import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize';
import User from '../user/user.model';
import Employee from '../employee/employee.model';
import EmployeeProject from '../employee/projectEmployees.model';

class Project extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
  public status!: 'planned' | 'on going' | 'cancelled' | 'completed' | 'on hold';
  public startDate!: Date;
  public endDate?: Date;
  public createdBy!: number;
  public duration!: number;
  public budget!: number;
  public createdAt?: Date;
  public readonly employees?: Employee[];
  public updatedAt?: Date;

  static initialize(sequelize: Sequelize) {
    Project.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { 
          type: DataTypes.STRING, 
          allowNull: false,
          unique: true 
        },
        description: { type: DataTypes.TEXT, allowNull: true },
        status: {
          type: DataTypes.STRING,
          defaultValue: 'planned'
        },
        startDate: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        budget: {
          type: DataTypes.STRING,
          allowNull: false
        },
        duration: {
          type: DataTypes.STRING,
          allowNull: true
        },
        endDate: { 
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: User,
            key: 'id'
          }
        },
      },
      { 
        sequelize,
        modelName: 'Project'
      }
    );
  }
}

export default Project;
