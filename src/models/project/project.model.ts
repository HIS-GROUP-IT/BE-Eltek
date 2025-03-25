// Project Model
import { DataTypes, Model } from 'sequelize';
import sequelize from '@/database/index';
import User from '../user/user.model';
import Profile from '../profile/profile.model';

class Project extends Model {
  public id!: number;
  public name!: string;
  public key!: string;
  public description?: string;
  public status!: 'active' | 'inactive' | 'archived';
  public startDate!: Date;
  public endDate?: Date;
  public estimatedDuration?: number; // In days or weeks
  public createdBy!: number; // Admin user ID
  public category?: string;
  public slug!: string;
}

Project.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true 
    },
    key: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true,
      validate: {
        isUppercase: true,
        len: [2, 5] // Project key length between 2-5 characters
      }
    },
    description: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      allowNull: false,
      defaultValue: 'active'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: { type: DataTypes.DATEONLY },
    estimatedDuration: {
      type: DataTypes.INTEGER, // Store duration in days or weeks
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
    category: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['software', 'marketing', 'operations', 'other']]
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9-]+$/ // URL-friendly slug format
      }
    }
  },
  { 
    sequelize,
    modelName: 'Project',
    indexes: [
      // Compound index for frequently searched fields
      {
        fields: ['name', 'key', 'status']
      }
    ]
  }
);

// Association with User model (Admin who created the project)
Project.belongsTo(User, { foreignKey: 'createdBy' });

// Many-to-Many Association with Employees (A project can have multiple employees assigned)
Project.belongsToMany(Profile, { through: 'ProjectEmployees', foreignKey: 'projectId' });
Profile.belongsToMany(Project, { through: 'ProjectEmployees', foreignKey: 'employeeId' });

export default Project;
