export type IProject = {
    id?: number;
    name: string;
    key: string;
    description?: string;
    status: 'active' | 'inactive' | 'archived';
    startDate: Date;
    endDate?: Date;
    createdBy: number;
    category?: string;
    slug: string;
    createdAt?: Date;
    updatedAt?: Date;
};