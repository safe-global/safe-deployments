import { _SAFE_DEPLOYMENTS, _SAFE_L2_DEPLOYMENTS } from './deployments';
import { DeploymentFilter, DeploymentFormats, SingletonDeployment, SingletonDeploymentV2 } from './types';
import { findDeployment } from './utils';

/**
 * Finds the latest safe singleton deployment that matches the given filter.
 * @param {DeploymentFilter} [filter] - The filter to apply when searching for the deployment.
 * @returns {SingletonDeployment | undefined} - The found deployment or undefined if no deployment matches the filter.
 */
export const getSafeSingletonDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, _SAFE_DEPLOYMENTS);
};

/**
 * Finds all safe singleton deployments that match the given filter.
 * @param {DeploymentFilter} [filter] - The filter to apply when searching for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The found deployments or undefined if no deployments match the filter.
 */
export const getSafeSingletonDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, _SAFE_DEPLOYMENTS, DeploymentFormats.MULTIPLE);
};

/**
 * Finds the latest safe L2 singleton deployment that matches the given filter.
 * @param {DeploymentFilter} [filter] - The filter to apply when searching for the deployment.
 * @returns {SingletonDeployment | undefined} - The found deployment or undefined if no deployment matches the filter.
 */
export const getSafeL2SingletonDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, _SAFE_L2_DEPLOYMENTS);
};

/**
 * Finds all safe L2 singleton deployments that match the given filter.
 * @param {DeploymentFilter} [filter] - The filter to apply when searching for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The found deployments or undefined if no deployments match the filter.
 */
export const getSafeL2SingletonDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, _SAFE_L2_DEPLOYMENTS, DeploymentFormats.MULTIPLE);
};
