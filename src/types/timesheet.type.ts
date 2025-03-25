export type ITimeSheet = {
    id?: number;
    userId: number;
    projectId: number;
    description: string;
    hours: number;
    status: string;
    date: Date;
}
