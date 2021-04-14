"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreateCallDeployment = exports.getMultiSendCallOnlyDeployment = exports.getMultiSendDeployment = void 0;
const create_call_1_3_0_json_1 = __importDefault(require("./assets/create_call_1.3.0.json"));
const multi_send_1_1_1_json_1 = __importDefault(require("./assets/multi_send_1.1.1.json"));
const multi_send_1_3_0_json_1 = __importDefault(require("./assets/multi_send_1.3.0.json"));
const multi_send_call_only_1_3_0_json_1 = __importDefault(require("./assets/multi_send_call_only_1.3.0.json"));
const utils_1 = require("./utils");
// This is a sorted array (by preference, currently we use 111 in most cases)
const multiSendDeployments = [
    multi_send_1_1_1_json_1.default, multi_send_1_3_0_json_1.default
];
const getMultiSendDeployment = (filter) => {
    return utils_1.findDeployment(filter !== null && filter !== void 0 ? filter : {}, multiSendDeployments);
};
exports.getMultiSendDeployment = getMultiSendDeployment;
// This is a sorted array (by preference)
const multiSendCallOnlyDeployments = [
    multi_send_call_only_1_3_0_json_1.default
];
const getMultiSendCallOnlyDeployment = (filter) => {
    return utils_1.findDeployment(filter !== null && filter !== void 0 ? filter : {}, multiSendCallOnlyDeployments);
};
exports.getMultiSendCallOnlyDeployment = getMultiSendCallOnlyDeployment;
// This is a sorted array (by preference)
const createCallDeployments = [
    create_call_1_3_0_json_1.default
];
const getCreateCallDeployment = (filter) => {
    return utils_1.findDeployment(filter !== null && filter !== void 0 ? filter : {}, createCallDeployments);
};
exports.getCreateCallDeployment = getCreateCallDeployment;
