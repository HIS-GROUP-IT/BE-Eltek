import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { INotification } from "@/types/notification.types";
import { CustomResponse } from "@/types/response.interface";
import { RequestWithUser } from "@/types/auth.types";
import { NOTIFICATION_SERVICE_TOKEN } from "@/interfaces/notification/INotificationService.interface";

export class NotificationController {
    private notificationService;

    constructor() {
        this.notificationService = Container.get(NOTIFICATION_SERVICE_TOKEN);
    }

    public createNotification = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const notificationData: Partial<INotification> = req.body;
            const createdNotification = await this.notificationService.createNotification(notificationData);
            const response: CustomResponse<INotification> = {
                data: createdNotification,
                message: "Notification created successfully",
                error: false
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    public updateNotification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notificationData: Partial<INotification> = req.body;
            const updatedNotification = await this.notificationService.updateNotification(notificationData);
            const response: CustomResponse<INotification> = {
                data: updatedNotification,
                message: "Notification updated successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notificationId = parseInt(req.params.notificationId);
            await this.notificationService.deleteNotification(notificationId);
            const response: CustomResponse<null> = {
                data: null,
                message: "Notification deleted successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public pemanentDeleteNotification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notificationId = parseInt(req.params.notificationId);
            await this.notificationService.permanentDelete(notificationId);
            const response: CustomResponse<null> = {
                data: null,
                message: "Notification deleted successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notifications = await this.notificationService.getAllNotifications();
            const response: CustomResponse<INotification[]> = {
                data: notifications,
                message: "Notifications retrieved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getNotificationById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notificationId = parseInt(req.params.notificationId);
            const notification = await this.notificationService.getNotificationById(notificationId);
            const response: CustomResponse<INotification> = {
                data: notification,
                message: "Notification retrieved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getNotificationsByEmployee = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId = parseInt(req.params.employeeId);
            const notifications = await this.notificationService.getNotificationsByEmployee(employeeId);
            const response: CustomResponse<INotification[]> = {
                data: notifications,
                message: "Notifications retrieved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public markAsRead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notificationId = parseInt(req.params.notificationId);
            const notification = await this.notificationService.markAsRead(notificationId);
            const response: CustomResponse<INotification> = {
                data: notification,
                message: "Notification marked as read",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId = parseInt(req.params.employeeId);
            await this.notificationService.markAllAsRead(employeeId);
            const response: CustomResponse<null> = {
                data: null,
                message: "All notifications marked as read",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId = parseInt(req.params.employeeId);
            const count = await this.notificationService.getUnreadNotificationsCount(employeeId);
            const response: CustomResponse<number> = {
                data: count,
                message: "Unread count retrieved",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
}