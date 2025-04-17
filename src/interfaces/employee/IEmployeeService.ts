import {  Allocation, IEmployee } from "@/types/employee.types";
import { Token } from "typedi";

export interface IEmployeeService {
 createEmployee(employee: IEmployee): Promise<IEmployee>;
    updateEmployee(employee: any): Promise<IEmployee>;
    deleteEmployee(id: number): Promise<void>;
    getEmployeeById(id: number): Promise<IEmployee>;
    getAllEmployees(): Promise<IEmployee[]>;
    getEmployeeByEmail(email: string): Promise<IEmployee | null> 
    getEmployeeByIdNumber(idNumber: string): Promise<IEmployee | null> 
   
}

export const EMPLOYEE_SERVICE_TOKEN = new Token<IEmployeeService>(
  "IEmployeeService"
);
