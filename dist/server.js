"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "handler", {
    enumerable: true,
    get: function() {
        return handler;
    }
});
const _serverlesshttp = /*#__PURE__*/ _interop_require_default(require("serverless-http"));
const _app = require("./app");
const _authroute = require("./routes/auth/auth.route");
const _projectroutes = require("./routes/project/project.routes");
const _timesheetroutes = require("./routes/project/timesheet.routes");
const _validateEnv = require("./utils/validateEnv");
const _employeeroutes = require("./routes/employee/employee.routes");
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
(0, _validateEnv.ValidateEnv)();
const app = new _app.App([
    new _authroute.AuthRoute(),
    new _projectroutes.ProjectRoute(),
    new _employeeroutes.EmployeeRoute(),
    new _timesheetroutes.TimesheetRoute()
]);
const serverlessApp = (0, _serverlesshttp.default)(app.getServer());
app.listen();
const CORS_HEADERS = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Content-Encoding": "identity"
};
const handler = async (event, context)=>{
    try {
        var _response_headers, _response_headers1;
        if (event.httpMethod === "OPTIONS") {
            return {
                statusCode: 204,
                headers: CORS_HEADERS,
                body: "",
                isBase64Encoded: false
            };
        }
        const response = await serverlessApp(event, context);
        const isCompressed = ((_response_headers = response.headers) === null || _response_headers === void 0 ? void 0 : _response_headers['x-compressed']) === 'true';
        const shouldEncodeAsBase64 = isCompressed;
        return {
            statusCode: response.statusCode || 200,
            headers: _object_spread({}, CORS_HEADERS, response.headers, isCompressed ? {
                'Content-Encoding': 'gzip'
            } : {}, ((_response_headers1 = response.headers) === null || _response_headers1 === void 0 ? void 0 : _response_headers1['x-compressed']) ? {} : {}),
            body: shouldEncodeAsBase64 ? Buffer.from(response.body, 'binary').toString('base64') : response.body,
            isBase64Encoded: shouldEncodeAsBase64
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: _object_spread_props(_object_spread({}, CORS_HEADERS), {
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({
                message: "Internal Server Error"
            }),
            isBase64Encoded: false
        };
    }
};

//# sourceMappingURL=server.js.map