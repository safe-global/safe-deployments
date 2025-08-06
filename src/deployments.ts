import { SingletonDeploymentJSON } from './types';

// This is a file where all the deployments are consolidated
// We do it in a separate file so we don't have to repeat comments about the array order and the type casting.
// We use some specific types (like `AddressType`) in the `SingletonDeploymentJSON` type, but the TypeScript cannot infer that from the JSON files.
// So we need to cast them to `SingletonDeploymentJSON` manually. The casting is valid because we have a test in `__tests__/assets.test.ts` that checks that the JSON files are valid.
// The arrays are sorted by preference, which at the moment means from the most recent version to the oldest.
// The arrays are prefixed with an underscore because they are not meant to be imported directly.

import SimulateTxAccessor130 from './assets/v1.3.0/simulate_tx_accessor.json';
import SimulateTxAccessor141 from './assets/v1.4.1/simulate_tx_accessor.json';
import SimulateTxAccessor150 from './assets/v1.5.0/simulate_tx_accessor.json';

const _ACCESSOR_DEPLOYMENTS = [
  SimulateTxAccessor150,
  SimulateTxAccessor141,
  SimulateTxAccessor130,
] as SingletonDeploymentJSON[];

import ProxyFactory100 from './assets/v1.0.0/proxy_factory.json';
import ProxyFactory111 from './assets/v1.1.1/proxy_factory.json';
import ProxyFactory130 from './assets/v1.3.0/proxy_factory.json';
import SafeProxyFactory141 from './assets/v1.4.1/safe_proxy_factory.json';
import SafeProxyFactory150 from './assets/v1.5.0/safe_proxy_factory.json';

const _FACTORY_DEPLOYMENTS = [
  SafeProxyFactory150,
  SafeProxyFactory141,
  ProxyFactory130,
  ProxyFactory111,
  ProxyFactory100,
] as SingletonDeploymentJSON[];

import DefaultCallbackHandler130 from './assets/v1.1.1/default_callback_handler.json';
import TokenCallbackHandler150 from './assets/v1.5.0/token_callback_handler.json';

const _TOKEN_CALLBACK_HANDLER_DEPLOYMENTS = [
  TokenCallbackHandler150,
  DefaultCallbackHandler130,
] as SingletonDeploymentJSON[];

import CompatibilityFallbackHandler130 from './assets/v1.3.0/compatibility_fallback_handler.json';
import CompatibilityFallbackHandler141 from './assets/v1.4.1/compatibility_fallback_handler.json';
import CompatibilityFallbackHandler150 from './assets/v1.5.0/compatibility_fallback_handler.json';

const _COMPAT_FALLBACK_HANDLER_DEPLOYMENTS = [
  CompatibilityFallbackHandler150,
  CompatibilityFallbackHandler141,
  CompatibilityFallbackHandler130,
] as SingletonDeploymentJSON[];

import ExtensibleFallbackHandler150 from './assets/v1.5.0/extensible_fallback_handler.json';

const _EXTENSIBLE_FALLBACK_HANDLER_DEPLOYMENTS = [ExtensibleFallbackHandler150] as SingletonDeploymentJSON[];

import GnosisSafe100 from './assets/v1.0.0/gnosis_safe.json';
import GnosisSafe111 from './assets/v1.1.1/gnosis_safe.json';
import GnosisSafe120 from './assets/v1.2.0/gnosis_safe.json';
import GnosisSafe130 from './assets/v1.3.0/gnosis_safe.json';
import Safe141 from './assets/v1.4.1/safe.json';
import Safe150 from './assets/v1.5.0/safe.json';

const _SAFE_DEPLOYMENTS = [
  Safe150,
  Safe141,
  GnosisSafe130,
  GnosisSafe120,
  GnosisSafe111,
  GnosisSafe100,
] as SingletonDeploymentJSON[];

