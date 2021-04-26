"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafeL2SingletonDeployment = exports.getSafeSingletonDeployment = void 0;
const gnosis_safe_l2_json_1 = __importDefault(require("./assets/v1.3.0/gnosis_safe_l2.json"));
const gnosis_safe_json_1 = __importDefault(require("./assets/v1.3.0/gnosis_safe.json"));
const gnosis_safe_json_2 = __importDefault(require("./assets/v1.2.0/gnosis_safe.json"));
const gnosis_safe_json_3 = __importDefault(require("./assets/v1.1.1/gnosis_safe.json"));
const gnosis_safe_json_4 = __importDefault(require("./assets/v1.0.0/gnosis_safe.json"));
const utils_1 = require("./utils");
// This is a sorted array (newest to oldest)
const safeDeployments = [
    gnosis_safe_json_1.default, gnosis_safe_json_2.default, gnosis_safe_json_3.default, gnosis_safe_json_4.default
];
const getSafeSingletonDeployment = (filter) => {
    return utils_1.findDeployment(utils_1.applyFilterDefaults(filter), safeDeployments);
};
exports.getSafeSingletonDeployment = getSafeSingletonDeployment;
// This is a sorted array (newest to oldest)
const safeL2Deployments = [
    gnosis_safe_l2_json_1.default
];
const getSafeL2SingletonDeployment = (filter) => {
    return utils_1.findDeployment(utils_1.applyFilterDefaults(filter), safeL2Deployments);
};
exports.getSafeL2SingletonDeployment = getSafeL2SingletonDeployment;
