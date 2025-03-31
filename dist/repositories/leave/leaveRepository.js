"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LeaveRepository", {
    enumerable: true,
    get: function() {
        return LeaveRepository;
    }
});
const _typedi = require("typedi");
const _HttpException = require("../../exceptions/HttpException");
const _leavetypes = require("../../types/leave.types");
const _leavemodel = /*#__PURE__*/ _interop_require_default(require("../../models/leave/leave.model"));
const _employeemodel = /*#__PURE__*/ _interop_require_default(require("../../models/employee/employee.model"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let LeaveRepository = class LeaveRepository {
    async createLeave(leaveData) {
        try {
            const leave = await _leavemodel.default.create(leaveData);
            return leave.get({
                plain: true
            });
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error creating leave: ${error.message}`);
        }
    }
    async updateLeave(leaveData) {
        try {
            const leave = await _leavemodel.default.findByPk(leaveData.id, {
                raw: true
            });
            if (!leave) throw new _HttpException.HttpException(404, "Leave not found");
            const [affectedCount] = await _leavemodel.default.update(leaveData, {
                where: {
                    id: leaveData.id
                },
                returning: true
            });
            if (affectedCount === 0) throw new _HttpException.HttpException(404, "Leave not found");
            return this.getLeave(leaveData.id);
        } catch (error) {
            if (error instanceof _HttpException.HttpException) throw error;
            throw new _HttpException.HttpException(500, `Error updating leave: ${error.message}`);
        }
    }
    async approveLeave(leaveId) {
        try {
            const leave = await _leavemodel.default.findByPk(leaveId);
            if (!leave) throw new _HttpException.HttpException(404, "Leave not found");
            if (leave.status !== _leavetypes.LeaveStatus.PENDING) {
                throw new _HttpException.HttpException(400, "Leave request has already been processed");
            }
            await leave.update({
                status: _leavetypes.LeaveStatus.APPROVED
            });
        } catch (error) {
            if (error instanceof _HttpException.HttpException) throw error;
            throw new _HttpException.HttpException(500, `Error approving leave: ${error.message}`);
        }
    }
    async rejectLeave(leaveId) {
        try {
            const leave = await _leavemodel.default.findByPk(leaveId);
            if (!leave) throw new _HttpException.HttpException(404, "Leave not found");
            if (leave.status !== _leavetypes.LeaveStatus.PENDING) {
                throw new _HttpException.HttpException(400, "Leave request has already been processed");
            }
            await leave.update({
                status: _leavetypes.LeaveStatus.REJECTED
            });
        } catch (error) {
            if (error instanceof _HttpException.HttpException) throw error;
            throw new _HttpException.HttpException(500, `Error rejecting leave: ${error.message}`);
        }
    }
    async getAllLeaves() {
        try {
            const leaves = await _leavemodel.default.findAll({
                include: [
                    {
                        model: _employeemodel.default,
                        as: 'employee',
                        attributes: [
                            'id',
                            'fullName',
                            'email'
                        ]
                    }
                ],
                order: [
                    [
                        'createdAt',
                        'DESC'
                    ]
                ],
                raw: true,
                nest: true
            });
            return leaves;
        } catch (error) {
            throw new _HttpException.HttpException(500, `Error fetching leaves: ${error.message}`);
        }
    }
    async getLeave(leaveId) {
        try {
            const leave = await _leavemodel.default.findByPk(leaveId, {
                include: [
                    {
                        model: _employeemodel.default,
                        as: 'employee',
                        attributes: [
                            'id',
                            'fullName',
                            'email'
                        ]
                    }
                ],
                raw: true,
                nest: true
            });
            if (!leave) throw new _HttpException.HttpException(404, "Leave not found");
            return leave;
        } catch (error) {
            if (error instanceof _HttpException.HttpException) throw error;
            throw new _HttpException.HttpException(500, `Error fetching leave: ${error.message}`);
        }
    }
    async getLeaveByEmployeeId(userId, leaveId) {
        try {
            const leave = await _leavemodel.default.findOne({
                where: {
                    id: leaveId,
                    employeeId: userId
                },
                include: [
                    {
                        model: _employeemodel.default,
                        as: 'employee',
                        attributes: [
                            'id',
                            'fullName',
                            'email'
                        ]
                    }
                ],
                raw: true,
                nest: true
            });
            if (!leave) throw new _HttpException.HttpException(404, "Leave not found for this user");
            return leave;
        } catch (error) {
            if (error instanceof _HttpException.HttpException) throw error;
            throw new _HttpException.HttpException(500, `Error fetching user leave: ${error.message}`);
        }
    }
    async deleteLeave(leaveId) {
        try {
            const affectedCount = await _leavemodel.default.destroy({
                where: {
                    id: leaveId
                }
            });
            if (affectedCount === 0) throw new _HttpException.HttpException(404, "Leave not found");
        } catch (error) {
            if (error instanceof _HttpException.HttpException) throw error;
            throw new _HttpException.HttpException(500, `Error deleting leave: ${error.message}`);
        }
    }
};
LeaveRepository = _ts_decorate([
    (0, _typedi.Service)()
], LeaveRepository);

//# sourceMappingURL=leaveRepository.js.map