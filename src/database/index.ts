import { Sequelize } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } from "@/config/index";
import User from "@/models/user/user.model";
import Project from "@/models/project/project.model";
import Profile from "@/models/profile/profile.model";
import { Timesheet } from "@/models/project/timesheet.model";


const dbConnection = new Sequelize({
  dialect: "mysql",      
  host: DB_HOST,    
  port: 3306,            
  database: DB_NAME,     
  username: DB_USER,     
  password: DB_PASSWORD, 
});

export default dbConnection;
