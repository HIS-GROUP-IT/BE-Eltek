import { Router } from "express";
import { Routes } from "@/types/routes.interface";
import { authorizationMiddleware } from "@/middlewares/authorizationMiddleware";
import { StatisticsController } from "@/controllers/project/statistics.contoller";

export class StatisticsRoute implements Routes {
    public path = "/statistics";
    public router = Router();
    public statisticsController = new StatisticsController();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/getStatisticsDashboard`, authorizationMiddleware, this.statisticsController.getStatisticsDashboard);

        this.router.get(`${this.path}/getGeneralStatistics`, authorizationMiddleware, this.statisticsController.getGeneralStatistics);
        this.router.get(`${this.path}/getGraphData/:projectId`, authorizationMiddleware, this.statisticsController.getGraphData);

    }
}
