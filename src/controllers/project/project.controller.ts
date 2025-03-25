import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { IProject } from "@/types/project.types";
import { CustomResponse } from "@/types/response.interface";
import { PROJECT_SERVICE_TOKEN } from "@/interfaces/project/IProjectService";

export class ProjectController {
    private projectService;

    constructor() {
        this.projectService = Container.get(PROJECT_SERVICE_TOKEN);
    }

    public createProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectData: Partial<IProject> = req.body;
            const createdProject = await this.projectService.createProject(projectData);
            const response: CustomResponse<IProject> = {
                data: createdProject,
                message: "Project created successfully",
                error: false
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    public updateProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectData: Partial<IProject> = req.body;
            const updatedProject = await this.projectService.updateProject(projectData);
            const response: CustomResponse<IProject> = {
                data: updatedProject,
                message: "Project updated successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public deleteProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId: number = parseInt(req.params.projectId);
            await this.projectService.deleteProject(projectId);
            const response: CustomResponse<null> = {
                data: null,
                message: "Project deleted successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projects = await this.projectService.getAllProjects();
            const response: CustomResponse<IProject[]> = {
                data: projects,
                message: "Projects retrieved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getProjectById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId: number = parseInt(req.params.projectId);
            const project = await this.projectService.getProjectById(projectId);
            const response: CustomResponse<IProject> = {
                data: project,
                message: "Project retrieved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
}
