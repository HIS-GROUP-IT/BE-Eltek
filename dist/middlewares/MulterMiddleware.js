"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _multer = /*#__PURE__*/ _interop_require_default(require("multer"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _HttpException = require("../exceptions/HttpException");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const uploadDir = "uploads/";
if (!_fs.default.existsSync(uploadDir)) {
    _fs.default.mkdirSync(uploadDir, {
        recursive: true
    });
}
const storage = _multer.default.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueName = `${file.fieldname}-${Date.now()}${_path.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const fileFilter = (req, file, cb)=>{
    if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
        cb(null, true);
    } else {
        cb(new _HttpException.HttpException(400, "Invalid file type. Please upload an image or video."));
    }
};
const upload = (0, _multer.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
}).array("files", 10);
const multerMiddleware = (req, res, next)=>{
    upload(req, res, (error)=>{
        if (error instanceof _multer.default.MulterError) {
            return next(new _HttpException.HttpException(400, error.message));
        } else if (error) {
            return next(new _HttpException.HttpException(400, "Error uploading files."));
        }
        if (!req.files || req.files.length === 0) {
            return next(new _HttpException.HttpException(400, "No files uploaded"));
        }
        next();
    });
};
const _default = multerMiddleware;

//# sourceMappingURL=MulterMiddleware.js.map