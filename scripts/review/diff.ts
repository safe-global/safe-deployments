import util from 'node:util';
import fs from 'node:fs/promises';
import parseDiff from 'parse-diff';

type Options = {
  diffPatchFileName: string;
  verbose: boolean;
};

enum HighestChangeType {
  Initial,
  Removal,
  Addition,
}

function parseOptions(): Options {
  const options = {
    diffPatchFileName: { type: 'string' },
    verbose: { type: 'boolean' },
  } as const;
  const { values } = util.parseArgs({ options });

  const option = 'diffPatchFileName';
  if (values[option] === undefined) {
    throw new Error(`missing --${option} flag`);
  }

  return {
    ...(values as Options),
    verbose: values.verbose === true,
  };
}

async function main() {
  const options = parseOptions();
  const debug = (...msg: unknown[]) => {
    if (options.verbose) {
      console.debug(...msg);
    }
  };

  // Read the content of the files
  const diffPatchContent = await fs.readFile(options.diffPatchFileName, 'utf-8');
  const diffPatch = parseDiff(diffPatchContent);

  let highestChainID = false;
  let additionalDeploymentToSameChainID = false;

  for (const { to, from, additions, deletions } of diffPatch) {
    // Check to see if the file name was changed.
    if (to !== from) {
      throw new Error(`ERROR: file renamed to ${to} from ${from}`);
    }

    debug(`Checking ${to} with ${additions} additions and ${deletions} deletions`);

    // Check to see if the changes are valid and set any edge case flags.
    if (additions === 2 && deletions === 1) {
      highestChainID = true;
    } else if (additions === 1 && deletions === 1) {
      additionalDeploymentToSameChainID = true;
    } else if (additions !== 1 || deletions !== 0) {
      throw new Error(`ERROR: ${to} has invalid changes`);
    }
  }

  if (highestChainID) {
    debug('Highest chain ID deployment');
    for (const { chunks } of diffPatch) {
      for (const { changes } of chunks) {
        let state = HighestChangeType.Initial;
        let expectedNextLine = '';

        for (const { type, content } of changes) {
          if (type === 'del') {
            if (state !== HighestChangeType.Initial) {
              throw new Error('Removal is not in correct order');
            }
            state = HighestChangeType.Removal;
            expectedNextLine = '+'.concat(content.slice(1)).concat(',');
          } else if (type === 'add') {
            if (state !== HighestChangeType.Removal && state !== HighestChangeType.Addition) {
              throw new Error('Addition is not in correct order');
            }
            if (state === HighestChangeType.Removal) {
              if (content !== expectedNextLine) {
                throw new Error('Previous highest chain ID removed');
              }
              state = HighestChangeType.Addition;
            }
          }
        }
      }
    }
    debug('Highest chain ID deployment is valid');
  }

  if (additionalDeploymentToSameChainID) {
    debug('Additional deployment to same chain ID');
    let previousDeployment: string[] = [];
    for (const { chunks } of diffPatch) {
      for (const { changes } of chunks) {
        for (const { type, content } of changes) {
          if (type === 'del') {
            // Only one deployment was present.
            if (content.search('\\[') === -1) {
              previousDeployment.push(content.split(':')[1].slice(1, -1));
            } // Multiple deployments were present.
            else {
              previousDeployment = content.split(':')[1].slice(2, -2).split(',');
            }
          } else if (type === 'add') {
            // Check if previous deployments were removed.
            for (const deployment of previousDeployment) {
              if (!content.includes(deployment)) {
                throw new Error('Previous deployment were removed');
              }
            }
          }
        }
      }
    }
    debug('Additional deployment to same chain ID is valid');
  }
}

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  process.exitCode = 1;
});
