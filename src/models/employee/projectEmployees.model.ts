import { Model, DataTypes, Sequelize } from 'sequelize';

class EmployeeProject extends Model {
  public employeeId!: number;
  public projectId!: number;
  public fullName!: string;
  public rate!: number;
  public role!: string;

  static initialize(sequelize: Sequelize) {
    EmployeeProject.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        employeeId: {
          type: DataTypes.INTEGER,
          references: { model: 'Employees', key: 'id' },
          onDelete: 'CASCADE',
        },
        projectId: {
          type: DataTypes.INTEGER,
          references: { model: 'Projects', key: 'id' },
          onDelete: 'CASCADE',
        },
        fullName: { type: DataTypes.STRING, allowNull: false },
        rate: { type: DataTypes.STRING, allowNull: false, validate: { min: 0 } },
        role: { type: DataTypes.STRING, allowNull: false },
      },
      {
        sequelize,
        tableName: 'EmployeeProject',
        modelName: 'EmployeeProject',
        timestamps: true,
      }
    );
  }
}

export default EmployeeProject;
