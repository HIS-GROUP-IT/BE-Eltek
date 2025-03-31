"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProjectRepository", {
    enumerable: true,
    get: function() {
        return ProjectRepository;
    }
});
const _typedi = require("typedi");
const _projectmodel = /*#__PURE__*/ _interop_require_default(require("../../models/project/project.model"));
const _employeemodel = /*#__PURE__*/ _interop_require_default(require("../../models/employee/employee.model"));
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
let ProjectRepository = class ProjectRepository {
    async createProject(projectData) {
        const project = await _projectmodel.default.create(projectData);
        return project.get({
            plain: true
        });
    }
    async updateProject(projectData) {
        const project = await _projectmodel.default.findByPk(projectData.id);
        if (!project) throw new Error("Project not found");
        await project.update(projectData);
        return project.get({
            plain: true
        });
    }
    async deleteProject(projectId) {
        const project = await _projectmodel.default.findByPk(projectId);
        if (!project) throw new Error("Project not found");
        await project.destroy();
    }
    async getAllProjects() {
        const projects = await _projectmodel.default.findAll({
            order: [
                [
                    'createdAt',
                    'DESC'
                ]
            ],
            raw: true
        });
        return projects;
    }
    async getProjectById(projectId) {
        const project = await _projectmodel.default.findByPk(projectId, {
            include: [
                {
                    model: _employeemodel.default,
                    as: 'employees',
                    attributes: [
                        'id',
                        'fullName',
                        'email'
                    ]
                }
            ],
            raw: true,
            nest: true
        });
        return project;
    }
    async getProjectsByEmployee(employeeId) {
        const employee = await _employeemodel.default.findByPk(employeeId, {
            include: [
                {
                    model: _projectmodel.default,
                    as: 'projects',
                    through: {
                        attributes: []
                    },
                    attributes: [
                        'id',
                        'name'
                    ]
                }
            ]
        });
        if (!employee) throw new Error("Employee not found");
        return employee.projects;
    }
};
ProjectRepository = _ts_decorate([
    (0, _typedi.Service)()
], ProjectRepository);

//# sourceMappingURL=project.repository.js.map