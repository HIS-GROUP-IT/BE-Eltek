export type INotification = {
    id: number;
    message: string;
    type: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    audiance : string;
    employeeId: number;
    department:string;
    projectId: number;
    title : string;
    isRead: boolean;
    isDeleted: boolean;    
}