import { promises as fs } from 'node:fs';
import path from 'node:path';
import util from 'node:util';

type Options = {
  version: string;
  chainId: string;
  tag: string;
  verbose: boolean;
};

function parseOptions(): Options {
  const options = {
    version: { type: 'string' },
    chainId: { type: 'string' },
    tag: { type: 'string' },
    verbose: { type: 'boolean' },
  } as const;
  const { values } = util.parseArgs({ options });

  for (const option of ['version', 'chainId', 'tag'] as const) {
    if (values[option] === undefined) {
      throw new Error(`missing --${option} flag`);
    }
  }

  if (!['zksync', 'canonical', 'eip155'].includes(values.tag as string)) {
    throw new Error(`invalid tag: ${values.tag}, must be one of: zksync, canonical, eip155`);
  }

  return {
    ...(values as Options),
    verbose: values.verbose === true,
  };
}

/**
 * Sorts network addresses by chain ID numerically
 * @param networkAddresses Object with chain IDs as keys
 * @returns New object with sorted keys
 */
function sortNetworkAddresses(networkAddresses: Record<string, string | string[]>): Record<string, string | string[]> {
  return Object.fromEntries(
    Object.entries(networkAddresses).sort((a, b) => {
      const numA = parseInt(a[0]);
      const numB = parseInt(b[0]);
      return numA - numB;
    })
  );
}

/**
 * Custom JSON formatter that formats arrays on a single line
 * @param obj Object to stringify
 * @returns Formatted JSON string
 */
function customStringify(obj: any): string {
  const jsonString = JSON.stringify(obj, null, 2);
  
  // Format arrays in networkAddresses to be on a single line
  const formatted = jsonString.replace(
    /"(\d+)":\s*\[\n\s+(".*?"),\n\s+(".*?")(,\n\s+(".*?"))*(,)?\n\s+\]/g,
    (match, p1) => {
      // Extract array elements
      const elements = match.match(/".*?"/g)?.slice(1) || [];
      return `"${p1}": [${elements.join(', ')}]`;
    }
  );
  
  // Ensure there's a new line at the end of the file
  return formatted.endsWith('\n') ? formatted : formatted + '\n';
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

  const assetsDir = path.join('src', 'assets', options.version);
  debug(`Looking for JSON files in ${assetsDir}`);
  
  try {
    const files = await fs.readdir(assetsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    debug(`Found ${jsonFiles.length} JSON files`);
    
    for (const file of jsonFiles) {
      const filePath = path.join(assetsDir, file);
      debug(`Processing ${filePath}`);
      
      const content = await fs.readFile(filePath, 'utf8');
      const json = JSON.parse(content);
      
      // Check if deployment tag exists
      if (!json.deployments || !json.deployments[options.tag]) {
        debug(`Skipping ${file} because it doesn't have ${options.tag} deployment`);
        continue;
      }
      
      // Update networkAddresses
      if (!json.networkAddresses) {
        json.networkAddresses = {};
      }
      
      // Add new chain ID with tag
      if (json.networkAddresses[options.chainId]) {
        if (Array.isArray(json.networkAddresses[options.chainId])) {
          // Add the tag if it doesn't exist in the array
          if (!json.networkAddresses[options.chainId].includes(options.tag)) {
            json.networkAddresses[options.chainId].push(options.tag);
            json.networkAddresses[options.chainId];
          }
        } else {
          // Convert to array if it's currently a string and different from the new tag
          if (json.networkAddresses[options.chainId] !== options.tag) {
            json.networkAddresses[options.chainId] = [
              json.networkAddresses[options.chainId] as string,
              options.tag,
            ];
          }
        }
      } else {
        // Add new entry
        json.networkAddresses[options.chainId] = options.tag;
      }
      
      // Sort network addresses
      json.networkAddresses = sortNetworkAddresses(json.networkAddresses);
      
      // Write updated content back to file with custom formatting
      await fs.writeFile(filePath, customStringify(json));
      debug(`Updated ${file} with chain ID ${options.chainId} using ${options.tag} tag`);
    }
    
    console.log(`Successfully added chain ID ${options.chainId} with ${options.tag} tag to all compatible JSON files in ${assetsDir}`);
    
  } catch (error) {
    console.error(`Error processing files: ${error}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  process.exitCode = 1;
});
