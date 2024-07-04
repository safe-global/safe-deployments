import DefaultCallbackHandler130 from './assets/v1.1.1/default_callback_handler.json';
import CompatibilityFallbackHandler130 from './assets/v1.3.0/compatibility_fallback_handler.json';
import CompatibilityFallbackHandler141 from './assets/v1.4.1/compatibility_fallback_handler.json';
import {
  DeploymentFilter,
  DeploymentFormats,
  SingletonDeployment,
  SingletonDeploymentJSON,
  SingletonDeploymentV2,
} from './types';
import { findDeployment } from './utils';

// This is a sorted array (by preference)
const defaultCallbackHandlerDeployments: SingletonDeploymentJSON[] = [DefaultCallbackHandler130];

/**
 * Get the default callback handler deployment based on the provided filter.
 * @param {DeploymentFilter} [filter] - Optional filter to apply to the deployment search.
 * @returns {SingletonDeployment | undefined} - The found deployment or undefined if not found.
 */
export const getDefaultCallbackHandlerDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, defaultCallbackHandlerDeployments);
};

export const getDefaultCallbackHandlerDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, defaultCallbackHandlerDeployments, DeploymentFormats.MULTIPLE);
};

// This is a sorted array (by preference)
const compatFallbackHandlerDeployments: SingletonDeploymentJSON[] = [
  CompatibilityFallbackHandler141,
  CompatibilityFallbackHandler130,
];

/**
 * Get the compatibility fallback handler deployment based on the provided filter.
 * @param {DeploymentFilter} [filter] - Optional filter to apply to the deployment search.
 * @returns {SingletonDeployment | undefined} - The found deployment or undefined if not found.
 */
export const getCompatibilityFallbackHandlerDeployment = (
  filter?: DeploymentFilter,
): SingletonDeployment | undefined => {
  return findDeployment(filter, compatFallbackHandlerDeployments);
};

/**
 * Get all compatibility fallback handler deployments based on the provided filter.
 * @param {DeploymentFilter} [filter] - Optional filter to apply to the deployment search.
 * @returns {SingletonDeploymentV2 | undefined} - The found deployments in version 2 format or undefined if not found.
 */
export const getCompatibilityFallbackHandlerDeployments = (
  filter?: DeploymentFilter,
): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, compatFallbackHandlerDeployments, DeploymentFormats.MULTIPLE);
};

/**
 * Get the fallback handler deployment based on the provided filter. This method is an alias for `getCompatibilityFallbackHandlerDeployment`.
 * Kept for backwards compatibility.
 * @param {DeploymentFilter} [filter] - Optional filter to apply to the deployment search.
 * @returns {SingletonDeployment | undefined} - The found deployment or undefined if not found.
 */
export const getFallbackHandlerDeployment = getCompatibilityFallbackHandlerDeployment;
