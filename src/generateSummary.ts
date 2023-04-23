import * as fs from 'fs';

import { getSafeL2SingletonDeployment, getSafeSingletonDeployment } from './safes';
import { getProxyFactoryDeployment } from './factories';
import ALL_CHAINS from '../chains_sample.json';

const title = '# Safe Deployments';
const versions = ['1.3.0', '1.2.0', '1.1.1', '1.0.0'];

// filter chains by if their Chain ID is in the list of deployed chains
const chains = ALL_CHAINS.filter((chain) => getProxyFactoryDeployment({ network: chain.chainId.toString() }));

const headerRow = `| **Chain**                   | ${versions.map((version) => `**${version}**`.padEnd(27, ' ')).join('|')} |`;
const seperatorRow = `| ${'-'.repeat(28)} | ${versions.map(() => ` ${'-'.repeat(26)} |`).join('')} `;

const deployments = [getProxyFactoryDeployment, getSafeSingletonDeployment, getSafeL2SingletonDeployment];

const chainRows = chains
  .filter((chain) => {
    let deployedOnChain = false;
    versions.forEach((version) => {
      deployments.forEach((deployment) => {
        const deploymentInfo = deployment({ version, released: true, network: chain.chainId.toString() });
        if (deploymentInfo?.networkAddresses[chain.chainId]) {
          deployedOnChain = true;
        }
      });
    });
    return deployedOnChain;
  })
  .map((chain) => {
    let chainTitle = `|[${chain.title || chain.name} (Chain ID: ${chain.chainId})](${chain.infoURL})|`;
    let chainRow = chainTitle;
    versions.forEach((version) => {
      let chainVersion = '';
      deployments.forEach((deployment) => {
        const deploymentInfo = deployment({ version, released: true, network: chain.chainId.toString() });
        if (deploymentInfo?.networkAddresses[chain.chainId]) {
          const address = deploymentInfo.networkAddresses[chain.chainId];
          const contractName = deploymentInfo.contractName;
          const deploymentMarkdown = `${contractName} - [${address}](${chain?.explorers![0].url}/address/${address})<br />`;
          chainVersion += deploymentMarkdown;
        }
      });
      chainRow = `${chainRow} ${chainVersion}|`;
    });
    return chainRow;
  });

const data = [title, headerRow, seperatorRow, ...chainRows].join('\n');
fs.writeFileSync('SUMMARY.md', data);
