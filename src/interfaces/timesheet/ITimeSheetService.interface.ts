import { ITimeSheet } from "@/types/timesheet.type";
import { Token } from "typedi";

export interface ITimeSheetService {
    createTimesheet(timesheetData: Partial<ITimeSheet>): Promise<ITimeSheet>
    updateTimesheet(id: number, timesheetData: Partial<ITimeSheet>): Promise<ITimeSheet | null>
    getTimesheetsByUser(userId: number): Promise<ITimeSheet[]> 
    getTimesheetsByProject(projectId: number): Promise<ITimeSheet[]>
    getAllTimesheets(): Promise<ITimeSheet[]>
    deleteTimesheet(id: number): Promise<void>
}


export const TIMESHEET_SERVICE_TOKEN = new Token<ITimeSheetService>("ITimeSheetService");