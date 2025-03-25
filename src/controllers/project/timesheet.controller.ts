import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { CustomResponse } from "@/types/response.interface";
import { ITimeSheet } from "@/types/timesheet.type";
import { TIMESHEET_SERVICE_TOKEN } from "@/interfaces/timesheet/ITimeSheetService.interface";
import { RequestWithUser } from "@/types/auth.types";

export class TimesheetController {
    private timesheetService;

    constructor() {
        this.timesheetService = Container.get(TIMESHEET_SERVICE_TOKEN);
    }

    public createTimesheet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const timesheetData: Partial<ITimeSheet> = req.body;
            const createdTimesheet = await this.timesheetService.createTimesheet(timesheetData);
            const response: CustomResponse<ITimeSheet> = {
                data: createdTimesheet,
                message: "Timesheet created successfully",
                error: false,
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    public updateTimesheet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { timesheetId } = req.params;
            const timesheetData: Partial<ITimeSheet> = req.body;
            const updatedTimesheet = await this.timesheetService.updateTimesheet(+timesheetId, timesheetData);
            const response: CustomResponse<ITimeSheet> = {
                data: updatedTimesheet,
                message: "Timesheet updated successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getTimesheetsByUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            const timesheets = await this.timesheetService.getTimesheetsByUser(+user);
            const response: CustomResponse<ITimeSheet[]> = {
                data: timesheets,
                message: "Timesheets fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getTimesheetsByProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { projectId } = req.params;
            const timesheets = await this.timesheetService.getTimesheetsByProject(+projectId);
            const response: CustomResponse<ITimeSheet[]> = {
                data: timesheets,
                message: "Timesheets fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getAllTimesheets = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const timesheets = await this.timesheetService.getAllTimesheets();
            const response: CustomResponse<ITimeSheet[]> = {
                data: timesheets,
                message: "All timesheets fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public deleteTimesheet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { timesheetId } = req.params;
            await this.timesheetService.deleteTimesheet(+timesheetId);
            const response: CustomResponse<null> = {
                data: null,
                message: "Timesheet deleted successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
}
