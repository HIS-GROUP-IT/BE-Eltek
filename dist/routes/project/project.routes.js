"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProjectRoute", {
    enumerable: true,
    get: function() {
        return ProjectRoute;
    }
});
const _express = require("express");
const _ValidationMiddleware = require("../../middlewares/ValidationMiddleware");
const _projectcontroller = require("../../controllers/project/project.controller");
const _projectdto = require("../../dots/project/project.dto");
const _authorizationMiddleware = require("../../middlewares/authorizationMiddleware");
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
let ProjectRoute = class ProjectRoute {
    initializeRoutes() {
        this.router.post(`${this.path}/createProject`, _authorizationMiddleware.authorizationMiddleware, (0, _ValidationMiddleware.ValidationMiddleware)(_projectdto.CreateProjectDto), this.projectController.createProject);
        this.router.put(`${this.path}/updateProject`, _authorizationMiddleware.authorizationMiddleware, (0, _ValidationMiddleware.ValidationMiddleware)(_projectdto.UpdateProjectDto), this.projectController.updateProject);
        this.router.delete(`${this.path}/:projectId`, _authorizationMiddleware.authorizationMiddleware, this.projectController.deleteProject);
        this.router.get(`${this.path}`, _authorizationMiddleware.authorizationMiddleware, this.projectController.getAllProjects);
        this.router.get(`${this.path}/:projectId`, _authorizationMiddleware.authorizationMiddleware, this.projectController.getProjectById);
    }
    constructor(){
        _define_property(this, "path", "/projects");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "projectController", new _projectcontroller.ProjectController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=project.routes.js.map