import { DeploymentFilter, SingletonDeployment } from "./types"

export const findDeployment = (criteria: DeploymentFilter, deployments: SingletonDeployment[]): SingletonDeployment | undefined =>
deployments.find((deployment) => {
    if (criteria.version && deployment.version !== criteria.version) return false
    if (deployment.released != (criteria.released ?? true)) return false
    if (criteria.network && !deployment.networkAddresses[criteria.network]) return false
    return true
})