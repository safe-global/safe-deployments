import Safe150 from '../assets/v1.5.0/safe.json';
import Safe141 from '../assets/v1.4.1/safe.json';
import GnosisSafe130 from '../assets/v1.3.0/gnosis_safe.json';
import GnosisSafe120 from '../assets/v1.2.0/gnosis_safe.json';
import GnosisSafe111 from '../assets/v1.1.1/gnosis_safe.json';
import GnosisSafe100 from '../assets/v1.0.0/gnosis_safe.json';
import SafeL2150 from '../assets/v1.5.0/safe_l2.json';
import SafeL2141 from '../assets/v1.4.1/safe_l2.json';
import GnosisSafeL2130 from '../assets/v1.3.0/gnosis_safe_l2.json';
import { getSafeSingletonDeployment, getSafeL2SingletonDeployment } from '../safes';

describe('safes.ts', () => {
  describe('getSafeSingletonDeployment', () => {
    it('should find the latest deployment first', () => {
      const result = getSafeSingletonDeployment();
      expect(result).toMatchObject({
        defaultAddress: Safe150.deployments.canonical.address,
        contractName: 'Safe',
        version: '1.5.0',
        networkAddresses: {
          ['1']: Safe150.deployments.canonical.address,
        },
        abi: Safe150.abi,
      });
    });

    it('should return the correct deployment filtered by version', () => {
      for (const [version, artifact] of [
        ['1.5.0', Safe150],
        ['1.4.1', Safe141],
        ['1.3.0', GnosisSafe130],
        ['1.2.0', GnosisSafe120],
        ['1.1.1', GnosisSafe111],
        ['1.0.0', GnosisSafe100],
      ] as const) {
        expect(getSafeSingletonDeployment({ version })).toMatchObject({
          defaultAddress: artifact.deployments.canonical.address,
          contractName: artifact.contractName,
          version,
          networkAddresses: {
            ['1']: artifact.deployments.canonical.address,
          },
          abi: artifact.abi,
        });
      }

      expect(getSafeSingletonDeployment({ version: '99.0.0' })).toBeUndefined();
    });
  });

  describe('getSafeL2SingletonDeployment', () => {
    it('should find the latest deployment first', () => {
      const result = getSafeL2SingletonDeployment();
      expect(result).toMatchObject({
        defaultAddress: SafeL2150.deployments.canonical.address,
        contractName: 'SafeL2',
        version: '1.5.0',
        networkAddresses: {
          ['1']: SafeL2150.deployments.canonical.address,
        },
        abi: SafeL2150.abi,
      });
    });

    it('should return the correct deployment filtered by version', () => {
      for (const [version, artifact] of [
        ['1.5.0', SafeL2150],
        ['1.4.1', SafeL2141],
        ['1.3.0', GnosisSafeL2130],
      ] as const) {
        expect(getSafeL2SingletonDeployment({ version })).toMatchObject({
          defaultAddress: artifact.deployments.canonical.address,
          contractName: artifact.contractName,
          version,
          networkAddresses: {
            ['1']: artifact.deployments.canonical.address,
          },
          abi: artifact.abi,
        });
      }

      expect(getSafeL2SingletonDeployment({ version: '99.0.0' })).toBeUndefined();
    });
  });
});
