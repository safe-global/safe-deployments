import {
  DeploymentFilter,
  SingletonDeployment,
  SingletonDeploymentJSON,
  DeploymentFormats,
  SingletonDeploymentV2,
} from './types';
import semverSatisfies from 'semver/functions/satisfies';

const DEFAULT_FILTER: DeploymentFilter = { released: true };

// The older JSON format had a `defaultAddress` field, which became obsolete due to EIP-155 enforcement and non-EVM compatible chains.
// This led to multiple "default" addresses, sometimes on the same chain ID. To maintain backwards compatibility, we map `defaultAddress`
// to the address deployed on a chosen default network.
const DEFAULT_NETWORK_CHAIN_ID = '1';

/**
 * Maps a SingletonDeploymentJSON object to a SingletonDeployment object.
 *
 * @param {SingletonDeploymentJSON} deployment - The deployment JSON object to map.
 * @returns {SingletonDeployment} - The mapped deployment object.
 */
const mapJsonToDeploymentsFormatV1 = (deployment: SingletonDeploymentJSON): SingletonDeployment => {
  const defaultAddressType = Array.isArray(deployment.networkAddresses[DEFAULT_NETWORK_CHAIN_ID])
    ? deployment.networkAddresses[DEFAULT_NETWORK_CHAIN_ID][0]
    : deployment.networkAddresses[DEFAULT_NETWORK_CHAIN_ID];
  const defaultAddress = deployment.addresses[defaultAddressType];
  const networkAddresses = Object.fromEntries(
    Object.entries(deployment.networkAddresses).map(([chainId, addressTypes]) => [
      chainId,
      Array.isArray(addressTypes) ? deployment.addresses[addressTypes[0]] : deployment.addresses[addressTypes],
    ]),
  );

  return { ...deployment, defaultAddress, networkAddresses };
};

/**
 * Maps a SingletonDeploymentJSON object to a SingletonDeploymentV2 object.
 *
 * This function transforms the `networkAddresses` field of the deployment JSON object.
 * It converts each entry in `networkAddresses` to an array of addresses, using the `addresses` field
 * to resolve each address type.
 *
 * @param {SingletonDeploymentJSON} deployment - The deployment JSON object to map.
 * @returns {SingletonDeploymentV2} - The mapped deployment object in V2 format.
 */
const mapJsonToDeploymentsFormatV2 = (deployment: SingletonDeploymentJSON): SingletonDeploymentV2 => {
  const newJson = { ...deployment };
  newJson.networkAddresses = Object.fromEntries(
    Object.entries(deployment.networkAddresses).map(([chainId, addressTypes]) => [
      chainId,
      Array.isArray(addressTypes)
        ? addressTypes.map((addressType) => deployment.addresses[addressType])
        : deployment.addresses[addressTypes],
    ]),
  );

  return newJson;
};

type FindDeploymentFunc = {
  (criteria: DeploymentFilter | undefined, deployments: SingletonDeploymentJSON[]): SingletonDeployment | undefined;
  (
    criteria: DeploymentFilter | undefined,
    deployments: SingletonDeploymentJSON[],
    format: DeploymentFormats.MULTIPLE,
  ): SingletonDeploymentV2 | undefined;
};

/**
 * Finds a deployment that matches the given criteria.
 *
 * @param {DeploymentFilter} [criteria=DEFAULT_FILTER] - The filter criteria to match deployments.
 * @param {SingletonDeploymentJSON[]} deployments - The list of deployment JSON objects to search.
 * @returns {SingletonDeployment | undefined} - The found deployment object or undefined if no match is found.
 */

export const findDeployment: FindDeploymentFunc = (
  criteria = DEFAULT_FILTER,
  deployments,
  format = DeploymentFormats.SINGLETON,
): any => {
  const { version, released, network } = { ...DEFAULT_FILTER, ...criteria };

  const deploymentJson = deployments.find((deployment) => {
    if (version && !semverSatisfies(deployment.version, version)) return false;
    if (typeof released === 'boolean' && deployment.released !== released) return false;
    if (network && !deployment.networkAddresses[network]) return false;

    return true;
  });

  switch (format) {
    case DeploymentFormats.SINGLETON:
      return deploymentJson ? mapJsonToDeploymentsFormatV1(deploymentJson) : undefined;
    case DeploymentFormats.MULTIPLE:
      return deploymentJson ? mapJsonToDeploymentsFormatV2(deploymentJson) : undefined;
  }
};
