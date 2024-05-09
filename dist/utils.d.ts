import { DeploymentFilter, SingletonDeployment } from './types';
export declare const findDeployment: (criteria: DeploymentFilter | undefined, deployments: SingletonDeployment[]) => SingletonDeployment | undefined;
