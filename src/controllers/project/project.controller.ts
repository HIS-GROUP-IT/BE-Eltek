import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { IEstimatedCost, IProject } from "@/types/project.types";
import { CustomResponse } from "@/types/response.interface";
import { PROJECT_SERVICE_TOKEN } from "@/interfaces/project/IProjectService";
import { RequestWithUser } from "@/types/auth.types";

export class ProjectController {
    private projectService;

    constructor() {
        this.projectService = Container.get(PROJECT_SERVICE_TOKEN);
    }

    public createProject = async (req: RequestWithUser, res: Response, next: NextFunction) => {
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

    public getProjectsByEmployee = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const employeeId = req.params.employeeId;
            const fetchedProjects = await this.projectService.getProjectsByEmployee((Number(employeeId)));
            const response: CustomResponse<IProject[]> = {
                data: fetchedProjects,
                message: "Projects retrieved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }


    public activeProject = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const project = req.body;
            const activetedProject = await this.projectService.activeProject(project);
            const response: CustomResponse<IProject[]> = {
                data: activetedProject,
                message: "Project actived successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public calculateEstimatedCost = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const projectId = req.params.projectId;
            const estimatedCost = await this.projectService.calculateEstimatedCost(projectId);
            const response: CustomResponse<IEstimatedCost> = {
                data: estimatedCost,
                message: "Project estimatedCost fetched successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public calculateEstimatedCostPerEmployee = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const projectId = req.params.projectId;
            const profitabilityData = await this.projectService.calculateEstimatedCostPerEmployee(projectId);
            const response: CustomResponse<any> = {
                data: profitabilityData,
                message: "Project profitabilityData fetched successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public getProjectFinancials = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const projectId = req.params.projectId;
            const financialData = await this.projectService.getProjectFinancials(projectId);
            const response: CustomResponse<any> = {
                data: financialData,
                message: "Project financialData fetched successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public getRemainingDays = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const projectId = req.params.projectId;
            const remainingDays = await this.projectService.getRemainingDays(projectId);
            const response: CustomResponse<any> = {
                data: remainingDays,
                message: "Project number of returning days fetched successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public getProjectFinancialData = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const projectId = req.params.projectId;
            const remainingDays = await this.projectService.getProjectFinancialData(projectId);
            const response: CustomResponse<any> = {
                data: remainingDays,
                message: "Project finacial data fetched successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public resumeProject = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const projectId = req.params.projectId;
            const resumedProject = await this.projectService.resumeProject(projectId);
            const response: CustomResponse<any> = {
                data: resumedProject,
                message: "Project resumed successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    public pauseProject = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const projectId = req.params.projectId;
            const pauseProject = await this.projectService.pauseProject(projectId);
            const response: CustomResponse<any> = {
                data: pauseProject,
                message: "Project paused successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }


}
