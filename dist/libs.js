"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignMessageLibDeployment = exports.getCreateCallDeployment = exports.getMultiSendCallOnlyDeployment = exports.getMultiSendDeployment = void 0;
const create_call_json_1 = __importDefault(require("./assets/v1.3.0/create_call.json"));
const create_call_json_2 = __importDefault(require("./assets/v1.4.1/create_call.json"));
const multi_send_json_1 = __importDefault(require("./assets/v1.1.1/multi_send.json"));
const multi_send_json_2 = __importDefault(require("./assets/v1.3.0/multi_send.json"));
const multi_send_json_3 = __importDefault(require("./assets/v1.4.1/multi_send.json"));
const multi_send_call_only_json_1 = __importDefault(require("./assets/v1.3.0/multi_send_call_only.json"));
const multi_send_call_only_json_2 = __importDefault(require("./assets/v1.4.1/multi_send_call_only.json"));
const sign_message_lib_json_1 = __importDefault(require("./assets/v1.3.0/sign_message_lib.json"));
const sign_message_lib_json_2 = __importDefault(require("./assets/v1.4.1/sign_message_lib.json"));
const utils_1 = require("./utils");
// This is a sorted array (by preference, currently we use 111 in most cases)
const multiSendDeployments = [
    multi_send_json_3.default, multi_send_json_2.default, multi_send_json_1.default
];
const getMultiSendDeployment = (filter) => {
    return (0, utils_1.findDeployment)(filter, multiSendDeployments);
};
exports.getMultiSendDeployment = getMultiSendDeployment;
// This is a sorted array (by preference)
const multiSendCallOnlyDeployments = [
    multi_send_call_only_json_2.default, multi_send_call_only_json_1.default
];
const getMultiSendCallOnlyDeployment = (filter) => {
    return (0, utils_1.findDeployment)(filter, multiSendCallOnlyDeployments);
};
exports.getMultiSendCallOnlyDeployment = getMultiSendCallOnlyDeployment;
// This is a sorted array (by preference)
const createCallDeployments = [
    create_call_json_2.default, create_call_json_1.default
];
const getCreateCallDeployment = (filter) => {
    return (0, utils_1.findDeployment)(filter, createCallDeployments);
};
exports.getCreateCallDeployment = getCreateCallDeployment;
const signMessageLibDeployments = [
    sign_message_lib_json_2.default, sign_message_lib_json_1.default
];
const getSignMessageLibDeployment = (filter) => {
    return (0, utils_1.findDeployment)(filter, signMessageLibDeployments);
};
exports.getSignMessageLibDeployment = getSignMessageLibDeployment;
