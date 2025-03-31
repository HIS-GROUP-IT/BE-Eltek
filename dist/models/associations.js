"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setupAssociations", {
    enumerable: true,
    get: function() {
        return setupAssociations;
    }
});
const _employeemodel = /*#__PURE__*/ _interop_require_default(require("./employee/employee.model"));
const _projectmodel = /*#__PURE__*/ _interop_require_default(require("./project/project.model"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function setupAssociations() {
    _employeemodel.default.belongsToMany(_projectmodel.default, {
        through: 'ProjectEmployees',
        foreignKey: 'employeeId',
        as: 'projects'
    });
    _projectmodel.default.belongsToMany(_employeemodel.default, {
        through: 'ProjectEmployees',
        foreignKey: 'projectId',
        as: 'employees'
    });
}

//# sourceMappingURL=associations.js.map