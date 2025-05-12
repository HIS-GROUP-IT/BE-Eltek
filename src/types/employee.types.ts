export type IEmployee = {
  id?: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  position: string;
  department: string;
  role: string;
  gender: "male" | "female" | "other";
  race?: string;
  status: "active" | "inactive";
  location: string;
  assigned: boolean;
  utilization?:IUtilization
  skills ?: string[]
  experience?:number;
  commitments?: Commitment[];
  allocations?: Allocation[];
  ctc?: number;
  createdBy: number;
};

export type IAssignedEmployee = {
  projectId: number;
  employeeId: number;
  rate: number;
  role: string;
  fullName: string;
  project: string;
  phase: string;
  start: Date;
  end: Date;
  hoursWeek: number;
  status: "confirmed" | "tentative";
  chargeOutRate?: number;
  chargeType?: "fixed" | "markup";
};

export type Allocation = {
  id?: number;
  projectName: string;
  employeeId: number;
  projectId: number;
  phases: string[];
  normalizedPhaseIds:string;
  start: Date;
  end: Date;
  hoursWeek: number;
  status: "confirmed" | "tentative";
  chargeOutRate?: number;
  chargeType?: "fixed" | "markup";
  isActive?:boolean;
  employee?:IEmployee
  createdAt?: Date;
  updatedAt?: Date;
  canOverride: boolean
};

export type Commitment = {
  type: "training" | "leave" | "other";
  title: string;
  start: Date;
  end: Date;
};

export type IUtilization = {
  [year: number]: {
    [month: string]: {
      week1: number;
      week2: number;
      week3: number;
      week4: number;
    };
  };
};
