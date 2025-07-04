import TokenCallbackHandler from '../assets/v1.5.0/token_callback_handler.json';
import CompatibilityFallbackHandler from '../assets/v1.5.0/compatibility_fallback_handler.json';
import ExtensibleFallbackHandler from '../assets/v1.5.0/extensible_fallback_handler.json';
import {
  getTokenCallbackHandlerDeployment,
  getCompatibilityFallbackHandlerDeployment,
  getExtensibleFallbackHandlerDeployment,
  getFallbackHandlerDeployment,
} from '../handler';

describe('handler.ts', () => {
  describe('getTokenCallbackHandlerDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getTokenCallbackHandlerDeployment();
      expect(result).toMatchObject({
        defaultAddress: TokenCallbackHandler.deployments.canonical.address,
        contractName: 'TokenCallbackHandler',
        version: '1.5.0',
        networkAddresses: {
          ['1']: TokenCallbackHandler.deployments.canonical.address,
        },
        abi: TokenCallbackHandler.abi,
      });
    });
  });

  describe('getCompatibilityFallbackHandlerDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getCompatibilityFallbackHandlerDeployment();
      expect(result).toMatchObject({
        defaultAddress: CompatibilityFallbackHandler.deployments.canonical.address,
        contractName: 'CompatibilityFallbackHandler',
        version: '1.5.0',
        networkAddresses: {
          ['1']: CompatibilityFallbackHandler.deployments.canonical.address,
        },
        abi: CompatibilityFallbackHandler.abi,
      });
    });
  });

  describe('getExtensibleFallbackHandlerDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getExtensibleFallbackHandlerDeployment();
      expect(result).toMatchObject({
        defaultAddress: ExtensibleFallbackHandler.deployments.canonical.address,
        contractName: 'ExtensibleFallbackHandler',
        version: '1.5.0',
        networkAddresses: {
          ['1']: ExtensibleFallbackHandler.deployments.canonical.address,
        },
        abi: ExtensibleFallbackHandler.abi,
      });
    });
  });

  describe('getFallbackHandlerDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getFallbackHandlerDeployment();
      expect(result).toMatchObject({
        defaultAddress: CompatibilityFallbackHandler.deployments.canonical.address,
        contractName: 'CompatibilityFallbackHandler',
        version: '1.5.0',
        networkAddresses: {
          ['1']: CompatibilityFallbackHandler.deployments.canonical.address,
        },
        abi: CompatibilityFallbackHandler.abi,
      });
    });
  });
});
