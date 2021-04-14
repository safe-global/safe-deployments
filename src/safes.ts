import GnosisSafeL2130 from './assets/gnosis_safe_l2_1.3.0.json'
import GnosisSafe130 from './assets/gnosis_safe_1.3.0.json'
import GnosisSafe120 from './assets/gnosis_safe_1.2.0.json'
import GnosisSafe111 from './assets/gnosis_safe_1.1.1.json'
import GnosisSafe100 from './assets/gnosis_safe_1.0.0.json'
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