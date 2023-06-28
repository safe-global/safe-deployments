"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDeployment = void 0;
const satisfies_1 = __importDefault(require("semver/functions/satisfies"));
const DEFAULT_FILTER = { released: true };
const findDeployment = (criteria = DEFAULT_FILTER, deployments) => {
    const criteriaWithDefaults = Object.assign(Object.assign({}, DEFAULT_FILTER), criteria);
    return deployments.find((deployment) => {
        if (typeof criteriaWithDefaults.version !== 'undefined' && !(0, satisfies_1.default)(deployment.version, criteriaWithDefaults.version))
            return false;
        if (typeof criteriaWithDefaults.released === 'boolean' && deployment.released != criteriaWithDefaults.released)
            return false;
        if (criteriaWithDefaults.network && !deployment.networkAddresses[criteriaWithDefaults.network])
            return false;
        return true;
    });
};
exports.findDeployment = findDeployment;
