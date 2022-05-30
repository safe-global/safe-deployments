import { DeploymentFilter, SingletonDeployment } from './types'
import semverSatisfies from 'semver/functions/satisfies'

const DEFAULT_FILTER: DeploymentFilter = { released: true }

export const findDeployment = (criteria: DeploymentFilter = DEFAULT_FILTER, deployments: SingletonDeployment[]): SingletonDeployment | undefined =>
  deployments.find((deployment) => {
        if (criteria.version && !semverSatisfies(deployment.version, criteria.version)) return false
        if (typeof criteria.released === 'boolean' && deployment.released != criteria.released) return false
        if (criteria.network && !deployment.networkAddresses[criteria.network]) return false
    return true
  })