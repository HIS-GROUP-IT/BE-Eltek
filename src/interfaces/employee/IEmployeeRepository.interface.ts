import { Allocation, IEmployee } from "@/types/employee.types";


export interface IEmployeeRepository {
    createEmployee(employee: IEmployee): Promise<IEmployee>;
    updateEmployee(employee: any): Promise<IEmployee>;
    deleteEmployee(id: number): Promise<void>;
    getEmployeeById(id: number): Promise<IEmployee>;
    getAllEmployees(): Promise<IEmployee[]>;
    getEmployeeByEmail(email: string): Promise<IEmployee | null> 
    getEmployeeByIdNumber(idNumber: string): Promise<IEmployee | null> 
    activeEmployee(
        employeeData: Partial<IEmployee>
      ): Promise<IEmployee> ;
    
}