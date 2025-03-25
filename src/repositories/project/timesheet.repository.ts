import { Service } from "typedi";
import { ITimeSheet } from "@/types/timesheet.type";
import { ITimeSheetRepository } from "@/interfaces/timesheet/ITimeSheetRepository.interface";
import { Timesheet } from "@/models/project/timesheet.model";


@Service()
export class TimesheetRepository implements ITimeSheetRepository {
    public async createTimesheet(timesheetData: Partial<ITimeSheet>): Promise<ITimeSheet> {
        return await Timesheet.create(timesheetData);
    }

    public async updateTimesheet(id: number, timesheetData: Partial<ITimeSheet>): Promise<ITimeSheet | null> {
        const timesheet = await Timesheet.findByPk(id);
        if (!timesheet) throw new Error("Timesheet not found");
        return await timesheet.update(timesheetData);
    }

    public async getTimesheetsByUser(userId: number): Promise<ITimeSheet[]> {
        return await Timesheet.findAll({ where: { userId } });
    }

    public async getTimesheetsByProject(projectId: number): Promise<ITimeSheet[]> {
        return await Timesheet.findAll({ where: { projectId } });
    }

    public async getAllTimesheets(): Promise<ITimeSheet[]> {
        return await Timesheet.findAll();
    }

    public async deleteTimesheet(id: number): Promise<void> {
        const timesheet = await Timesheet.findByPk(id);
        if (timesheet) {
            await timesheet.destroy();
        } else {
            throw new Error("Timesheet not found");
        }
    }
}
