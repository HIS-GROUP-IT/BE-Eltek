export type IEmployee = {
  id?: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  position: string;
  department: string;
  role: 'employee';
  gender: 'male' | 'female' | 'other';
  race?: string;
  status: 'active' | 'inactive';
  location: string;
  assigned: boolean;
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