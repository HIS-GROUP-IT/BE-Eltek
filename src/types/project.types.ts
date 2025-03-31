export type IProject = {
    id?: number;
    name: string;
    description?: string;
    status: 'planned' | 'on going' | 'cancelled' | 'completed' | 'on hold';
    startDate: Date;
    budget:number;
    duration:number;
    endDate?: Date;
    createdBy: number;
    createdAt?: Date;
    updatedAt?: Date;
};