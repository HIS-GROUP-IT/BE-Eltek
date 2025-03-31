import { IAssignedEmployees, IEmployee } from "@/types/employee.types";
import { IProject } from "@/types/project.types";


export interface IEmployeeRepository {
    createEmployee(employee: IEmployee): Promise<IEmployee>;
    updateEmployee(employee: any): Promise<IEmployee>;
    deleteEmployee(id: number): Promise<void>;
    getEmployeeById(id: number): Promise<IEmployee>;
    getAllEmployees(): Promise<IEmployee[]>;
    assignEmployeesToProject(assignedEmployees:IAssignedEmployees[]): Promise<void>
    getEmployeesByProjectId(projectId: number): Promise<IAssignedEmployees[]>;
    removeEmployeeFromProject(employeeId: number, projectId: number): Promise<void>
    // getEmployeeProjects(employeeId: number): Promise<IProject[]>;
    getNumberOfAssignedEmployees(): Promise<number>;
}