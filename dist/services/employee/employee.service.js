"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmployeeService", {
    enumerable: true,
    get: function() {
        return EmployeeService;
    }
});
const _typedi = require("typedi");
const _IEmployeeService = require("../../interfaces/employee/IEmployeeService");
const _employeerepository = require("../../repositories/employee/employee.repository");
const _HttpException = require("../../exceptions/HttpException");
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
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let EmployeeService = class EmployeeService {
    async createEmployee(employeeData) {
        try {
            return await this.employeeRepository.createEmployee(employeeData);
        } catch (error) {
            throw new _HttpException.HttpException(400, "Error creating employee");
        }
    }
    async getAllEmployees() {
        try {
            return await this.employeeRepository.getAllEmployees();
        } catch (error) {
            throw new _HttpException.HttpException(500, "Error getting employees");
        }
    }
    async getEmployeeById(id) {
        try {
            return await this.employeeRepository.getEmployeeById(id);
        } catch (error) {
            throw new _HttpException.HttpException(500, "Error retrieving employee");
        }
    }
    async updateEmployee(employeeData) {
        try {
            return await this.employeeRepository.updateEmployee(employeeData);
        } catch (error) {
            throw new _HttpException.HttpException(400, "Error updating employee");
        }
    }
    async deleteEmployee(id) {
        try {
            await this.employeeRepository.deleteEmployee(id);
        } catch (error) {
            throw new _HttpException.HttpException(400, "Error deleting employee");
        }
    }
    async assignEmployeesToProject(employeeIds, projectId) {
        try {
            const assignEmployees = await this.employeeRepository.assignEmployeesToProject(employeeIds, projectId);
            return assignEmployees;
        } catch (error) {
            throw new _HttpException.HttpException(500, "Error assigning employees to project");
        }
    }
    async getEmployeesByProjectId(projectId) {
        try {
            const fetchedEmployees = await this.employeeRepository.getEmployeesByProjectId(projectId);
            return fetchedEmployees;
        } catch (error) {
            throw new _HttpException.HttpException(404, `No employees found for Project ID : ${projectId}`);
        }
    }
    async getEmployeeProjects(employeeId) {
        try {
            const fetchedProjects = await this.employeeRepository.getEmployeeProjects(employeeId);
            return fetchedProjects;
        } catch (error) {
            throw new _HttpException.HttpException(404, `No Projects for employee ID: ${employeeId}`);
        }
    }
    constructor(employeeRepository){
        _define_property(this, "employeeRepository", void 0);
        this.employeeRepository = employeeRepository;
    }
};
EmployeeService = _ts_decorate([
    (0, _typedi.Service)({
        id: _IEmployeeService.EMPLOYEE_SERVICE_TOKEN,
        type: EmployeeService
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _employeerepository.EmployeeRepository === "undefined" ? Object : _employeerepository.EmployeeRepository
    ])
], EmployeeService);

//# sourceMappingURL=employee.service.js.map