import { HttpException } from "@/exceptions/HttpException";
import { IEmployeeRepository } from "@/interfaces/employee/IEmployeeRepository.interface";
import EmployeeProject from "@/models/employee/projectEmployees.model";
import { Op } from "sequelize";
import Project from "@/models/project/project.model";
import { IAssignedEmployees, IEmployee } from "@/types/employee.types";
import Employee from "@/models/employee/employee.model";
import { Service } from "typedi";
import { Transaction } from "sequelize";
import User from "@/models/user/user.model";
import { MonthlyTasks } from "@/types/task.type";
import Task from "@/models/task/task.model";

@Service()
export class EmployeeRepository implements IEmployeeRepository {
  public async createEmployee(
    employeeData: Partial<IEmployee>
  ): Promise<IEmployee> {
    const employee = await Employee.create(employeeData);
    return employee.get({ plain: true });
  }

  public async getEmployeeByEmail(email: string): Promise<IEmployee | null> {
    const employee = await Employee.findOne({ where: { email }, raw: true });
    return employee;
  }

  public async getEmployeeByIdNumber(
    idNumber: string
  ): Promise<IEmployee | null> {
    const employee = await Employee.findOne({ where: { idNumber }, raw: true });
    return employee;
  }

  public async updateEmployee(
    employeeData: Partial<IEmployee>
  ): Promise<IEmployee> {
    const employee = await Employee.findByPk(employeeData.id);
    if (!employee) throw new Error("Employee not found");
    await employee.update(employeeData);
    return employee.get({ plain: true });
  }

