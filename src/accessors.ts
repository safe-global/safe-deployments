import SimulateTxAccessor130 from './assets/v1.3.0/simulate_tx_accessor.json';
import SimulateTxAccessor141 from './assets/v1.4.1/simulate_tx_accessor.json';

import {
  DeploymentFilter,
  SingletonDeploymentJSON,
  SingletonDeployment,
  DeploymentFormats,
  SingletonDeploymentV2,
} from './types';
import { findDeployment } from './utils';

// This is a sorted array (newest to oldest)
const accessorDeployments: SingletonDeploymentJSON[] = [SimulateTxAccessor141, SimulateTxAccessor130];

/**
 * Retrieves a single simulate transaction accessor deployment based on the provided filter.
 *
 * @param {DeploymentFilter} [filter] - Optional filter to apply when searching for the deployment.
 * @returns {SingletonDeployment | undefined} - The found deployment or undefined if no deployment matches the filter.
 */
export const getSimulateTxAccessorDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, accessorDeployments);
};

/**
 * Retrieves multiple simulate transaction accessor deployments based on the provided filter.
 *
 * @param {DeploymentFilter} [filter] - Optional filter to apply when searching for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The found deployments in the specified format or undefined if no deployments match the filter.
 */
export const getSimulateTxAccessorDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, accessorDeployments, DeploymentFormats.MULTIPLE);
};
