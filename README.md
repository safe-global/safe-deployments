# Safe Deployments

[![npm version](https://badge.fury.io/js/%40safe-global%2Fsafe-deployments.svg)](https://badge.fury.io/js/%40safe-global%2Fsafe-deployments)
[![CI](https://github.com/safe-global/safe-deployments/actions/workflows/test.yml/badge.svg)](https://github.com/safe-global/safe-deployments/actions/workflows/test.yml)

This contract contains a collection of deployments of the contract of the [Safe contracts repository](https://github.com/safe-global/safe-smart-account).

The addresses on the different networks and the abi files are available for each deployment. To get an overview of the available versions, check the available [json assets](./src/assets/).

## Adding additional deployments:

1. Follow the [deployment steps in the Safe contract repository](https://github.com/safe-global/safe-smart-contracts#deployments).
2. Verify that the addresses match the expected address for each contract. You can find them under the "addresses" mapping in the respective JSON file in the [assets folder](./src/assets/).
3. Create a PR adding the new deployment. Example PR can be found [here](https://github.com/safe-global/safe-deployments/pull/676).

## Install

- npm - `npm i @safe-global/safe-deployments`
- yarn - `yarn add @safe-global/safe-deployments`

## Usage

It is possible to directly use the JSON files in the [assets folder](./src/assets/) that contain the addresses and abi definitions.

An alternative is using JavaScript library methods to query the correct deployment. The library supports different methods to get the deployment of a specific contract.

Each of the methods takes an optional `DeploymentFilter` as a parameter.

```ts
interface DeploymentFilter {
  version?: string;
  released?: boolean; // Defaults to true if no filter is specified
  network?: string; // Chain id of the network
}
```

The method will return a `SingletonDeployment` object or `undefined` if no deployment was found for the specified filter.

```ts
interface SingletonDeployment {
  // The default address of the deployment.
  defaultAddress: string;

  // Indicates if the deployment is released.
  released: boolean;

  // The name of the contract.
  contractName: string;

  // The version of the deployment.
  version: string;

  // The hash of the contract code.
  codeHash: string;

  // A record of addresses, where the key is the address type and the value is the address.
  addresses: Record<string, string>;

  // A record of network addresses, where the key is the network identifier and the value is the address.
  networkAddresses: Record<string, string>;

  // The ABI (Application Binary Interface) of the contract.
  abi: any[];
}
```

- Safe

```ts
const safeSingleton = getSafeSingletonDeployment();

// Returns latest contract version, even if not finally released yet
const safeSingletonNightly = getSafeSingletonDeployment({ released: undefined });

// Returns released contract version for specific network
const safeSingletonGörli = getSafeSingletonDeployment({ network: '5' });

// Returns released contract version for specific version
const safeSingleton100 = getSafeSingletonDeployment({ version: '1.0.0' });

// Version with additional events used on L2 networks
const safeL2Singleton = getSafeL2SingletonDeployment();
```

- Factories

```ts
const proxyFactory = getProxyFactoryDeployment();
```

- Libraries

```ts
const multiSendLib = getMultiSendDeployment();

const multiSendCallOnlyLib = getMultiSendCallOnlyDeployment();

const createCallLib = getCreateCallDeployment();
```

- Handler

```ts
// Returns recommended handler
const fallbackHandler = getFallbackHandlerDeployment();

const callbackHandler = getDefaultCallbackHandlerDeployment();

const compatHandler = getCompatibilityFallbackHandlerDeployment();
```

## Release cycle

`safe-deployments` release cycle is once per month, except for urgent issues that require immediate attention.

## Notes

A list of network information can be found at [chainid.network](https://chainid.network/)

## License

This library is released under MIT.
