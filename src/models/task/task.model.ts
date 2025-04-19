import { DataTypes, Model } from "sequelize";
import { Sequelize } from "sequelize";
import Employee from "../employee/employee.model";
import User from "../user/user.model";
import { IComment } from "@/types/task.type";

class Task extends Model {
  public id!: number;
  public employeeName!: string;
  public allocationId!: number;
  public createdBy!: number;
  public employeeId!: number;
  public position!: string;
  public taskTitle!: string;
  public taskDescription!: string;
  public phase!: string;
  public estimatedHours!: number;
  public actualHours!: number;
  public comment?: IComment;
  public status!: "pending" | "in-progress" | "completed" | "rejected";
  public reasonForRejection?: string;
  public taskDate: Date;
  public modifiedBy!: number;
  public readonly totalHours: number;
  public readonly pendingHours: number;
  public readonly completedHours: number;
  public readonly rejectedHours: number;
  public createdAt: Date;
  public readonly employee?: Employee;
  public readonly user?: User;

  static initialize(sequelize: Sequelize) {
    Task.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        employeeName: { type: DataTypes.STRING, allowNull: false },
        employeeId: { type: DataTypes.INTEGER, allowNull: false },
        allocationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "allocations",
            key: "id",
          },
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: User,
            key: "id",
          },
        },
        position: { type: DataTypes.STRING, allowNull: false },
        taskTitle: { type: DataTypes.STRING, allowNull: false },
        taskDescription: { type: DataTypes.TEXT, allowNull: false },
        estimatedHours: { type: DataTypes.INTEGER, allowNull: false },
        actualHours: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        comment: { type: DataTypes.JSON, allowNull: true, defaultValue: {} },
        phase: { type: DataTypes.STRING, allowNull: false },
        taskDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Date.now,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "pending",
        },
        reasonForRejection: { type: DataTypes.STRING, allowNull: true },
        modifiedBy: { type: DataTypes.INTEGER, allowNull: false },
      },
      { sequelize, modelName: "Task" }
    );
  }
}

export default Task;
