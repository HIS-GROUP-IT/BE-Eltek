"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _typedi = require("typedi");
const _IAuthServiceinterface = require("../../interfaces/auth/IAuthService.interface");
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
let AuthController = class AuthController {
    constructor(){
        _define_property(this, "auth", void 0);
        _define_property(this, "signup", async (req, res, next)=>{
            try {
                const userData = req.body;
                const signUpUserData = await this.auth.signup(userData);
                const response = {
                    data: signUpUserData,
                    message: "User registered successfully",
                    error: false
                };
                res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "login", async (req, res, next)=>{
            try {
                const userData = req.body;
                const loggedInUser = await this.auth.login(userData);
                const response = {
                    data: loggedInUser,
                    message: "User logged in successuflly",
                    error: false
                };
                return res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "refreshToken", async (req, res, next)=>{
            try {
                const token = req.body.token;
                const newToken = await this.auth.refreshToken(token);
                const response = {
                    data: newToken,
                    message: "Token refreshed sucessfully",
                    error: false
                };
                return res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "Logout", async (req, res, next)=>{
            try {
                const token = req.params.token;
                console.log("Token", token);
                const deletedToken = await this.auth.logout(token.toString());
                const response = {
                    data: null,
                    message: "User logged out successfully",
                    error: false
                };
                return res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "sendOtp", async (req, res, next)=>{
            try {
                const { email } = req.body;
                const message = await this.auth.sendOtp(email);
                const response = {
                    data: null,
                    message: message,
                    error: false
                };
                return res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "verifyOtp", async (req, res, next)=>{
            try {
                const { email, otp } = req.body;
                const message = await this.auth.verifyOtp(email, otp);
                const response = {
                    data: null,
                    message: message,
                    error: false
                };
                return res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updatePassword", async (req, res, next)=>{
            try {
                const { email, otp, newPassword } = req.body;
                const updatedUser = await this.auth.updatePassword(email, otp, newPassword);
                const response = {
                    data: updatedUser,
                    message: "User logged out successfully",
                    error: false
                };
                return res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        this.auth = _typedi.Container.get(_IAuthServiceinterface.AUTH_SERVICE_TOKEN);
    }
};

//# sourceMappingURL=auth.controller.js.map