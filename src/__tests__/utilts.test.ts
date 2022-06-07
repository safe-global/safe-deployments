import GnosisSafeL2130 from '../assets/v1.3.0/gnosis_safe_l2.json';
import GnosisSafe130 from '../assets/v1.3.0/gnosis_safe.json';
import GnosisSafe120 from '../assets/v1.2.0/gnosis_safe.json';
import GnosisSafe111 from '../assets/v1.1.1/gnosis_safe.json';
import GnosisSafe100 from '../assets/v1.0.0/gnosis_safe.json';
import { findDeployment } from '../utils';
import { _safeDeployments, _safeL2Deployments } from '../safes';
import { SingletonDeployment } from '../types';

const _safeDeploymentsReverse = [..._safeDeployments].reverse();

describe('utils.ts', () => {
  describe('findDeployment', () => {
    it('should filter by released by default', () => {
      const testUnreleasedDeployment: SingletonDeployment = {
        defaultAddress: '',
        version: '',
        abi: [],
        networkAddresses: {},
        contractName: '',
        released: false,
      };
      const testReleasedDeployment: SingletonDeployment = {
        defaultAddress: '',
        version: '',
        abi: [],
        networkAddresses: {},
        contractName: '',
        released: true, // Default filter value
      };

      const testDeployments = [
        testUnreleasedDeployment,
        testUnreleasedDeployment,
        testReleasedDeployment,
      ];

      expect(findDeployment(undefined, testDeployments)).toBe(
        testReleasedDeployment
      );
    });
    it('should return the correct deployment (filtered by version)', () => {
      // Chronological deployments
      expect(findDeployment({ version: '1.3.0' }, _safeDeployments)).toBe(
        GnosisSafe130
      );
      expect(findDeployment({ version: '1.2.0' }, _safeDeployments)).toBe(
        GnosisSafe120
      );
      expect(findDeployment({ version: '1.1.1' }, _safeDeployments)).toBe(
        GnosisSafe111
      );
      expect(findDeployment({ version: '1.0.0' }, _safeDeployments)).toBe(
        GnosisSafe100
      );
      // Incorrect filter:
      expect(
        findDeployment({ version: '2.0.0' }, _safeDeployments)
      ).toBeUndefined();

      // L2 deployments
      expect(findDeployment({ version: '1.3.0+L2' }, _safeL2Deployments)).toBe(
        GnosisSafeL2130
      );
      // Incorrect filter:
      expect(
        findDeployment({ version: '2.0.0+L2' }, _safeL2Deployments)
      ).toBeUndefined();
    });
    it('should return the correct deployment (filtered by release)', () => {
      // Chronological deployments
      expect(findDeployment({ released: true }, _safeDeployments)).toBe(
        GnosisSafe130
      );
      // Incorrect filter:
      expect(
        findDeployment({ released: false }, _safeDeployments)
      ).toBeUndefined();

      // Reverse chronological deployments
      expect(findDeployment({ released: true }, _safeDeploymentsReverse)).toBe(
        GnosisSafe100
      );
      // Incorrect filter:
      expect(
        findDeployment({ released: false }, _safeDeploymentsReverse)
      ).toBeUndefined();

      // L2 deployments
      expect(findDeployment({ released: true }, _safeL2Deployments)).toBe(
        GnosisSafeL2130
      );
      // Incorrect filter:
      expect(
        findDeployment({ released: false }, _safeL2Deployments)
      ).toBeUndefined();
    });

    it('should return the correct deployment (filtered by network)', () => {
      // Reverse chronological deployments
      expect(findDeployment({ network: '1' }, _safeDeploymentsReverse)).toBe(
        GnosisSafe100
      );
      expect(
        findDeployment({ network: '73799' }, _safeDeploymentsReverse)
      ).toBe(GnosisSafe111);
      expect(
        findDeployment({ network: '11297108109' }, _safeDeploymentsReverse)
      ).toBe(GnosisSafe130);
      // Incorrect filter:
      expect(
        findDeployment({ network: '0' }, _safeDeploymentsReverse)
      ).toBeUndefined();

      // L2 deployments
      expect(findDeployment({ network: '100' }, _safeL2Deployments)).toBe(
        GnosisSafeL2130
      );
      // Incorrect filter:
      expect(
        findDeployment({ network: '0' }, _safeL2Deployments)
      ).toBeUndefined();
    });
    it('should return the correct deployment (filtered by version and released)', () => {
      // Chronological deployments
      expect(
        findDeployment({ version: '1.3.0', released: true }, _safeDeployments)
      ).toBe(GnosisSafe130);
      expect(
        findDeployment({ version: '1.2.0', released: true }, _safeDeployments)
      ).toBe(GnosisSafe120);
      expect(
        findDeployment({ version: '1.1.1', released: true }, _safeDeployments)
      ).toBe(GnosisSafe111);
      expect(
        findDeployment({ version: '1.0.0', released: true }, _safeDeployments)
      ).toBe(GnosisSafe100);
      // Incorrect filter:
      expect(
        findDeployment({ version: '1.0.0', released: false }, _safeDeployments)
      ).toBeUndefined();

      // L2 deployments
      expect(
        findDeployment({ version: '1.3.0', released: true }, _safeL2Deployments)
      ).toBe(GnosisSafeL2130);
      expect(
        findDeployment(
          { version: '1.3.0+L2', released: true },
          _safeL2Deployments
        )
      ).toBe(GnosisSafeL2130);
      // Incorrect filter:
      expect(
        findDeployment(
          { version: '1.3.0+L2', released: false },
          _safeL2Deployments
        )
      ).toBeUndefined();
    });
    it('should return the correct deployment (filtered by version and network)', () => {
      // Reverse chronological deployments
      expect(
        findDeployment(
          { version: '1.0.0', network: '1' },
          _safeDeploymentsReverse
        )
      ).toBe(GnosisSafe100);
      expect(
        findDeployment(
          { version: '1.1.1', network: '1' },
          _safeDeploymentsReverse
        )
      ).toBe(GnosisSafe111);
      expect(
        findDeployment(
          { version: '1.2.0', network: '1' },
          _safeDeploymentsReverse
        )
      ).toBe(GnosisSafe120);
      expect(
        findDeployment(
          { version: '1.3.0', network: '1' },
          _safeDeploymentsReverse
        )
      ).toBe(GnosisSafe130);
      // Incorrect filter:
      expect(
        findDeployment(
          { version: '1.3.0', network: '0' },
          _safeDeploymentsReverse
        )
      ).toBeUndefined();

      // L2 deployments
      expect(
        findDeployment({ version: '1.3.0', network: '100' }, _safeL2Deployments)
      ).toBe(GnosisSafeL2130);
      expect(
        findDeployment(
          { version: '1.3.0+L2', network: '100' },
          _safeL2Deployments
        )
      ).toBe(GnosisSafeL2130);
      // Incorrect filter:
      expect(
        findDeployment(
          { version: '1.3.0+L2', network: '0' },
          _safeL2Deployments
        )
      ).toBeUndefined();
    });
    it('should return the correct deployment (filtered by released and network)', () => {
      // Reverse chronological deployments
      expect(
        findDeployment(
          { released: true, network: '1' },
          _safeDeploymentsReverse
        )
      ).toBe(GnosisSafe100);
      expect(
        findDeployment(
          { released: true, network: '246' },
          _safeDeploymentsReverse
        )
      ).toBe(GnosisSafe111);
      expect(
        findDeployment(
          { released: true, network: '11297108109' },
          _safeDeploymentsReverse
        )
      ).toBe(GnosisSafe130);
      // Incorrect filter:
      expect(
        findDeployment(
          { released: true, network: '0' },
          _safeDeploymentsReverse
        )
      ).toBeUndefined();
      expect(
        findDeployment(
          { released: false, network: '1' },
          _safeDeploymentsReverse
        )
      ).toBeUndefined();

      // L2 deployments
      expect(
        findDeployment({ released: true, network: '100' }, _safeL2Deployments)
      ).toBe(GnosisSafeL2130);
      // Incorrect filter:
      expect(
        findDeployment({ released: true, network: '0' }, _safeL2Deployments)
      ).toBeUndefined();
      expect(
        findDeployment({ released: false, network: '100' }, _safeL2Deployments)
      ).toBeUndefined();
    });
    it('should return the correct deployment (filtered by version, released and network)', () => {
      // Reverse chronological deployments
      expect(
        findDeployment(
          { version: '1.0.0', released: true, network: '1' },
          _safeDeploymentsReverse
        )
      ).toBe(GnosisSafe100);
      expect(
        findDeployment(
          { version: '1.1.1', released: true, network: '246' },
          _safeDeploymentsReverse
        )
      ).toBe(GnosisSafe111);
      expect(
        findDeployment(
          { version: '1.2.0', released: true, network: '73799' },
          _safeDeploymentsReverse
        )
      ).toBe(GnosisSafe120);
      expect(
        findDeployment(
          { version: '1.3.0', released: true, network: '11297108109' },
          _safeDeploymentsReverse
        )
      ).toBe(GnosisSafe130);
      // Incorrect filter:
      expect(
        findDeployment(
          { version: '1.3.0', released: false, network: '11297108109' },
          _safeDeploymentsReverse
        )
      ).toBeUndefined();
      expect(
        findDeployment(
          { version: '1.3.0', released: true, network: '0' },
          _safeDeploymentsReverse
        )
      ).toBeUndefined();
      expect(
        findDeployment(
          { version: '2.0.0', released: true, network: '11297108109' },
          _safeDeploymentsReverse
        )
      ).toBeUndefined();

      // L2 deployments
      expect(
        findDeployment(
          { version: '1.3.0', released: true, network: '100' },
          _safeL2Deployments
        )
      ).toBe(GnosisSafeL2130);
      expect(
        findDeployment(
          { version: '1.3.0+L2', released: true, network: '100' },
          _safeL2Deployments
        )
      ).toBe(GnosisSafeL2130);
      // Incorrect filter:
      expect(
        findDeployment(
          { version: '1.3.0+L2', released: false, network: '100' },
          _safeL2Deployments
        )
      ).toBeUndefined();
      expect(
        findDeployment(
          { version: '1.3.0+L2', released: true, network: '0' },
          _safeL2Deployments
        )
      ).toBeUndefined();
      expect(
        findDeployment(
          { version: '2.0.0+L2', released: true, network: '100' },
          _safeL2Deployments
        )
      ).toBeUndefined();
    });
  });
});
