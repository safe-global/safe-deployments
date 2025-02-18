# Safe Deployments

[![npm version](https://badge.fury.io/js/%40safe-global%2Fsafe-deployments.svg)](https://badge.fury.io/js/%40safe-global%2Fsafe-deployments)
[![CI](https://github.com/safe-global/safe-deployments/actions/workflows/test.yml/badge.svg)](https://github.com/safe-global/safe-deployments/actions/workflows/test.yml)

This contract contains a collection of deployments of the contract of the [Safe contracts repository](https://github.com/safe-global/safe-smart-account).

The addresses on the different networks and the abi files are available for each deployment. To get an overview of the available versions, check the available [json assets](./src/assets/).

## Adding additional deployments:

1. Follow the [deployment steps in the Safe contract repository](https://github.com/safe-global/safe-smart-account/#deployments).
2. Verify that the addresses match the expected address for each contract. You can find them under the "addresses" mapping in the respective JSON file in the [assets folder](./src/assets/).
3. Create a PR adding the new deployment. Example PR can be found [here](https://github.com/safe-global/safe-deployments/pull/676).

## Deployments overview

> ContractScan is a 3rd party tool that is not maintained by the Safe team

- [1.0.0](https://contractscan.xyz/bundle?name=Safe+1.0.0&addresses=0xb6029ea3b2c51d09a50b53ca8012feeb05bda35a,0x12302fe9c02ff50939baaaaf415fc226c078613c)
- [1.1.1](https://contractscan.xyz/bundle?name=Safe+1.1.1&addresses=0xf61a721642b0c0c8b334ba3763ba1326f53798c0,0x8538fcbccba7f5303d2c679fa5d7a629a8c9bf4a,0xd5d82b6addc9027b22dca772aa68d5d74cdbdf44,0x34cfac646f301356faa8b21e94227e3583fe3f5f,0x8d29be29923b68abfdd21e541b9374737b49cdad,0x76e2cfc1f5fa8f6a5b3fc4c8f4788f0116861f9b)
- [1.2.0](https://contractscan.xyz/bundle?name=Safe+1.2.0&addresses=0x6851d6fdfafd08c0295c392436245e5bc78b0185)
- 1.3.0
  - [Canonical](https://contractscan.xyz/bundle?name=Safe+1.3.0&addresses=0xf48f2b2d2a534e402487b3ee7c18c33aec0fe5e4,0x7cbb62eaa69f79e6873cd1ecb2392971036cfaa4,0xd9db270c1b5e3bd161e8c8503c55ceabee709552,0x3e5c63644e683549055b9be8653de26e0b4cd36e,0xa238cbeb142c10ef7ad8442c6d1f9e89e07e7761,0x40a2accbd92bca938b02010e17a5b8929b49130d,0xa6b71e26c5e0845f74c812102ca7114b6a896ab2,0xa65387f16b013cf2af4605ad8aa5ec25a2cba3a2,0x59ad6735bcd8152b84860cb256dd9e96b85f69da)
  - [EIP155](https://contractscan.xyz/bundle?name=Safe+1.3.0+EIP155&addresses=0x017062a1de2fe6b99be3d9d37841fed19f573804,0xb19d6ffc2182150f8eb585b79d4abcd7c5640a9d,0x69f4d1788e39c87893c980c06edf4b7f686e2938,0xfb1bffc9d739b8d520daf37df666da4c687191ea,0x998739bfdaadde7c933b942a68053933098f9eda,0xa1dabef33b3b82c7814b6d82a79e50f4ac44102b,0xc22834581ebc8527d974f8a1c97e1bea4ef910bc,0x98ffbbf51bb33a056b08ddf711f289936aaff717,0x727a77a074d1e6c4530e814f89e618a3298fc044)
  - [ZKsync](https://contractscan.xyz/bundle?name=Safe+1.3.0+ZKsync&addresses=0x2f870a80647bbc554f3a0ebd093f11b4d2a7492a,0xcb8e5e438c5c2b45fbe17b02ca9af91509a8ad56,0xb00ce5cccdef57e539ddced01df43a13855d9910,0x1727c2c531cf966f902e5927b98490fdfb3b2b70,0x0dfcccb95225ffb03c6fbb2559b530c2b7c8a912,0xf220d3b4dfb23c4ade8c88e526c1353abacbc38f,0xdaec33641865e4651fb43181c6db6f7232ee91c2,0x357147caf9c0cca67dfa0cf5369318d8193c8407,0x4191e2e12e8bc5002424ce0c51f9947b02675a44)
- [1.4.1](https://contractscan.xyz/bundle?name=Safe+1.4.1&addresses=0xfd0732dc9e303f09fcef3a7388ad10a83459ec99,0x9b35af71d77eaf8d7e40252370304687390a1a52,0x38869bf66a61cf6bdb996a6ae40d5853fd43b526,0x9641d764fc13c8b624c04430c7356c1c7c8102e2,0x41675c099f32341bf84bfc5382af534df5c7461a,0x29fcb43b46531bca003ddc8fcb67ffe91900c762,0x4e1dcf7ad4e460cfd30791ccc4f9c8a4f820ec67,0xd53cd0ab83d845ac265be939c57f53ad838012c9,0x3d4ba2e0884aa488718476ca2fb8efc291a46199,0x526643F69b81B008F46d95CD5ced5eC0edFFDaC6,0xfF83F6335d8930cBad1c0D439A841f01888D9f69,0xBD89A1CE4DDe368FFAB0eC35506eEcE0b1fFdc54)


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
