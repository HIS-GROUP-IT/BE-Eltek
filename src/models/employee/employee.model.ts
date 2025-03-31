import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize';
import Project from '../project/project.model';

interface EmployeeAttributes {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  position: string;
  department: string;
  role: 'employee';
  gender: 'male' | 'female' | 'other';
  race?: string;
  status: 'active' | 'inactive';
  location: string;
  assigned: boolean;
  password: string;
  createdBy: number;
}

class Employee extends Model<EmployeeAttributes> implements EmployeeAttributes {
  public id!: number;
  public fullName!: string;
  public email!: string;
  public phoneNumber!: string;
  public idNumber!: string;
  public position!: string;
  public department!: string;
  public role!: 'employee';
  public gender!: 'male' | 'female' | 'other';
  public race?: string;
  public status!: 'active' | 'inactive';
  public location!: string;
  public assigned!: boolean;
  public password!: string;
  public createdBy!: number;
  public projects : Project[]

  static initialize(sequelize: Sequelize) {
    Employee.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,allowNull:false },
        fullName: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        phoneNumber: { type: DataTypes.STRING, allowNull: false },
        idNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
        position: { type: DataTypes.STRING, allowNull: false },
        department: { type: DataTypes.STRING, allowNull: true },
        role: { 
          type: DataTypes.ENUM('employee'), 
          allowNull: false, 
          defaultValue: 'employee' 
        },
        gender: { 
          type: DataTypes.ENUM('male', 'female', 'other'), 
          allowNull: false 
        },
        status: { 
          type: DataTypes.ENUM('active', 'inactive'), 
          allowNull: false, 
          defaultValue: 'active' 
        },
        race: { type: DataTypes.STRING, allowNull: true },
        location: { type: DataTypes.STRING, allowNull: false },
        assigned: { 
          type: DataTypes.BOOLEAN, 
          allowNull: false, 
          defaultValue: false 
        },
        password: { type: DataTypes.STRING, allowNull: false },
        createdBy: { type: DataTypes.INTEGER, allowNull: false }
      },
      { 
        sequelize, 
        modelName: 'Employee',
        timestamps: true
      }
    );
  }
}

export default Employee;