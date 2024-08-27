# Safe Deployments

[![npm version](https://badge.fury.io/js/%40safe-global%2Fsafe-deployments.svg)](https://badge.fury.io/js/%40safe-global%2Fsafe-deployments)
[![CI](https://github.com/safe-global/safe-deployments/actions/workflows/test.yml/badge.svg)](https://github.com/safe-global/safe-deployments/actions/workflows/test.yml)

This contract contains a collection of deployments of the contract of the [Safe contracts repository](https://github.com/safe-global/safe-smart-account).

The addresses on the different networks and the abi files are available for each deployment. To get an overview of the available versions, check the available [json assets](./src/assets/).

## Adding additional deployments:

1. Follow the [deployment steps in the Safe contract repository](https://github.com/safe-global/safe-smart-account/#deployments).
2. Verify that the addresses match the expected address for each contract. You can find them under the "addresses" mapping in the respective JSON file in the [assets folder](./src/assets/).
3. Create a PR adding the new deployment. Example PR can be found [here](https://github.com/safe-global/safe-deployments/pull/676).

## Install

- npm - `npm i @safe-global/safe-deployments`
- yarn - `yarn add @safe-global/safe-deployments`

## Usage

It is possible to directly use the JSON files in the [assets folder](./src/assets/) that contain the addresses and ABI definitions.

An alternative is using JavaScript library methods to query the correct deployment. The library supports different methods to get the deployment of a specific contract.

Each of the methods takes an optional `DeploymentFilter` as a parameter.

```ts
interface DeploymentFilter {
  version?: string;
  released?: boolean; // Defaults to true if no filter is specified
  network?: string; // Chain id of the network
}
```

### V1 Methods (single deployments)

Those methods will return a `SingletonDeployment` object or `undefined` if no deployment was found for the specified filter.

```ts
export interface SingletonDeployment {
  // The default address of the deployment.
  defaultAddress: string;

  // Indicates if the deployment is released.
  released: boolean;

  // The name of the contract.
  contractName: string;

  // The version of the deployment.
  version: string;

  // The address & hash of the contract code, where the key is the deployment type.
  // There could be multiple deployment types: canonical, eip155, zksync
  // Possible addresses per version:
  // 1.0.0: canonical
  // 1.1.1: canonical
  // 1.2.0: canonical
  // 1.3.0: canonical, eip155, zksync
  // 1.4.1: canonical, zksync
  // Ex: deployments: { "canonical": { "codeHash": "0x1234", "address": "0x5678"}}
  deployments: Record<string, { address: string; codeHash: string }>;

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

const signMessageLib = getSignMessageLibDeployment();
```

- Handler

```ts

const callbackHandler = getDefaultCallbackHandlerDeployment();

const compatHandler = getCompatibilityFallbackHandlerDeployment();
```

### V2 Methods (multiple deployments)

We added a new methods that allow multiple deployment addresses for a contract.

Those methods will return a `SingletonDeployment` object or `undefined` if no deployment was found for the specified filter. Notice the difference in the `networkAddresses` field.

```ts
export interface SingletonDeployment {
  // The default address of the deployment.
  defaultAddress: string;

  // Indicates if the deployment is released.
  released: boolean;

  // The name of the contract.
  contractName: string;

  // The version of the deployment.
  version: string;

  // The address & hash of the contract code, where the key is the deployment type.
  // There could be multiple deployment types: canonical, eip155, zksync
  // Possible addresses per version:
  // 1.0.0: canonical
  // 1.1.1: canonical
  // 1.2.0: canonical
  // 1.3.0: canonical, eip155, zksync
  // 1.4.1: canonical, zksync
  // Ex: deployments: { "canonical": { "codeHash": "0x1234", "address": "0x5678"}}
  deployments: Record<string, { address: string; codeHash: string }>;

  // A record of network addresses, where the key is the network identifier and the value is the address.
  networkAddresses: Record<string, string | string[]>;

  // The ABI (Application Binary Interface) of the contract.
  abi: any[];
}
```

- Safe

```ts
const safeSingleton = getSafeSingletonDeployments();

// Returns latest contract version, even if not finally released yet
const safeSingletonNightly = getSafeSingletonDeployments({ released: undefined });

// Returns released contract version for specific network
const safeSingletonGörli = getSafeSingletonDeployments({ network: '5' });

// Returns released contract version for specific version
const safeSingleton100 = getSafeSingletonDeployments({ version: '1.0.0' });

// Version with additional events used on L2 networks
const safeL2Singleton = getSafeL2SingletonDeployments();
```

- Factories

```ts
const proxyFactory = getProxyFactoryDeployments();
```

- Libraries

```ts
const multiSendLib = getMultiSendDeployments();

const multiSendCallOnlyLib = getMultiSendCallOnlyDeployments();

const createCallLib = getCreateCallDeployments();

const signMessageLib = getSignMessageLibDeployments();
```

- Handler

```ts

const callbackHandler = getDefaultCallbackHandlerDeployments();

const compatHandler = getCompatibilityFallbackHandlerDeployments();
```

## Release cycle

`safe-deployments` release cycle is once per month, except for urgent issues that require immediate attention.

## Notes

- v1 supports only one address per network, while v2 allows multiple addresses per network. To maintain compatibility with v1, the address order in v2 is arranged so that the first address matches the one used in v1.

- A list of network information can be found at [chainid.network](https://chainid.network/)

## License

This library is released under MIT.
