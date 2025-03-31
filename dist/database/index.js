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
const _sequelize = require("sequelize");
const DB_NAME = "db_aa010d_eltek";
const DB_HOST = "MYSQL6013.site4now.net";
const DB_USER = "aa010d_kultwano";
const DB_PASSWORD = "Bp4N3FDfKL7ZTY@";
const dbConnection = new _sequelize.Sequelize({
    dialect: "mysql",
    host: DB_HOST,
    port: 3306,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
dbConnection.sync({
    alter: true
}).then(()=>{
    console.log('Database synced successfully');
}).catch((error)=>{
    console.error('Error syncing database:', error);
});
const _default = dbConnection;

//# sourceMappingURL=index.js.map