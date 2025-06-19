import { DataTypes, Model } from "sequelize";
import { Sequelize } from "sequelize";
import Employee from "../employee/employee.model";
import User from "../user/user.model";
import { IComment } from "@/types/task.type";
import Project from "../project/project.model";
import { Allocation } from "@/types/employee.types";

class Task extends Model {
  public id!: number;
  public employeeName!: string;
  public phaseId!: string;
  public projectId!: number;
  public allocationId!: number;
  public createdBy!: number;
  public employeeId!: number;
  public position!: string;
  public taskTitle!: string;
  public taskDescription!: string;
  public phase!: string;
  public priority!: string;
  public isSubmitted!: boolean;
  public estimatedHours!: number;
  public actualHours!: number;
  public comment?: IComment;
  public status!: "pending" | "in-progress" | "completed" | "rejected";
  public reasonForRejection?: string;
  public taskDate: Date;
  public modifiedBy!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public readonly totalHours: number;
  public readonly pendingHours: number;
  public readonly completedHours: number;
  public readonly allocation : Allocation
  public readonly rejectedHours: any;
  public readonly approvedHours: any;
  public readonly totalTasks : number
  public readonly employee?: Employee;
  public readonly user?: User;

  static initialize(sequelize: Sequelize) {
    Task.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        employeeId: { type: DataTypes.INTEGER, allowNull: false, references: {
          model: Employee,
          key: "id",
        }, },
        phaseId: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        projectId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "projects",
            key: "id",
          },
        },      
        allocationId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "allocations",
            key: "id",
          },
        },      

        position: { type: DataTypes.STRING, allowNull: false },
        isSubmitted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        priority: { type: DataTypes.STRING, allowNull: false },

        taskTitle: { type: DataTypes.STRING, allowNull: false },
        taskDescription: { type: DataTypes.TEXT, allowNull: false },
        estimatedHours: { type: DataTypes.INTEGER, allowNull: false },
        actualHours: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
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
      },
      { sequelize, modelName: "Task" }
    );
  }
}

export default Task;
