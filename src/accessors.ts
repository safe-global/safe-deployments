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

export const getSimulateTxAccessorDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, accessorDeployments);
};

export const getSimulateTxAccessorDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, accessorDeployments, DeploymentFormats.MULTIPLE);
};
