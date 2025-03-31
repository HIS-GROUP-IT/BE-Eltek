"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    SuperAdminAuthorizationMiddleware: function() {
        return SuperAdminAuthorizationMiddleware;
    },
    authorizationMiddleware: function() {
        return authorizationMiddleware;
    }
});
const _config = require("../config");
const _HttpException = require("../exceptions/HttpException");
const _jsonwebtoken = require("jsonwebtoken");
const authorizationMiddleware = (req, res, next)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        throw new _HttpException.HttpException(401, "Authentication required");
    }
    (0, _jsonwebtoken.verify)(token, _config.SECRET_KEY, (error, user)=>{
        if (error) {
            throw new _HttpException.HttpException(401, error.message);
        }
        req.user = user;
        next();
    });
};
const SuperAdminAuthorizationMiddleware = (req, res, next)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        throw new _HttpException.HttpException(401, "Authentication required");
    }
    (0, _jsonwebtoken.verify)(token, _config.SECRET_KEY, (error, user)=>{
        if (error) {
            throw new _HttpException.HttpException(401, error.message);
        }
        if (user.role !== "SuperAdmin") {
            throw new _HttpException.HttpException(401, "Super admin rights required!");
        }
        req.user = user;
        next();
    });
};

//# sourceMappingURL=authorizationMiddleware.js.map