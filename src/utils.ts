import { DeploymentFilter, SingletonDeployment, SingletonDeploymentJSON } from './types';
import semverSatisfies from 'semver/functions/satisfies';

const DEFAULT_FILTER: DeploymentFilter = { released: true };

// The older JSON format had a `defaultAddress` field, which became obsolete due to EIP-155 enforcement and non-EVM compatible chains.
// This led to multiple "default" addresses, sometimes on the same chain ID. To maintain backwards compatibility, we map `defaultAddress`
// to the address deployed on a chosen default network.
const DEFAULT_NETWORK_CHAIN_ID = '1';

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

export const findDeployment = (
  criteria: DeploymentFilter = DEFAULT_FILTER,
  deployments: SingletonDeploymentJSON[],
): SingletonDeployment | undefined => {
  const { version, released, network } = { ...DEFAULT_FILTER, ...criteria };

  const deploymentJson = deployments.find((deployment) => {
    if (version && !semverSatisfies(deployment.version, version)) return false;
    if (typeof released === 'boolean' && deployment.released !== released) return false;
    if (network && !deployment.networkAddresses[network]) return false;

    return true;
  });

  return deploymentJson ? mapJsonToDeploymentsFormatV1(deploymentJson) : undefined;
};
