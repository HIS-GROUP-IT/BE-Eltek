"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LeaveDTO", {
    enumerable: true,
    get: function() {
        return LeaveDTO;
    }
});
const _leavetypes = require("../../types/leave.types");
const _classvalidator = require("class-validator");
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
let LeaveDTO = class LeaveDTO {
    constructor(){
        _define_property(this, "id", void 0);
        _define_property(this, "leaveType", void 0);
        _define_property(this, "duration", void 0);
        _define_property(this, "startDate", void 0);
        _define_property(this, "endDate", void 0);
        _define_property(this, "reason", void 0);
        _define_property(this, "documents", void 0);
        _define_property(this, "status", void 0);
        _define_property(this, "employeeId", void 0);
        _define_property(this, "createdAt", void 0);
        _define_property(this, "updatedAt", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsInt)(),
    _ts_metadata("design:type", Number)
], LeaveDTO.prototype, "id", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_leavetypes.LeaveType),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof _leavetypes.LeaveType === "undefined" ? Object : _leavetypes.LeaveType)
], LeaveDTO.prototype, "leaveType", void 0);
_ts_decorate([
    (0, _classvalidator.IsDecimal)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], LeaveDTO.prototype, "duration", void 0);
_ts_decorate([
    (0, _classvalidator.IsDateString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], LeaveDTO.prototype, "startDate", void 0);
_ts_decorate([
    (0, _classvalidator.IsDateString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], LeaveDTO.prototype, "endDate", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], LeaveDTO.prototype, "reason", void 0);
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)({
        each: true
    }),
    _ts_metadata("design:type", Array)
], LeaveDTO.prototype, "documents", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_leavetypes.LeaveStatus),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof _leavetypes.LeaveStatus === "undefined" ? Object : _leavetypes.LeaveStatus)
], LeaveDTO.prototype, "status", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], LeaveDTO.prototype, "employeeId", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsDateString)(),
    _ts_metadata("design:type", String)
], LeaveDTO.prototype, "createdAt", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsDateString)(),
    _ts_metadata("design:type", String)
], LeaveDTO.prototype, "updatedAt", void 0);

//# sourceMappingURL=leave.dto.js.map