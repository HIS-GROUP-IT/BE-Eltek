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
const _employeemodel = /*#__PURE__*/ _interop_require_default(require("../employee/employee.model"));
const _leavetypes = require("../../types/leave.types");
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
let Leave = class Leave extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "leaveType", void 0), _define_property(this, "duration", void 0), _define_property(this, "startDate", void 0), _define_property(this, "endDate", void 0), _define_property(this, "reason", void 0), _define_property(this, "documents", void 0), _define_property(this, "status", void 0), _define_property(this, "employeeId", void 0), _define_property(this, "createdAt", void 0), _define_property(this, "updatedAt", void 0);
    }
};
Leave.init({
    id: {
        type: _sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    leaveType: {
        type: _sequelize.DataTypes.ENUM(...Object.values(_leavetypes.LeaveType)),
        allowNull: false
    },
    duration: {
        type: _sequelize.DataTypes.DECIMAL(5, 1),
        allowNull: false
    },
    startDate: {
        type: _sequelize.DataTypes.DATEONLY,
        allowNull: false
    },
    endDate: {
        type: _sequelize.DataTypes.DATEONLY,
        allowNull: false
    },
    reason: {
        type: _sequelize.DataTypes.TEXT,
        allowNull: false
    },
    documents: {
        type: _sequelize.DataTypes.ARRAY(_sequelize.DataTypes.STRING),
        allowNull: true,
        defaultValue: []
    },
    status: {
        type: _sequelize.DataTypes.ENUM(...Object.values(_leavetypes.LeaveStatus)),
        defaultValue: _leavetypes.LeaveStatus.PENDING,
        allowNull: false
    },
    employeeId: {
        type: _sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: _employeemodel.default,
            key: 'id'
        }
    },
    createdAt: {
        type: _sequelize.DataTypes.DATE,
        defaultValue: _sequelize.DataTypes.NOW
    },
    updatedAt: {
        type: _sequelize.DataTypes.DATE,
        defaultValue: _sequelize.DataTypes.NOW
    }
}, {
    sequelize: _index.default,
    modelName: 'Leave',
    tableName: 'leaves',
    indexes: [
        {
            fields: [
                'employeeId'
            ]
        },
        {
            fields: [
                'status'
            ]
        }
    ]
});
Leave.belongsTo(_employeemodel.default, {
    foreignKey: 'employeeId',
    as: 'employee'
});
_employeemodel.default.hasMany(Leave, {
    foreignKey: 'employeeId',
    as: 'leaves'
});
const _default = Leave;

//# sourceMappingURL=leave.model.js.map