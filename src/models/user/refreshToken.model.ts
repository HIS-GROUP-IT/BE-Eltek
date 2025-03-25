// models/refreshToken.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '@/database/index';
import User from './user.model';

class RefreshToken extends Model {
  public id!: number;
  public token!: string;
  public userId!: number;
  public expiresAt!: Date;
}

RefreshToken.init(
  {
    token: { type: DataTypes.STRING, primaryKey: true },
    userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
    expiresAt: { type: DataTypes.DATE }
  },
  { sequelize, modelName: 'RefreshToken' }
);

User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

export default RefreshToken;