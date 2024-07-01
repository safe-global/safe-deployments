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

export interface SingletonDeployment {
  defaultAddress: string;
  released: boolean;
  contractName: string;
  version: string;
  codeHash: string;
  addresses: Record<string, string>;
  networkAddresses: Record<string, string>;
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
