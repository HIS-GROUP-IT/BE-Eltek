"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProjectService", {
    enumerable: true,
    get: function() {
        return ProjectService;
    }
});
const _typedi = require("typedi");
const _HttpException = require("../../exceptions/HttpException");
const _IProjectService = require("../../interfaces/project/IProjectService");
const _projectrepository = require("../../repositories/project/project.repository");
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
let ProjectService = class ProjectService {
    async createProject(projectData) {
        try {
            return await this.projectRepository.createProject(projectData);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error creating project: ${error.message}`);
        }
    }
    async updateProject(projectData) {
        try {
            return await this.projectRepository.updateProject(projectData);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error updating project: ${error.message}`);
        }
    }
    async deleteProject(projectId) {
        try {
            await this.projectRepository.deleteProject(projectId);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error deleting project: ${error.message}`);
        }
    }
    async getAllProjects() {
        try {
            return await this.projectRepository.getAllProjects();
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error retrieving projects: ${error.message}`);
        }
    }
    async getProjectById(projectId) {
        try {
            const project = await this.projectRepository.getProjectById(projectId);
            if (!project) throw new _HttpException.HttpException(404, "Project not found");
            return project;
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error retrieving project: ${error.message}`);
        }
    }
    constructor(projectRepository){
        _define_property(this, "projectRepository", void 0);
        this.projectRepository = projectRepository;
    }
};
ProjectService = _ts_decorate([
    (0, _typedi.Service)({
        id: _IProjectService.PROJECT_SERVICE_TOKEN,
        type: ProjectService
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _projectrepository.ProjectRepository === "undefined" ? Object : _projectrepository.ProjectRepository
    ])
], ProjectService);

//# sourceMappingURL=project.service.js.map