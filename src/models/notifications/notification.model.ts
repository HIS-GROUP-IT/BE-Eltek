import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize';

interface NotificationAttributes {
  id: number;
  message: string;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  audiance: string;
  employeeId: number;
  projectId: number;
  department: string;
  title: string;
  isRead: boolean;
  isDeleted: boolean;
}

class Notification extends Model<NotificationAttributes> implements NotificationAttributes {
  public id!: number;
  public message!: string;
  public type!: string;
  public status!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public audiance!: string;
  public employeeId!: number;
  public title!: string;
  public isRead!: boolean;
  public projectId: number;
  public department: string;
  public isDeleted!: boolean;

  static initialize(sequelize: Sequelize) {
    Notification.init(
      {
        id: { 
          type: DataTypes.INTEGER, 
          autoIncrement: true, 
          primaryKey: true,
          allowNull: false 
        },
        message: { 
          type: DataTypes.TEXT, 
          allowNull: false 
        },
        type: { 
          type: DataTypes.STRING, 
          allowNull: false 
        },
        status: { 
          type: DataTypes.STRING, 
          allowNull: false 
        },
        createdAt: { 
          type: DataTypes.DATE, 
          allowNull: false,
          defaultValue: DataTypes.NOW 
        },
        updatedAt: { 
          type: DataTypes.DATE, 
          allowNull: false,
          defaultValue: DataTypes.NOW 
        },
        audiance: { 
          type: DataTypes.STRING, 
          allowNull: false 
        },
        employeeId: { 
          type: DataTypes.INTEGER, 
          allowNull: false 
        },
        projectId: { 
            type: DataTypes.INTEGER, 
            allowNull: true
          },
          department: { 
            type: DataTypes.STRING, 
            allowNull: true
          },
        title: { 
          type: DataTypes.STRING, 
          allowNull: false 
        },
        isRead: { 
          type: DataTypes.BOOLEAN, 
          allowNull: false,
          defaultValue: false 
        },
        isDeleted: { 
          type: DataTypes.BOOLEAN, 
          allowNull: false,
          defaultValue: false 
        }
      },
      { 
        sequelize, 
        modelName: 'Notification',
        timestamps: true 
      }
    );
  }
}

export default Notification;