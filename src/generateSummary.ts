// create a markdown file called SUMMARY.md with a table and columns: Chain ID, Network Name, Version
import * as fs from 'fs'

import {getSafeL2SingletonDeployment, getSafeSingletonDeployment} from './safes'
import {getProxyFactoryDeployment} from './factories'
import ALL_CHAINS from '../chains_sample.json'

const title = '# Safe Deployments'

const headerRow = '| **Chain**                   | **1.3.0**                   | **1.2.0**                   | **1.1.1**                   | **1.0.0**                   |'
const seperatorRow = '| --------------------------- | --------------------------- | --------------------------- | --------------------------- | --------------------------- |'

const deployments = [getProxyFactoryDeployment, getSafeSingletonDeployment, getSafeL2SingletonDeployment]
const versions = ['1.3.0', '1.2.0', '1.1.1', '1.0.0']


// filter chains by if their Chain ID is in the list of deployed chains
let chains: any = ALL_CHAINS.filter((chain: any) => getProxyFactoryDeployment({network: chain.chainId}))

const chainRows: string[] = [];

// get list of chain IDs that have been deployed 

chains.forEach((chain: any) => {
    let chainTitle = `${chain.title || chain.name}`
    chainTitle = `|[${chainTitle} (Chain ID: ${chain.chainId})](${chain.infoURL})|`
    let chainRow = chainTitle
    let deployedOnChain = false;
    versions.forEach(version => {
        let chainVersion = '';
        deployments.forEach(deployment => {
            const deploymentInfo = deployment({version, released: true, network: chain.chainId})
            if (deploymentInfo?.networkAddresses[chain.chainId]) {
                if (chain.chainId === '1') {
                    console.log({deploymentInfo});
                }
                deployedOnChain = true;
                const address = deploymentInfo.networkAddresses[chain.chainId]
                const contractName = deploymentInfo.contractName
                const deploymentMarkdown = `${contractName} - [${address}](${chain.explorers[0].url}/address/${address})<br />`;
                chainVersion += deploymentMarkdown
            }
        })
        chainRow = `${chainRow} ${chainVersion}|`
    })
    // TODO: Cannot find name 'console'. Do you need to change your target library? Try changing the 'lib' compiler option to include 'dom'.
    // console.log({chainRow})
    if (deployedOnChain) {
        chainRows.push(chainRow)
    }
    // console.log({chainRows})
});

const data = [title, headerRow, seperatorRow, ...chainRows].join('\n')

fs.writeFileSync('SUMMARY.md', data);
