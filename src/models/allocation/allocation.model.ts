import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import Employee from '@/models/employee/employee.model';
import { Allocation } from '@/types/employee.types';
import Project from '../project/project.model';

interface AllocationCreationAttributes extends Optional<Allocation, 'id' | 'chargeOutRate' | 'chargeType' | 'status'> {}

class AllocationModel extends Model<Allocation, AllocationCreationAttributes> implements Allocation {
  public id!: number;
  public projectName!: string;
  public employeeId!: number;
  public projectId!: number;
  public phase!: string;
  public start!: Date;
  public end!: Date;
  public hoursWeek!: number;
  public status!: 'confirmed' | 'tentative';
  public chargeOutRate?: number;
  public chargeType?: 'fixed' | 'markup';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize) {
    AllocationModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        projectName: {
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
        projectId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Project,
            key:"id" 
          }
        },
        phase: {
          type: DataTypes.STRING,
          allowNull: false
        },
        start: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        end: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          validate: {
            isAfterStartDate(value: Date) {
              if (value <= this.start) {
                throw new Error('End date must be after start date');
              }
            }
          }
        },
        hoursWeek: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          validate: {
            min: 0,
            max: 168
          }
        },
        status: {
          type: DataTypes.ENUM('confirmed', 'tentative'),
          defaultValue: 'tentative',
          allowNull: false
        },
        chargeOutRate: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true
        },
        chargeType: {
          type: DataTypes.ENUM('fixed', 'markup'),
          allowNull: true
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
        modelName: 'Allocation',
        tableName: 'allocations',
        validate: {
          endAfterStart() {
            if (this.end <= this.start) {
              throw new Error('End date must be after start date');
            }
          }
        }
      }
    );
  }


}

export default AllocationModel;