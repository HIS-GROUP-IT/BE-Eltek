import { ProjectRepository } from '@/repositories/project/project.repository';
import { HttpException } from "@/exceptions/HttpException";
import { IEmployee } from "@/types/employee.types";
import { Service } from "typedi";
import { EMPLOYEE_SERVICE_TOKEN, IEmployeeService } from "@/interfaces/employee/IEmployeeService";
import { EmployeeRepository } from "@/repositories/employee/employee.repository";
import { Allocation } from "@/types/employee.types";
import { IProjectRepository } from '@/interfaces/project/IProjectRepository.interface';

@Service({ id: EMPLOYEE_SERVICE_TOKEN})
export class EmployeeService implements IEmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  public async createEmployee(employeeData: IEmployee): Promise<IEmployee> {
    const existingEmployee = await this.employeeRepository.getEmployeeByEmail(employeeData.email);
    if (existingEmployee) {
      if (existingEmployee.status === "inactive") {
        throw new HttpException(409, "Email already exists and employee is inactive. Please reactivate the employee to proceed.");
      }
      throw new HttpException(409, "Email already exists");
    }

    const existingIdNumber = await this.employeeRepository.getEmployeeByIdNumber(employeeData.idNumber);
    if (existingIdNumber) {
      if (existingIdNumber.status === "inactive") {
        throw new HttpException(409, "ID Number already exists and employee is inactive. Please reactivate the employee to proceed.");
      }
      throw new HttpException(409, "ID Number already exists");
    }

    return this.employeeRepository.createEmployee(employeeData);
  }

  public async updateEmployee(employeeData: Partial<IEmployee>): Promise<IEmployee> {
    try {
      return await this.employeeRepository.updateEmployee(employeeData);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof Error && error.message === "Employee not found") {
        throw new HttpException(404, error.message);
      }
      throw new HttpException(500, "Error updating employee");
    }
  }

  public async deleteEmployee(id: number): Promise<void> {
    try {
      await this.employeeRepository.deleteEmployee(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, "Error deleting employee");
    }
  }

  public async getEmployeeById(id: number): Promise<IEmployee> {
    try {
      const employee = await this.employeeRepository.getEmployeeById(id);
      if (!employee) throw new HttpException(404, "Employee not found");
      return employee;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, "Error retrieving employee");
    }
  }

  public async getAllEmployees(): Promise<IEmployee[]> {
    try {
      return await this.employeeRepository.getAllEmployees();
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  public async getEmployeeByEmail(email: string): Promise<IEmployee | null> {
    try {
      return await this.employeeRepository.getEmployeeByEmail(email);
    } catch (error) {
      throw new HttpException(500, "Error fetching employee by email");
    }
  }

  public async getEmployeeByIdNumber(idNumber: string): Promise<IEmployee | null> {
    try {
      return await this.employeeRepository.getEmployeeByIdNumber(idNumber);
    } catch (error) {
      throw new HttpException(500, "Error fetching employee by ID number");
    }
  }

  public async activeEmployee(employeeData: Partial<IEmployee>): Promise<IEmployee> {
    try {
      if (!employeeData.email && !employeeData.idNumber) {
        throw new HttpException(400, "Email or ID number required");
      }
      const employee = await this.employeeRepository.activeEmployee(employeeData);
      if (!employee) throw new HttpException(404, "Employee not found");
      return employee;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, "Error reactivating employee");
    }
  }

}