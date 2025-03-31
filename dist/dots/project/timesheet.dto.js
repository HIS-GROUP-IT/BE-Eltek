"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimesheetDTO", {
    enumerable: true,
    get: function() {
        return TimesheetDTO;
    }
});
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
let TimesheetDTO = class TimesheetDTO {
    constructor(){
        _define_property(this, "id", void 0);
        _define_property(this, "userId", void 0);
        _define_property(this, "projectName", void 0);
        _define_property(this, "projectId", void 0);
        _define_property(this, "description", void 0);
        _define_property(this, "hours", void 0);
        _define_property(this, "status", void 0);
        _define_property(this, "date", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsInt)(),
    _ts_metadata("design:type", Number)
], TimesheetDTO.prototype, "id", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], TimesheetDTO.prototype, "userId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], TimesheetDTO.prototype, "projectName", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], TimesheetDTO.prototype, "projectId", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], TimesheetDTO.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Number)
], TimesheetDTO.prototype, "hours", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], TimesheetDTO.prototype, "status", void 0);
_ts_decorate([
    (0, _classvalidator.IsDate)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], TimesheetDTO.prototype, "date", void 0);

//# sourceMappingURL=timesheet.dto.js.map