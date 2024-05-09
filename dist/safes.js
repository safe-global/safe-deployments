"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafeL2SingletonDeployment = exports._safeL2Deployments = exports.getSafeSingletonDeployment = exports._safeDeployments = void 0;
const safe_l2_json_1 = __importDefault(require("./assets/v1.4.1/safe_l2.json"));
const safe_json_1 = __importDefault(require("./assets/v1.4.1/safe.json"));
const gnosis_safe_l2_json_1 = __importDefault(require("./assets/v1.3.0/gnosis_safe_l2.json"));
const gnosis_safe_json_1 = __importDefault(require("./assets/v1.3.0/gnosis_safe.json"));
const gnosis_safe_json_2 = __importDefault(require("./assets/v1.2.0/gnosis_safe.json"));
const gnosis_safe_json_3 = __importDefault(require("./assets/v1.1.1/gnosis_safe.json"));
const gnosis_safe_json_4 = __importDefault(require("./assets/v1.0.0/gnosis_safe.json"));
const utils_1 = require("./utils");
// This is a sorted array (newest to oldest), exported for tests
exports._safeDeployments = [
    safe_json_1.default, gnosis_safe_json_1.default, gnosis_safe_json_2.default, gnosis_safe_json_3.default, gnosis_safe_json_4.default
];
const getSafeSingletonDeployment = (filter) => {
    return (0, utils_1.findDeployment)(filter, exports._safeDeployments);
};
exports.getSafeSingletonDeployment = getSafeSingletonDeployment;
// This is a sorted array (newest to oldest), exported for tests
exports._safeL2Deployments = [
    safe_l2_json_1.default, gnosis_safe_l2_json_1.default
];
const getSafeL2SingletonDeployment = (filter) => {
    return (0, utils_1.findDeployment)(filter, exports._safeL2Deployments);
};
exports.getSafeL2SingletonDeployment = getSafeL2SingletonDeployment;
