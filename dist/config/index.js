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
    AWS_ACCESS_KEY_ID: function() {
        return AWS_ACCESS_KEY_ID;
    },
    AWS_REGION: function() {
        return AWS_REGION;
    },
    AWS_S3_BUCKET_NAME: function() {
        return AWS_S3_BUCKET_NAME;
    },
    AWS_SECRET_ACCESS_KEY: function() {
        return AWS_SECRET_ACCESS_KEY;
    },
    CREDENTIALS: function() {
        return CREDENTIALS;
    },
    DB_HOST: function() {
        return DB_HOST;
    },
    DB_NAME: function() {
        return DB_NAME;
    },
    DB_PASSWORD: function() {
        return DB_PASSWORD;
    },
    DB_USER: function() {
        return DB_USER;
    },
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL: function() {
        return FIREBASE_AUTH_PROVIDER_X509_CERT_URL;
    },
    FIREBASE_AUTH_URI: function() {
        return FIREBASE_AUTH_URI;
    },
    FIREBASE_CLIENT_EMAIL: function() {
        return FIREBASE_CLIENT_EMAIL;
    },
    FIREBASE_CLIENT_ID: function() {
        return FIREBASE_CLIENT_ID;
    },
    FIREBASE_CLIENT_X509_CERT_URL: function() {
        return FIREBASE_CLIENT_X509_CERT_URL;
    },
    FIREBASE_PRIVATE_KEY: function() {
        return FIREBASE_PRIVATE_KEY;
    },
    FIREBASE_PRIVATE_KEY_ID: function() {
        return FIREBASE_PRIVATE_KEY_ID;
    },
    FIREBASE_PROJECT_ID: function() {
        return FIREBASE_PROJECT_ID;
    },
    FIREBASE_TOKEN_URI: function() {
        return FIREBASE_TOKEN_URI;
    },
    FIREBASE_TYPE: function() {
        return FIREBASE_TYPE;
    },
    JWT_EXPIRES_IN: function() {
        return JWT_EXPIRES_IN;
    },
    LOG_DIR: function() {
        return LOG_DIR;
    },
    LOG_FORMAT: function() {
        return LOG_FORMAT;
    },
    NODE_ENV: function() {
        return NODE_ENV;
    },
    ORIGIN: function() {
        return ORIGIN;
    },
    PORT: function() {
        return PORT;
    },
    SECRET_KEY: function() {
        return SECRET_KEY;
    }
});
const _dotenv = require("dotenv");
(0, _dotenv.config)({
    path: ".env"
});
const CREDENTIALS = process.env.CREDENTIALS === "true";
const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, JWT_EXPIRES_IN } = process.env;
const { FIREBASE_AUTH_PROVIDER_X509_CERT_URL, FIREBASE_AUTH_URI, FIREBASE_CLIENT_EMAIL, FIREBASE_CLIENT_ID, FIREBASE_CLIENT_X509_CERT_URL, FIREBASE_PRIVATE_KEY, FIREBASE_PRIVATE_KEY_ID, FIREBASE_PROJECT_ID, FIREBASE_TOKEN_URI, FIREBASE_TYPE } = process.env;
const { DB_NAME, DB_HOST, DB_PASSWORD, DB_USER } = process.env;
const { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_S3_BUCKET_NAME, AWS_SECRET_ACCESS_KEY } = process.env;

//# sourceMappingURL=index.js.map