"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmployeeRoute", {
    enumerable: true,
    get: function() {
        return EmployeeRoute;
    }
});
const _express = require("express");
const _ValidationMiddleware = require("../../middlewares/ValidationMiddleware");
const _employeecontroller = require("../../controllers/employee/employee.controller");
const _authorizationMiddleware = require("../../middlewares/authorizationMiddleware");
const _employeedto = require("../../dots/employee/employee.dto");
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
let EmployeeRoute = class EmployeeRoute {
    initializeRoutes() {
        this.router.post(`${this.path}/createEmployee`, _authorizationMiddleware.authorizationMiddleware, (0, _ValidationMiddleware.ValidationMiddleware)(_employeedto.CreateEmployeeDto), this.employeeController.createEmployee);
        this.router.put(`${this.path}/updateEmployee`, _authorizationMiddleware.authorizationMiddleware, (0, _ValidationMiddleware.ValidationMiddleware)(_employeedto.CreateEmployeeDto), this.employeeController.updateEmployee);
        this.router.delete(`${this.path}/deleteEmployee/:id`, _authorizationMiddleware.authorizationMiddleware, this.employeeController.deleteEmployee);
        this.router.get(`${this.path}/getAllEmployees`, _authorizationMiddleware.authorizationMiddleware, this.employeeController.getAllEmployees);
        this.router.get(`${this.path}/getEmployee/:id`, _authorizationMiddleware.authorizationMiddleware, this.employeeController.getEmployeeById);
        this.router.post(`${this.path}/assignEmployees`, _authorizationMiddleware.authorizationMiddleware, this.employeeController.assignEmployeesToProject);
        this.router.get(`${this.path}/getProjectEmployees/:projectId`, _authorizationMiddleware.authorizationMiddleware, this.employeeController.getEmployeesByProjectId);
        this.router.get(`${this.path}/getEmployeeProjects/:employeeId`, _authorizationMiddleware.authorizationMiddleware, this.employeeController.getEmployeeProjects);
    }
    constructor(){
        _define_property(this, "path", "/employees");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "employeeController", new _employeecontroller.EmployeeController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=employee.routes.js.map