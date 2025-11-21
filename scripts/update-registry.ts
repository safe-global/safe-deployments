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
  networkAddresses: Record<string, AddressType | AddressType[]>,
): Record<string, AddressType | AddressType[]> {
  const entries = Object.entries(networkAddresses);
  entries.sort(([a], [b]) => {
    try {
      const aNum = BigInt(a);
      const bNum = BigInt(b);
      if (aNum < bNum) return -1;
      if (aNum > bNum) return 1;
      return 0;
    } catch {
      // If chain ID is not a valid number, sort alphabetically
      return a.localeCompare(b);
    }
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
  const normalizedVersion = options.version.startsWith('v') ? options.version : `v${options.version}`;

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

  // Pre-check: Validate all contracts and check if deployment is already fully supported
  const deploymentType = options.deploymentType as AddressType;
  const contractsToProcess: Array<{ file: string; path: string; json: SingletonDeploymentJSON }> = [];
  const alreadySupported: string[] = [];
  const missingDeploymentType: string[] = [];

  for (const file of jsonFiles) {
    const filePath = path.join(assetsDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const json: SingletonDeploymentJSON = JSON.parse(content);

    // Check if deployment type exists for this contract
    if (!json.deployments[deploymentType as keyof typeof json.deployments]) {
      missingDeploymentType.push(json.contractName);
      continue;
    }

    // Check if chain ID already exists with this deployment type
    const existingValue = json.networkAddresses[options.chainId];
    if (existingValue !== undefined) {
      const isArray = Array.isArray(existingValue);
      const hasDeploymentType = isArray ? existingValue.includes(deploymentType) : existingValue === deploymentType;

      if (hasDeploymentType) {
        alreadySupported.push(json.contractName);
        continue;
      }
    }

    // Contract needs to be updated
    contractsToProcess.push({ file, path: filePath, json });
  }

  // Report pre-check results
  if (missingDeploymentType.length > 0) {
    throw new Error(
      `❌ ${missingDeploymentType.length} contract(s) don't support deployment type "${deploymentType}": ${missingDeploymentType.join(', ')}\n` +
        `Cannot proceed with partial application. All contracts must support the deployment type.`,
    );
  }

  if (contractsToProcess.length === 0) {
    // All contracts that support this deployment type already have the chain ID
    console.log(
      `\n✅ Chain ID ${options.chainId} with deployment type "${deploymentType}" is already supported for all contracts:`,
    );
    alreadySupported.forEach((name) => console.log(`   - ${name}`));
    console.log(`\nNo changes needed.`);
    return;
  }

  if (alreadySupported.length > 0) {
    console.log(
      `\nℹ️  ${alreadySupported.length} contract(s) already support chain ID ${options.chainId} with "${deploymentType}":`,
    );
    alreadySupported.forEach((name) => console.log(`   - ${name}`));
  }

  console.log(`\n📝 Will update ${contractsToProcess.length} contract(s):`);
  contractsToProcess.forEach(({ json }) => console.log(`   - ${json.contractName}`));

  // Process contracts that need updating
  const updatedCount = contractsToProcess.length;
  const skippedCount = alreadySupported.length + missingDeploymentType.length;

  for (const { path: filePath, json } of contractsToProcess) {
    debug(`Processing ${json.contractName}...`);

    // Deployment type and chain ID already validated in pre-check
    // At this point, we know:
    // 1. The deployment type exists for this contract
    // 2. The chain ID either doesn't exist OR exists but doesn't have this deployment type

    const existingValue = json.networkAddresses[options.chainId];

    if (existingValue !== undefined) {
      // Chain ID exists but with a different deployment type - add to array
      const isArray = Array.isArray(existingValue);

      if (isArray) {
        // Add to existing array (pre-check ensures deploymentType is not already in array)
        // Policy: Keep existing first value to avoid breaking changes
        json.networkAddresses[options.chainId] = [...existingValue, deploymentType];
        debug(
          `  Added "${deploymentType}" to existing array [${existingValue.join(', ')}] for chain ID ${options.chainId}`,
        );
        debug(`  Updated array: [${[...existingValue, deploymentType].join(', ')}]`);
      } else {
        // Convert single value to array
        // Policy: Keep existing deployment type first to avoid breaking changes
        const existingType = existingValue as AddressType;
        json.networkAddresses[options.chainId] = [existingType, deploymentType];
        console.log(
          `  Converted single value "${existingType}" to array [${existingType}, ${deploymentType}] for chain ID ${options.chainId}`,
        );
        debug(`  Preserved existing deployment type "${existingType}" as first, added "${deploymentType}"`);
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
