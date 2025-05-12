import { TimesheetService } from './../../services/timesheet/timesheet.service';
import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { IDocument, ILeave, RequestWithFile } from "@/types/leave.types";
import { CustomResponse } from "@/types/response.interface";
import { LEAVE_SERVICE_TOKEN } from "@/interfaces/leave/ILeaveService.interface";
import { RequestWithUser } from "@/types/auth.types";
import fs from 'fs';
import { promisify } from 'util';
import { TIMESHEET_SERVICE_TOKEN } from '@/interfaces/timesheet/ITimesheetService.interface';

export class TimesheetController {
    private timesheetService;

    constructor() {
        this.timesheetService = Container.get(TIMESHEET_SERVICE_TOKEN);    }


    public getActiveEmployeesWorkMetrics = async (req: Request, res: Response, next: NextFunction) => {
        try {  
            const activeEmployeesWorkMetrics = await this.timesheetService.getActiveEmployeesWorkMetrics();
            const response: CustomResponse<ILeave> = {
                data: activeEmployeesWorkMetrics,
                message: "active Employees WorkMetrics  retrieved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    
    public getEmployeeWorkChartsData = async (req: Request, res: Response, next: NextFunction) => {
        try {  
            const EmployeeWorkChartsData = await this.timesheetService.getEmployeeWorkChartsData();
            const response: CustomResponse<ILeave> = {
                data: EmployeeWorkChartsData,
                message: "Employee Work Charts Data  retrieved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
}