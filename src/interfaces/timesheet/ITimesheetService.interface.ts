import { IEmployeeWorkMetrics } from "@/types/timesheet.types";
import { Token } from "typedi";

export interface ITimesheetService {
 getActiveEmployeesWorkMetrics(): Promise<IEmployeeWorkMetrics[]>
}


export const TIMESHEET_SERVICE_TOKEN = new Token<ITimesheetService>("ITimesheetService");