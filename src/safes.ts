import GnosisSafeL2130 from './assets/v1.3.0/gnosis_safe_l2.json'
import GnosisSafe130 from './assets/v1.3.0/gnosis_safe.json'
import GnosisSafe120 from './assets/v1.2.0/gnosis_safe.json'
import GnosisSafe111 from './assets/v1.1.1/gnosis_safe.json'
import GnosisSafe100 from './assets/v1.0.0/gnosis_safe.json'
import { DeploymentFilter, SingletonDeployment } from './types'
import { applyFilterDefaults, findDeployment } from './utils'

// This is a sorted array (newest to oldest)
const safeDeployments: SingletonDeployment[] = [
    GnosisSafe130, GnosisSafe120, GnosisSafe111, GnosisSafe100
]

export const getSafeSingletonDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
    return findDeployment(applyFilterDefaults(filter), safeDeployments)
}

// This is a sorted array (newest to oldest)
const safeL2Deployments: SingletonDeployment[] = [
    GnosisSafeL2130
]

export const getSafeL2SingletonDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
    return findDeployment(applyFilterDefaults(filter), safeL2Deployments)
}