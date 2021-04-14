"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyFilterDefaults = exports.findDeployment = void 0;
const findDeployment = (criteria, deployments) => deployments.find((deployment) => {
    if (criteria.version && deployment.version !== criteria.version)
        return false;
    if (criteria.released && deployment.released != criteria.released)
        return false;
    if (criteria.network && !deployment.networkAddresses[criteria.network])
        return false;
    return true;
});
exports.findDeployment = findDeployment;
const applyFilterDefaults = (filter) => {
    if (!filter)
        return { released: true };
    return filter;
};
exports.applyFilterDefaults = applyFilterDefaults;
