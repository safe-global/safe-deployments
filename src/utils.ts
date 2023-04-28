import { DeploymentFilter, SingletonDeployment } from './types'
import semverSatisfies from 'semver/functions/satisfies'

const DEFAULT_FILTER: DeploymentFilter = { released: true }

export const findDeployment = (criteria: DeploymentFilter = DEFAULT_FILTER, deployments: SingletonDeployment[]): SingletonDeployment | undefined => {
  const criteriaWithDefaults: DeploymentFilter = { ...DEFAULT_FILTER, ...criteria }

  return deployments.find((deployment) => {
        if (typeof criteriaWithDefaults.version !== 'undefined' && !semverSatisfies(deployment.version, criteriaWithDefaults.version)) return false
        if (typeof criteriaWithDefaults.released === 'boolean' && deployment.released != criteriaWithDefaults.released) return false
        if (criteriaWithDefaults.network && !deployment.networkAddresses[criteriaWithDefaults.network]) return false

    console.log('criteria.version && !semverSatisfies(deployment.version, criteria.version)', typeof criteria.version !== 'undefined' && !semverSatisfies(deployment.version, criteria.version))  
    console.log(`typeof criteria.released === 'boolean' && deployment.released != criteria.released)`, typeof criteria.released === 'boolean' && deployment.released != criteria.released)
    return true
  })
}