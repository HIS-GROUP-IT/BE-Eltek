"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimesheetRoute", {
    enumerable: true,
    get: function() {
        return TimesheetRoute;
    }
});
const _timesheetcontroller = require("../../controllers/project/timesheet.controller");
const _timesheetdto = require("../../dots/project/timesheet.dto");
const _authorizationMiddleware = require("../../middlewares/authorizationMiddleware");
const _ValidationMiddleware = require("../../middlewares/ValidationMiddleware");
const _express = require("express");
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
let TimesheetRoute = class TimesheetRoute {
    initializeRoutes() {
        this.router.post(`${this.path}/createTimeSheet`, _authorizationMiddleware.authorizationMiddleware, (0, _ValidationMiddleware.ValidationMiddleware)(_timesheetdto.TimesheetDTO), this.timesheetController.createTimesheet);
        this.router.put(`${this.path}/updateTimeSheet`, _authorizationMiddleware.authorizationMiddleware, (0, _ValidationMiddleware.ValidationMiddleware)(_timesheetdto.TimesheetDTO), this.timesheetController.updateTimesheet);
        this.router.get(`${this.path}/getUserTimeSheet`, _authorizationMiddleware.authorizationMiddleware, this.timesheetController.getTimesheetsByUser);
        this.router.get(`${this.path}/project/:projectId`, _authorizationMiddleware.authorizationMiddleware, this.timesheetController.getTimesheetsByProject);
        this.router.get(`${this.path}`, _authorizationMiddleware.authorizationMiddleware, this.timesheetController.getAllTimesheets);
        this.router.delete(`${this.path}/:timesheetId`, _authorizationMiddleware.authorizationMiddleware, this.timesheetController.deleteTimesheet);
        this.router.get(`${this.path}/getTimesheetById/:id`, _authorizationMiddleware.authorizationMiddleware, this.timesheetController.getTimesheetById);
        this.router.get(`${this.path}/date-range`, _authorizationMiddleware.authorizationMiddleware, this.timesheetController.getTimesheetsByDateRange);
        this.router.get(`${this.path}/user/:userId/project/:projectId`, _authorizationMiddleware.authorizationMiddleware, this.timesheetController.getTimesheetsByUserAndProject);
        this.router.get(`${this.path}/user/:userId/total-hours`, _authorizationMiddleware.authorizationMiddleware, this.timesheetController.getTotalHoursByUser);
        this.router.get(`${this.path}/summary`, _authorizationMiddleware.authorizationMiddleware, this.timesheetController.getTimesheetSummary);
        this.router.patch(`${this.path}/:id/approve`, _authorizationMiddleware.authorizationMiddleware, this.timesheetController.approveTimesheet);
        this.router.patch(`${this.path}/:id/reject`, _authorizationMiddleware.authorizationMiddleware, this.timesheetController.rejectTimesheet);
    }
    constructor(){
        _define_property(this, "path", "/timesheets");
        _define_property(this, "router", (0, _express.Router)());
        _define_property(this, "timesheetController", new _timesheetcontroller.TimesheetController());
        this.initializeRoutes();
    }
};

//# sourceMappingURL=timesheet.routes.js.map