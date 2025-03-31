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
    LeaveStatus: function() {
        return LeaveStatus;
    },
    LeaveType: function() {
        return LeaveType;
    }
});
var LeaveType = /*#__PURE__*/ function(LeaveType) {
    LeaveType["VACATION"] = "annual";
    LeaveType["SICK"] = "sick";
    LeaveType["PERSONAL"] = "personal";
    LeaveType["MATERNITY"] = "maternity";
    LeaveType["PATERNITY"] = "paternity";
    LeaveType["BEREAVEMENT"] = "bereavement";
    LeaveType["OTHER"] = "other";
    return LeaveType;
}({});
var LeaveStatus = /*#__PURE__*/ function(LeaveStatus) {
    LeaveStatus["PENDING"] = "pending";
    LeaveStatus["APPROVED"] = "approved";
    LeaveStatus["REJECTED"] = "rejected";
    return LeaveStatus;
}({});

//# sourceMappingURL=leave.types.js.map