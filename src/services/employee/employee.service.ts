import { IAssignedEmployees, IEmployee } from "@/types/employee.types";
import { Service } from "typedi";
import {
  EMPLOYEE_SERVICE_TOKEN,
  IEmployeeService,
} from "@/interfaces/employee/IEmployeeService";
import { EmployeeRepository } from "@/repositories/employee/employee.repository";
import { HttpException } from "@/exceptions/HttpException";
import { IProject } from "@/types/project.types";

@Service({ id: EMPLOYEE_SERVICE_TOKEN, type: EmployeeService })
export class EmployeeService implements IEmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  public async createEmployee(employeeData: IEmployee): Promise<IEmployee> {
    const existingEmployee = await this.employeeRepository.getEmployeeByEmail(
      employeeData.email
    );
    if (existingEmployee) {
      if (existingEmployee.status === "inactive") {
        throw new HttpException(
          409,
          "Email already exists and employee is inactive. Please reactivate the employee to proceed."
        );
      } else if (existingEmployee.status === "active") {
        throw new HttpException(409, "Email already exists");
      }
    }

    const existingIdNumber =
      await this.employeeRepository.getEmployeeByIdNumber(
        employeeData.idNumber
      );

    if (existingIdNumber) {
      if (existingIdNumber.status === "inactive") {
        throw new HttpException(
          409,
          "ID Number already exists and employee is inactive. Please reactivate the employee to proceed."
        );
      } else if (existingIdNumber.status === "active") {
        throw new HttpException(409, "ID Number already exists");
      }
    }

    return await this.employeeRepository.createEmployee(employeeData);
  }

  public async getNumberOfAssignedEmployees(): Promise<number> {
    try {
      const employees =
        await this.employeeRepository.getNumberOfAssignedEmployees();
      return employees;
    } catch (error) {
      throw new HttpException(
        400,
        "Error getting number of assigned employees"
      );
    }
  }

  public async getAllEmployees(): Promise<IEmployee[]> {
    try {
      return await this.employeeRepository.getAllEmployees();
    } catch (error) {
      throw new HttpException(500, "Error getting employees");
    }
  }

  public async getEmployeeById(id: number): Promise<IEmployee | null> {
    try {
      return await this.employeeRepository.getEmployeeById(id);
    } catch (error) {
      throw new HttpException(500, "Error retrieving employee");
    }
  }

  public async updateEmployee(
    employeeData: Partial<IEmployee>
  ): Promise<IEmployee> {
    try {
    } catch (error) {
      throw new HttpException(400, "Error updating employee");
    }
    return await this.employeeRepository.updateEmployee(employeeData);
  }

  public async deleteEmployee(id: number): Promise<void> {
    try {
      await this.employeeRepository.deleteEmployee(id);
    } catch (error) {
      throw new HttpException(400, "Error deleting employee");
    }
  }

  public async assignEmployeesToProject(
    assignedEmployees: IAssignedEmployees[]
  ): Promise<void> {
    try {
      const assignEmployees =
        await this.employeeRepository.assignEmployeesToProject(
          assignedEmployees
        );
      return assignEmployees;
    } catch (error) {
      throw new HttpException(500, "Error assigning employees to project");
    }
  }

  public async getEmployeesByProjectId(
    projectId: number
  ): Promise<IAssignedEmployees[]> {
    try {
      const fetchedEmployees =
        await this.employeeRepository.getEmployeesByProjectId(projectId);
      return fetchedEmployees;
    } catch (error) {
      throw new HttpException(
        404,
        `No employees found for Project ID : ${projectId}`
      );
    }
  }

  public async removeEmployeeFromProject(
    employeeId: number,
    projectId: number
  ): Promise<void> {
    try {
      const removedEmployee =
        await this.employeeRepository.removeEmployeeFromProject(
          employeeId,
          projectId
        );
    } catch (error) {
      throw new HttpException(
        400,
        `Error removing employee ${employeeId} from the project ${projectId}`
      );
    }
  }

  public async activeEmployee(employeeData: Partial<IEmployee>): Promise<IEmployee> {
    try {
      if (!employeeData.email && !employeeData.idNumber) {
        throw new HttpException(400, "Either email or ID number must be provided");
      }
      
      const employee = await this.employeeRepository.activeEmployee(employeeData);
      if (!employee) {
        throw new HttpException(404, "Employee not found");
      }
      return employee;
    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw new HttpException(500, "Error activating employee");
      }
      throw error;
    }
  }
}
