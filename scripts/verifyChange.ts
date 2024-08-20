import util from 'node:util';

type Options = {
  fileLineChange: string;
  diffPatchSeparated: string;
  verbose: boolean;
};

function parseOptions(): Options {
  const options = {
    fileLineChange: { type: 'string' },
    diffPatchSeparated: { type: 'string' },
    verbose: { type: 'boolean' },
  } as const;
  const { values } = util.parseArgs({ options });

  for (const option of ['fileLineChange', 'diffPatchSeparated'] as const) {
    if (values[option] === undefined) {
      throw new Error(`missing --${option} flag`);
    }
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

  const fileLineChangeJSON = JSON.parse(options.fileLineChange);
  const diffPatchSeparated = Buffer.from(options.diffPatchSeparated, 'base64')
    .toString('utf-8')
    .split('\n')
    .slice(0, -1);
  let highestChainID = false;
  let additionalDeploymentToSameChainID = false;

  for (const file of fileLineChangeJSON.files) {
    const { path, additions, deletions } = file;
    debug(`Checking ${path} with ${additions} additions and ${deletions} deletions`);
    if (additions === 2 && deletions === 1) {
      highestChainID = true;
    } else if (additions === 1 && deletions === 1) {
      additionalDeploymentToSameChainID = true;
    } else if (additions !== 1 || deletions !== 0) {
      throw new Error(`ERROR: ${path} has invalid changes`);
    }
  }

  if (highestChainID) {
    debug('Highest chain ID deployment');
    let i = 0;
    let previousLine = '';
    for (const line of diffPatchSeparated) {
      debug('highestChainID in line: ', line);
      if (i === 0) {
        if (!line.startsWith('-')) {
          throw new Error('Removal is not in correct order');
        }
        previousLine = '+'.concat(line.slice(1)).concat(',');
        i++;
      } else if (i === 1) {
        if (line !== previousLine) {
          throw new Error('Previous highest chain ID removed');
        }
        i++;
      } else if (i === 2) {
        if (!line.startsWith('+')) {
          throw new Error('Addition is not in correct order');
        }
        i = 0;
      }
    }
  }

  if (additionalDeploymentToSameChainID) {
    debug('Additional deployment to same chain ID');
    let i = 0;
    let previousDeployment: string[] = [];
    for (const line of diffPatchSeparated) {
      debug('additionalDeploymentToSameChainID in line: ', line);
      if (i === 0) {
        if (!line.startsWith('-')) {
          throw new Error('Removal is not in correct order');
        }
        // Only one deployment was present.
        if (line.search('\\[') === -1) {
          previousDeployment.push(line.split(':')[1].slice(1, -1));
        } // Multiple deployments were present.
        else {
          previousDeployment = line.split(':')[1].slice(2, -2).split(',');
        }
        i++;
      } else if (i === 1) {
        if (!line.startsWith('+')) {
          throw new Error('Addition is not in correct order');
        }
        // Check if previous deployments were removed.
        for (const deployment of previousDeployment) {
          if (!line.includes(deployment)) {
            throw new Error('Previous deployment were removed');
          }
        }
        i = 0;
      }
    }
  }
}

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  process.exitCode = 1;
});
