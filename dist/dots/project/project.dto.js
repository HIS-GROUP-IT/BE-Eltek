"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    CreateProjectDto: function() {
        return CreateProjectDto;
    },
    UpdateProjectDto: function() {
        return UpdateProjectDto;
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
let CreateProjectDto = class CreateProjectDto {
    constructor(){
        _define_property(this, "name", void 0);
        _define_property(this, "description", void 0);
        _define_property(this, "status", void 0);
        _define_property(this, "startDate", void 0);
        _define_property(this, "endDate", void 0);
        _define_property(this, "createdBy", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateProjectDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)([
        'planned',
        'on going',
        'cancelled',
        'completed',
        'on hold'
    ]),
    _ts_metadata("design:type", String)
], CreateProjectDto.prototype, "status", void 0);
_ts_decorate([
    (0, _classvalidator.IsDateString)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CreateProjectDto.prototype, "startDate", void 0);
_ts_decorate([
    (0, _classvalidator.IsDateString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], CreateProjectDto.prototype, "endDate", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    _ts_metadata("design:type", Number)
], CreateProjectDto.prototype, "createdBy", void 0);
let UpdateProjectDto = class UpdateProjectDto {
    constructor(){
        _define_property(this, "name", void 0);
        _define_property(this, "description", void 0);
        _define_property(this, "status", void 0);
        _define_property(this, "startDate", void 0);
        _define_property(this, "endDate", void 0);
        _define_property(this, "createdBy", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateProjectDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateProjectDto.prototype, "description", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)([
        'planned',
        'on going',
        'cancelled',
        'completed',
        'on hold'
    ]),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateProjectDto.prototype, "status", void 0);
_ts_decorate([
    (0, _classvalidator.IsDateString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UpdateProjectDto.prototype, "startDate", void 0);
_ts_decorate([
    (0, _classvalidator.IsDateString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof Date === "undefined" ? Object : Date)
], UpdateProjectDto.prototype, "endDate", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UpdateProjectDto.prototype, "createdBy", void 0);

//# sourceMappingURL=project.dto.js.map