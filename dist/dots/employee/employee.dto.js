"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateEmployeeDto", {
    enumerable: true,
    get: function() {
        return CreateEmployeeDto;
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
let CreateEmployeeDto = class CreateEmployeeDto {
    constructor(){
        _define_property(this, "fullName", void 0);
        _define_property(this, "email", void 0);
        _define_property(this, "phoneNumber", void 0);
        _define_property(this, "idNumber", void 0);
        _define_property(this, "position", void 0);
        _define_property(this, "role", void 0);
        _define_property(this, "gender", void 0);
        _define_property(this, "race", void 0);
        _define_property(this, "location", void 0);
        _define_property(this, "password", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateEmployeeDto.prototype, "fullName", void 0);
_ts_decorate([
    (0, _classvalidator.IsEmail)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateEmployeeDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsPhoneNumber)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateEmployeeDto.prototype, "phoneNumber", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateEmployeeDto.prototype, "idNumber", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateEmployeeDto.prototype, "position", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)([
        'admin',
        'manager',
        'employee'
    ]),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateEmployeeDto.prototype, "role", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)([
        'male',
        'female',
        'other'
    ]),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateEmployeeDto.prototype, "gender", void 0);
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], CreateEmployeeDto.prototype, "race", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateEmployeeDto.prototype, "location", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateEmployeeDto.prototype, "password", void 0);

//# sourceMappingURL=employee.dto.js.map