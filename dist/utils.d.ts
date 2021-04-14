import { DeploymentFilter, SingletonDeployment } from "./types";
export declare const findDeployment: (criteria: DeploymentFilter, deployments: SingletonDeployment[]) => SingletonDeployment | undefined;
export declare const applyFilterDefaults: (filter?: DeploymentFilter | undefined) => DeploymentFilter;
