import { ITimeSheet } from "@/types/timesheet.type";

export interface ITimeSheetRepository {
    createTimesheet(timesheetData: Partial<ITimeSheet>): Promise<ITimeSheet>
    updateTimesheet(id: number, timesheetData: Partial<ITimeSheet>): Promise<ITimeSheet | null>
    getTimesheetsByUser(userId: number): Promise<ITimeSheet[]> 
    getTimesheetsByProject(projectId: number): Promise<ITimeSheet[]>
    getAllTimesheets(): Promise<ITimeSheet[]>
    deleteTimesheet(id: number): Promise<void>
}
