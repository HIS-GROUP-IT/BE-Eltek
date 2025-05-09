import { Router } from "express";
import { Routes } from "@/types/routes.interface";
import { authorizationMiddleware } from "@/middlewares/authorizationMiddleware";
import { ReportController } from "@/controllers/project/report.controller";

export class ReportRoute implements Routes {
    public path = "/reports";
    public router = Router();
    public projectController = new ReportController();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/getPhaseCompletionPercentages/:projectId`,authorizationMiddleware, this.projectController.getPhaseCompletionPercentages);  
        this.router.get(`${this.path}/getProjectCostData/:projectId`,authorizationMiddleware, this.projectController.getProjectCostData);  
        this.router.get(`${this.path}/getStructuredAllocations/:projectId`,authorizationMiddleware, this.projectController.getStructuredAllocations);  
    }
}
