import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { CustomResponse } from "@/types/response.interface";
import { STATISTICS_SERVICE_TOKEN } from "@/interfaces/project/StatisticsService.interface";

export class StatisticsController {
    private statisticsService;

    constructor() {
        this.statisticsService = Container.get(STATISTICS_SERVICE_TOKEN);
    }

    public getStatisticsDashboard = async (req:Request,res:Response, next:NextFunction) => {
        try {
            const dashboardStatistics = await this.statisticsService.getStatisticsDashboard();
            const response: CustomResponse<any> = {
                data: dashboardStatistics,
                message: "Statistics fetched successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
    public getGeneralStatistics = async (req:Request,res:Response, next:NextFunction) => {
        try {
            const generalStatistics = await this.statisticsService.getGeneralStatistics();
            const response: CustomResponse<any> = {
                data: generalStatistics,
                message: "Statistics fetched successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
        public getGraphData = async (req:Request,res:Response, next:NextFunction) => {
        try {
            const {projectId} = req.params;
            const graphData = await this.statisticsService.getGraphData(projectId);
            const response: CustomResponse<any> = {
                data: graphData,
                message: "Statistics fetched successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
    
}   