  public async deleteEmployee(employeeId: number): Promise<void> {
    const transaction = await Employee.sequelize!.transaction();

    try {
      const employee = await Employee.findByPk(employeeId, { transaction });
      if (!employee) {
        throw new HttpException(404, "Employee not found");
      }
      await EmployeeProject.destroy({
        where: { employeeId },
        transaction,
      });

      await User.destroy({
        where: { employeeId },
        transaction,
      });

      employee.status = "inactive";
      employee.assigned = false;
      await employee.save({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error instanceof HttpException
        ? error
        : new HttpException(500, "Error deleting employee");
    }
  }


  public async activeEmployee(
    employeeData: Partial<IEmployee>
  ): Promise<IEmployee> {
    const transaction = await Employee.sequelize!.transaction();
  
    try {
      if (!employeeData.email && !employeeData.idNumber) {
        throw new HttpException(400, "Either email or ID number must be provided");
      }
  
      let whereClause = {};
      if (employeeData.email && employeeData.idNumber) {
        whereClause = { 
          [Op.or]: [
            { email: employeeData.email },
            { idNumber: employeeData.idNumber }
          ]
        };
      } else if (employeeData.email) {
        whereClause = { email: employeeData.email };
      } else {
        whereClause = { idNumber: employeeData.idNumber };
      }
  
      const employee = await Employee.findOne({ 
        where: whereClause,
        transaction
      });
  
      if (!employee) {
        throw new HttpException(404, "Employee not found");
      }
  
      const updateData = {
        ...employeeData,
        assigned: employeeData.assigned ?? false
      };
  
      await employee.update(updateData, { transaction });
  
      await transaction.commit();
      
      return employee.get({ plain: true });
    } catch (error) {
      await transaction.rollback();
      throw error instanceof HttpException
        ? error
        : new HttpException(500, "Error updating employee");
    }
  }

  public async getAllEmployees(): Promise<IEmployee[]> {
    const employees = await Employee.findAll({
      order: [["createdAt", "DESC"]],
      raw: true,
    });
    return employees;
  }

  public async getEmployeeById(employeeId: number): Promise<IEmployee | null> {
    const employee = await Employee.findByPk(employeeId, { raw: true });
    return employee;
  }

  public async assignEmployeesToProject(
    assignedEmployees: IAssignedEmployees[]
  ): Promise<void> {
    if (!assignedEmployees || assignedEmployees.length === 0) {
      throw new HttpException(400, "Assigned employees array is empty");
    }

    const projectId = assignedEmployees[0].projectId;
    const project = await Project.findByPk(projectId);
    if (!project) throw new HttpException(404, "Project not found");

    const employeeIds = assignedEmployees.map((a) => a.employeeId);

    const employees = await Employee.findAll({ where: { id: employeeIds } });
    if (employees.length === 0)
      throw new HttpException(404, "No employees found");

    const foundIds = employees.map((emp) => emp.id);
    const missingIds = employeeIds.filter((id) => !foundIds.includes(id));
    if (missingIds.length > 0) {
      throw new HttpException(
        404,
        `Employees not found: ${missingIds.join(", ")}`
      );
    }

    const existingAssignments = await EmployeeProject.findAll({
      where: { projectId, employeeId: employeeIds },
    });

    const alreadyAssignedIds = existingAssignments.map((e) => e.employeeId);
    const newAssignments = assignedEmployees.filter(
      (e) => !alreadyAssignedIds.includes(e.employeeId)
    );

    if (newAssignments.length === 0) {
      throw new HttpException(
        400,
        "All employees are already assigned to this project"
      );
    }

    const transaction: Transaction =
      await EmployeeProject.sequelize!.transaction();

    try {
      await EmployeeProject.bulkCreate(newAssignments, { transaction });

      await Employee.update(
        { assigned: true },
        {
          where: { id: newAssignments.map((a) => a.employeeId) },
          transaction,
        }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(500, "Error assigning employees to project");
    }
  }

  public async getNumberOfAssignedEmployees(): Promise<number> {
    const assignedEmployeesCount = await EmployeeProject.count();
    return assignedEmployeesCount;
  }

  public async getEmployeesByProjectId(
    projectId: number
  ): Promise<IAssignedEmployees[]> {
    const assignedEmployees = await EmployeeProject.findAll({
      where: { projectId },
    });

    return assignedEmployees as IAssignedEmployees[];
  }

  public async removeEmployeeFromProject(
    employeeId: number,
    projectId: number
  ): Promise<void> {
    const transaction = await EmployeeProject.sequelize!.transaction();

    try {
      const otherAssignments = await EmployeeProject.count({
        where: { employeeId, projectId: { [Op.ne]: projectId } },
        transaction,
      });

      const deletedCount = await EmployeeProject.destroy({
        where: { employeeId, projectId },
        transaction,
      });

      if (deletedCount === 0) {
        throw new HttpException(404, "Employee assignment not found");
      }
      if (otherAssignments === 0) {
        await Employee.update(
          { assigned: false },
          {
            where: { id: employeeId },
            transaction,
          }
        );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error instanceof HttpException
        ? error
        : new HttpException(500, "Error removing employee from project");
    }
  }

  public async getEmployeeMonthlyTasks(
    projectId: number,
    employeeId: number,
    year: number,
    month: number
  ): Promise<MonthlyTasks> {
    try {
      if (!projectId || !employeeId || !year || !month) {
        throw new HttpException(400, "Missing required parameters");
      }

      const employeeProject = await EmployeeProject.findOne({
        where: {
          employeeId,
          projectId,
        },
        raw: true,
      });

      if (!employeeProject) {
        throw new HttpException(
          404,
          "Employee is not assigned to this project"
        );
      }

      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 0));
      endDate.setUTCHours(23, 59, 59, 999);

      const tasks = await Task.findAll({
        where: {
          projectId,
          employeeId,
          status: "completed",
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [["createdAt", "ASC"]],
        raw: true,
      });

      const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);
      const rate = Number(employeeProject.rate);
      const totalCost = totalHours * rate;

      return {
        totalHours,
        rate,
        totalCost,
        tasks: tasks.map((task) => ({
          id: task.id,
          taskTitle: task.taskTitle,
          taskDescription: task.taskDescription,
          hours: task.hours,
          status: task.status,
          employeeName: task.employeeName,
          position: task.position,
          date: task.createdAt.toISOString().split("T")[0],
          rate: rate,
        })),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, "Failed to fetch monthly tasks");
    }
  }
}
