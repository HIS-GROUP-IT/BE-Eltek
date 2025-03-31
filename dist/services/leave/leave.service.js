"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LeaveService", {
    enumerable: true,
    get: function() {
        return LeaveService;
    }
});
const _typedi = require("typedi");
const _ILeaveServiceinterface = require("../../interfaces/leave/ILeaveService.interface");
const _leavetypes = require("../../types/leave.types");
const _HttpException = require("../../exceptions/HttpException");
const _leaveRepository = require("../../repositories/leave/leaveRepository");
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
let LeaveService = class LeaveService {
    async createLeave(leaveData) {
        try {
            return await this.leaveRepository.createLeave(leaveData);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error creating leave: ${error.message}`);
        }
    }
    async updateLeave(leaveData) {
        try {
            const leave = await this.leaveRepository.getLeave(leaveData.id);
            if (!leave) throw new _HttpException.HttpException(404, "Leave not found");
            return await this.leaveRepository.updateLeave(leaveData);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error updating leave: ${error.message}`);
        }
    }
    async deleteLeave(leaveId) {
        try {
            const leave = await this.leaveRepository.getLeave(leaveId);
            if (!leave) throw new _HttpException.HttpException(404, "Leave not found");
            await this.leaveRepository.deleteLeave(leaveId);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error deleting leave: ${error.message}`);
        }
    }
    async getLeaveById(leaveId) {
        try {
            const leave = await this.leaveRepository.getLeave(leaveId);
            if (!leave) throw new _HttpException.HttpException(404, "Leave not found");
            return leave;
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error retrieving leave: ${error.message}`);
        }
    }
    async getAllLeaves() {
        try {
            return await this.leaveRepository.getAllLeaves();
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error retrieving leaves: ${error.message}`);
        }
    }
    async approveLeave(leaveId) {
        try {
            const leave = await this.leaveRepository.getLeave(leaveId);
            if (!leave) throw new _HttpException.HttpException(404, "Leave not found");
            if (leave.status !== _leavetypes.LeaveStatus.PENDING) {
                throw new _HttpException.HttpException(400, "Leave request has already been processed");
            }
            await this.leaveRepository.approveLeave(leaveId);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error approving leave: ${error.message}`);
        }
    }
    async rejectLeave(leaveId) {
        try {
            const leave = await this.leaveRepository.getLeave(leaveId);
            if (!leave) throw new _HttpException.HttpException(404, "Leave not found");
            if (leave.status !== _leavetypes.LeaveStatus.PENDING) {
                throw new _HttpException.HttpException(400, "Leave request has already been processed");
            }
            await this.leaveRepository.rejectLeave(leaveId);
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error rejecting leave: ${error.message}`);
        }
    }
    async getLeave(leaveId) {
        try {
            const leave = await this.leaveRepository.getLeave(leaveId);
            if (!leave) throw new _HttpException.HttpException(404, "Leave not found");
            return leave;
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error getting leave: ${error.message}`);
        }
    }
    async getLeaveByEmployeeId(employeeId) {
        try {
            const leave = await this.leaveRepository.getLeave(employeeId);
            if (!leave) throw new _HttpException.HttpException(404, "Leave not found");
            return leave;
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error getting leave: ${error.message}`);
        }
    }
    constructor(leaveRepository){
        _define_property(this, "leaveRepository", void 0);
        this.leaveRepository = leaveRepository;
    }
};
LeaveService = _ts_decorate([
    (0, _typedi.Service)({
        id: _ILeaveServiceinterface.LEAVE_SERVICE_TOKEN,
        type: LeaveService
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _leaveRepository.LeaveRepository === "undefined" ? Object : _leaveRepository.LeaveRepository
    ])
], LeaveService);

//# sourceMappingURL=leave.service.js.map