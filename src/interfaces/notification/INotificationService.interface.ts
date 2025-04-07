import { INotification } from "@/types/notification.types";
import { Token } from "typedi";



export interface INotificationService {
    updateNotification(notificationData: Partial<INotification>): Promise<INotification> 
    deleteNotification(notificationId: number): Promise<void> 
    getAllNotifications(): Promise<INotification[]> 
    getNotificationById(notificationId: number): Promise<INotification | null>
    getNotificationsByEmployee(employeeId: number): Promise<INotification[]>
    markAsRead(notificationId: number): Promise<INotification>
    markAllAsRead(employeeId: number): Promise<void>
    getUnreadNotificationsCount(employeeId: number): Promise<number> 
    permanentDelete(notificationId: number): Promise<void> 
    restoreNotification(notificationId: number): Promise<void>  
    createNotification(notificationData: Partial<INotification>): Promise<INotification[]> 
}

export const NOTIFICATION_SERVICE_TOKEN = new Token<INotificationService>("INotificationService");