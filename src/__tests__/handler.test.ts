import DefaultCallbackHandler130 from '../assets/v1.1.1/default_callback_handler.json';
import CompatibilityFallbackHandler from '../assets/v1.3.0/compatibility_fallback_handler.json';
import {
  getDefaultCallbackHandlerDeployment,
  getCompatibilityFallbackHandlerDeployment,
  getFallbackHandlerDeployment,
} from '../handler';

describe('handler.ts', () => {
  describe('getDefaultCallbackHandlerDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getDefaultCallbackHandlerDeployment();
      expect(result).toBe(DefaultCallbackHandler130);
    });
  });

  describe('getCompatibilityFallbackHandlerDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getCompatibilityFallbackHandlerDeployment();
      expect(result).toBe(CompatibilityFallbackHandler);
    });
  });

  describe('getFallbackHandlerDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getFallbackHandlerDeployment();
      expect(result).toBe(CompatibilityFallbackHandler);
      expect(result).not.toBe(DefaultCallbackHandler130);
    });
  });
});
