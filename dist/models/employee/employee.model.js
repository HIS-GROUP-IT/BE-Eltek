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
const _projectmodel = /*#__PURE__*/ _interop_require_default(require("../project/project.model"));
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
let Employee = class Employee extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "fullName", void 0), _define_property(this, "email", void 0), _define_property(this, "phoneNumber", void 0), _define_property(this, "idNumber", void 0), _define_property(this, "position", void 0), _define_property(this, "role", void 0), _define_property(this, "gender", void 0), _define_property(this, "race", void 0), _define_property(this, "location", void 0), _define_property(this, "password", void 0), _define_property(this, "createdBy", void 0), _define_property(this, "projects", void 0), _define_property(this, "projectIds", void 0), _define_property(this, "addProjects", void 0);
    }
};
Employee.init({
    id: {
        type: _sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullName: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phoneNumber: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    idNumber: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    position: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: _sequelize.DataTypes.ENUM('employee'),
        allowNull: false,
        defaultValue: 'employee'
    },
    gender: {
        type: _sequelize.DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false
    },
    race: {
        type: _sequelize.DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    createdBy: {
        type: _sequelize.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: _index.default,
    modelName: 'Employee'
});
Employee.belongsToMany(_projectmodel.default, {
    through: 'EmployeeProject',
    as: 'projects',
    foreignKey: 'employeeId'
});
_projectmodel.default.belongsToMany(Employee, {
    through: 'EmployeeProject',
    as: 'employees',
    foreignKey: 'projectId'
});
const _default = Employee;

//# sourceMappingURL=employee.model.js.map