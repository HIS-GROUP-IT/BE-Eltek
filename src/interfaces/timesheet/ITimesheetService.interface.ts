import { IEmployeeWorkMetrics } from "@/types/timesheet.types";
import { Token } from "typedi";

export interface ITimesheetService {
 getActiveEmployeesWorkMetrics(): Promise<IEmployeeWorkMetrics[]>;
 getEmployeeWorkChartsData(): Promise<{
    hoursData: { employees: string[]; hours: number[] };
    tasksData: { employees: string[]; tasks: number[] };
  }>
}


export const TIMESHEET_SERVICE_TOKEN = new Token<ITimesheetService>("ITimesheetService");