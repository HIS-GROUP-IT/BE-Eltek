import { Sequelize } from "sequelize";
import User from "@/models/user/user.model";
import Project from "@/models/project/project.model";
import Profile from "@/models/profile/profile.model";
import { Timesheet } from "@/models/project/timesheet.model";


const DB_NAME = "db_aa010d_eltek";
const DB_HOST = "MYSQL6013.site4now.net";
const DB_USER = "aa010d_kultwano";
const DB_PASSWORD = "Bp4N3FDfKL7ZTY@";

const dbConnection = new Sequelize({
  dialect: "mysql",
  host: DB_HOST,
  port: 3306,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Change to true if using a valid CA certificate
    },
  },
  pool: {
    max: 5, // Limit connections
    min: 0,
    acquire: 30000, // Increase timeout
    idle: 10000,
  },
});


export default dbConnection;
