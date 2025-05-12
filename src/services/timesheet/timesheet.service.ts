import { TimesheetRepository } from './../../repositories/timesheet/timesheet.repository';
import { Service } from "typedi";
import { ILeaveService, LEAVE_SERVICE_TOKEN } from "@/interfaces/leave/ILeaveService.interface";
import { ILeave, LeaveStatus } from "@/types/leave.types";
import { HttpException } from "@/exceptions/HttpException"; 
import { LeaveRepository } from "@/repositories/leave/leaveRepository";
import { uploadFileToS3 } from "@/utils/s3";
import { ITimesheetService, TIMESHEET_SERVICE_TOKEN } from "@/interfaces/timesheet/ITimesheetService.interface";
import { IEmployeeWorkMetrics } from '@/types/timesheet.types';


@Service({ id: TIMESHEET_SERVICE_TOKEN, type: TimesheetService })
export class TimesheetService implements ITimesheetService {
    constructor(private timesheetRepository: TimesheetRepository) {}

    public async getActiveEmployeesWorkMetrics(): Promise<IEmployeeWorkMetrics[]> {
        try {
            return await this.timesheetRepository.getActiveEmployeesWorkMetrics();
        } catch (error) {
            throw new HttpException(500, error.message)
        }
    }

    public async getEmployeeWorkChartsData(): Promise<{
        hoursData: { employees: string[]; hours: number[] };
        tasksData: { employees: string[]; tasks: number[] };
      }> {
        try {
            return await this.timesheetRepository.getEmployeeWorkChartsData();
        } catch (error) {
            throw new HttpException(500, error.message)
        }
    }
}
