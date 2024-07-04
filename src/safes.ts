import SafeL2141 from './assets/v1.4.1/safe_l2.json';
import Safe141 from './assets/v1.4.1/safe.json';
import GnosisSafeL2130 from './assets/v1.3.0/gnosis_safe_l2.json';
import GnosisSafe130 from './assets/v1.3.0/gnosis_safe.json';
import GnosisSafe120 from './assets/v1.2.0/gnosis_safe.json';
import GnosisSafe111 from './assets/v1.1.1/gnosis_safe.json';
import GnosisSafe100 from './assets/v1.0.0/gnosis_safe.json';
import {
  DeploymentFilter,
  DeploymentFormats,
  SingletonDeployment,
  SingletonDeploymentV2,
  SingletonDeploymentJSON,
} from './types';
import { findDeployment } from './utils';

// This is a sorted array (newest to oldest), exported for tests
export const _safeDeployments: SingletonDeploymentJSON[] = [
  Safe141,
  GnosisSafe130,
  GnosisSafe120,
  GnosisSafe111,
  GnosisSafe100,
];

/**
 * Finds the latest safe singleton deployment that matches the given filter.
 * @param {DeploymentFilter} [filter] - The filter to apply when searching for the deployment.
 * @returns {SingletonDeployment | undefined} - The found deployment or undefined if no deployment matches the filter.
 */
export const getSafeSingletonDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, _safeDeployments);
};

/**
 * Finds all safe singleton deployments that match the given filter.
 * @param {DeploymentFilter} [filter] - The filter to apply when searching for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The found deployments or undefined if no deployments match the filter.
 */
export const getSafeSingletonDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, _safeDeployments, DeploymentFormats.MULTIPLE);
};

// This is a sorted array (newest to oldest), exported for tests
export const _safeL2Deployments: SingletonDeploymentJSON[] = [SafeL2141, GnosisSafeL2130];

/**
 * Finds the latest safe L2 singleton deployment that matches the given filter.
 * @param {DeploymentFilter} [filter] - The filter to apply when searching for the deployment.
 * @returns {SingletonDeployment | undefined} - The found deployment or undefined if no deployment matches the filter.
 */
export const getSafeL2SingletonDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, _safeL2Deployments);
};

/**
 * Finds all safe L2 singleton deployments that match the given filter.
 * @param {DeploymentFilter} [filter] - The filter to apply when searching for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The found deployments or undefined if no deployments match the filter.
 */
export const getSafeL2SingletonDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, _safeL2Deployments, DeploymentFormats.MULTIPLE);
};
