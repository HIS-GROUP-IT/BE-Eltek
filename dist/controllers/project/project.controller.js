"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProjectController", {
    enumerable: true,
    get: function() {
        return ProjectController;
    }
});
const _typedi = require("typedi");
const _IProjectService = require("../../interfaces/project/IProjectService");
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
let ProjectController = class ProjectController {
    constructor(){
        _define_property(this, "projectService", void 0);
        _define_property(this, "createProject", async (req, res, next)=>{
            try {
                const projectData = req.body;
                const createdProject = await this.projectService.createProject(projectData);
                const response = {
                    data: createdProject,
                    message: "Project created successfully",
                    error: false
                };
                res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updateProject", async (req, res, next)=>{
            try {
                const projectData = req.body;
                const updatedProject = await this.projectService.updateProject(projectData);
                const response = {
                    data: updatedProject,
                    message: "Project updated successfully",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "deleteProject", async (req, res, next)=>{
            try {
                const projectId = parseInt(req.params.projectId);
                await this.projectService.deleteProject(projectId);
                const response = {
                    data: null,
                    message: "Project deleted successfully",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getAllProjects", async (req, res, next)=>{
            try {
                const projects = await this.projectService.getAllProjects();
                const response = {
                    data: projects,
                    message: "Projects retrieved successfully",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getProjectById", async (req, res, next)=>{
            try {
                const projectId = parseInt(req.params.projectId);
                const project = await this.projectService.getProjectById(projectId);
                const response = {
                    data: project,
                    message: "Project retrieved successfully",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        this.projectService = _typedi.Container.get(_IProjectService.PROJECT_SERVICE_TOKEN);
    }
};

//# sourceMappingURL=project.controller.js.map