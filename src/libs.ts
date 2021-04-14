import CreateCall130 from './assets/create_call_1.3.0.json'
import MultiSend111 from './assets/multi_send_1.1.1.json'
import MultiSend130 from './assets/multi_send_1.3.0.json'
import MultiSendCallOnly130 from './assets/multi_send_call_only_1.3.0.json'
import { DeploymentFilter, SingletonDeployment } from './types'
import { applyFilterDefaults, findDeployment } from './utils'

// This is a sorted array (by preference, currently we use 111 in most cases)
const multiSendDeployments: SingletonDeployment[] = [
    MultiSend111, MultiSend130
]

export const getMultiSendDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
    return findDeployment(applyFilterDefaults(filter), multiSendDeployments)
}

// This is a sorted array (by preference)
const multiSendCallOnlyDeployments: SingletonDeployment[] = [
    MultiSendCallOnly130
]

export const getMultiSendCallOnlyDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
    return findDeployment(applyFilterDefaults(filter), multiSendCallOnlyDeployments)
}

// This is a sorted array (by preference)
const createCallDeployments: SingletonDeployment[] = [
    CreateCall130
]

export const getCreateCallDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
    return findDeployment(applyFilterDefaults(filter), createCallDeployments)
}