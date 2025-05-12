import Employee from "@/models/employee/employee.model";
import { Allocation, IEmployee } from "./employee.types";

export type IEmployeeWorkMetrics = {
    employee :IEmployee
    numberOfAllocations : number
    numberOfTasks : number;
    numberOfHours : number
  }