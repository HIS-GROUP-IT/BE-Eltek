import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize';
import Employee from '../employee/employee.model';
import User from '../user/user.model';

class Task extends Model {
  public id!: number;
  public employeeName!: string;
  public projectId!: number;
  public employeeId!: number;
  public position!: string;
  public taskTitle!: string;
  public taskDescription!: string;
  public hours!: number;
  public status!: 'pending' | 'in-progress' | 'completed' | 'rejected';
  public reasonForRejection?: string;
  public modifiedBy!: number;
  public readonly totalHours : number
  public readonly pendingHours  : number
  public readonly completedHours :number
  public readonly rejectedHours :number
  public createdAt : Date;
  public readonly employee?: Employee;
  public readonly user?: User;

  static initialize(sequelize: Sequelize) {
    Task.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        employeeName: { type: DataTypes.STRING, allowNull: false },
        employeeId: { type: DataTypes.INTEGER, allowNull: false },
        projectId: { type: DataTypes.INTEGER, allowNull: false },
        position: { type: DataTypes.STRING, allowNull: false },
        taskTitle: { type: DataTypes.STRING, allowNull: false },
        taskDescription: { type: DataTypes.TEXT, allowNull: false },
        hours: { type: DataTypes.INTEGER, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
        reasonForRejection: { type: DataTypes.STRING, allowNull: true },
        modifiedBy: { type: DataTypes.INTEGER, allowNull: false }
      },
      { sequelize, modelName: 'Task' }
    );
  }
}

export default Task;