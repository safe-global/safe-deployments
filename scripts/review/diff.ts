import util from 'node:util';
import fs from 'node:fs/promises';
import parseDiff from 'parse-diff';
import assert from 'node:assert';

type Options = {
  diffPatchFileName: string;
  verbose: boolean;
};

type Deployments = { [chainId: number]: string | string[] };

/**
 * This function parses the options from the command line arguments.
 *
 * @returns The parsed options.
 */
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

/**
 * Check if the changes in the diff patch are of the given types.
 *
 * @param changes The changes in the diff patch.
 * @param types The types of changes to check.
 *
 * @returns True if the changes are of the given types, false otherwise.
 */
function hasChangeTypes(changes: parseDiff.Chunk['changes'], types: string[]): boolean {
  return changes.length === types.length && changes.every(({ type }, i) => type === types[i]);
}

/**
 * This function checks if the changes are for the highest chain ID.
 * If the changes are for the highest chain ID, the first change should be a deletion (current Highest Chain ID)
 * and the next two changes should be additions (Current Highest Chain ID and the new Highest Chain ID).
 * The deleted content should be the same as the added content with a comma `,` at the end.
 *
 * @param changes The changes in the diff patch.
 */
function assertHighestChainIdChanges(changes: parseDiff.Chunk['changes']) {
  assert(hasChangeTypes(changes, ['del', 'add', 'add']));
  assert(changes[0].content.replace(/^-(.*)/, '+$1,') === changes[1].content);
}

/**
 * This function checks if the changes are for additional deployments to the same chain ID.
 * If the changes are for additional deployments to the same chain ID, the first change should be a deletion (current deployments)
 * and the next change should be an addition (current and new deployments).
 * All the previous deployments should be present in the new deployments.
 *
 * @param changes The changes in the diff patch.
 */
function additionalDeploymentToSameChainId(changes: parseDiff.Chunk['changes']) {
  assert(hasChangeTypes(changes, ['del', 'add']));

  // Read values from old and new deployments.
  const oldDeployments = JSON.parse(`{${changes[0].content.slice(1, -1)}}`) as Deployments;
  const [[oldDeploymentsKey, oldDeploymentsValues]] = Object.entries(oldDeployments);

  const newDeployments = JSON.parse(`{${changes[1].content.slice(1, -1)}}`) as Deployments;
  const [[newDeploymentsKey, newDeploymentsValues]] = Object.entries(newDeployments);

  if (oldDeploymentsKey !== newDeploymentsKey) {
    throw new Error('Chain ID is not the same');
  }

  // New deployment should always be more than one.
  if (!Array.isArray(newDeploymentsValues)) {
    throw new Error('New deployment is not correct');
  }

  const nomalizedOldDeploymentValues = Array.isArray(oldDeploymentsValues)
    ? oldDeploymentsValues
    : [oldDeploymentsValues];

  for (const deployment of nomalizedOldDeploymentValues) {
    if (!newDeploymentsValues.includes(deployment)) {
      throw new Error('Previous deployments were removed');
    }
  }
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

  for (const { to, from, additions, deletions, chunks } of diffPatch) {
    // Check to see if the file name was changed.
    if (to !== from) {
      throw new Error(`ERROR: file renamed to ${to} from ${from}`);
    }

    debug(`Checking ${to} with ${additions} additions and ${deletions} deletions`);

    // Check to see if the changes are valid and set any edge case flags.
    const changes = chunks.flatMap(({ changes }) => changes.filter(({ type }) => type === 'add' || type === 'del'));
    if (additions === 2 && deletions === 1) {
      assertHighestChainIdChanges(changes);
    } else if (additions === 1 && deletions === 1) {
      additionalDeploymentToSameChainId(changes);
    } else if (additions !== 1 || deletions !== 0) {
      throw new Error(`ERROR: ${to} has invalid changes`);
    }
  }

  debug('Diff patch is valid');
}

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  process.exitCode = 1;
});
