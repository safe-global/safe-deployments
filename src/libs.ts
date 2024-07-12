import {
  _CREATE_CALL_DEPLOYMENTS,
  _MULTI_SEND_CALL_ONLY_DEPLOYMENTS,
  _MULTI_SEND_DEPLOYMENTS,
  _SIGN_MESSAGE_LIB_DEPLOYMENTS,
} from './deployments';
import { DeploymentFilter, DeploymentFormats, SingletonDeployment, SingletonDeploymentV2 } from './types';
import { findDeployment } from './utils';

/**
 * Get the MultiSend deployment based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployment.
 * @returns {SingletonDeployment | undefined} - The matched deployment or undefined if not found.
 */
export const getMultiSendDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, _MULTI_SEND_DEPLOYMENTS);
};

/**
 * Get all MultiSend deployments based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The matched deployments or undefined if not found.
 */
export const getMultiSendDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, _MULTI_SEND_DEPLOYMENTS, DeploymentFormats.MULTIPLE);
};

/**
 * Get the MultiSendCallOnly deployment based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployment.
 * @returns {SingletonDeployment | undefined} - The matched deployment or undefined if not found.
 */
export const getMultiSendCallOnlyDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, _MULTI_SEND_CALL_ONLY_DEPLOYMENTS);
};

/**
 * Get all MultiSendCallOnly deployments based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The matched deployments or undefined if not found.
 */
export const getMultiSendCallOnlyDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, _MULTI_SEND_CALL_ONLY_DEPLOYMENTS, DeploymentFormats.MULTIPLE);
};

/**
 * Get the CreateCall deployment based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployment.
 * @returns {SingletonDeployment | undefined} - The matched deployment or undefined if not found.
 */
export const getCreateCallDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, _CREATE_CALL_DEPLOYMENTS);
};

/**
 * Get all CreateCall deployments based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The matched deployments or undefined if not found.
 */
export const getCreateCallDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, _CREATE_CALL_DEPLOYMENTS, DeploymentFormats.MULTIPLE);
};

/**
 * Get the SignMessageLib deployment based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployment.
 * @returns {SingletonDeployment | undefined} - The matched deployment or undefined if not found.
 */
export const getSignMessageLibDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
  return findDeployment(filter, _SIGN_MESSAGE_LIB_DEPLOYMENTS);
};

/**
 * Get all SignMessageLib deployments based on the provided filter.
 * @param {DeploymentFilter} [filter] - The filter criteria for the deployments.
 * @returns {SingletonDeploymentV2 | undefined} - The matched deployments or undefined if not found.
 */
export const getSignMessageLibDeployments = (filter?: DeploymentFilter): SingletonDeploymentV2 | undefined => {
  return findDeployment(filter, _SIGN_MESSAGE_LIB_DEPLOYMENTS, DeploymentFormats.MULTIPLE);
};
