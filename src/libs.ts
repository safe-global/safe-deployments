import CreateCall130 from './assets/v1.3.0/create_call.json';
import CreateCall141 from './assets/v1.4.1/create_call.json';
import MultiSend111 from './assets/v1.1.1/multi_send.json';
import MultiSend130 from './assets/v1.3.0/multi_send.json';
import MultiSend141 from './assets/v1.4.1/multi_send.json';
import MultiSendCallOnly130 from './assets/v1.3.0/multi_send_call_only.json';
import MultiSendCallOnly141 from './assets/v1.4.1/multi_send_call_only.json';
import SignMessageLib130 from './assets/v1.3.0/sign_message_lib.json';
import SignMessageLib141 from './assets/v1.4.1/sign_message_lib.json';
import {
  DeploymentFilter,
  DeploymentFormats,
  SingletonDeployment,
  SingletonDeploymentJSON,
  SingletonDeploymentV2,
} from './types';
import { findDeployment } from './utils';

// This is a sorted array (by preference, currently we use 111 in most cases)
const multiSendDeployments: SingletonDeploymentJSON[] = [MultiSend141, MultiSend130, MultiSend111];

/**
 * Get the MultiSend deployment based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployment.
 * @returns {SingletonDeployment | undefined} - The matched deployment or undefined if not found.
 */
export const getMultiSendDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, multiSendDeployments);
};

/**
 * Get all MultiSend deployments based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The matched deployments or undefined if not found.
 */
export const getMultiSendDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, multiSendDeployments, DeploymentFormats.MULTIPLE);
};

// This is a sorted array (by preference)
const multiSendCallOnlyDeployments: SingletonDeploymentJSON[] = [MultiSendCallOnly141, MultiSendCallOnly130];

/**
 * Get the MultiSendCallOnly deployment based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployment.
 * @returns {SingletonDeployment | undefined} - The matched deployment or undefined if not found.
 */
export const getMultiSendCallOnlyDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, multiSendCallOnlyDeployments);
};

/**
 * Get all MultiSendCallOnly deployments based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The matched deployments or undefined if not found.
 */
export const getMultiSendCallOnlyDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, multiSendCallOnlyDeployments, DeploymentFormats.MULTIPLE);
};

// This is a sorted array (by preference)
const createCallDeployments: SingletonDeploymentJSON[] = [CreateCall141, CreateCall130];

/**
 * Get the CreateCall deployment based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployment.
 * @returns {SingletonDeployment | undefined} - The matched deployment or undefined if not found.
 */
export const getCreateCallDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, createCallDeployments);
};

/**
 * Get all CreateCall deployments based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The matched deployments or undefined if not found.
 */
export const getCreateCallDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, createCallDeployments, DeploymentFormats.MULTIPLE);
};

const signMessageLibDeployments: SingletonDeploymentJSON[] = [SignMessageLib141, SignMessageLib130];

/**
 * Get the SignMessageLib deployment based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployment.
 * @returns {SingletonDeployment | undefined} - The matched deployment or undefined if not found.
 */
export const getSignMessageLibDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, signMessageLibDeployments);
};

/**
 * Get all SignMessageLib deployments based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The matched deployments or undefined if not found.
 */
export const getSignMessageLibDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, signMessageLibDeployments, DeploymentFormats.MULTIPLE);
};
