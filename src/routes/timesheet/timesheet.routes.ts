import { Router } from "express";
import { Routes } from "@/types/routes.interface";
import { ValidationMiddleware } from "@/middlewares/ValidationMiddleware";
import { LeaveController } from "@/controllers/leave/leave.controller";
import { authorizationMiddleware } from "@/middlewares/authorizationMiddleware";
import multerMiddleware from "@/middlewares/MulterMiddleware";
import { TimesheetController } from "@/controllers/timesheet/timesheet.controller";

export class TimesheetRoute implements Routes {
    public path = "/timesheets";
    public router = Router();
    public leaveController = new TimesheetController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.get(
            `${this.path}/getActiveEmployeesWorkMetrics`,
            authorizationMiddleware,
            this.leaveController.getActiveEmployeesWorkMetrics
        );
    }
}