import { IAssignedEmployees, IEmployee } from "@/types/employee.types";
import { IProject } from "@/types/project.types";
import { Token } from "typedi";

export interface IEmployeeService {
  createEmployee(employee: IEmployee): Promise<IEmployee>;
  updateEmployee(employee: any): Promise<IEmployee>;
  deleteEmployee(id: number): Promise<void>;
  getEmployeeById(id: number): Promise<IEmployee>;
  getAllEmployees(): Promise<IEmployee[]>;
  getNumberOfAssignedEmployees(): Promise<number>;
  assignEmployeesToProject(
    assignedEmployees:IAssignedEmployees[]
  ): Promise<void>;
  getEmployeesByProjectId(projectId: number): Promise<IAssignedEmployees[]>;
  removeEmployeeFromProject(employeeId: number, projectId: number): Promise<void>
}

export const EMPLOYEE_SERVICE_TOKEN = new Token<IEmployeeService>(
  "IEmployeeService"
);
