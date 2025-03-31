import { IAssignedEmployees, IEmployee } from '@/types/employee.types';
import { Service } from 'typedi';
import { EMPLOYEE_SERVICE_TOKEN, IEmployeeService } from '@/interfaces/employee/IEmployeeService';
import { EmployeeRepository } from '@/repositories/employee/employee.repository';
import { HttpException } from '@/exceptions/HttpException';
import { IProject } from '@/types/project.types';


@Service({id: EMPLOYEE_SERVICE_TOKEN, type: EmployeeService})
export class EmployeeService implements IEmployeeService {

    constructor(
        private employeeRepository: EmployeeRepository,
    ) {}

    public async createEmployee(employeeData: IEmployee): Promise<IEmployee> {
      try {
          return await this.employeeRepository.createEmployee(employeeData);
      } catch (error) {
          console.error("Error in createEmployee:", error);
          throw new HttpException(400, "Error creating employee");
      }
  }

  public async getNumberOfAssignedEmployees(): Promise<number> {
    try {
      const employees = await this.employeeRepository.getNumberOfAssignedEmployees();
      return employees;
    } catch (error) {
      throw new HttpException(400, "Error getting number of assigned employees");
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

    public async updateEmployee(employeeData: Partial<IEmployee>): Promise<IEmployee> {
      try {
        return await this.employeeRepository.updateEmployee(employeeData);
      } catch (error) {
        throw new HttpException(400, "Error updating employee");
      }
    }

    public async deleteEmployee(id: number): Promise<void> {
      try {
        await this.employeeRepository.deleteEmployee(id);
      } catch (error) {
        throw new HttpException(400, "Error deleting employee");
      }
    }

    public async assignEmployeesToProject(assignedEmployees:IAssignedEmployees[]): Promise<void> {
      try {
        const assignEmployees = await this.employeeRepository.assignEmployeesToProject(assignedEmployees);       
        return assignEmployees;      
      } catch (error) {
        throw new HttpException(500, "Error assigning employees to project");
      }
    }

    public async getEmployeesByProjectId(projectId: number): Promise<IAssignedEmployees[]> {
      try {
        const fetchedEmployees = await this.employeeRepository.getEmployeesByProjectId(projectId);
        return fetchedEmployees;
      } catch (error) {
        throw new HttpException(404, `No employees found for Project ID : ${projectId}`);
      }
    }

    public async getEmployeeProjects(employeeId: number): Promise<IProject[]> {
      try {
        const fetchedProjects = await this.employeeRepository.getEmployeeProjects(employeeId);
        return fetchedProjects;
      } catch (error) {
        throw new HttpException(404, `No Projects for employee ID: ${employeeId}`);
      }
    }
  
    public async removeEmployeeFromProject(employeeId: number, projectId: number): Promise<void> {
      try {
        const removedEmployee = await this.employeeRepository.removeEmployeeFromProject(employeeId,projectId);
      } catch (error) {
        throw new HttpException(400, `Error removing employee ${employeeId} from the project ${projectId}`);
      }
    }
}
