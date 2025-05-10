import { HttpException } from "@/exceptions/HttpException";
import { IEmployeeRepository } from "@/interfaces/employee/IEmployeeRepository.interface";
import { Op, QueryTypes } from "sequelize";
import { Sequelize } from "sequelize";
import Project from "@/models/project/project.model";
import { Allocation, IAssignedEmployee, IEmployee } from "@/types/employee.types";
import Employee from "@/models/employee/employee.model";
import { Service } from "typedi";
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

  public async updateEmployee(employeeData: Partial<IEmployee>): Promise<IEmployee> {
    const transaction = await Employee.sequelize.transaction();    
    try {
      const employee = await Employee.findByPk(employeeData.id, { transaction });
      if (!employee) {
        await transaction.rollback();
        throw new Error("Employee not found");
      }  
      await employee.update(employeeData, { transaction });
        const fieldsToSync = ['fullName', 'email', 'phoneNumber', 'position'];
      const updateData = {};
            fieldsToSync.forEach(field => {
        if (employeeData[field] !== undefined) {
          updateData[field] = employeeData[field];
        }
      });
        if (Object.keys(updateData).length > 0) {
        await User.update(updateData, {
          where: { employeeId: employeeData.id },
          transaction
        });
      }
      await transaction.commit();
      return employee.get({ plain: true });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  public async deleteEmployee(employeeId: number): Promise<void> {
    const transaction = await Employee.sequelize!.transaction();

    try {
      const employee = await Employee.findByPk(employeeId, { transaction });
      if (!employee) {
        throw new HttpException(404, "Employee not found");
      }
   
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
      where: {
        role: 'employee'
            },
      include: [{
        association: 'allocations',
        attributes: [
          'id',
          'projectName',
          'employeeId',
          'projectId',
          'phases',
          'start',
          'end',
          'hoursWeek',
          'status',
          'chargeOutRate',
          'chargeType'
        ] 
      }],
      order: [["createdAt", "DESC"]],
      raw: false 
    });
  
    return employees.map(emp => emp.get({ plain: true }));
  }


  public async getEmployeeById(employeeId: number): Promise<IEmployee | null> {
    const employee = await Employee.findByPk(employeeId, {
      include: [{
        association: 'allocations',
        attributes: [  'id',
          'projectName',
          'employeeId',
          'projectId',
          'phases',
          'start',
          'end',
          'hoursWeek',
          'status',
          'chargeOutRate',
          'chargeType']
      }],
      raw: false
    });
  
    return employee ? employee.get({ plain: true }) : null;
  }




}