import DefaultCallbackHandler130 from './assets/default_callback_handler_1.1.1.json'
import CompatibilityFallbackHandler from './assets/compatibility_fallback_handler_1.3.0.json'
import { DeploymentFilter, SingletonDeployment } from './types'
import { findDeployment } from './utils'

// This is a sorted array (by preference)
const defaultCallbackHandlerDeployments: SingletonDeployment[] = [
    DefaultCallbackHandler130
]

export const getDefaultCallbackHandlerDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
    return findDeployment(filter ?? {}, defaultCallbackHandlerDeployments)
}

// This is a sorted array (by preference)
const compatFallbackHandlerDeployments: SingletonDeployment[] = [
    CompatibilityFallbackHandler
]

export const getCompatibilityFallbackHandlerDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
    return findDeployment(filter ?? {}, compatFallbackHandlerDeployments)
}

// This is a sorted array (by preference)
const fallbackHandlerDeployments: SingletonDeployment[] = [
    CompatibilityFallbackHandler, DefaultCallbackHandler130
]

export const getFallbackHandlerDeployment = (filter?: DeploymentFilter): SingletonDeployment | undefined => {
    return findDeployment(filter ?? {}, fallbackHandlerDeployments)
}