import GnosisSafeL2130 from './assets/v1.3.0/gnosis_safe_l2.json';
import SafeL2141 from './assets/v1.4.1/safe_l2.json';
import SafeL2150 from './assets/v1.5.0/safe_l2.json';

const _SAFE_L2_DEPLOYMENTS = [SafeL2150, SafeL2141, GnosisSafeL2130] as SingletonDeploymentJSON[];

import MultiSend111 from './assets/v1.1.1/multi_send.json';
import MultiSend130 from './assets/v1.3.0/multi_send.json';
import MultiSend141 from './assets/v1.4.1/multi_send.json';
import MultiSend150 from './assets/v1.5.0/multi_send.json';

const _MULTI_SEND_DEPLOYMENTS = [MultiSend150, MultiSend141, MultiSend130, MultiSend111] as SingletonDeploymentJSON[];

import MultiSendCallOnly130 from './assets/v1.3.0/multi_send_call_only.json';
import MultiSendCallOnly141 from './assets/v1.4.1/multi_send_call_only.json';
import MultiSendCallOnly150 from './assets/v1.5.0/multi_send_call_only.json';

const _MULTI_SEND_CALL_ONLY_DEPLOYMENTS = [
  MultiSendCallOnly150,
  MultiSendCallOnly141,
  MultiSendCallOnly130,
] as SingletonDeploymentJSON[];

import CreateCall130 from './assets/v1.3.0/create_call.json';
import CreateCall141 from './assets/v1.4.1/create_call.json';
import CreateCall150 from './assets/v1.5.0/create_call.json';

const _CREATE_CALL_DEPLOYMENTS = [CreateCall150, CreateCall141, CreateCall130] as SingletonDeploymentJSON[];

import SignMessageLib130 from './assets/v1.3.0/sign_message_lib.json';
import SignMessageLib141 from './assets/v1.4.1/sign_message_lib.json';
import SignMessageLib150 from './assets/v1.5.0/sign_message_lib.json';

const _SIGN_MESSAGE_LIB_DEPLOYMENTS = [
  SignMessageLib150,
  SignMessageLib141,
  SignMessageLib130,
] as SingletonDeploymentJSON[];

import SafeMigration141 from './assets/v1.4.1/safe_migration.json';
import SafeMigration150 from './assets/v1.5.0/safe_migration.json';

const _SAFE_MIGRATION_DEPLOYMENTS = [SafeMigration150, SafeMigration141] as SingletonDeploymentJSON[];

import SafeToL2Migration141 from './assets/v1.4.1/safe_to_l2_migration.json';

const _SAFE_TO_L2_MIGRATION_DEPLOYMENTS = [SafeToL2Migration141] as SingletonDeploymentJSON[];

import SafeToL2Setup141 from './assets/v1.4.1/safe_to_l2_setup.json';
import SafeToL2Setup150 from './assets/v1.5.0/safe_to_l2_setup.json';

const _SAFE_TO_L2_SETUP_DEPLOYMENTS = [SafeToL2Setup150, SafeToL2Setup141] as SingletonDeploymentJSON[];

export {
  _ACCESSOR_DEPLOYMENTS,
  _FACTORY_DEPLOYMENTS,
  _TOKEN_CALLBACK_HANDLER_DEPLOYMENTS,
  _COMPAT_FALLBACK_HANDLER_DEPLOYMENTS,
  _EXTENSIBLE_FALLBACK_HANDLER_DEPLOYMENTS,
  _SAFE_DEPLOYMENTS,
  _SAFE_L2_DEPLOYMENTS,
  _MULTI_SEND_DEPLOYMENTS,
  _MULTI_SEND_CALL_ONLY_DEPLOYMENTS,
  _CREATE_CALL_DEPLOYMENTS,
  _SIGN_MESSAGE_LIB_DEPLOYMENTS,
  _SAFE_MIGRATION_DEPLOYMENTS,
  _SAFE_TO_L2_MIGRATION_DEPLOYMENTS,
  _SAFE_TO_L2_SETUP_DEPLOYMENTS,
};
