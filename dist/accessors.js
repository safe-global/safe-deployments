"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSimulateTxAccessorDeployment = void 0;
const simulate_tx_accessor_json_1 = __importDefault(require("./assets/v1.3.0/simulate_tx_accessor.json"));
const simulate_tx_accessor_json_2 = __importDefault(require("./assets/v1.4.1/simulate_tx_accessor.json"));
const utils_1 = require("./utils");
// This is a sorted array (newest to oldest)
const accessorDeployments = [
    simulate_tx_accessor_json_2.default, simulate_tx_accessor_json_1.default
];
const getSimulateTxAccessorDeployment = (filter) => {
    return (0, utils_1.findDeployment)(filter, accessorDeployments);
};
exports.getSimulateTxAccessorDeployment = getSimulateTxAccessorDeployment;
