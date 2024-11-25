import { DeploymentFilter, SingletonDeployment, DeploymentFormats, SingletonDeploymentV2 } from './types';
import { findDeployment } from './utils';
import { _ACCESSOR_DEPLOYMENTS } from './deployments';

/**
 * Retrieves a single simulate transaction accessor deployment based on the provided filter.
 *
 * @param {DeploymentFilter} [filter] - Optional filter to apply when searching for the deployment.
 * @returns {SingletonDeployment | undefined} - The found deployment or undefined if no deployment matches the filter.
 */
export const getSimulateTxAccessorDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, _ACCESSOR_DEPLOYMENTS);
};

/**
 * Retrieves multiple simulate transaction accessor deployments based on the provided filter.
 *
 * @param {DeploymentFilter} [filter] - Optional filter to apply when searching for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The found deployments in the specified format or undefined if no deployments match the filter.
 */
export const getSimulateTxAccessorDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, _ACCESSOR_DEPLOYMENTS, DeploymentFormats.MULTIPLE);
};
