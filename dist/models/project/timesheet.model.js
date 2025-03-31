"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Timesheet", {
    enumerable: true,
    get: function() {
        return Timesheet;
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
let Timesheet = class Timesheet extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "userId", void 0), _define_property(this, "projectId", void 0), _define_property(this, "projectName", void 0), _define_property(this, "description", void 0), _define_property(this, "hours", void 0), _define_property(this, "status", void 0), _define_property(this, "date", void 0), _define_property(this, "createdAt", void 0), _define_property(this, "updatedAt", void 0);
    }
};
Timesheet.init({
    id: {
        type: _sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: _sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    projectName: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    projectId: {
        type: _sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    hours: {
        type: _sequelize.DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    date: {
        type: _sequelize.DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: _index.default,
    tableName: 'timesheets'
});

//# sourceMappingURL=timesheet.model.js.map