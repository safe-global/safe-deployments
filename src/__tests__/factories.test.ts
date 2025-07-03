import SafeProxyFactory from '../assets/v1.5.0/safe_proxy_factory.json';
import { getProxyFactoryDeployment } from '../factories';

describe('factories.ts', () => {
  describe('getProxyFactoryDeployment', () => {
    it('should find the latest deployment first', () => {
      const result = getProxyFactoryDeployment();
      expect(result).toMatchObject({
        defaultAddress: SafeProxyFactory.deployments.canonical.address,
        contractName: 'SafeProxyFactory',
        version: '1.5.0',
        networkAddresses: {
          ['1']: SafeProxyFactory.deployments.canonical.address,
        },
        abi: SafeProxyFactory.abi,
      });
    });
  });
});
