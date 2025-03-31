"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimesheetController", {
    enumerable: true,
    get: function() {
        return TimesheetController;
    }
});
const _typedi = require("typedi");
const _ITimeSheetServiceinterface = require("../../interfaces/timesheet/ITimeSheetService.interface");
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
let TimesheetController = class TimesheetController {
    constructor(){
        _define_property(this, "timesheetService", void 0);
        _define_property(this, "createTimesheet", async (req, res, next)=>{
            try {
                const timesheetData = req.body;
                const createdTimesheet = await this.timesheetService.createTimesheet(timesheetData);
                const response = {
                    data: createdTimesheet,
                    message: "Timesheet created successfully",
                    error: false
                };
                res.status(201).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "updateTimesheet", async (req, res, next)=>{
            try {
                const timesheetData = req.body;
                const updatedTimesheet = await this.timesheetService.updateTimesheet(timesheetData);
                const response = {
                    data: updatedTimesheet,
                    message: "Timesheet updated successfully",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getTimesheetsByUser", async (req, res, next)=>{
            try {
                const user = req.user;
                const timesheets = await this.timesheetService.getTimesheetsByUser(+user);
                const response = {
                    data: timesheets,
                    message: "Timesheets fetched successfully",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getTimesheetsByProject", async (req, res, next)=>{
            try {
                const { projectId } = req.params;
                const timesheets = await this.timesheetService.getTimesheetsByProject(+projectId);
                const response = {
                    data: timesheets,
                    message: "Timesheets fetched successfully",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getAllTimesheets", async (req, res, next)=>{
            try {
                const timesheets = await this.timesheetService.getAllTimesheets();
                const response = {
                    data: timesheets,
                    message: "All timesheets fetched successfully",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "deleteTimesheet", async (req, res, next)=>{
            try {
                const timesheetId = req.params.timesheetId;
                await this.timesheetService.deleteTimesheet(+timesheetId);
                const response = {
                    data: null,
                    message: "Timesheet deleted successfully",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getTimesheetById", async (req, res, next)=>{
            try {
                const id = req.params.id;
                const timesheet = await this.timesheetService.getTimesheetById(+id);
                const response = {
                    data: timesheet,
                    message: "Timesheet fetched successfully",
                    error: false
                };
                res.status(timesheet ? 200 : 404).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getTimesheetsByDateRange", async (req, res, next)=>{
            try {
                const { startDate, endDate } = req.query;
                const timesheets = await this.timesheetService.getTimesheetsByDateRange(new Date(startDate), new Date(endDate));
                const response = {
                    data: timesheets,
                    message: "Timesheets fetched successfully",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getTimesheetsByUserAndProject", async (req, res, next)=>{
            try {
                const { userId, projectId } = req.params;
                const timesheets = await this.timesheetService.getTimesheetsByUserAndProject(+userId, +projectId);
                const response = {
                    data: timesheets,
                    message: "Timesheets fetched successfully",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getTotalHoursByUser", async (req, res, next)=>{
            try {
                const userId = req.params.userId;
                const totalHours = await this.timesheetService.getTotalHoursByUser(+userId);
                const response = {
                    data: totalHours,
                    message: "Total hours calculated",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "getTimesheetSummary", async (req, res, next)=>{
            try {
                const user = req.user.id;
                const { startDate, endDate } = req.query;
                const summary = await this.timesheetService.getTimesheetSummary(+user, new Date(startDate), new Date(endDate));
                const response = {
                    data: summary,
                    message: "Timesheet summary generated",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "approveTimesheet", async (req, res, next)=>{
            try {
                const id = req.params.id;
                const approvedTimesheet = await this.timesheetService.approveTimesheet(+id);
                const response = {
                    data: approvedTimesheet,
                    message: "Timesheet approved",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        _define_property(this, "rejectTimesheet", async (req, res, next)=>{
            try {
                const id = req.params.id;
                const rejectedTimesheet = await this.timesheetService.rejectTimesheet(+id);
                const response = {
                    data: rejectedTimesheet,
                    message: "Timesheet rejected",
                    error: false
                };
                res.status(200).json(response);
            } catch (error) {
                next(error);
            }
        });
        this.timesheetService = _typedi.Container.get(_ITimeSheetServiceinterface.TIMESHEET_SERVICE_TOKEN);
    }
};

//# sourceMappingURL=timesheet.controller.js.map