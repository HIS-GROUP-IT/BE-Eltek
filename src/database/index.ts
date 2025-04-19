import { Sequelize } from 'sequelize';
import User from '@/models/user/user.model';
import RefreshToken from '@/models/user/refreshToken.model';
import Employee from '@/models/employee/employee.model';
import Task from '@/models/task/task.model';
import Project from '@/models/project/project.model';
import Leave from '@/models/leave/leave.model';
import Notification from '@/models/notifications/notification.model';
import AllocationModel from '@/models/allocation/allocation.model';

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

User.initialize(dbConnection);
RefreshToken.initialize(dbConnection);
Employee.initialize(dbConnection);
Task.initialize(dbConnection);
Project.initialize(dbConnection);
Leave.initialize(dbConnection)
Notification.initialize(dbConnection);
AllocationModel.initialize(dbConnection);


User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

Employee.hasMany(Task, { foreignKey: 'employeeId' });
Task.belongsTo(Employee, { foreignKey: 'employeeId' });
Task.belongsTo(AllocationModel, {
  foreignKey: 'allocationId',
  as: 'allocation',
});



Leave.belongsTo(Employee, {
  foreignKey: 'employeeId',
  as: 'employee'
});

Employee.hasMany(Leave, {
  foreignKey: 'employeeId',
  as: 'leaves'
});

Notification.belongsTo(Employee, {
  foreignKey: 'employeeId',
  as: 'employee'
});


Notification.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project'
});

AllocationModel.belongsTo(Employee, {
  foreignKey: 'employeeId',
  as: 'employee'
});

AllocationModel.belongsTo(Project, { 
  foreignKey: 'projectId',
  as: 'project'
});

Employee.hasMany(AllocationModel, {
  foreignKey: 'employeeId',
  as: 'allocations' 
});

dbConnection.sync({ alter: true })
  .then(() => console.log('Database synced successfully'))
  .catch(error => console.error('Error syncing database:', error));

export default dbConnection;
