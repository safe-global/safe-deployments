"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProxyFactoryDeployment = void 0;
const proxy_factory_json_1 = __importDefault(require("./assets/v1.0.0/proxy_factory.json"));
const proxy_factory_json_2 = __importDefault(require("./assets/v1.1.1/proxy_factory.json"));
const proxy_factory_json_3 = __importDefault(require("./assets/v1.3.0/proxy_factory.json"));
const safe_proxy_factory_json_1 = __importDefault(require("./assets/v1.4.1/safe_proxy_factory.json"));
const utils_1 = require("./utils");
// This is a sorted array (newest to oldest)
const factoryDeployments = [
    safe_proxy_factory_json_1.default, proxy_factory_json_3.default, proxy_factory_json_2.default, proxy_factory_json_1.default
];
const getProxyFactoryDeployment = (filter) => {
    return (0, utils_1.findDeployment)(filter, factoryDeployments);
};
exports.getProxyFactoryDeployment = getProxyFactoryDeployment;
