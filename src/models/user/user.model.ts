import { DataTypes, Model } from 'sequelize';
import { Sequelize } from 'sequelize';
import Employee from '../employee/employee.model';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: string;
  public fullName!: string;
  public employeeId!: string;
  public phoneNumber!: string;
  public position! : string;
  public otp?: string;

  static initialize(sequelize: Sequelize) {
    User.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        fullName: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        employeeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Employee,
            key: "id",
          }
        },
        position: { type: DataTypes.STRING, allowNull: true },
        phoneNumber: { type: DataTypes.STRING, allowNull: true },
        role: { type: DataTypes.STRING, allowNull: false },
        otp: { type: DataTypes.STRING }
      },
      {
        timestamps: true,
        sequelize, modelName: 'User' }
    );
  }
}

export default User;