"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSafeSingletonDeployment = void 0;
const gnosis_safe_1_3_0_json_1 = __importDefault(require("./assets/gnosis_safe_1.3.0.json"));
const gnosis_safe_1_2_0_json_1 = __importDefault(require("./assets/gnosis_safe_1.2.0.json"));
const gnosis_safe_1_1_1_json_1 = __importDefault(require("./assets/gnosis_safe_1.1.1.json"));
const gnosis_safe_1_0_0_json_1 = __importDefault(require("./assets/gnosis_safe_1.0.0.json"));
const utils_1 = require("./utils");
// This is a sorted array (newest to oldest)
const safeDeployments = [
    gnosis_safe_1_3_0_json_1.default, gnosis_safe_1_2_0_json_1.default, gnosis_safe_1_1_1_json_1.default, gnosis_safe_1_0_0_json_1.default
];
const getSafeSingletonDeployment = (filter) => {
    return utils_1.findDeployment(filter !== null && filter !== void 0 ? filter : {}, safeDeployments);
};
exports.getSafeSingletonDeployment = getSafeSingletonDeployment;
