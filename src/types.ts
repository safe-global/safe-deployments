export interface SingletonDeploymentJSON {
    released: boolean
    contractName: string,
    version: string,
    codeHash: string,
    networkAddresses: Record<string, string>,
    abi: any[],
}

export interface SingletonDeployment {
    defaultAddress: string,
    released: boolean
    contractName: string,
    version: string,
    codeHash: string,
    networkAddresses: Record<string, string>,
    abi: any[],
}

export interface DeploymentFilter {
    version?: string,
    released?: boolean,
    network?: string
}
