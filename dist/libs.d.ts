import { DeploymentFilter, SingletonDeployment } from './types';
export declare const getMultiSendDeployment: (filter?: DeploymentFilter | undefined) => SingletonDeployment | undefined;
export declare const getMultiSendCallOnlyDeployment: (filter?: DeploymentFilter | undefined) => SingletonDeployment | undefined;
export declare const getCreateCallDeployment: (filter?: DeploymentFilter | undefined) => SingletonDeployment | undefined;
export declare const getSignMessageLibDeployment: (filter?: DeploymentFilter | undefined) => SingletonDeployment | undefined;
