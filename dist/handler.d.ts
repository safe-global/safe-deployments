import { DeploymentFilter, SingletonDeployment } from './types';
export declare const getDefaultCallbackHandlerDeployment: (filter?: DeploymentFilter | undefined) => SingletonDeployment | undefined;
export declare const getCompatibilityFallbackHandlerDeployment: (filter?: DeploymentFilter | undefined) => SingletonDeployment | undefined;
export declare const getFallbackHandlerDeployment: (filter?: DeploymentFilter | undefined) => SingletonDeployment | undefined;
