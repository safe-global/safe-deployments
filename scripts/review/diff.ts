import util from 'node:util';
import fs from 'node:fs/promises';
import parseDiff from 'parse-diff';
import assert from 'node:assert';

type Options = {
  diffPatchFileName: string;
  verbose: boolean;
};

type Deployments = { [chainId: number]: string | string[] };

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

function hasChangeTypes(changes: parseDiff.Chunk['changes'], types: string[]): boolean {
  return changes.length === types.length && changes.every(({ type }, i) => type === types[i]);
}

function highestChainID(changes: parseDiff.Chunk['changes']) {
  assert(hasChangeTypes(changes, ['del', 'add', 'add']));
  assert(changes[0].content.replace(/^-(.*)/, '+$1,') === changes[1].content);
}

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
      highestChainID(changes);
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
