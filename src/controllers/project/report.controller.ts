import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { IEstimatedCost, IProject } from "@/types/project.types";
import { CustomResponse } from "@/types/response.interface";
import { PROJECT_SERVICE_TOKEN } from "@/interfaces/project/IProjectService";
import { RequestWithUser } from "@/types/auth.types";
import { REPORT_SERVICE_TOKEN } from "@/interfaces/project/reportsService.interface";
import { ProjectCostDataResponse } from "@/types/report.types";

export class ReportController {
    private reportService;

    constructor() {
        this.reportService = Container.get(REPORT_SERVICE_TOKEN);
    }

    public getPhaseCompletionPercentages = async (req:Request,res:Response, next:NextFunction) => {
        try {
            const projectId = req.params.projectId
            const phaseCompletion = await this.reportService.getPhaseCompletionPercentages(Number(projectId));
            const response: CustomResponse<any> = {
                data: phaseCompletion,
                message: "Phase completion rate fetched successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
    public getProjectCostData = async (req:Request,res:Response, next:NextFunction) => {
        try {
            const projectId = req.params.projectId
            const projectCostData = await this.reportService.getProjectCostData(Number(projectId));
            const response: CustomResponse<ProjectCostDataResponse[]> = {
                data: projectCostData,
                message: "project Cost Data fetched successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}   
