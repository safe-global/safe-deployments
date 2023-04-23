// create a markdown file called SUMMARY.md with a table and columns: Chain ID, Network Name, Version
const fs = require('fs');


const title = '# Safe Deployments'

const headerRow = '| **Chain**                   | **1.3.0**                   | **1.2.0**                   | **1.1.0**                   | **1.0.0**                   |'
const seperatorRow = '| --------------------------- | --------------------------- | --------------------------- | --------------------------- | --------------------------- |'


let chains = fs.readFileSync('chains_sample.json').toString('utf-8')

chains = JSON.parse(chains)

// Use mock data until @safe-global/safe-deployments package is used 
const safeNetworkAddresses = {
    "1": "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
    "3": "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
    "4": "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
    "5": "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
}

const safeProxyFactoryAddresses = {
    "1": "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    "3": "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    "4": "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    "5": "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
}

const getSafeSingletonDeployment = (version, released, network) => (
    {
        defaultAddress: safeNetworkAddresses[1],
        version,
        abi: [],
        networkAddresses: Object.entries(safeNetworkAddresses).filter(keyValue => keyValue[0]==network),
        contractName: 'GnosisSafe',
        released
    }
)

const getProxyFactoryDeployment = (version, released, network) => ({
    ...getSafeSingletonDeployment(version, released, network),
    defaultAddress: safeProxyFactoryAddresses[1],
    networkAddresses: Object.entries(safeProxyFactoryAddresses).filter(keyValue => keyValue[0]==network),
    contractName: 'GnosisSafeProxyFactory',
})

const deployments = [getSafeSingletonDeployment, getProxyFactoryDeployment]
const versions = ['1.3.0','1.2.0','1.1.0','1.0.0']


const chainRows = [];
chains.forEach(chain => {
    console.log({chain})
    let chainTitle = `${chain.title || chain.name}`
    chainTitle = `|[${chainTitle}](${chain.infoURL})|`
    let chainRow = chainTitle
    let deployedOnChain = false;
    versions.forEach(version => {
        let chainVersion = '';
        deployments.forEach(deployment => {
            const deploymentInfo = deployment(version, true, chain.chainId)
            if (deploymentInfo.networkAddresses.length > 0) {
                deployedOnChain = true;
                const address = deploymentInfo.networkAddresses[0][1]
                const contractName = deploymentInfo.contractName
                const deploymentMarkdown = `${contractName} - [${address}](${chain.explorers[0].url}/address/${address})/ `;
                chainVersion += deploymentMarkdown
            }
        })
        chainRow = `${chainRow} ${chainVersion}|`
    })
    console.log({chainRow})
    if (deployedOnChain) {
        chainRows.push(chainRow)
    }
    console.log({chainRows})
});

const data = [title, headerRow, seperatorRow, ...chainRows].join('\n')

fs.writeFileSync('SUMMARY.md', data);
