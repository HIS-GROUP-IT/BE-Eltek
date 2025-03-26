import { Service } from "typedi";
import { ITimeSheet } from "@/types/timesheet.type";
import { ITimeSheetRepository } from "@/interfaces/timesheet/ITimeSheetRepository.interface";
import { Timesheet } from "@/models/project/timesheet.model";

@Service()
export class TimesheetRepository implements ITimeSheetRepository {
    public async createTimesheet(timesheetData: Partial<ITimeSheet>): Promise<ITimeSheet> {
        const timesheet = await Timesheet.create(timesheetData);
        return timesheet.get({ plain: true });
    }

    public async updateTimesheet(id: number, timesheetData: Partial<ITimeSheet>): Promise<ITimeSheet> {
        const timesheet = await Timesheet.findByPk(id);
        if (!timesheet) throw new Error("Timesheet not found");
        await timesheet.update(timesheetData);
        return timesheet.get({ plain: true });
    }

    public async getTimesheetsByUser(userId: number): Promise<ITimeSheet[]> {
        return await Timesheet.findAll({ 
            where: { userId },
            raw: true,
            order: [['date', 'DESC']]
        });
    }

    public async getTimesheetsByProject(projectId: number): Promise<ITimeSheet[]> {
        return await Timesheet.findAll({ 
            where: { projectId },
            raw: true,
            order: [['date', 'DESC']]
        });
    }

    public async getAllTimesheets(): Promise<ITimeSheet[]> {
        return await Timesheet.findAll({
            raw: true,
            order: [['date', 'DESC']]
        });
    }

    public async deleteTimesheet(id: number): Promise<void> {
        const timesheet = await Timesheet.findByPk(id);
        if (!timesheet) throw new Error("Timesheet not found");
        await timesheet.destroy();
    }

    public async getTimesheetById(id: number): Promise<ITimeSheet | null> {
        return await Timesheet.findByPk(id, { raw: true });
    }

    // public async getTimesheetsByDateRange(startDate: Date, endDate: Date): Promise<ITimeSheet[]> {
    //     return await Timesheet.findAll({
    //         where: {
    //             date: {
    //                 [Op.between]: [startDate, endDate]
    //             }
    //         },
    //         raw: true,
    //         order: [['date', 'ASC']]
    //     });
    // }

    // public async getTimesheetsByUserAndProject(userId: number, projectId: number): Promise<ITimeSheet[]> {
    //     return await Timesheet.findAll({
    //         where: { userId, projectId },
    //         raw: true,
    //         order: [['date', 'DESC']]
    //     });
    // }

    // public async getTotalHoursByUser(userId: number): Promise<number> {
    //     const result = await Timesheet.findOne({
    //         where: { userId },
    //         attributes: [
    //             [Sequelize.fn('SUM', Sequelize.col('hours')), 'totalHours']
    //         ],
    //         raw: true
    //     });
    //     return result?.totalHours || 0;
    // }

    // public async getTimesheetSummary(userId: number, startDate: Date, endDate: Date): Promise<{projectId: number, totalHours: number}[]> {
    //     return await Timesheet.findAll({
    //         where: {
    //             userId,
    //             date: {
    //                 [Op.between]: [startDate, endDate]
    //             }
    //         },
    //         attributes: [
    //             'projectId',
    //             [Sequelize.fn('SUM', Sequelize.col('hours')), 'totalHours']
    //         ],
    //         group: ['projectId'],
    //         raw: true
    //     }) as unknown as {projectId: number, totalHours: number}[];
    // }

    // public async approveTimesheet(id: number): Promise<ITimeSheet> {
    //     const timesheet = await Timesheet.findByPk(id);
    //     if (!timesheet) throw new Error("Timesheet not found");
    //     await timesheet.update({ status: 'approved' });
    //     return timesheet.get({ plain: true });
    // }

    // public async rejectTimesheet(id: number): Promise<ITimeSheet> {
    //     const timesheet = await Timesheet.findByPk(id);
    //     if (!timesheet) throw new Error("Timesheet not found");
    //     await timesheet.update({ status: 'rejected' });
    //     return timesheet.get({ plain: true });
    // }
}