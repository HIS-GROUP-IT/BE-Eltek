import { Service } from "typedi";
import { HttpException } from "@/exceptions/HttpException";
import { NotificationRepository } from "@/repositories/notification/notification.repository";
import { INotification } from "@/types/notification.types";
import { INotificationService, NOTIFICATION_SERVICE_TOKEN } from "@/interfaces/notification/INotificationService.interface";
import EmployeeProject from "@/models/employee/projectEmployees.model";
import Employee from "@/models/employee/employee.model";

@Service({ id: NOTIFICATION_SERVICE_TOKEN, type: NotificationService })
export class NotificationService implements INotificationService {
    constructor(private notificationRepository: NotificationRepository) {}

    private async getTargetEmployees(data: Partial<INotification>): Promise<number[]> {
    switch(data.audiance) {
        case 'employee':
            return [data.employeeId];
        
        case 'project':
            const assignments = await EmployeeProject.findAll({
                where: { projectId: data.projectId },
                attributes: ['employeeId'],
                raw: true
            });
            return assignments.map(a => a.employeeId);
        
        case 'department':
            const employees = await Employee.findAll({
                where: { department: data.department },
                attributes: ['id'],
                raw: true
            });
            return employees.map(e => e.id);
        
        case 'all':
            const allEmployees = await Employee.findAll({
                attributes: ['id'],
                raw: true
            });
            return allEmployees.map(e => e.id);
        
        default:
            throw new HttpException(400, 'Invalid audience type');
    }
}

    public async createNotification(notificationData: Partial<INotification>): Promise<INotification[]> {
        try {
            const employeeIds = await this.getTargetEmployees(notificationData);
            
            const notifications = employeeIds.map(employeeId => ({
                ...notificationData,
                employeeId,
                projectId: notificationData.audiance === 'project' ? notificationData.projectId : null,
                department: notificationData.audiance === 'department' ? notificationData.department : null
            }));

            return this.notificationRepository.bulkCreateNotifications(notifications);
        } catch (error) {
            throw new HttpException(500, `Error creating notifications: ${error.message}`);
        }
    }

    public async updateNotification(notificationData: Partial<INotification>): Promise<INotification> {
        try {
            return await this.notificationRepository.updateNotification(notificationData);
        } catch (error) {
            throw new HttpException(500, `Error updating notification: ${error.message}`);
        }
    }

    public async deleteNotification(notificationId: number): Promise<void> {
        try {
            await this.notificationRepository.deleteNotification(notificationId);
        } catch (error) {
            throw new HttpException(500, `Error deleting notification: ${error.message}`);
        }
    }

    public async getAllNotifications(): Promise<INotification[]> {
        try {
            return await this.notificationRepository.getAllNotifications();
        } catch (error) {
            throw new HttpException(500, `Error retrieving notifications: ${error.message}`);
        }
    }

    public async getNotificationById(notificationId: number): Promise<INotification | null> {
        try {
            const notification = await this.notificationRepository.getNotificationById(notificationId);
            if (!notification) throw new HttpException(404, "Notification not found");
            return notification;
        } catch (error) {
            throw new HttpException(500, `Error retrieving notification: ${error.message}`);
        }
    }

    public async getNotificationsByEmployee(employeeId: number): Promise<INotification[]> {
        try {
            return await this.notificationRepository.getNotificationsByEmployee(employeeId);
        } catch (error) {
            throw new HttpException(500, `Error retrieving notifications: ${error.message}`);
        }
    }

    public async markAsRead(notificationId: number): Promise<INotification> {
        try {
            return await this.notificationRepository.markAsRead(notificationId);
        } catch (error) {
            throw new HttpException(500, `Error marking notification as read: ${error.message}`);
        }
    }

    public async markAllAsRead(employeeId: number): Promise<void> {
        try {
            await this.notificationRepository.markAllAsRead(employeeId);
        } catch (error) {
            throw new HttpException(500, `Error marking notifications as read: ${error.message}`);
        }
    }

    public async getUnreadNotificationsCount(employeeId: number): Promise<number> {
        try {
            return await this.notificationRepository.getUnreadNotificationsCount(employeeId);
        } catch (error) {
            throw new HttpException(500, `Error getting unread count: ${error.message}`);
        }
    }

    public async restoreNotification(notificationId: number): Promise<void> {
        try {
            await this.notificationRepository.restoreNotification(notificationId);
        } catch (error) {
            throw new HttpException(500, `Error restoring notification: ${error.message}`);
        }
    }
    public async permanentDelete(notificationId: number): Promise<void> {
        try {
            await this.notificationRepository.permanentDelete(notificationId);
        } catch (error) {
            throw new HttpException(500, `Error permanently deleting notification: ${error.message}`);
        }
    }
}