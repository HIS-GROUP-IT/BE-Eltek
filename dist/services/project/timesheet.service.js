"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimesheetService", {
    enumerable: true,
    get: function() {
        return TimesheetService;
    }
});
const _typedi = require("typedi");
const _ITimeSheetServiceinterface = require("../../interfaces/timesheet/ITimeSheetService.interface");
const _HttpException = require("../../exceptions/HttpException");
const _timesheetrepository = require("../../repositories/project/timesheet.repository");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TimesheetService = class TimesheetService {
    async createTimesheet(timesheetData) {
        try {
            return await this.timesheetRepository.createTimesheet(timesheetData);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error creating timesheet: ${error.message}`);
        }
    }
    async updateTimesheet(timesheetData) {
        try {
            return await this.timesheetRepository.updateTimesheet(timesheetData);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error updating timesheet: ${error.message}`);
        }
    }
    async getTimesheetsByUser(userId) {
        try {
            return await this.timesheetRepository.getTimesheetsByUser(userId);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error fetching timesheets: ${error.message}`);
        }
    }
    async getTimesheetsByProject(projectId) {
        try {
            return await this.timesheetRepository.getTimesheetsByProject(projectId);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error fetching timesheets: ${error.message}`);
        }
    }
    async getAllTimesheets() {
        try {
            return await this.timesheetRepository.getAllTimesheets();
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error fetching timesheets: ${error.message}`);
        }
    }
    async deleteTimesheet(id) {
        try {
            await this.timesheetRepository.deleteTimesheet(id);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error deleting timesheet: ${error.message}`);
        }
    }
    async getTimesheetById(id) {
        try {
            return await this.timesheetRepository.getTimesheetById(id);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error fetching timesheet: ${error.message}`);
        }
    }
    async getTimesheetsByDateRange(startDate, endDate) {
        try {
            return await this.timesheetRepository.getTimesheetsByDateRange(startDate, endDate);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error fetching timesheets: ${error.message}`);
        }
    }
    async getTimesheetsByUserAndProject(userId, projectId) {
        try {
            return await this.timesheetRepository.getTimesheetsByUserAndProject(userId, projectId);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error fetching timesheets: ${error.message}`);
        }
    }
    async getTotalHoursByUser(userId) {
        try {
            return await this.timesheetRepository.getTotalHoursByUser(userId);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error calculating hours: ${error.message}`);
        }
    }
    async getTimesheetSummary(userId, startDate, endDate) {
        try {
            return await this.timesheetRepository.getTimesheetSummary(userId, startDate, endDate);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error generating summary: ${error.message}`);
        }
    }
    async approveTimesheet(id) {
        try {
            return await this.timesheetRepository.approveTimesheet(id);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error approving timesheet: ${error.message}`);
        }
    }
    async rejectTimesheet(id) {
        try {
            return await this.timesheetRepository.rejectTimesheet(id);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error rejecting timesheet: ${error.message}`);
        }
    }
    constructor(timesheetRepository){
        _define_property(this, "timesheetRepository", void 0);
        this.timesheetRepository = timesheetRepository;
    }
};
TimesheetService = _ts_decorate([
    (0, _typedi.Service)({
        id: _ITimeSheetServiceinterface.TIMESHEET_SERVICE_TOKEN,
        type: TimesheetService
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _timesheetrepository.TimesheetRepository === "undefined" ? Object : _timesheetrepository.TimesheetRepository
    ])
], TimesheetService);

//# sourceMappingURL=timesheet.service.js.map