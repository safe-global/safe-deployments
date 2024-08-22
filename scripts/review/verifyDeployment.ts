import { promises as fs } from 'node:fs';
import path from 'node:path';
import util from 'node:util';

import { ethers } from 'ethers';

import type { SingletonDeploymentJSON } from '../../src/types';

type Options = {
  version: string;
  chainId: string;
  rpc: string;
  verbose: boolean;
};

function parseOptions(): Options {
  const options = {
    version: { type: 'string' },
    chainId: { type: 'string' },
    rpc: { type: 'string' },
    verbose: { type: 'boolean' },
  } as const;
  const { values } = util.parseArgs({ options });

  for (const option of ['version', 'chainId', 'rpc'] as const) {
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

  await fetch(`https://chainlist.org/chain/${options.chainId}`).then((response) => {
    if (!response.ok) {
      throw new Error(`chain is not registered on Chainlist`);
    }
  });
  debug(`chain ${options.chainId} exists on Chainlist`);

  const provider = new ethers.JsonRpcProvider(options.rpc);
  const { chainId } = await provider.getNetwork();
  debug(`RPC reported chain ${chainId}`);
  if (`${chainId}` !== options.chainId) {
    throw new Error(`RPC chain ID ${chainId} does not match expected ${options.chainId}`);
  }

  const assets = path.join('src', 'assets', options.version);
  for (const file of await fs.readdir(assets)) {
    const asset = path.join(assets, file);
    const json: SingletonDeploymentJSON = JSON.parse(await fs.readFile(asset, 'utf-8'));
    debug(`${json.contractName} deployments:`);

    const networkAddresses = json.networkAddresses[options.chainId];
    if (networkAddresses === undefined) {
      throw new Error(`missing ${json.contractName} deployment`);
    }

    for (const deployment of [networkAddresses].flat()) {
      if (json.deployments[deployment] === undefined) {
        throw new Error(`invalid ${json.contractName} deployment "${deployment}"`);
      }

      const { address, codeHash: expectedCodeHash } = json.deployments[deployment];
      const code = await provider.getCode(address);
      if (ethers.dataLength(code) === 0) {
        throw new Error(`${json.contractName} not deployed at ${address}`);
      }
      const codeHash = ethers.keccak256(code);
      if (codeHash !== expectedCodeHash) {
        throw new Error(`${json.contractName} code hash ${codeHash} does not match expected ${expectedCodeHash}`);
      }

      debug(`• ${deployment} deployment OK`);
    }
  }
}

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  process.exitCode = 1;
});
