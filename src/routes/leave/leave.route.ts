import { Router } from "express";
import { Routes } from "@/types/routes.interface";
import { ValidationMiddleware } from "@/middlewares/ValidationMiddleware";
import { LeaveController } from "@/controllers/leave/leave.controller";
import { authorizationMiddleware } from "@/middlewares/authorizationMiddleware";
import multerMiddleware from "@/middlewares/MulterMiddleware";

export class LeaveRoute implements Routes {
    public path = "/leaves";
    public router = Router();
    public leaveController = new LeaveController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Create leave
        this.router.post(
            `${this.path}/createLeave`,
            authorizationMiddleware,
            this.leaveController.createLeave
        );

        // Update leave
        this.router.put(
            `${this.path}/updateLeave`,
            authorizationMiddleware,
            this.leaveController.updateLeave
        );

        this.router.post(`${this.path}/uploadDocuments`,authorizationMiddleware,multerMiddleware,this.leaveController.uploadMediaToS3);


        // Delete leave
        this.router.delete(
            `${this.path}/:leaveId`,
            authorizationMiddleware,
            this.leaveController.deleteLeave
        );
        this.router.delete(
            `${this.path}/deleteDocument/:leaveId`,
            authorizationMiddleware,
            this.leaveController.deleteDocument
        );

        // Get all leaves
        this.router.get(
            `${this.path}/getAllLeaves`,
            authorizationMiddleware,
            this.leaveController.getAllLeaves
        );

        // Get single leave
        this.router.get(
            `${this.path}/getLeave/:leaveId`,
            authorizationMiddleware,
            this.leaveController.getLeaveById
        );

        // Approve leave
        this.router.put(
            `${this.path}/approveLeave`,
            authorizationMiddleware,
            this.leaveController.approveLeave
        );

        // Reject leave
        this.router.put(
            `${this.path}/rejectLeave`,
            authorizationMiddleware,
            this.leaveController.rejectLeave
        );

        // Get employee leave
        this.router.get(
            `${this.path}/getEmployeeLeave/:employeeId`,
            authorizationMiddleware,
            this.leaveController.getAllLeavesByEmployeeId
        );
    }
}