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
    logger: function() {
        return logger;
    },
    stream: function() {
        return stream;
    }
});
const _fs = require("fs");
const _path = require("path");
const _winston = /*#__PURE__*/ _interop_require_default(require("winston"));
const _winstondailyrotatefile = /*#__PURE__*/ _interop_require_default(require("winston-daily-rotate-file"));
const _index = require("../config/index");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const isLambda = process.env.IS_LAMBDA === 'true';
const logger = _winston.default.createLogger({
    format: _winston.default.format.combine(_winston.default.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), _winston.default.format.printf(({ timestamp, level, message })=>`${timestamp} ${level}: ${message}`)),
    transports: [
        new _winston.default.transports.Console({
            format: _winston.default.format.combine(_winston.default.format.splat(), _winston.default.format.colorize())
        })
    ]
});
if (!isLambda) {
    const logDir = (0, _path.join)(__dirname, _index.LOG_DIR !== null && _index.LOG_DIR !== void 0 ? _index.LOG_DIR : "../logs");
    if (!(0, _fs.existsSync)(logDir)) {
        (0, _fs.mkdirSync)(logDir, {
            recursive: true
        });
    }
    logger.add(new _winstondailyrotatefile.default({
        level: 'debug',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + '/debug',
        filename: `%DATE%.log`,
        maxFiles: 30,
        json: false,
        zippedArchive: true
    }));
    logger.add(new _winstondailyrotatefile.default({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + '/error',
        filename: `%DATE%.log`,
        maxFiles: 30,
        handleExceptions: true,
        json: false,
        zippedArchive: true
    }));
}
const stream = {
    write: (message)=>{
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    }
};

//# sourceMappingURL=logger.js.map