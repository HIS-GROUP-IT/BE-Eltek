"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmployeeController", {
    enumerable: true,
    get: function() {
        return EmployeeController;
    }
});
const _typedi = /*#__PURE__*/ _interop_require_default(require("typedi"));
const _IEmployeeService = require("../../interfaces/employee/IEmployeeService");
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
let EmployeeController = class EmployeeController {
    constructor(){
        _define_property(this, "employeeService", void 0);
        _define_property(this, "createEmployee", async (req, res, next)=>{
            try {
                const employeeData = req.body;
                const createdBy = Number(req.user.id);
                employeeData.createdBy = createdBy;
                const createdEmployee = await this.employeeService.createEmployee(employeeData);
                const response = {
                    data: createdEmployee,
                    message: "Employee created successfully",
                    error: false
                };
                res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getAllEmployees", async (req, res, next)=>{
            try {
                const employees = await this.employeeService.getAllEmployees();
                const response = {
                    data: employees,
                    message: "Employees retrieved successfully",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getEmployeeById", async (req, res, next)=>{
            try {
                const employeeId = parseInt(req.params.id);
                const employee = await this.employeeService.getEmployeeById(employeeId);
                const response = {
                    data: employee,
                    message: employee ? "Employee retrieved successfully" : "Employee not found",
                    error: !employee
                };
                res.status(employee ? 200 : 404).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updateEmployee", async (req, res, next)=>{
            try {
                const employeeData = req.body;
                const updatedEmployee = await this.employeeService.updateEmployee(employeeData);
                const response = {
                    data: updatedEmployee,
                    message: "Employee updated successfully",
                    error: false
                };
                res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "deleteEmployee", async (req, res, next)=>{
            try {
                const employeeId = parseInt(req.params.id);
                await this.employeeService.deleteEmployee(employeeId);
                const response = {
                    data: null,
                    message: "Employee deleted successfully",
                    error: false
                };
                res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "assignEmployeesToProject", async (req, res, next)=>{
            try {
                const { employeeIds, projectId } = req.body;
                if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
                    return res.status(400).json({
                        message: "Invalid employee IDs",
                        error: true
                    });
                }
                if (!projectId || isNaN(projectId)) {
                    return res.status(400).json({
                        message: "Invalid project ID",
                        error: true
                    });
                }
                await this.employeeService.assignEmployeesToProject(employeeIds, projectId);
                res.status(201).json({
                    data: null,
                    message: "Employees assigned successfully",
                    error: false
                });
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getEmployeesByProjectId", async (req, res, next)=>{
            try {
                const projectId = req.params.projectId;
                const parsedProjectId = Number(projectId);
                if (isNaN(parsedProjectId)) {
                    return res.status(400).json({
                        message: "Invalid project ID format",
                        error: true
                    });
                }
                const employees = await this.employeeService.getEmployeesByProjectId(parsedProjectId);
                const response = {
                    data: employees,
                    message: "Employees retrieved successfully",
                    error: false
                };
                res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getEmployeeProjects", async (req, res, next)=>{
            try {
                const employeeId = req.params.employeeId;
                const parsedEmployeeId = Number(employeeId);
                if (isNaN(parsedEmployeeId)) {
                    return res.status(400).json({
                        message: "Invalid employee ID",
                        error: true
                    });
                }
                const projects = await this.employeeService.getEmployeeProjects(parsedEmployeeId);
                const response = {
                    data: projects,
                    message: "Projects retrieved successfully",
                    error: false
                };
                res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        this.employeeService = _typedi.default.get(_IEmployeeService.EMPLOYEE_SERVICE_TOKEN);
    }
};

//# sourceMappingURL=employee.controller.js.map