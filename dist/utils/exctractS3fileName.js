"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractS3FilePath", {
    enumerable: true,
    get: function() {
        return extractS3FilePath;
    }
});
const extractS3FilePath = (s3Url)=>{
    try {
        const url = new URL(s3Url);
        return url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
    } catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
};

//# sourceMappingURL=exctractS3fileName.js.map