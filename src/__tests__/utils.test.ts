import { findDeployment } from '../utils';
import { _SAFE_DEPLOYMENTS, _SAFE_L2_DEPLOYMENTS } from '../deployments';
import { SingletonDeployment, SingletonDeploymentJSON, DeploymentFormats, SingletonDeploymentV2 } from '../types';

const _safeDeploymentsReverse = [..._SAFE_DEPLOYMENTS].reverse();

describe('utils.ts', () => {
  describe('findDeployment', () => {
    describe('singleton format', () => {
      it('should filter by released by default', () => {
        const testUnreleasedDeploymentJson: SingletonDeploymentJSON = {
          version: '',
          abi: [],
          deployments: {
            canonical: {
              address: '0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
          },
          networkAddresses: { '1': 'canonical' },
          contractName: '',
          released: false,
        };
        const testReleasedDeploymentJson: SingletonDeploymentJSON = {
          version: '',
          abi: [],
          deployments: {
            canonical: {
              address: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
          },
          networkAddresses: { '1': 'canonical' },
          contractName: '',
          released: true, // Default filter value
        };
        const testReleasedDeployment: SingletonDeployment = {
          defaultAddress: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
          deployments: {
            canonical: {
              address: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
          },
          networkAddresses: { '1': '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef' },
          released: true,
          abi: [],
          version: '',
          contractName: '',
        };

        const testDeployments = [
          testUnreleasedDeploymentJson,
          testUnreleasedDeploymentJson,
          testReleasedDeploymentJson,
        ];

        expect(findDeployment(undefined, testDeployments)).toMatchObject(testReleasedDeployment);

        // should preserve the released flag even if its not explicitly passed
        expect(findDeployment({ network: '1' }, testDeployments)).toMatchObject(testReleasedDeployment);
      });

      it('should return the correct deployment (filtered by released flag)', () => {
        const testUnreleasedDeploymentJson: SingletonDeploymentJSON = {
          version: '',
          abi: [],
          deployments: {
            canonical: {
              address: '0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
          },
          networkAddresses: { '1': 'canonical' },
          contractName: '',
          released: false,
        };
        const testReleasedDeploymentJson: SingletonDeploymentJSON = {
          version: '',
          abi: [],
          deployments: {
            canonical: {
              address: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
          },
          networkAddresses: { '1': 'canonical' },
          contractName: '',
          released: true, // Default filter value
        };
        const testUnreleasedDeployment: SingletonDeployment = {
          defaultAddress: '0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead',
          deployments: {
            canonical: {
              address: '0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
          },
          networkAddresses: { '1': '0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead' },
          released: false,
          abi: [],
          version: '',
          contractName: '',
        };
        const testReleasedDeployment: SingletonDeployment = {
          defaultAddress: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
          deployments: {
            canonical: {
              address: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
          },
          networkAddresses: { '1': '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef' },
          released: true,
          abi: [],
          version: '',
          contractName: '',
        };
        const testDeployments = [testUnreleasedDeploymentJson, testReleasedDeploymentJson];

        expect(findDeployment({ released: false }, testDeployments)).toMatchObject(testUnreleasedDeployment);
        expect(findDeployment({ released: true }, testDeployments)).toMatchObject(testReleasedDeployment);

        expect(findDeployment({ released: true }, _SAFE_DEPLOYMENTS)).toMatchObject({
          contractName: 'Safe',
          version: '1.5.0',
        });
        expect(findDeployment({ released: true }, _safeDeploymentsReverse)).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.0.0',
        });
        expect(findDeployment({ released: true }, _SAFE_L2_DEPLOYMENTS)).toMatchObject({
          contractName: 'SafeL2',
          version: '1.5.0',
        });
      });

      it('should return the correct deployment (filtered by network)', () => {
        // Reverse chronological deployments
        expect(findDeployment({ network: '1' }, _safeDeploymentsReverse)).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.0.0',
        });
        expect(findDeployment({ network: '73799' }, _safeDeploymentsReverse)).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.1.1',
        });
        expect(findDeployment({ network: '11297108109' }, _safeDeploymentsReverse)).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.3.0',
        });
        // Incorrect filter:
        expect(findDeployment({ network: '0' }, _safeDeploymentsReverse)).toBeUndefined();

        // L2 deployments
        expect(findDeployment({ network: '1' }, _SAFE_L2_DEPLOYMENTS)).toMatchObject({
          contractName: 'SafeL2',
          version: '1.5.0',
        });
        // Incorrect filter:
        expect(findDeployment({ network: '0' }, _SAFE_L2_DEPLOYMENTS)).toBeUndefined();
      });

      it('should return the correct deployment (filtered by version and released)', () => {
        // Chronological deployments
        expect(findDeployment({ version: '1.3.0', released: true }, _SAFE_DEPLOYMENTS)).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.3.0',
          released: true,
        });
        expect(findDeployment({ version: '1.2.0', released: true }, _SAFE_DEPLOYMENTS)).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.2.0',
          released: true,
        });
        expect(findDeployment({ version: '1.1.1', released: true }, _SAFE_DEPLOYMENTS)).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.1.1',
          released: true,
        });
        expect(findDeployment({ version: '1.0.0', released: true }, _SAFE_DEPLOYMENTS)).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.0.0',
          released: true,
        });
        // Incorrect filter:
        expect(findDeployment({ version: '1.0.0', released: false }, _SAFE_DEPLOYMENTS)).toBeUndefined();

        // L2 deployments
        expect(findDeployment({ version: '1.3.0', released: true }, _SAFE_L2_DEPLOYMENTS)).toMatchObject({
          contractName: 'GnosisSafeL2',
          version: '1.3.0',
          released: true,
        });
        // Incorrect filter:
        expect(findDeployment({ version: '1.3.0', released: false }, _SAFE_L2_DEPLOYMENTS)).toBeUndefined();
      });

      it('should return the correct deployment (filtered by version and network)', () => {
        // Reverse chronological deployments
        expect(
          findDeployment(
            {
              version: '1.0.0',
              network: '1',
            },
            _safeDeploymentsReverse,
          ),
        ).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.0.0',
        });
        expect(
          findDeployment(
            {
              version: '1.1.1',
              network: '1',
            },
            _safeDeploymentsReverse,
          ),
        ).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.1.1',
        });
        expect(
          findDeployment(
            {
              version: '1.2.0',
              network: '1',
            },
            _safeDeploymentsReverse,
          ),
        ).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.2.0',
        });
        expect(
          findDeployment(
            {
              version: '1.3.0',
              network: '1',
            },
            _safeDeploymentsReverse,
          ),
        ).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.3.0',
        });
        // Incorrect filter:
        expect(findDeployment({ version: '1.3.0', network: '0' }, _safeDeploymentsReverse)).toBeUndefined();

        // L2 deployments
        expect(
          findDeployment(
            {
              version: '1.3.0',
              network: '100',
            },
            _SAFE_L2_DEPLOYMENTS,
          ),
        ).toMatchObject({
          contractName: 'GnosisSafeL2',
          version: '1.3.0',
        });
        // Incorrect filter:
        expect(findDeployment({ version: '1.3.0', network: '0' }, _SAFE_L2_DEPLOYMENTS)).toBeUndefined();
      });

      it('should return the correct deployment (filtered by released and network)', () => {
        const testUnreleasedDeploymentJson: SingletonDeploymentJSON = {
          version: '',
          abi: [],
          deployments: {
            canonical: {
              address: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
          },
          networkAddresses: { '1': 'canonical' },
          contractName: '',
          released: false,
        };
        const testReleasedDeploymentJson: SingletonDeploymentJSON = {
          version: '',
          abi: [],
          deployments: {
            canonical: {
              address: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
          },
          networkAddresses: { '1': 'canonical' },
          contractName: '',
          released: true, // Default filter value
        };
        const testUnreleasedDeployment: SingletonDeployment = {
          defaultAddress: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
          deployments: {
            canonical: {
              address: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
          },
          networkAddresses: { '1': '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef' },
          released: false,
          abi: [],
          version: '',
          contractName: '',
        };

        const testDeployments = [
          testUnreleasedDeploymentJson,
          testUnreleasedDeploymentJson,
          testReleasedDeploymentJson,
        ];

        expect(findDeployment({ released: false, network: '1' }, testDeployments)).toMatchObject(
          testUnreleasedDeployment,
        );

        // Reverse chronological deployments
        expect(
          findDeployment(
            {
              released: true,
              network: '1',
            },
            _safeDeploymentsReverse,
          ),
        ).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.0.0',
        });
        expect(findDeployment({ released: true, network: '246' }, _safeDeploymentsReverse)).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.1.1',
        });
        expect(findDeployment({ released: true, network: '11297108109' }, _safeDeploymentsReverse)).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.3.0',
        });
        // Incorrect filter:
        expect(findDeployment({ released: true, network: '0' }, _safeDeploymentsReverse)).toBeUndefined();

        // L2 deployments
        expect(findDeployment({ released: true, network: '1' }, _SAFE_L2_DEPLOYMENTS)).toMatchObject({
          contractName: 'SafeL2',
          version: '1.5.0',
        });
        // Incorrect filter:
        expect(findDeployment({ released: true, network: '0' }, _SAFE_L2_DEPLOYMENTS)).toBeUndefined();
        expect(findDeployment({ released: false, network: '100' }, testDeployments)).toBeUndefined();
      });

      it('should return the correct deployment (filtered by version, released and network)', () => {
        // Reverse chronological deployments
        expect(
          findDeployment({ version: '1.0.0', released: true, network: '1' }, _safeDeploymentsReverse),
        ).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.0.0',
        });
        expect(
          findDeployment({ version: '1.1.1', released: true, network: '246' }, _safeDeploymentsReverse),
        ).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.1.1',
        });
        expect(
          findDeployment({ version: '1.2.0', released: true, network: '73799' }, _safeDeploymentsReverse),
        ).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.2.0',
        });
        expect(
          findDeployment({ version: '1.3.0', released: true, network: '11297108109' }, _safeDeploymentsReverse),
        ).toMatchObject({
          contractName: 'GnosisSafe',
          version: '1.3.0',
        });
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
        expect(
          findDeployment({ version: '1.3.0', released: true, network: '100' }, _SAFE_L2_DEPLOYMENTS),
        ).toMatchObject({
          contractName: 'GnosisSafeL2',
          version: '1.3.0',
        });
        // Incorrect filter:
        expect(
          findDeployment({ version: '1.3.0', released: false, network: '100' }, _SAFE_L2_DEPLOYMENTS),
        ).toBeUndefined();
        expect(
          findDeployment({ version: '1.3.0', released: true, network: '0' }, _SAFE_L2_DEPLOYMENTS),
        ).toBeUndefined();
        expect(
          findDeployment({ version: '2.0.0', released: true, network: '100' }, _SAFE_L2_DEPLOYMENTS),
        ).toBeUndefined();
      });
    });

    describe('multiple format', () => {
      it('should populate the networkAddresses field', () => {
        const testReleasedDeploymentJson: SingletonDeploymentJSON = {
          version: '',
          abi: [],
          deployments: {
            canonical: {
              address: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
            eip155: {
              address: '0xc0ffeec0ffeec0ffeec0ffeec0ffeec0ffeebabe',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
            zksync: {
              address: '0xbabebabebabebabebabebabebabebabebabebabe',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
          },
          networkAddresses: { '1': 'canonical', '100': 'zksync', '101': ['canonical', 'eip155'] },
          contractName: '',
          released: true, // Default filter value
        };
        const expectedDeployment: SingletonDeploymentV2 = {
          deployments: {
            canonical: {
              address: '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
            eip155: {
              address: '0xc0ffeec0ffeec0ffeec0ffeec0ffeec0ffeebabe',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
            zksync: {
              address: '0xbabebabebabebabebabebabebabebabebabebabe',
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            },
          },
          networkAddresses: {
            '1': '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
            '100': '0xbabebabebabebabebabebabebabebabebabebabe',
            '101': ['0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef', '0xc0ffeec0ffeec0ffeec0ffeec0ffeec0ffeebabe'],
          },
          released: true,
          abi: [],
          version: '',
          contractName: '',
        };

        const testDeployments = [testReleasedDeploymentJson];

        expect(findDeployment({}, testDeployments, DeploymentFormats.MULTIPLE)).toMatchObject(expectedDeployment);
      });
    });
  });
});
