import { Router } from "express";
import { Routes } from "@/types/routes.interface";
import { ValidationMiddleware } from "@/middlewares/ValidationMiddleware";
import { ProjectController } from "@/controllers/project/project.controller";
import { CreateProjectDto, UpdateProjectDto } from "@/dots/project/project.dto";
import { authorizationMiddleware } from "@/middlewares/authorizationMiddleware";

export class ProjectRoute implements Routes {
    public path = "/projects";
    public router = Router();
    public projectController = new ProjectController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/createProject`,authorizationMiddleware, ValidationMiddleware(CreateProjectDto), this.projectController.createProject);
        this.router.put(`${this.path}/updateProject`,authorizationMiddleware, ValidationMiddleware(UpdateProjectDto), this.projectController.updateProject);
        this.router.delete(`${this.path}/:projectId`, authorizationMiddleware,this.projectController.deleteProject);
        this.router.get(`${this.path}/getAllProjects`,authorizationMiddleware, this.projectController.getAllProjects); 
        this.router.get(`${this.path}/getProject/:projectId`,authorizationMiddleware, this.projectController.getProjectById); 
        this.router.get(`${this.path}/getProjectFinancialData/:projectId`,authorizationMiddleware, this.projectController.getProjectFinancialData); 
        this.router.get(`${this.path}/getProjectFinancials/:projectId`,authorizationMiddleware, this.projectController.getProjectFinancials); 
        this.router.delete(`${this.path}/deleteProject/:projectId`,authorizationMiddleware, this.projectController.deleteProject); 
        this.router.get(`${this.path}/getEmployeeProjects/:employeeId`,authorizationMiddleware, this.projectController.getProjectsByEmployee); 
        this.router.put(`${this.path}/activeProject`,authorizationMiddleware, this.projectController.activeProject); 
        this.router.get(`${this.path}/getProjectEstimatedCost/:projectId`,authorizationMiddleware, this.projectController.calculateEstimatedCost); 
        this.router.get(`${this.path}/calculateEstimatedCostPerEmployee/:projectId`,authorizationMiddleware, this.projectController.calculateEstimatedCostPerEmployee); 
        this.router.post(`${this.path}/pauseProject/:projectId`,authorizationMiddleware, this.projectController.pauseProject); 
        this.router.post(`${this.path}/resumeProject/:projectId`,authorizationMiddleware, this.projectController.resumeProject);
        this.router.get(`${this.path}/getProjectRemainingDays/:projectId`,authorizationMiddleware, this.projectController.getRemainingDays);  
    }
}
