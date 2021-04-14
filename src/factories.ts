import ProxyFactory111 from './assets/proxy_factory_1.1.1.json'
import ProxyFactory130 from './assets/proxy_factory_1.3.0.json'
import { DeploymentFilter, SingletonDeployment } from './types'
import { applyFilterDefaults, findDeployment } from './utils'



// This is a sorted array (newest to oldest)
const factoryDeployments: SingletonDeployment[] = [
    ProxyFactory130, ProxyFactory111
]

export const getProxyFactoryDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
    return findDeployment(applyFilterDefaults(filter), factoryDeployments)
}