export type IEmployee = {
    id?: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    idNumber: string;
    position: string;
    role: 'employee';
    gender: 'male' | 'female' | 'other';
    status: 'active' | 'inactive';
    race?: string;
    location: string;
    department:string;
    password: string;
    createdBy: number;
  }

  export type IAssignedEmployees = {
    projectId:number;
    employeeId: number; 
    rate: number;
    role: string;
      fullName: string; 
  }