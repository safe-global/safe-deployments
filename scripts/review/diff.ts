import util from 'node:util';
import fs from 'node:fs/promises';
import parseDiff from 'parse-diff';
import assert from 'node:assert';

type Options = {
  diffPatchFileName: string;
  verbose: boolean;
};

type Deployment = { [key: number]: string };

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
      // Filter chunks as `changes` to only include items that are additions (add) or deletions (del).
      const changes = chunks.flatMap(({ changes }) => changes.filter(({ type }) => type === 'add' || type === 'del'));
      assert(changes.length === 3);
      assert(changes.map((c) => c.type).join() === 'del,add,add');
      assert(changes[0].content.slice(1) === changes[1].content.slice(1, -1));
    }
    debug('Highest chain ID deployment is valid');
  }

  if (additionalDeploymentToSameChainID) {
    debug('Additional deployment to same chain ID');
    for (const { chunks } of diffPatch) {
      const changes = chunks.flatMap(({ changes }) => changes.filter(({ type }) => type === 'add' || type === 'del'));
      assert(changes.length === 2);
      assert(changes.map((c) => c.type).join() === 'del,add');

      // Read values from old and new deployments.
      const oldDeployments = Object.values(JSON.parse(`{${changes[0].content.slice(1, -1)}}`))[0];
      const newDeployments = Object.values(JSON.parse(`{${changes[1].content.slice(1, -1)}}`))[0];

      // New deployment should always be more than one.
      if (typeof newDeployments !== 'object') {
        throw new Error('New deployment is not correct');
      }

      // Only one deployment was present.
      if (typeof oldDeployments === 'string') {
        if (!Object.values(newDeployments as Deployment).includes(oldDeployments)) {
          throw new Error('Previous deployment were removed');
        }
      } // Multiple deployments were present.
      else if (typeof oldDeployments === 'object') {
        for (const deployment of Object.values(oldDeployments as Deployment)) {
          if (!Object.values(newDeployments as Deployment).includes(deployment)) {
            throw new Error('Previous deployments were removed');
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
