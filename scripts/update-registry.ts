import { promises as fs } from 'node:fs';
import path from 'node:path';
import util from 'node:util';

import type { AddressType, SingletonDeploymentJSON } from '../src/types';

type Options = {
  version: string;
  chainId: string;
  deploymentType: string;
  verbose: boolean;
};

/**
 * Parses version string to extract version and deployment type
 * Examples:
 * - "v1.3.0-canonical" -> { version: "v1.3.0", deploymentType: "canonical" }
 * - "v1.3.0-eip155" -> { version: "v1.3.0", deploymentType: "eip155" }
 * - "v1.4.1" -> { version: "v1.4.1", deploymentType: "canonical" }
 * - "v1.5.0" -> { version: "v1.5.0", deploymentType: "canonical" }
 */
function parseVersion(versionString: string): { version: string; deploymentType: string } {
  const parts = versionString.split('-');
  if (parts.length === 2) {
    return {
      version: parts[0],
      deploymentType: parts[1],
    };
  }
  return {
    version: versionString,
    deploymentType: 'canonical',
  };
}

function parseOptions(): Options {
  const options = {
    version: { type: 'string' },
    chainId: { type: 'string' },
    verbose: { type: 'boolean' },
  } as const;
  const { values } = util.parseArgs({ options });

  if (values.version === undefined) {
    throw new Error('missing --version flag');
  }
  if (values.chainId === undefined) {
    throw new Error('missing --chainId flag');
  }

  const { version, deploymentType } = parseVersion(values.version as string);

  return {
    version,
    chainId: values.chainId as string,
    deploymentType,
    verbose: values.verbose === true,
  };
}

/**
 * Sorts network addresses by chain ID (numeric)
 */
function sortNetworkAddresses(
  networkAddresses: Record<string, AddressType | AddressType[]>
): Record<string, AddressType | AddressType[]> {
  const entries = Object.entries(networkAddresses);
  entries.sort(([a], [b]) => {
    const aNum = parseInt(a, 10);
    const bNum = parseInt(b, 10);
    if (isNaN(aNum) || isNaN(bNum)) {
      return a.localeCompare(b);
    }
    return aNum - bNum;
  });
  return Object.fromEntries(entries);
}

async function main() {
  const options = parseOptions();
  const debug = (...msg: unknown[]) => {
    if (options.verbose) {
      console.debug(...msg);
    }
  };

  debug('Parsed options:');
  debug(options);

  // Normalize version (remove 'v' prefix if present)
  const normalizedVersion = options.version.startsWith('v')
    ? options.version
    : `v${options.version}`;

  const assetsDir = path.join('src', 'assets', normalizedVersion);

  // Check if version directory exists
  try {
    await fs.access(assetsDir);
  } catch {
    throw new Error(`Version directory ${assetsDir} does not exist`);
  }

  // Read all JSON files in the version directory
  const files = await fs.readdir(assetsDir);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));

  if (jsonFiles.length === 0) {
    throw new Error(`No JSON files found in ${assetsDir}`);
  }

  debug(`Found ${jsonFiles.length} JSON files to update`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const file of jsonFiles) {
    const filePath = path.join(assetsDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const json: SingletonDeploymentJSON = JSON.parse(content);

    debug(`Processing ${json.contractName}...`);

    // Check if deployment type exists
    if (!json.deployments[options.deploymentType as keyof typeof json.deployments]) {
      console.warn(
        `⚠️  Skipping ${json.contractName}: deployment type "${options.deploymentType}" not found. Available types: ${Object.keys(json.deployments).join(', ')}`
      );
      skippedCount++;
      continue;
    }

    // Cast deployment type to AddressType (we've already validated it exists)
    const deploymentType = options.deploymentType as AddressType;

    // Check if chain ID already exists
    if (json.networkAddresses[options.chainId] !== undefined) {
      const existingValue = json.networkAddresses[options.chainId];
      const isArray = Array.isArray(existingValue);
      const hasDeploymentType = isArray
        ? existingValue.includes(deploymentType)
        : existingValue === deploymentType;

      if (hasDeploymentType) {
        debug(`  Chain ID ${options.chainId} already exists with deployment type "${deploymentType}"`);
        skippedCount++;
        continue;
      }

      // If it's an array and doesn't include the deployment type, add it
      if (isArray) {
        const updatedArray: AddressType[] = [...existingValue, deploymentType];
        json.networkAddresses[options.chainId] = updatedArray;
        debug(`  Added "${deploymentType}" to existing array for chain ID ${options.chainId}`);
      } else {
        // Convert single value to array
        json.networkAddresses[options.chainId] = [existingValue, deploymentType];
        debug(`  Converted single value to array and added "${deploymentType}" for chain ID ${options.chainId}`);
      }
    } else {
      // Add new chain ID
      json.networkAddresses[options.chainId] = deploymentType;
      debug(`  Added chain ID ${options.chainId} with deployment type "${deploymentType}"`);
    }

    // Sort network addresses by chain ID
    json.networkAddresses = sortNetworkAddresses(json.networkAddresses);

    // Write updated JSON back to file
    const updatedContent = JSON.stringify(json, null, 2);
    await fs.writeFile(filePath, updatedContent + '\n', 'utf-8');
    updatedCount++;

    console.log(`✓ Updated ${json.contractName}`);
  }

  console.log(`\n✅ Registry update complete!`);
  console.log(`   Updated: ${updatedCount} files`);
  if (skippedCount > 0) {
    console.log(`   Skipped: ${skippedCount} files`);
  }
}

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  process.exitCode = 1;
});

