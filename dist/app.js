"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "App", {
    enumerable: true,
    get: function() {
        return App;
    }
});
require("reflect-metadata");
const _cookieparser = /*#__PURE__*/ _interop_require_default(require("cookie-parser"));
const _cors = /*#__PURE__*/ _interop_require_default(require("cors"));
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
const _helmet = /*#__PURE__*/ _interop_require_default(require("helmet"));
const _hpp = /*#__PURE__*/ _interop_require_default(require("hpp"));
const _morgan = /*#__PURE__*/ _interop_require_default(require("morgan"));
const _config = require("./config");
const _database = /*#__PURE__*/ _interop_require_default(require("./database"));
const _ErrorMiddleware = require("./middlewares/ErrorMiddleware");
const _logger = require("./utils/logger");
const _typedi = /*#__PURE__*/ _interop_require_default(require("typedi"));
const _IAuthServiceinterface = require("./interfaces/auth/IAuthService.interface");
const _authservice = require("./services/auth/auth.service");
const _authrepository = require("./repositories/auth/auth.repository");
const _IProjectService = require("./interfaces/project/IProjectService");
const _projectrepository = require("./repositories/project/project.repository");
const _projectservice = require("./services/project/project.service");
const _ITimeSheetServiceinterface = require("./interfaces/timesheet/ITimeSheetService.interface");
const _timesheetservice = require("./services/project/timesheet.service");
const _timesheetrepository = require("./repositories/project/timesheet.repository");
const _IEmployeeService = require("./interfaces/employee/IEmployeeService");
const _employeeservice = require("./services/employee/employee.service");
const _employeerepository = require("./repositories/employee/employee.repository");
const _ILeaveServiceinterface = require("./interfaces/leave/ILeaveService.interface");
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
let App = class App {
    listen() {
        this.app.listen(this.port, ()=>{
            _logger.logger.info(`=================================`);
            _logger.logger.info(`======= ENV: ${this.env} =======`);
            _logger.logger.info(`🚀 Identity Service listening on port ${this.port}`);
            _logger.logger.info(`=================================`);
        });
    }
    getServer() {
        return this.app;
    }
    async connectToDatabase() {
        try {
            await _database.default.authenticate();
            _logger.logger.info("Database connection established successfully.");
            console.log("Database connection established successfully.");
            await _database.default.sync({
                force: false
            });
            _logger.logger.info("Database tables synced successfully.");
        } catch (error) {
            _logger.logger.error("Unable to connect to the database:", error);
            process.exit(1);
        }
    }
    initializeMiddlewares() {
        this.app.use((0, _morgan.default)(_config.LOG_FORMAT, {
            stream: _logger.stream
        }));
        this.app.use((0, _hpp.default)());
        this.app.use((0, _helmet.default)());
        this.app.use(_helmet.default.crossOriginResourcePolicy({
            policy: "cross-origin"
        }));
        this.app.use((0, _cors.default)(this.corsOptions));
        this.app.use(_express.default.json());
        this.app.use(_express.default.urlencoded({
            extended: true
        }));
        this.app.use((0, _cookieparser.default)());
    }
    initializeInterfaces() {
        _typedi.default.set(_IAuthServiceinterface.AUTH_SERVICE_TOKEN, new _authservice.AuthService(_typedi.default.get(_authrepository.AuthRepository)));
        _typedi.default.set(_IProjectService.PROJECT_SERVICE_TOKEN, new _projectservice.ProjectService(_typedi.default.get(_projectrepository.ProjectRepository)));
        _typedi.default.set(_ITimeSheetServiceinterface.TIMESHEET_SERVICE_TOKEN, new _timesheetservice.TimesheetService(_typedi.default.get(_timesheetrepository.TimesheetRepository)));
        _typedi.default.set(_IEmployeeService.EMPLOYEE_SERVICE_TOKEN, new _employeeservice.EmployeeService(_typedi.default.get(_employeerepository.EmployeeRepository)));
        _typedi.default.set(_ILeaveServiceinterface.LEAVE_SERVICE_TOKEN, new _employeeservice.EmployeeService(_typedi.default.get(_employeerepository.EmployeeRepository)));
    }
    initializeRoutes(routes) {
        routes.forEach((route)=>{
            this.app.use("/api", route.router);
        });
    }
    initializeErrorHandling() {
        this.app.use(_ErrorMiddleware.ErrorMiddleware);
    }
    constructor(routes){
        _define_property(this, "app", void 0);
        _define_property(this, "env", void 0);
        _define_property(this, "port", void 0);
        _define_property(this, "corsOptions", {
            origin: "*",
            methods: [
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
            ],
            allowedHeaders: [
                "X-Requested-With",
                "Content-Type",
                "Authorization"
            ],
            credentials: true
        });
        this.app = (0, _express.default)();
        this.env = _config.NODE_ENV || "development";
        this.port = _config.PORT || 3001;
        this.initializeInterfaces();
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }
};

//# sourceMappingURL=app.js.map