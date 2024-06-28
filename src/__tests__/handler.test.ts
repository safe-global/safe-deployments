import DefaultCallbackHandler130 from './assets/v1/v1.1.1/default_callback_handler.json';
import CompatibilityFallbackHandler141 from './assets/v1/v1.4.1/compatibility_fallback_handler.json';
import {
  getDefaultCallbackHandlerDeployment,
  getCompatibilityFallbackHandlerDeployment,
  getFallbackHandlerDeployment,
} from '../handler';

describe('handler.ts', () => {
  describe('getDefaultCallbackHandlerDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getDefaultCallbackHandlerDeployment();
      expect(result).toMatchObject(DefaultCallbackHandler130);
    });
  });

  describe('getCompatibilityFallbackHandlerDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getCompatibilityFallbackHandlerDeployment();
      expect(result).toMatchObject(CompatibilityFallbackHandler141);
    });
  });

  describe('getFallbackHandlerDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getFallbackHandlerDeployment();
      expect(result).toMatchObject(CompatibilityFallbackHandler141);
      expect(result).not.toBe(DefaultCallbackHandler130);
    });
  });
});
