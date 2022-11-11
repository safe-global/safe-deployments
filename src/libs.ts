import CreateCall130 from './assets/v1.3.0/create_call.json'
import MultiSend111 from './assets/v1.1.1/multi_send.json'
import MultiSend130 from './assets/v1.3.0/multi_send.json'
import MultiSendCallOnly130 from './assets/v1.3.0/multi_send_call_only.json'
import SignMessageLib130 from './assets/v1.3.0/sign_message_lib.json'
import { DeploymentFilter, SingletonDeployment } from './types'
import { findDeployment } from './utils'

// This is a sorted array (by preference, currently we use 111 in most cases)
const multiSendDeployments: SingletonDeployment[] = [
  MultiSend130, MultiSend111
]

export const getMultiSendDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
    return findDeployment(filter, multiSendDeployments)
}

// This is a sorted array (by preference)
const multiSendCallOnlyDeployments: SingletonDeployment[] = [
  MultiSendCallOnly130
]

export const getMultiSendCallOnlyDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
    return findDeployment(filter, multiSendCallOnlyDeployments)
}

// This is a sorted array (by preference)
const createCallDeployments: SingletonDeployment[] = [
  CreateCall130
]

export const getCreateCallDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
    return findDeployment(filter, createCallDeployments)
}

const signMessageLibDeployments: SingletonDeployment[] = [
  SignMessageLib130
]

export const getSignMessageLibDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
    return findDeployment(filter, signMessageLibDeployments)
}