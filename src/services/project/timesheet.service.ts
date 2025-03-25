import { Service } from "typedi";
import { ITimeSheetService, TIMESHEET_SERVICE_TOKEN } from "@/interfaces/timesheet/ITimeSheetService.interface";
import { HttpException } from "@/exceptions/HttpException"; // Custom Exception Handling
import { ITimeSheet } from "@/types/timesheet.type";
import { TimesheetRepository } from "@/repositories/project/timesheet.repository";

@Service({id : TIMESHEET_SERVICE_TOKEN, type: TimesheetService})
export class TimesheetService implements ITimeSheetService {
    constructor(private timesheetRepository: TimesheetRepository) {}

    public async createTimesheet(timesheetData: Partial<ITimeSheet>): Promise<ITimeSheet> {
        try {
            return await this.timesheetRepository.createTimesheet(timesheetData);
        } catch (error) {
            throw new HttpException(500, `Error creating timesheet: ${error.message}`);
        }
    }

    public async updateTimesheet(id: number, timesheetData: Partial<ITimeSheet>): Promise<ITimeSheet | null> {
        try {
            return await this.timesheetRepository.updateTimesheet(id, timesheetData);
        } catch (error) {
            throw new HttpException(500, `Error updating timesheet: ${error.message}`);
        }
    }

    public async getTimesheetsByUser(userId: number): Promise<ITimeSheet[]> {
        try {
            return await this.timesheetRepository.getTimesheetsByUser(userId);
        } catch (error) {
            throw new HttpException(500, `Error fetching timesheets: ${error.message}`);
        }
    }

    public async getTimesheetsByProject(projectId: number): Promise<ITimeSheet[]> {
        try {
            return await this.timesheetRepository.getTimesheetsByProject(projectId);
        } catch (error) {
            throw new HttpException(500, `Error fetching timesheets: ${error.message}`);
        }
    }

    public async getAllTimesheets(): Promise<ITimeSheet[]> {
        try {
            return await this.timesheetRepository.getAllTimesheets();
        } catch (error) {
            throw new HttpException(500, `Error fetching timesheets: ${error.message}`);
        }
    }

    public async deleteTimesheet(id: number): Promise<void> {
        try {
            await this.timesheetRepository.deleteTimesheet(id);
        } catch (error) {
            throw new HttpException(500, `Error deleting timesheet: ${error.message}`);
        }
    }
}
