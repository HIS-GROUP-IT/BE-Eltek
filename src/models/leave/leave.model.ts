import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '@/database/index'; 
import Employee from '@/models/employee/employee.model'; 
import { ILeave, LeaveStatus, LeaveType } from '@/types/leave.types';


interface LeaveCreationAttributes extends Optional<ILeave, 'id' | 'status' | 'createdAt' | 'updatedAt'> {}

class Leave extends Model<ILeave, LeaveCreationAttributes> implements ILeave {
  public id!: number;
  public leaveType!: LeaveType;
  public duration!: number;
  public startDate!: Date;
  public endDate!: Date;
  public reason!: string;
  public documents!: string[];
  public status!: LeaveStatus;
  public employeeId!: number;
  public position : string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Leave.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    leaveType: {
      type: DataTypes.ENUM(...Object.values(LeaveType)),
      allowNull: false
    },
    duration: {
      type: DataTypes.DECIMAL(5, 1), 
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    documents: {
      type: DataTypes.ARRAY(DataTypes.STRING), 
      allowNull: true,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM(...Object.values(LeaveStatus)),
      defaultValue: LeaveStatus.PENDING,
      allowNull: false
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Employee,
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Leave',
    tableName: 'leaves',
    indexes: [
      {
        fields: ['employeeId']
      },
      {
        fields: ['status']
      }
    ]
  }
);


Leave.belongsTo(Employee, {
  foreignKey: 'employeeId',
  as: 'employee'
});

Employee.hasMany(Leave, {
  foreignKey: 'employeeId',
  as: 'leaves'
});

export default Leave;