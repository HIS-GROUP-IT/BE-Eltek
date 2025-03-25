import { DataTypes, Model } from 'sequelize';
import sequelize from '@/database/index';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: string;
  public otp? : string 
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    otp : { type: DataTypes.STRING }
  },
  { sequelize, modelName: 'User' }
);

export default User;