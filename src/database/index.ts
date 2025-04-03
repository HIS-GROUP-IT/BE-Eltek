import { Sequelize } from 'sequelize';
import User from '@/models/user/user.model';
import RefreshToken from '@/models/user/refreshToken.model';
import Employee from '@/models/employee/employee.model';
import Task from '@/models/project/task.model';
import Project from '@/models/project/project.model';
import EmployeeProject from '@/models/employee/projectEmployees.model';
import Leave from '@/models/leave/leave.model';

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

// Initialize all models
User.initialize(dbConnection);
RefreshToken.initialize(dbConnection);
Employee.initialize(dbConnection);
Task.initialize(dbConnection);
Project.initialize(dbConnection);
EmployeeProject.initialize(dbConnection);
Leave.initialize(dbConnection)

// Set up associations
User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

Employee.hasMany(Task, { foreignKey: 'employeeId' });
Task.belongsTo(Employee, { foreignKey: 'employeeId' });

// Many-to-Many Association between Employee and Project
Employee.belongsToMany(Project, {
  through: EmployeeProject,
  foreignKey: 'employeeId',
  otherKey: 'projectId'
});

// Define Associations
Leave.belongsTo(Employee, {
  foreignKey: 'employeeId',
  as: 'employee'
});

Employee.hasMany(Leave, {
  foreignKey: 'employeeId',
  as: 'leaves'
});


Project.belongsToMany(Employee, {
  through: EmployeeProject,
  foreignKey: 'projectId',
  otherKey: 'employeeId'
});

EmployeeProject.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });


dbConnection.sync({ alter: true })
  .then(() => console.log('Database synced successfully'))
  .catch(error => console.error('Error syncing database:', error));

export default dbConnection;
