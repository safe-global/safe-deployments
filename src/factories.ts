import ProxyFactory100 from './assets/v1.0.0/proxy_factory.json';
import ProxyFactory111 from './assets/v1.1.1/proxy_factory.json';
import ProxyFactory130 from './assets/v1.3.0/proxy_factory.json';
import SafeProxyFactory141 from './assets/v1.4.1/safe_proxy_factory.json';

import {
  DeploymentFilter,
  DeploymentFormats,
  SingletonDeployment,
  SingletonDeploymentJSON,
  SingletonDeploymentV2,
} from './types';
import { findDeployment } from './utils';

// This is a sorted array (newest to oldest)
const factoryDeployments: SingletonDeploymentJSON[] = [
  SafeProxyFactory141,
  ProxyFactory130,
  ProxyFactory111,
  ProxyFactory100,
];

/**
 * Finds the latest proxy factory deployment that matches the given filter.
 * @param {DeploymentFilter} [filter] - The filter to apply when searching for the deployment.
 * @returns {SingletonDeployment | undefined} - The found deployment or undefined if no deployment matches the filter.
 */
export const getProxyFactoryDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, factoryDeployments);
};

/**
 * Finds all proxy factory deployments that match the given filter.
 * @param {DeploymentFilter} [filter] - The filter to apply when searching for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The found deployments or undefined if no deployments match the filter.
 */
export const getProxyFactoryDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, factoryDeployments, DeploymentFormats.MULTIPLE);
};
