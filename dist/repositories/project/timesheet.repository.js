"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimesheetRepository", {
    enumerable: true,
    get: function() {
        return TimesheetRepository;
    }
});
const _typedi = require("typedi");
const _timesheetmodel = require("../../models/project/timesheet.model");
const _sequelize = require("sequelize");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TimesheetRepository = class TimesheetRepository {
    async createTimesheet(timesheetData) {
        const timesheet = await _timesheetmodel.Timesheet.create(timesheetData);
        return timesheet.get({
            plain: true
        });
    }
    async updateTimesheet(timesheetData) {
        const timesheet = await _timesheetmodel.Timesheet.findByPk(timesheetData.id);
        if (!timesheet) throw new Error("Timesheet not found");
        await timesheet.update(timesheetData);
        return timesheet.get({
            plain: true
        });
    }
    async getTimesheetsByUser(userId) {
        return await _timesheetmodel.Timesheet.findAll({
            where: {
                userId
            },
            raw: true,
            order: [
                [
                    'date',
                    'DESC'
                ]
            ]
        });
    }
    async getTimesheetsByProject(projectId) {
        return await _timesheetmodel.Timesheet.findAll({
            where: {
                projectId
            },
            raw: true,
            order: [
                [
                    'date',
                    'DESC'
                ]
            ]
        });
    }
    async getAllTimesheets() {
        return await _timesheetmodel.Timesheet.findAll({
            raw: true,
            order: [
                [
                    'date',
                    'DESC'
                ]
            ]
        });
    }
    async deleteTimesheet(id) {
        const timesheet = await _timesheetmodel.Timesheet.findByPk(id);
        if (!timesheet) throw new Error("Timesheet not found");
        await timesheet.destroy();
    }
    async getTimesheetById(id) {
        return await _timesheetmodel.Timesheet.findByPk(id, {
            raw: true
        });
    }
    async getTimesheetsByDateRange(startDate, endDate) {
        return await _timesheetmodel.Timesheet.findAll({
            where: {
                date: {
                    [_sequelize.Op.between]: [
                        startDate,
                        endDate
                    ]
                }
            },
            raw: true,
            order: [
                [
                    'date',
                    'ASC'
                ]
            ]
        });
    }
    async getTimesheetsByUserAndProject(userId, projectId) {
        return await _timesheetmodel.Timesheet.findAll({
            where: {
                userId,
                projectId
            },
            raw: true,
            order: [
                [
                    'date',
                    'DESC'
                ]
            ]
        });
    }
    async getTotalHoursByUser(userId) {
        const result = await _timesheetmodel.Timesheet.findOne({
            where: {
                userId
            },
            attributes: [
                [
                    _sequelize.Sequelize.fn('SUM', _sequelize.Sequelize.col('hours')),
                    'totalHours'
                ]
            ],
            raw: true
        });
        return (result === null || result === void 0 ? void 0 : result.hours) || 0;
    }
    async getTimesheetSummary(userId, startDate, endDate) {
        return await _timesheetmodel.Timesheet.findAll({
            where: {
                userId,
                date: {
                    [_sequelize.Op.between]: [
                        startDate,
                        endDate
                    ]
                }
            },
            attributes: [
                'projectId',
                [
                    _sequelize.Sequelize.fn('SUM', _sequelize.Sequelize.col('hours')),
                    'totalHours'
                ]
            ],
            group: [
                'projectId'
            ],
            raw: true
        });
    }
    async approveTimesheet(id) {
        const timesheet = await _timesheetmodel.Timesheet.findByPk(id);
        if (!timesheet) throw new Error("Timesheet not found");
        await timesheet.update({
            status: 'approved'
        });
        return timesheet.get({
            plain: true
        });
    }
    async rejectTimesheet(id) {
        const timesheet = await _timesheetmodel.Timesheet.findByPk(id);
        if (!timesheet) throw new Error("Timesheet not found");
        await timesheet.update({
            status: 'rejected'
        });
        return timesheet.get({
            plain: true
        });
    }
};
TimesheetRepository = _ts_decorate([
    (0, _typedi.Service)()
], TimesheetRepository);

//# sourceMappingURL=timesheet.repository.js.map