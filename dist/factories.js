"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProxyFactoryDeployment = void 0;
const proxy_factory_1_1_1_json_1 = __importDefault(require("./assets/proxy_factory_1.1.1.json"));
const proxy_factory_1_3_0_json_1 = __importDefault(require("./assets/proxy_factory_1.3.0.json"));
const utils_1 = require("./utils");
// This is a sorted array (newest to oldest)
const factoryDeployments = [
    proxy_factory_1_3_0_json_1.default, proxy_factory_1_1_1_json_1.default
];
const getProxyFactoryDeployment = (filter) => {
    return utils_1.findDeployment(filter !== null && filter !== void 0 ? filter : {}, factoryDeployments);
};
exports.getProxyFactoryDeployment = getProxyFactoryDeployment;
