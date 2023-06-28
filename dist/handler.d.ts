import { DeploymentFilter, SingletonDeployment } from './types';
export declare const getDefaultCallbackHandlerDeployment: (filter?: DeploymentFilter) => SingletonDeployment | undefined;
export declare const getCompatibilityFallbackHandlerDeployment: (filter?: DeploymentFilter) => SingletonDeployment | undefined;
export declare const getFallbackHandlerDeployment: (filter?: DeploymentFilter) => SingletonDeployment | undefined;
