import { Service } from "typedi";
import { INotificationRepository } from "@/interfaces/notification/INotificationRepository.interface";
import { INotification } from "@/types/notification.types";
import { HttpException } from "@/exceptions/HttpException";
import Notification from "@/models/notifications/notification.model";

@Service()
export class NotificationRepository implements INotificationRepository {
    public async createNotification(notificationData: Partial<INotification>): Promise<INotification> {
        const notification = await Notification.create(notificationData);
        return notification.get({ plain: true });
    }

    public async bulkCreateNotifications(notificationsData: Partial<INotification>[]): Promise<INotification[]> {
        const notifications = await Notification.bulkCreate(notificationsData);
        return notifications.map(n => n.get({ plain: true }));
    }

    public async updateNotification(notificationData: Partial<INotification>): Promise<INotification> {
        const notification = await Notification.findOne({
            where: {
                id: notificationData.id,
                isDeleted: false
            }
        });
        if (!notification) {
            throw new HttpException(404, "Notification not found");
        }
        await notification.update(notificationData);
        return notification.get({ plain: true });
    }

    public async deleteNotification(notificationId: number): Promise<void> {
        const notification = await Notification.findOne({
            where: {
                id: notificationId,
                isDeleted: false
            }
        });
        if (!notification) {
            throw new HttpException(404, "Notification not found");
        }
        await notification.update({ isDeleted: true });
    }

    public async getAllNotifications(): Promise<INotification[]> {
        const notifications = await Notification.findAll({
            where: { isDeleted: false },
            order: [['createdAt', 'DESC']],
            raw: true
        });
        return notifications;
    }

    public async getNotificationById(notificationId: number): Promise<INotification | null> {
        const notification = await Notification.findOne({
            where: {
                id: notificationId,
                isDeleted: false
            },
            raw: true,
            nest: true
        });
        return notification;
    }

    public async getNotificationsByEmployee(employeeId: number): Promise<INotification[]> {
        const notifications = await Notification.findAll({
            where: { 
                employeeId,
                isDeleted: false 
            },
            order: [['createdAt', 'DESC']],
            raw: true
        });
        return notifications;
    }

    public async markAsRead(notificationId: number): Promise<INotification> {
        const notification = await Notification.findOne({
            where: {
                id: notificationId,
                isDeleted: false
            }
        });
        if (!notification) {
            throw new HttpException(404, "Notification not found");
        }
        await notification.update({ isRead: true });
        return notification.get({ plain: true });
    }

    public async markAllAsRead(employeeId: number): Promise<void> {
        await Notification.update(
            { isRead: true },
            {
                where: {
                    employeeId,
                    isRead: false,
                    isDeleted: false
                }
            }
        );
    }

    public async getUnreadNotificationsCount(employeeId: number): Promise<number> {
        const count = await Notification.count({
            where: {
                employeeId,
                isRead: false,
                isDeleted: false
            }
        });
        return count;
    }

    public async permanentDelete(notificationId: number): Promise<void> {
        const notification = await Notification.findByPk(notificationId);
        if (!notification) {
            throw new HttpException(404, "Notification not found");
        }
        await notification.destroy();
    }

    public async restoreNotification(notificationId: number): Promise<void> {
        const notification = await Notification.findOne({
            where: {
                id: notificationId,
                isDeleted: true
            }
        });
        if (!notification) {
            throw new HttpException(404, "Notification not found or not deleted");
        }
        await notification.update({ isDeleted: false });
    }
    public async getNotificationsByProject(projectId: number): Promise<INotification[]> {
        return Notification.findAll({
            where: { 
                projectId,
                isDeleted: false 
            },
            order: [['createdAt', 'DESC']],
            raw: true
        });
    }

    public async getNotificationsByDepartment(department: string): Promise<INotification[]> {
        return Notification.findAll({
            where: { 
                department,
                isDeleted: false 
            },
            order: [['createdAt', 'DESC']],
            raw: true
        });
    }
public async getNotificationsForAllEmployees(): Promise<INotification[]> {
    return Notification.findAll({
        where: { 
            audiance: 'all',
            isDeleted: false 
        },
        order: [['createdAt', 'DESC']],
        raw: true
    });
}
}