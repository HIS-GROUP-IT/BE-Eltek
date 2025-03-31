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
let User = class User extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "email", void 0), _define_property(this, "password", void 0), _define_property(this, "role", void 0), _define_property(this, "fullName", void 0), _define_property(this, "otp", void 0);
    }
};
User.init({
    id: {
        type: _sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    fullName: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    otp: {
        type: _sequelize.DataTypes.STRING
    }
}, {
    sequelize: _index.default,
    modelName: 'User'
});
const _default = User;

//# sourceMappingURL=user.model.js.map