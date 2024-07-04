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

export const getDefaultCallbackHandlerDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, defaultCallbackHandlerDeployments);
};

// This is a sorted array (by preference)
const compatFallbackHandlerDeployments: SingletonDeploymentJSON[] = [
  CompatibilityFallbackHandler141,
  CompatibilityFallbackHandler130,
];

export const getCompatibilityFallbackHandlerDeployment = (
  filter?: DeploymentFilter,
): SingletonDeployment | undefined => {
  return findDeployment(filter, compatFallbackHandlerDeployments);
};

export const getCompatibilityFallbackHandlerDeploymentV2 = (
  filter?: DeploymentFilter,
): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, compatFallbackHandlerDeployments, DeploymentFormats.MULTIPLE);
};

// This is a sorted array (by preference)
const fallbackHandlerDeployments: SingletonDeploymentJSON[] = [
  CompatibilityFallbackHandler141,
  CompatibilityFallbackHandler130,
  DefaultCallbackHandler130,
];

export const getFallbackHandlerDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, fallbackHandlerDeployments);
};

export const getFallbackHandlerDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, fallbackHandlerDeployments, DeploymentFormats.MULTIPLE);
};
