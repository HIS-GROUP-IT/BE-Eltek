import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize';

class Client extends Model {
  public id!: number;
  public email!: string;
  public tel!: string;
  public cell!: string;
  public fullName!: string;
  public isActive : boolean;
  public company!: string;

  static initialize(sequelize: Sequelize) {
    Client.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        email: { type: DataTypes.STRING, allowNull: false,  },
        fullName: { type: DataTypes.STRING, allowNull: false },
        company: { type: DataTypes.STRING, allowNull: false },
        cell: { type: DataTypes.STRING, allowNull: true },
        isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue:true },
        tel: { type: DataTypes.STRING, allowNull: true },
      },
      { sequelize, modelName: 'Client' }
    );
  }
}

export default Client;