import { IEmployeeWorkMetrics } from "@/types/timesheet.types";

export interface ITimesheetRepository {
 getActiveEmployeesWorkMetrics(): Promise<IEmployeeWorkMetrics[]>;
 getEmployeeWorkChartsData(): Promise<{
    hoursData: { employees: string[]; hours: number[] };
    tasksData: { employees: string[]; tasks: number[] };
  }>
}
