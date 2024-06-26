enum AddressType {
  CANONICAL = 'canonical',
  EIP155 = 'eip155',
  ZKSYNC = 'zksync',
}

export interface SingletonDeploymentJSON {
  released: boolean;
  contractName: string;
  version: string;
  codeHash: string;
  networkAddresses: Record<string, string | string[]>;
  addresses: Record<string, string>;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  abi: any[];
}

interface AbiInput {
  indexed?: boolean;
  internalType: string;
  name: string;
  type: string;
}

interface AbiItem {
  anonymous?: boolean;
  inputs?: AbiInput[];
  name?: string;
  type: string;
  stateMutability?: string;
  outputs?: AbiInput[];
}

export interface SingletonDeployment {
  defaultAddress: string;
  released: boolean;
  contractName: string;
  version: string;
  codeHash: string;
  networkAddresses: Record<string, string>;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  abi: AbiItem[];
}

export interface SingletonDeploymentV2 {
  released: boolean;
  contractName: string;
  version: string;
  codeHash: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  abi: AbiItem[];
  networkAddresses: Record<string, AddressType | AddressType[]>;
  addresses: Partial<Record<AddressType, string>>;
}

export interface DeploymentFilter {
  version?: string;
  released?: boolean;
  network?: string;
}
