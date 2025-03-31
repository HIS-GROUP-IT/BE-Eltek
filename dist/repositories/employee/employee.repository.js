"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmployeeRepository", {
    enumerable: true,
    get: function() {
        return EmployeeRepository;
    }
});
const _HttpException = require("../../exceptions/HttpException");
const _employeemodel = /*#__PURE__*/ _interop_require_default(require("../../models/employee/employee.model"));
const _projectmodel = /*#__PURE__*/ _interop_require_default(require("../../models/project/project.model"));
const _typedi = require("typedi");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let EmployeeRepository = class EmployeeRepository {
    async createEmployee(employeeData) {
        const employee = await _employeemodel.default.create(employeeData);
        return employee.get({
            plain: true
        });
    }
    async updateEmployee(employeeData) {
        const employee = await _employeemodel.default.findByPk(employeeData.id);
        if (!employee) throw new Error("Employee not found");
        await employee.update(employeeData);
        return employee.get({
            plain: true
        });
    }
    async deleteEmployee(employeeId) {
        const employee = await _employeemodel.default.findByPk(employeeId);
        if (!employee) throw new Error("Employee not found");
        await employee.destroy();
    }
    async getAllEmployees() {
        const employees = await _employeemodel.default.findAll({
            order: [
                [
                    'createdAt',
                    'DESC'
                ]
            ],
            raw: true
        });
        return employees;
    }
    async getEmployeeById(employeeId) {
        const employee = await _employeemodel.default.findByPk(employeeId, {
            raw: true
        });
        return employee;
    }
    async assignEmployeesToProject(employeeIds, projectId) {
        const project = await _projectmodel.default.findByPk(projectId);
        if (!project) throw new _HttpException.HttpException(404, "Project not found");
        const employees = await _employeemodel.default.findAll({
            where: {
                id: employeeIds
            }
        });
        if (employees.length === 0) throw new _HttpException.HttpException(404, "No employees found");
        const foundIds = employees.map((emp)=>emp.id);
        const missingIds = employeeIds.filter((id)=>!foundIds.includes(id));
        if (missingIds.length > 0) {
            throw new _HttpException.HttpException(404, `Employees not found: ${missingIds.join(', ')}`);
        }
        await Promise.all(employees.map((employee)=>employee.addProjects([
                project
            ])));
    }
    async getEmployeesByProjectId(projectId) {
        const project = await _projectmodel.default.findByPk(projectId, {
            include: [
                {
                    model: _employeemodel.default,
                    as: 'employees',
                    through: {
                        attributes: []
                    }
                }
            ],
            raw: true
        });
        if (!project) {
            throw new _HttpException.HttpException(404, "Project not found");
        }
        const employees = project.employees;
        if (!employees || employees.length === 0) {
            throw new _HttpException.HttpException(404, "No employees assigned to this project");
        }
        return employees;
    }
    async getEmployeeProjects(employeeId) {
        const employee = await _employeemodel.default.findByPk(employeeId, {
            include: [
                {
                    model: _projectmodel.default,
                    as: 'projects',
                    through: {
                        attributes: []
                    }
                }
            ],
            raw: true
        });
        if (!employee) {
            throw new _HttpException.HttpException(404, "Employee not found");
        }
        const projects = employee.projects;
        if (!projects || projects.length === 0) {
            throw new _HttpException.HttpException(404, "No projects assigned to this employee");
        }
        return projects;
    }
};
EmployeeRepository = _ts_decorate([
    (0, _typedi.Service)()
], EmployeeRepository);

//# sourceMappingURL=employee.repository.js.map