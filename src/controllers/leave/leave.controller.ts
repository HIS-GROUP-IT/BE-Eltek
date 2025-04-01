import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { ILeave } from "@/types/leave.types";
import { CustomResponse } from "@/types/response.interface";
import { LEAVE_SERVICE_TOKEN } from "@/interfaces/leave/ILeaveService.interface";
import { RequestWithUser } from "@/types/auth.types";

export class LeaveController {
    private leaveService;

    constructor() {
        this.leaveService = Container.get(LEAVE_SERVICE_TOKEN);
    }

    public createLeave = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const leaveData: Partial<ILeave> = req.body;
            const createdLeave = await this.leaveService.createLeave(leaveData);
            const response: CustomResponse<ILeave> = {
                data: createdLeave,
                message: "Leave created successfully",
                error: false
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    public updateLeave = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const leaveId = parseInt(req.params.leaveId);
            const leaveData: Partial<ILeave> = {
                ...req.body,
                id: leaveId,
            };
            const updatedLeave = await this.leaveService.updateLeave(leaveData);
            const response: CustomResponse<ILeave> = {
                data: updatedLeave,
                message: "Leave updated successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public deleteLeave = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const leaveId = parseInt(req.params.leaveId);
            await this.leaveService.deleteLeave(leaveId);
            const response: CustomResponse<null> = {
                data: null,
                message: "Leave deleted successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getLeaveById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const leaveId = parseInt(req.params.leaveId);
            const leave = await this.leaveService.getLeaveById(leaveId);
            const response: CustomResponse<ILeave> = {
                data: leave,
                message: "Leave retrieved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getAllLeaves = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const leaves = await this.leaveService.getAllLeaves();
            const response: CustomResponse<ILeave[]> = {
                data: leaves,
                message: "Leaves retrieved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public approveLeave = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const leaveId = parseInt(req.params.leaveId);
            await this.leaveService.approveLeave(leaveId);
            const approvedLeave = await this.leaveService.getLeaveById(leaveId);
            const response: CustomResponse<ILeave> = {
                data: approvedLeave,
                message: "Leave approved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public rejectLeave = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const leaveId = parseInt(req.params.leaveId);
            await this.leaveService.rejectLeave(leaveId);
            const rejectedLeave = await this.leaveService.getLeaveById(leaveId);
            const response: CustomResponse<ILeave> = {
                data: rejectedLeave,
                message: "Leave rejected successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getLeaveByEmployeeId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId = parseInt(req.params.employeeId);
            const leave = await this.leaveService.getLeaveByEmployeeId(employeeId);
            const response: CustomResponse<ILeave> = {
                data: leave,
                message: "Employee leave retrieved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
}