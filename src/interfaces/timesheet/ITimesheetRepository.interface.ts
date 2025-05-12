import { IEmployeeWorkMetrics } from "@/types/timesheet.types";

export interface ITimesheetRepository {
 getActiveEmployeesWorkMetrics(): Promise<IEmployeeWorkMetrics[]>
}
