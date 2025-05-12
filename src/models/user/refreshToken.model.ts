import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize';
import User from './user.model';

class RefreshToken extends Model {
  public id!: number;
  public token!: string;
  public userId!: number;
  public expiresAt!: Date;

  static initialize(sequelize: Sequelize) {
    RefreshToken.init(
      {
        token: { type: DataTypes.STRING, primaryKey: true },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: User,
            key: "id",
          },
        },
        expiresAt: { type: DataTypes.DATE }
      },
      { sequelize, modelName: 'RefreshToken' }
    );
  }
}

export default RefreshToken;