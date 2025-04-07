import { INotification } from "@/types/notification.types";



export interface INotificationRepository {
    createNotification(notificationData: Partial<INotification>): Promise<INotification>
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
    bulkCreateNotifications(notificationsData: Partial<INotification>[]): Promise<INotification[]>
    getNotificationsByProject(projectId: number): Promise<INotification[]> 
    getNotificationsByDepartment(department: string): Promise<INotification[]> 

}