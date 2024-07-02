enum AddressType {
  // The original address the contract was deployed on.
  // Starting with 1.4.1, the contracts are deployed with an EIP155-compatible transaction.
  CANONICAL = 'canonical',

  // An address that was deployed with a transaction compatible with the EIP155 standard.
  // The type is only used for 1.3.0 deployments.
  EIP155 = 'eip155',

  // An address that is deployed to the ZkSync VM networks.
  ZKSYNC = 'zksync',
}

export interface SingletonDeploymentJSON {
  // Indicates if the deployment is released.
  released: boolean;

  // The name of the contract.
  contractName: string;

  // The version of the deployment.
  version: string;

  // The hash of the contract code.
  codeHash: string;

  // A record of network addresses, where the key is the network identifier and the value is either a single address type or an array of address types.
  networkAddresses: Record<string, string | string[]>;

  // A record of addresses, where the key is the address type and the value is the address.
  // Possible addresses per version:
  // 1.0.0: canonical
  // 1.1.1: canonical
  // 1.2.0: canonical
  // 1.3.0: canonical, eip155, zksync
  // 1.4.1: canonical, zksync
  addresses: Record<string, string>;

  // The ABI (Application Binary Interface) of the contract.
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  abi: any[];
}

// This is the old type that only allows a single address for each network.
// It is still used for backwards compatibility.
export interface SingletonDeployment {
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
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  abi: any[];
}

export interface SingletonDeploymentV2 {
  released: boolean;
  contractName: string;
  version: string;
  codeHash: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  abi: any[];
  networkAddresses: Record<string, AddressType | AddressType[]>;
  addresses: Partial<Record<AddressType, string>>;
}

export interface DeploymentFilter {
  version?: string;
  released?: boolean;
  network?: string;
}
