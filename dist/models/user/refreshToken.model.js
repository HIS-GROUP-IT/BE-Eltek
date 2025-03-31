"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _sequelize = require("sequelize");
const _index = /*#__PURE__*/ _interop_require_default(require("../../database/index"));
const _usermodel = /*#__PURE__*/ _interop_require_default(require("./user.model"));
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
let RefreshToken = class RefreshToken extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "token", void 0), _define_property(this, "userId", void 0), _define_property(this, "expiresAt", void 0);
    }
};
RefreshToken.init({
    token: {
        type: _sequelize.DataTypes.STRING,
        primaryKey: true
    },
    userId: {
        type: _sequelize.DataTypes.INTEGER,
        references: {
            model: _usermodel.default,
            key: 'id'
        }
    },
    expiresAt: {
        type: _sequelize.DataTypes.DATE
    }
}, {
    sequelize: _index.default,
    modelName: 'RefreshToken'
});
_usermodel.default.hasMany(RefreshToken, {
    foreignKey: 'userId'
});
RefreshToken.belongsTo(_usermodel.default, {
    foreignKey: 'userId'
});
const _default = RefreshToken;

//# sourceMappingURL=refreshToken.model.js.map