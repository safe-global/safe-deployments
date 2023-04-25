import * as fs from 'fs';

import { getSafeL2SingletonDeployment, getSafeSingletonDeployment } from '../src/safes';
import { getProxyFactoryDeployment } from '../src/factories';
import { getDefaultCallbackHandlerDeployment, getCompatibilityFallbackHandlerDeployment, getFallbackHandlerDeployment } from '../src/handler';
import { getMultiSendDeployment, getMultiSendCallOnlyDeployment, getCreateCallDeployment, getSignMessageLibDeployment } from '../src/libs';
import ALL_CHAINS from '../chains.json';
import { exit } from 'process';

const title = '# Safe Deployments\n';
const description = 'This table contains a list of deployed Safe contracts. Chain information was taken from [Ethereum Lists: Chains](https://github.com/ethereum-lists/chains).\n';
const versions = fs.readdirSync('./src/assets')
  .filter(file => fs.lstatSync(`./src/assets/${file}`).isDirectory())
  .map(dir => dir.replace(/^v/, ''))
  .sort((a, b) => {
    const versionA = a.split('.').map(Number);
    const versionB = b.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if (versionA[i] < versionB[i]) {
        return 1;
      } else if (versionA[i] > versionB[i]) {
        return -1;
      }
    }
    return 0;
});

const headerRow = `| **Chain**                   | ${versions.map((version) => `**${version}**`.padEnd(27, ' ')).join('|')} |`;
const seperatorRow = `| ${'-'.repeat(28)} | ${versions.map(() => ` ${'-'.repeat(26)} |`).join('')} `;

const deployments = [getProxyFactoryDeployment, getSafeSingletonDeployment, getSafeL2SingletonDeployment,
     getDefaultCallbackHandlerDeployment, getCompatibilityFallbackHandlerDeployment, getFallbackHandlerDeployment,
     getMultiSendDeployment, getMultiSendCallOnlyDeployment, getCreateCallDeployment, getSignMessageLibDeployment];

const chainRows = ALL_CHAINS
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
          const explorerUrl = chain.explorers?.[0]?.url || ''
          const deploymentMarkdown = `${contractName} - ${explorerUrl ? `[${address}](${explorerUrl}/address/${address})` : address}<br />`
          chainVersion += deploymentMarkdown;
        }
      });
      chainRow = `${chainRow} ${chainVersion}|`;
    });
    return chainRow;
  });

const data = [title, description, headerRow, seperatorRow, ...chainRows].join('\n');
fs.writeFileSync('SUMMARY.md', data);
