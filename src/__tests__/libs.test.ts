import CreateCall130 from '../assets/v1.3.0/create_call.json';
import MultiSend111 from '../assets/v1.1.1/multi_send.json';
import MultiSend130 from '../assets/v1.3.0/multi_send.json';
import MultiSendCallOnly130 from '../assets/v1.3.0/multi_send_call_only.json';
import SignMessageLib130 from '../assets/v1.3.0/sign_message_lib.json';
import {
  getMultiSendDeployment,
  getMultiSendCallOnlyDeployment,
  getCreateCallDeployment,
  getSignMessageLibDeployment,
} from '../libs';

describe('libs.ts', () => {
  describe('getMultiSendDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getMultiSendDeployment();
      expect(result).toBe(MultiSend130);
      expect(result).not.toBe(MultiSend111);
    });
  });
  describe('getMultiSendCallOnlyDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getMultiSendCallOnlyDeployment();
      expect(result).toBe(MultiSendCallOnly130);
    });
  });
  describe('getCreateCallDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getCreateCallDeployment();
      expect(result).toBe(CreateCall130);
    });
  });
  describe('getSignMessageLibDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getSignMessageLibDeployment();
      expect(result).toBe(SignMessageLib130);
    });
  });
});
