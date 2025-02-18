import {
  DeploymentFilter,
  SingletonDeployment,
  SingletonDeploymentJSON,
  DeploymentFormats,
  SingletonDeploymentV2,
  AddressType,
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
  // The usage of non-null assertion below is safe, because we validate that the asset files are properly formed in tests
  const defaultAddress = deployment.deployments[defaultAddressType]!.address;
  const networkAddresses = Object.fromEntries(
    Object.entries(deployment.networkAddresses).map(([chainId, addressTypes]) => [
      chainId,
      Array.isArray(addressTypes)
        ? deployment.deployments[addressTypes[0]]!.address
        : deployment.deployments[addressTypes]!.address,
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
const mapJsonToDeploymentsFormatV2 = (deployment: SingletonDeploymentJSON): SingletonDeploymentV2 => ({
  ...deployment,
  networkAddresses: Object.fromEntries(
    Object.entries(deployment.networkAddresses).map(([chainId, addressTypes]) => [
      chainId,
      (Array.isArray(addressTypes)
        ? // The usage of non-null assertion below is safe, because we validate that the asset files are properly formed in tests
          (addressTypes.map((addressType) => deployment.deployments[addressType]!.address) as AddressType[])
        : deployment.deployments[addressTypes]!.address) as AddressType,
    ]),
  ),
});

/**
 * Finds a deployment that matches the given criteria.
 * This function is implemented as a regular function to allow for overloading: https://github.com/microsoft/TypeScript/issues/33482
 *
 * @param {DeploymentFilter} [criteria=DEFAULT_FILTER] - The filter criteria to match deployments.
 * @param {SingletonDeploymentJSON[]} deployments - The list of deployment JSON objects to search.
 * @returns {SingletonDeployment | undefined} - The found deployment object or undefined if no match is found.
 */
function findDeployment(
  criteria: DeploymentFilter | undefined,
  deployments: SingletonDeploymentJSON[],
  format?: DeploymentFormats.SINGLETON,
): SingletonDeployment | undefined;
function findDeployment(
  criteria: DeploymentFilter | undefined,
  deployments: SingletonDeploymentJSON[],
  format: DeploymentFormats.MULTIPLE,
): SingletonDeploymentV2 | undefined;
function findDeployment(
  criteria = DEFAULT_FILTER,
  deployments: SingletonDeploymentJSON[],
  format: DeploymentFormats = DeploymentFormats.SINGLETON,
): SingletonDeployment | SingletonDeploymentV2 | undefined {
  const { version, released, network } = { ...DEFAULT_FILTER, ...criteria };

  const deploymentJson = deployments.find((deployment) => {
    if (version && !semverSatisfies(deployment.version, version)) return false;
    if (typeof released === 'boolean' && deployment.released !== released) return false;
    if (network && !deployment.networkAddresses[network]) return false;

    return true;
  });

  if (!deploymentJson) return undefined;

  if (format === DeploymentFormats.MULTIPLE) {
    return mapJsonToDeploymentsFormatV2(deploymentJson);
  } else {
    return mapJsonToDeploymentsFormatV1(deploymentJson);
  }
}

export { findDeployment };
