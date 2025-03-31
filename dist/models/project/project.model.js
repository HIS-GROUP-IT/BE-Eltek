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
const _usermodel = /*#__PURE__*/ _interop_require_default(require("../user/user.model"));
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
let Project = class Project extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "name", void 0), _define_property(this, "description", void 0), _define_property(this, "status", void 0), _define_property(this, "startDate", void 0), _define_property(this, "endDate", void 0), _define_property(this, "createdBy", void 0), _define_property(this, "createdAt", void 0), _define_property(this, "employees", void 0), _define_property(this, "updatedAt", void 0);
    }
};
Project.init({
    id: {
        type: _sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: _sequelize.DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: _sequelize.DataTypes.ENUM('planned', 'on going', 'cancelled', 'completed', 'on hold'),
        allowNull: false,
        defaultValue: 'planned'
    },
    startDate: {
        type: _sequelize.DataTypes.DATEONLY,
        allowNull: false
    },
    endDate: {
        type: _sequelize.DataTypes.DATEONLY,
        allowNull: true
    },
    createdBy: {
        type: _sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: _usermodel.default,
            key: 'id'
        }
    }
}, {
    sequelize: _index.default,
    modelName: 'Project',
    indexes: [
        {
            fields: [
                'name',
                'status'
            ]
        }
    ]
});
const _default = Project;

//# sourceMappingURL=project.model.js.map