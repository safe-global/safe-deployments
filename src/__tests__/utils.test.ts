import SafeL2141 from './assets/v1/v1.4.1/safe_l2.json';
import Safe141 from './assets/v1/v1.4.1/safe.json';

import GnosisSafeL2130 from './assets/v1/v1.3.0/gnosis_safe_l2.json';
import GnosisSafe130 from './assets/v1/v1.3.0/gnosis_safe.json';
import GnosisSafe120 from './assets/v1/v1.2.0/gnosis_safe.json';
import GnosisSafe111 from './assets/v1/v1.1.1/gnosis_safe.json';
import GnosisSafe100 from './assets/v1/v1.0.0/gnosis_safe.json';
import { findDeployment } from '../utils';
import { _safeDeployments, _safeL2Deployments } from '../safes';
import { SingletonDeployment, SingletonDeploymentJSON } from '../types';

const _safeDeploymentsReverse = [..._safeDeployments].reverse();

describe('utils.ts', () => {
  describe('findDeployment', () => {
    it('should filter by released by default', () => {
      const testUnreleasedDeploymentJson: SingletonDeploymentJSON = {
        version: '',
        abi: [],
        addresses: {
          canonical: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
        },
        networkAddresses: { '1': 'canonical' },
        contractName: '',
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        released: false,
      };
      const testReleasedDeploymentJson: SingletonDeploymentJSON = {
        version: '',
        abi: [],
        addresses: {
          canonical: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
        },
        networkAddresses: { '1': 'canonical' },
        contractName: '',
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        released: true, // Default filter value
      };
      const testReleasedDeployment: SingletonDeployment = {
        defaultAddress: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
        addresses: {
          canonical: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
        },
        networkAddresses: { '1': '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef' },
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        released: true,
        abi: [],
        version: '',
        contractName: '',
      };

      const testDeployments = [testUnreleasedDeploymentJson, testUnreleasedDeploymentJson, testReleasedDeploymentJson];

      expect(findDeployment(undefined, testDeployments)).toMatchObject(testReleasedDeployment);

      // should preserve the released flag even if its not explicitly passed
      expect(findDeployment({ network: '1' }, testDeployments)).toMatchObject(testReleasedDeployment);
    });

    it('should return the correct deployment (filtered by version)', () => {
      // Chronological deployments
      expect(findDeployment({ version: '1.3.0' }, _safeDeployments)).toMatchObject(GnosisSafe130);
      expect(findDeployment({ version: '1.2.0' }, _safeDeployments)).toMatchObject(GnosisSafe120);
      expect(findDeployment({ version: '1.1.1' }, _safeDeployments)).toMatchObject(GnosisSafe111);
      expect(findDeployment({ version: '1.0.0' }, _safeDeployments)).toMatchObject(GnosisSafe100);
      // Incorrect filter:
      expect(findDeployment({ version: '2.0.0' }, _safeDeployments)).toBeUndefined();

      // L2 deployments
      expect(findDeployment({ version: '1.3.0+L2' }, _safeL2Deployments)).toMatchObject(GnosisSafeL2130);
      // Incorrect filter:
      expect(findDeployment({ version: '2.0.0+L2' }, _safeL2Deployments)).toBeUndefined();
    });

    it('should return the correct deployment (filtered by released flag)', () => {
      const testUnreleasedDeploymentJson: SingletonDeploymentJSON = {
        version: '',
        abi: [],
        addresses: {
          canonical: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
        },
        networkAddresses: { '1': 'canonical' },
        contractName: '',
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        released: false,
      };
      const testReleasedDeploymentJson: SingletonDeploymentJSON = {
        version: '',
        abi: [],
        addresses: {
          canonical: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
        },
        networkAddresses: { '1': 'canonical' },
        contractName: '',
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        released: true, // Default filter value
      };
      const testUnreleasedDeployment: SingletonDeployment = {
        defaultAddress: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
        addresses: {
          canonical: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
        },
        networkAddresses: { '1': '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef' },
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        released: false,
        abi: [],
        version: '',
        contractName: '',
      };

      const testDeployments = [testUnreleasedDeploymentJson, testReleasedDeploymentJson];

      // Chronological deployments
      expect(findDeployment({ released: true }, _safeDeployments)).toMatchObject(Safe141);

      // Reverse chronological deployments
      expect(findDeployment({ released: true }, _safeDeploymentsReverse)).toMatchObject(GnosisSafe100);
      // Released flag set to false:
      expect(findDeployment({ released: false }, testDeployments)).toMatchObject(testUnreleasedDeployment);

      // L2 deployments
      expect(findDeployment({ released: true }, _safeL2Deployments)).toMatchObject(SafeL2141);
    });

    it('should return the correct deployment (filtered by network)', () => {
      // Reverse chronological deployments
      expect(findDeployment({ network: '1' }, _safeDeploymentsReverse)).toMatchObject(GnosisSafe100);
      expect(findDeployment({ network: '73799' }, _safeDeploymentsReverse)).toMatchObject(GnosisSafe111);
      expect(findDeployment({ network: '11297108109' }, _safeDeploymentsReverse)).toMatchObject(GnosisSafe130);
      // Incorrect filter:
      expect(findDeployment({ network: '0' }, _safeDeploymentsReverse)).toBeUndefined();

      // L2 deployments
      expect(findDeployment({ network: '100' }, _safeL2Deployments)).toMatchObject(SafeL2141);
      // Incorrect filter:
      expect(findDeployment({ network: '0' }, _safeL2Deployments)).toBeUndefined();
    });
    it('should return the correct deployment (filtered by version and released)', () => {
      // Chronological deployments
      expect(findDeployment({ version: '1.3.0', released: true }, _safeDeployments)).toMatchObject(GnosisSafe130);
      expect(findDeployment({ version: '1.2.0', released: true }, _safeDeployments)).toMatchObject(GnosisSafe120);
      expect(findDeployment({ version: '1.1.1', released: true }, _safeDeployments)).toMatchObject(GnosisSafe111);
      expect(findDeployment({ version: '1.0.0', released: true }, _safeDeployments)).toMatchObject(GnosisSafe100);
      // Incorrect filter:
      expect(findDeployment({ version: '1.0.0', released: false }, _safeDeployments)).toBeUndefined();

      // L2 deployments
      expect(findDeployment({ version: '1.3.0', released: true }, _safeL2Deployments)).toMatchObject(GnosisSafeL2130);
      expect(findDeployment({ version: '1.3.0+L2', released: true }, _safeL2Deployments)).toMatchObject(
        GnosisSafeL2130,
      );
      // Incorrect filter:
      expect(findDeployment({ version: '1.3.0+L2', released: false }, _safeL2Deployments)).toBeUndefined();
    });
    it('should return the correct deployment (filtered by version and network)', () => {
      // Reverse chronological deployments
      expect(findDeployment({ version: '1.0.0', network: '1' }, _safeDeploymentsReverse)).toMatchObject(GnosisSafe100);
      expect(findDeployment({ version: '1.1.1', network: '1' }, _safeDeploymentsReverse)).toMatchObject(GnosisSafe111);
      expect(findDeployment({ version: '1.2.0', network: '1' }, _safeDeploymentsReverse)).toMatchObject(GnosisSafe120);
      expect(findDeployment({ version: '1.3.0', network: '1' }, _safeDeploymentsReverse)).toMatchObject(GnosisSafe130);
      // Incorrect filter:
      expect(findDeployment({ version: '1.3.0', network: '0' }, _safeDeploymentsReverse)).toBeUndefined();

      // L2 deployments
      expect(findDeployment({ version: '1.3.0', network: '100' }, _safeL2Deployments)).toMatchObject(GnosisSafeL2130);
      expect(findDeployment({ version: '1.3.0+L2', network: '100' }, _safeL2Deployments)).toMatchObject(
        GnosisSafeL2130,
      );
      // Incorrect filter:
      expect(findDeployment({ version: '1.3.0+L2', network: '0' }, _safeL2Deployments)).toBeUndefined();
    });
    it('should return the correct deployment (filtered by released and network)', () => {
      const testUnreleasedDeploymentJson: SingletonDeploymentJSON = {
        version: '',
        abi: [],
        addresses: {
          canonical: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
        },
        networkAddresses: { '1': 'canonical' },
        contractName: '',
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        released: false,
      };
      const testReleasedDeploymentJson: SingletonDeploymentJSON = {
        version: '',
        abi: [],
        addresses: {
          canonical: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
        },
        networkAddresses: { '1': 'canonical' },
        contractName: '',
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        released: true, // Default filter value
      };
      const testUnreleasedDeployment: SingletonDeployment = {
        defaultAddress: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
        addresses: {
          canonical: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
        },
        networkAddresses: { '1': '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef' },
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        released: false,
        abi: [],
        version: '',
        contractName: '',
      };

      const testDeployments = [testUnreleasedDeploymentJson, testUnreleasedDeploymentJson, testReleasedDeploymentJson];

      // Reverse chronological deployments
      expect(findDeployment({ released: true, network: '1' }, _safeDeploymentsReverse)).toMatchObject(GnosisSafe100);
      expect(findDeployment({ released: true, network: '246' }, _safeDeploymentsReverse)).toMatchObject(GnosisSafe111);
      expect(findDeployment({ released: true, network: '11297108109' }, _safeDeploymentsReverse)).toMatchObject(
        GnosisSafe130,
      );
      // Incorrect filter:
      expect(findDeployment({ released: true, network: '0' }, _safeDeploymentsReverse)).toBeUndefined();
      expect(findDeployment({ released: false, network: '1' }, testDeployments)).toMatchObject(
        testUnreleasedDeployment,
      );

      // L2 deployments
      expect(findDeployment({ released: true, network: '100' }, _safeL2Deployments)).toMatchObject(SafeL2141);
      // Incorrect filter:
      expect(findDeployment({ released: true, network: '0' }, _safeL2Deployments)).toBeUndefined();
      expect(findDeployment({ released: false, network: '100' }, testDeployments)).toBeUndefined();
    });
    it('should return the correct deployment (filtered by version, released and network)', () => {
      // Reverse chronological deployments
      expect(findDeployment({ version: '1.0.0', released: true, network: '1' }, _safeDeploymentsReverse)).toMatchObject(
        GnosisSafe100,
      );
      expect(
        findDeployment({ version: '1.1.1', released: true, network: '246' }, _safeDeploymentsReverse),
      ).toMatchObject(GnosisSafe111);
      expect(
        findDeployment({ version: '1.2.0', released: true, network: '73799' }, _safeDeploymentsReverse),
      ).toMatchObject(GnosisSafe120);
      expect(
        findDeployment({ version: '1.3.0', released: true, network: '11297108109' }, _safeDeploymentsReverse),
      ).toMatchObject(GnosisSafe130);
      // Incorrect filter:
      expect(
        findDeployment({ version: '1.3.0', released: false, network: '11297108109' }, _safeDeploymentsReverse),
      ).toBeUndefined();
      expect(
        findDeployment({ version: '1.3.0', released: true, network: '0' }, _safeDeploymentsReverse),
      ).toBeUndefined();
      expect(
        findDeployment({ version: '2.0.0', released: true, network: '11297108109' }, _safeDeploymentsReverse),
      ).toBeUndefined();

      // L2 deployments
      expect(findDeployment({ version: '1.3.0', released: true, network: '100' }, _safeL2Deployments)).toMatchObject(
        GnosisSafeL2130,
      );
      expect(findDeployment({ version: '1.3.0+L2', released: true, network: '100' }, _safeL2Deployments)).toMatchObject(
        GnosisSafeL2130,
      );
      // Incorrect filter:
      expect(
        findDeployment({ version: '1.3.0+L2', released: false, network: '100' }, _safeL2Deployments),
      ).toBeUndefined();
      expect(findDeployment({ version: '1.3.0+L2', released: true, network: '0' }, _safeL2Deployments)).toBeUndefined();
      expect(
        findDeployment({ version: '2.0.0+L2', released: true, network: '100' }, _safeL2Deployments),
      ).toBeUndefined();
    });
  });
});
