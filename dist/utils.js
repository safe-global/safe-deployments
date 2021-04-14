"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDeployment = void 0;
const findDeployment = (criteria, deployments) => deployments.find((deployment) => {
    var _a;
    if (criteria.version && deployment.version !== criteria.version)
        return false;
    if (deployment.released != ((_a = criteria.released) !== null && _a !== void 0 ? _a : true))
        return false;
    if (criteria.network && !deployment.networkAddresses[criteria.network])
        return false;
    return true;
});
exports.findDeployment = findDeployment;
