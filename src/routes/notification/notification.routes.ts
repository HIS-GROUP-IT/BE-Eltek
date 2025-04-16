import { Router } from "express";
import { Routes } from "@/types/routes.interface";
import { NotificationController } from "@/controllers/notification/notification.controller";
import { authorizationMiddleware } from "@/middlewares/authorizationMiddleware";
import { ValidationMiddleware } from "@/middlewares/ValidationMiddleware";
import { CreateNotificationDto } from "@/dots/notification/notification.dto";

export class NotificationRoute implements Routes {
    public path = "/notifications";
    public router = Router();
    public notificationController = new NotificationController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/createNotification`, authorizationMiddleware,ValidationMiddleware(CreateNotificationDto), this.notificationController.createNotification);
        this.router.put(`${this.path}/updateNotification`, authorizationMiddleware, this.notificationController.updateNotification);
        this.router.delete(`${this.path}/deleteNotification/:notificationId`, authorizationMiddleware, this.notificationController.deleteNotification);
        this.router.get(`${this.path}/getAllNotifications`, authorizationMiddleware, this.notificationController.getAllNotifications);
        this.router.get(`${this.path}/getNotification/:notificationId`, authorizationMiddleware, this.notificationController.getNotificationById);
        this.router.get(`${this.path}/getEmployeeNotifications/:employeeId`, authorizationMiddleware, this.notificationController.getNotificationsByEmployee);
        this.router.put(`${this.path}/mark-read/:notificationId`, authorizationMiddleware, this.notificationController.markAsRead);
        this.router.patch(`${this.path}/mark-all-read/:employeeId`, authorizationMiddleware, this.notificationController.markAllAsRead);
        this.router.get(`${this.path}/unread-count/:employeeId`, authorizationMiddleware, this.notificationController.getUnreadCount);
    }
}