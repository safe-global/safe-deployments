import { DeploymentFilter, SingletonDeployment } from './types';
export declare const getMultiSendDeployment: (filter?: DeploymentFilter) => SingletonDeployment | undefined;
export declare const getMultiSendCallOnlyDeployment: (filter?: DeploymentFilter) => SingletonDeployment | undefined;
export declare const getCreateCallDeployment: (filter?: DeploymentFilter) => SingletonDeployment | undefined;
export declare const getSignMessageLibDeployment: (filter?: DeploymentFilter) => SingletonDeployment | undefined;
