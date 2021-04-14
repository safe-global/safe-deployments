import { DeploymentFilter, SingletonDeployment } from "./types"

export const findDeployment = (criteria: DeploymentFilter, deployments: SingletonDeployment[]): SingletonDeployment | undefined =>
    deployments.find((deployment) => {
        if (criteria.version && deployment.version !== criteria.version) return false
        if (criteria.released && deployment.released != criteria.released) return false
        if (criteria.network && !deployment.networkAddresses[criteria.network]) return false
        return true
    })

export const applyFilterDefaults = (filter?: DeploymentFilter): DeploymentFilter => {
    if (!filter) return { released: true }
    return filter
}