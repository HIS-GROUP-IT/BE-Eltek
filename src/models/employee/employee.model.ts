import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize';
import Project from '../project/project.model';
import { Allocation, Commitment, IEmployee, IUtilization } from '@/types/employee.types';
import { ITask } from '@/types/task.type';

class Employee extends Model<IEmployee> implements IEmployee {
  public id!: number;
  public fullName!: string;
  public email!: string;
  public phoneNumber!: string;
  public idNumber!: string;
  public position!: string;
  public department!: string;
  public role!: string;
  public gender!: 'male' | 'female' | 'other';
  public race?: string;
  public status!: 'active' | 'inactive';
  public location!: string;
  public assigned!: boolean;
  public utilization!:IUtilization;
  public skills!: string[];
  public experience! : number;
  public ctc?: number;
  public createdBy!: number;
  public allocations?: Allocation[];
  public tasks?:ITask[];
  public commitments?: Commitment[];

  static initialize(sequelize: Sequelize) {
    Employee.init(
      {
        id: { 
          type: DataTypes.INTEGER, 
          autoIncrement: true, 
          primaryKey: true,
          allowNull: false 
        },
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
        ctc: { 
          type: DataTypes.INTEGER, 
          allowNull: true, 
          defaultValue: 0 
        },
        race: { type: DataTypes.STRING, allowNull: true },
        experience: { type: DataTypes.INTEGER, allowNull: true },
        utilization: { type: DataTypes.JSON, allowNull: true },
        location: { type: DataTypes.STRING, allowNull: false },
        assigned: { 
          type: DataTypes.BOOLEAN, 
          allowNull: false, 
          defaultValue: false 
        },
        skills: { type: DataTypes.JSON, allowNull: true,defaultValue:[] },
        createdBy: { type: DataTypes.INTEGER, allowNull: true }
        
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