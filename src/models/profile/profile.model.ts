// Profile Model
import { DataTypes, Model } from 'sequelize';
import sequelize from '@/database/index';
import User from '../user/user.model';

class Profile extends Model {
  public id!: number;
  public userId!: number;

  // Profile-specific fields
  public bio?: string;
  public avatarUrl?: string;
  public phoneNumber?: string;
  public location?: string;

  // Employee-specific fields
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public position!: string;
  public projectId?: number; // Change to number if projectId is an integer in Project model
  public startDate!: Date;
  public endDate?: Date;
  public status!: 'active' | 'inactive';
}

Profile.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: 'id'
      }
    },

    // Profile-specific fields
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[0-9+() -]*$/ // Allows phone numbers with common formats
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // Employee-specific fields
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false
    },
    projectId: {
      type: DataTypes.INTEGER, // Change to number if the projectId is an integer
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    }
  },
  {
    sequelize,
    modelName: 'Profile'
  }
);

User.hasOne(Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId' });

export default Profile;
