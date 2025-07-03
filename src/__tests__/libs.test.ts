import CreateCall from '../assets/v1.5.0/create_call.json';
import MultiSend from '../assets/v1.5.0/multi_send.json';
import MultiSendCallOnly from '../assets/v1.5.0/multi_send_call_only.json';
import SignMessageLib from '../assets/v1.5.0/sign_message_lib.json';
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
      expect(result).toMatchObject({
        defaultAddress: MultiSend.deployments.canonical.address,
        contractName: 'MultiSend',
        version: '1.5.0',
        networkAddresses: {
          ['1']: MultiSend.deployments.canonical.address,
        },
        abi: MultiSend.abi,
      });
    });
  });

  describe('getMultiSendCallOnlyDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getMultiSendCallOnlyDeployment();
      expect(result).toMatchObject({
        defaultAddress: MultiSendCallOnly.deployments.canonical.address,
        contractName: 'MultiSendCallOnly',
        version: '1.5.0',
        networkAddresses: {
          ['1']: MultiSendCallOnly.deployments.canonical.address,
        },
        abi: MultiSendCallOnly.abi,
      });
    });
  });

  describe('getCreateCallDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getCreateCallDeployment();
      expect(result).toMatchObject({
        defaultAddress: CreateCall.deployments.canonical.address,
        contractName: 'CreateCall',
        version: '1.5.0',
        networkAddresses: {
          ['1']: CreateCall.deployments.canonical.address,
        },
        abi: CreateCall.abi,
      });
    });
  });

  describe('getSignMessageLibDeployment', () => {
    it('should find the preferred deployment first', () => {
      const result = getSignMessageLibDeployment();
      expect(result).toMatchObject({
        defaultAddress: SignMessageLib.deployments.canonical.address,
        contractName: 'SignMessageLib',
        version: '1.5.0',
        networkAddresses: {
          ['1']: SignMessageLib.deployments.canonical.address,
        },
        abi: SignMessageLib.abi,
      });
    });
  });
});
