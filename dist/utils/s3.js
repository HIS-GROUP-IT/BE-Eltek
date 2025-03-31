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
    deleteFileFromS3: function() {
        return deleteFileFromS3;
    },
    uploadFileToS3: function() {
        return uploadFileToS3;
    }
});
const _clients3 = require("@aws-sdk/client-s3");
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _HttpException = require("../exceptions/HttpException");
const _config = require("../config");
const _logger = require("./logger");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const s3 = new _clients3.S3Client({
    region: _config.AWS_REGION,
    credentials: {
        accessKeyId: _config.AWS_ACCESS_KEY_ID,
        secretAccessKey: _config.AWS_SECRET_ACCESS_KEY
    }
});
const uploadFileToS3 = async (filePath, fileName, mimeType)=>{
    try {
        const fileStream = _fs.default.createReadStream(filePath);
        const uploadParams = {
            Bucket: _config.AWS_S3_BUCKET_NAME,
            Key: `leaves/${fileName}`,
            Body: fileStream,
            ContentType: mimeType
        };
        const uploadCommand = new _clients3.PutObjectCommand(uploadParams);
        await s3.send(uploadCommand);
        _fs.default.unlinkSync(filePath);
        return `https://${_config.AWS_S3_BUCKET_NAME}.s3.${_config.AWS_REGION}.amazonaws.com/uploads/${fileName}`;
    } catch (error) {
        throw new _HttpException.HttpException(500, "Error uploading file to S3");
    }
};
const deleteFileFromS3 = async (fileName)=>{
    try {
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        const objectKey = `${fileName}`;
        const { Versions } = await s3.send(new _clients3.ListObjectVersionsCommand({
            Bucket: bucketName,
            Prefix: objectKey
        }));
        if (!Versions || Versions.length === 0) {
            _logger.logger.info("No versions found, skipping deletion.");
            return;
        }
        for (const version of Versions){
            const deleteParams = {
                Bucket: bucketName,
                Key: objectKey,
                VersionId: version.VersionId
            };
            await s3.send(new _clients3.DeleteObjectCommand(deleteParams));
        }
        _logger.logger.info(`Deleted all versions of ${fileName}`);
    } catch (error) {
        console.error("Error deleting file from S3:", error);
    }
};

//# sourceMappingURL=s3.js.map