"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthRepository", {
    enumerable: true,
    get: function() {
        return AuthRepository;
    }
});
const _typedi = require("typedi");
const _refreshTokenmodel = /*#__PURE__*/ _interop_require_default(require("../../models/user/refreshToken.model"));
const _usermodel = /*#__PURE__*/ _interop_require_default(require("../../models/user/user.model"));
const _bcryptjs = require("bcryptjs");
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
let AuthRepository = class AuthRepository {
    async findUserByEmail(email) {
        return _usermodel.default.findOne({
            where: {
                email
            },
            attributes: [
                'id',
                'email',
                'password',
                'role',
                'otp'
            ],
            raw: true
        });
    }
    async saveOtp(email, otp) {
        const user = await _usermodel.default.findOne({
            where: {
                email
            },
            raw: false
        });
        if (user) {
            await user.update({
                otp
            });
        }
    }
    async validateOtp(email, otp) {
        return _usermodel.default.findOne({
            where: {
                email,
                otp
            },
            raw: true
        });
    }
    async forgotPassword(email, otp, newPassword) {
        const user = await _usermodel.default.findOne({
            where: {
                email
            },
            raw: false
        });
        if (user) {
            const hashedPassword = await (0, _bcryptjs.hash)(newPassword, 10);
            await user.update({
                password: hashedPassword,
                otp: ''
            });
            return user.get({
                plain: true
            });
        }
        throw new Error("User not found");
    }
    async findUserById(userId) {
        return _usermodel.default.findByPk(userId, {
            raw: true
        });
    }
    async createUser(userData) {
        return _usermodel.default.create(userData, {
            raw: true
        });
    }
    async saveRefreshToken(userId, token, expiresAt) {
        await _refreshTokenmodel.default.create({
            token,
            userId,
            expiresAt
        });
    }
    async findRefreshToken(token) {
        return _refreshTokenmodel.default.findOne({
            where: {
                token
            },
            raw: true
        });
    }
    async deleteRefreshToken(token) {
        await _refreshTokenmodel.default.destroy({
            where: {
                token
            }
        });
    }
};
AuthRepository = _ts_decorate([
    (0, _typedi.Service)()
], AuthRepository);

//# sourceMappingURL=auth.repository.js.map