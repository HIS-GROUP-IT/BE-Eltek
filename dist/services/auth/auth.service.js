"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _bcryptjs = require("bcryptjs");
const _jsonwebtoken = require("jsonwebtoken");
const _typedi = require("typedi");
const _config = require("../../config");
const _HttpException = require("../../exceptions/HttpException");
const _crypto = /*#__PURE__*/ _interop_require_default(require("crypto"));
const _authrepository = require("../../repositories/auth/auth.repository");
const _IAuthServiceinterface = require("../../interfaces/auth/IAuthService.interface");
const _nodemailer = /*#__PURE__*/ _interop_require_default(require("nodemailer"));
const _sequelize = require("sequelize");
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const createToken = async (userData)=>{
    const dataStoredIntoken = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        fullName: userData.fullName
    };
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    const accessToken = (0, _jsonwebtoken.sign)(dataStoredIntoken, _config.SECRET_KEY, {
        expiresIn: "1h"
    });
    const refreshToken = _crypto.default.randomBytes(40).toString("hex");
    return {
        expiresAt,
        accessToken,
        refreshToken
    };
};
let AuthService = class AuthService {
    async signup(userData) {
        const findUser = await this.authRepository.findUserByEmail(userData.email);
        if (findUser) {
            throw new _HttpException.HttpException(409, `This email ${userData.email} already exists`);
        }
        const hashedPassword = await (0, _bcryptjs.hash)(userData.password, 10);
        const createdUser = await this.authRepository.createUser({
            email: userData.email,
            password: hashedPassword,
            role: userData.role,
            fullName: userData.fullName
        });
        const tokenData = await createToken(createdUser);
        await this.authRepository.saveRefreshToken(createdUser.id, tokenData.refreshToken, tokenData.expiresAt);
        return tokenData;
    }
    async login(userData) {
        if (!userData.password) {
            throw new _HttpException.HttpException(400, "Password is required");
        }
        const findUser = await this.authRepository.findUserByEmail(userData.email);
        console.log('User Data:', findUser);
        if (!findUser) {
            throw new _HttpException.HttpException(404, `Email ${userData.email} not found`);
        }
        console.log('Raw user data:', JSON.stringify(findUser));
        console.log('Is Sequelize instance:', findUser instanceof _sequelize.Model);
        if (!findUser.password) {
            throw new _HttpException.HttpException(404, "User password not found in database");
        }
        const comparePassword = await (0, _bcryptjs.compare)(userData.password, findUser.password);
        if (!comparePassword) {
            throw new _HttpException.HttpException(400, "Invalid password");
        }
        const tokenData = await createToken(findUser);
        console.log('Token Data:', tokenData);
        await this.authRepository.saveRefreshToken(findUser.id, tokenData.refreshToken, tokenData.expiresAt);
        return tokenData;
    }
    async refreshToken(token) {
        if (!token) {
            throw new _HttpException.HttpException(404, "Token not provided");
        }
        const storedToken = await this.authRepository.findRefreshToken(token);
        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new _HttpException.HttpException(401, "Invalid or expired token");
        }
        const user = await this.authRepository.findUserById(storedToken.userId);
        if (!user) {
            throw new _HttpException.HttpException(404, `User associated with this token not found`);
        }
        const newToken = await createToken(user);
        await this.authRepository.deleteRefreshToken(storedToken.token);
        await this.authRepository.saveRefreshToken(user.id, newToken.refreshToken, newToken.expiresAt);
        return newToken;
    }
    async logout(token) {
        await this.authRepository.deleteRefreshToken(token);
    }
    async sendOtp(email) {
        const user = await this.authRepository.findUserByEmail(email);
        if (!user) {
            throw new _HttpException.HttpException(404, "User Not Found");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.authRepository.saveOtp(email, otp);
        const transporter = _nodemailer.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            html: `<p>Your OTP to reset your password is <strong>${otp}</strong></p>`
        };
        await transporter.sendMail(mailOptions);
        return "OTP sent to your email";
    }
    async verifyOtp(email, otp) {
        const isValid = await this.authRepository.validateOtp(email, otp);
        if (!isValid) {
            throw new _HttpException.HttpException(400, "Invalid or expired OTP");
        }
        return "OTP verified successfully";
    }
    async updatePassword(email, otp, newPassword) {
        const user = await this.authRepository.findUserByEmail(email);
        if (!user) {
            throw new _HttpException.HttpException(404, "User Not Found");
        }
        if (user.otp !== otp) {
            throw new _HttpException.HttpException(400, "Invalid OTP");
        }
        const updatedUser = await this.authRepository.forgotPassword(email, otp, newPassword);
        return updatedUser;
    }
    constructor(authRepository){
        _define_property(this, "authRepository", void 0);
        this.authRepository = authRepository;
    }
};
AuthService = _ts_decorate([
    (0, _typedi.Service)({
        id: _IAuthServiceinterface.AUTH_SERVICE_TOKEN,
        type: AuthService
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authrepository.AuthRepository === "undefined" ? Object : _authrepository.AuthRepository
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map