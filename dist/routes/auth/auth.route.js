"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthRoute", {
    enumerable: true,
    get: function() {
        return AuthRoute;
    }
});
const _express = require("express");
const _authcontroller = require("../../controllers/auth/auth.controller");
const _ValidationMiddleware = require("../../middlewares/ValidationMiddleware");
const _userdot = require("../../dots/auth/user.dot");
const _authorizationMiddleware = require("../../middlewares/authorizationMiddleware");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
let AuthRoute = class AuthRoute {
    initializeRoutes() {
        this.router.post(`${this.path}/signup`, _authorizationMiddleware.SuperAdminAuthorizationMiddleware, (0, _ValidationMiddleware.ValidationMiddleware)(_userdot.CreateUserDto), this.auth.signup);
        this.router.post(`${this.path}/login`, this.auth.login);
        this.router.post(`${this.path}/refreshtoken`, this.auth.refreshToken);
        this.router.delete(`${this.path}/logout/:token`, this.auth.Logout);
        this.router.post(`${this.path}/send-otp`, this.auth.sendOtp);
        this.router.post(`${this.path}/verify-otp`, this.auth.verifyOtp);
        this.router.post(`${this.path}/update-password`, this.auth.updatePassword);
    }
    constructor(){
        _define_property(this, "path", "/auth");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "auth", new _authcontroller.AuthController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=auth.route.js.map