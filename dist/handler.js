"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFallbackHandlerDeployment = exports.getCompatibilityFallbackHandlerDeployment = exports.getDefaultCallbackHandlerDeployment = void 0;
const default_callback_handler_json_1 = __importDefault(require("./assets/v1.1.1/default_callback_handler.json"));
const compatibility_fallback_handler_json_1 = __importDefault(require("./assets/v1.3.0/compatibility_fallback_handler.json"));
const compatibility_fallback_handler_json_2 = __importDefault(require("./assets/v1.4.1/compatibility_fallback_handler.json"));
const utils_1 = require("./utils");
// This is a sorted array (by preference)
const defaultCallbackHandlerDeployments = [
    default_callback_handler_json_1.default
];
const getDefaultCallbackHandlerDeployment = (filter) => {
    return (0, utils_1.findDeployment)(filter, defaultCallbackHandlerDeployments);
};
exports.getDefaultCallbackHandlerDeployment = getDefaultCallbackHandlerDeployment;
// This is a sorted array (by preference)
const compatFallbackHandlerDeployments = [
    compatibility_fallback_handler_json_2.default, compatibility_fallback_handler_json_1.default
];
const getCompatibilityFallbackHandlerDeployment = (filter) => {
    return (0, utils_1.findDeployment)(filter, compatFallbackHandlerDeployments);
};
exports.getCompatibilityFallbackHandlerDeployment = getCompatibilityFallbackHandlerDeployment;
// This is a sorted array (by preference)
const fallbackHandlerDeployments = [
    compatibility_fallback_handler_json_2.default, compatibility_fallback_handler_json_1.default, default_callback_handler_json_1.default
];
const getFallbackHandlerDeployment = (filter) => {
    return (0, utils_1.findDeployment)(filter, fallbackHandlerDeployments);
};
exports.getFallbackHandlerDeployment = getFallbackHandlerDeployment;
