import { TimesheetController } from "@/controllers/project/timesheet.controller";
import { Router } from "express";

export class TimesheetRoute {
    public path = "/timesheets";
    public router = Router();
    private timesheetController = new TimesheetController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Create timesheet
        this.router.post(`${this.path}`, this.timesheetController.createTimesheet);

        // Update timesheet
        this.router.put(`${this.path}/:timesheetId`, this.timesheetController.updateTimesheet);

        // Get all timesheets by user
        this.router.get(`${this.path}/getUserTimeSheet`, this.timesheetController.getTimesheetsByUser);

        // Get all timesheets by project
        this.router.get(`${this.path}/project/:projectId`, this.timesheetController.getTimesheetsByProject);

        // Get all timesheets
        this.router.get(`${this.path}`, this.timesheetController.getAllTimesheets);

        // Delete timesheet
        this.router.delete(`${this.path}/:timesheetId`, this.timesheetController.deleteTimesheet);
    }
}
