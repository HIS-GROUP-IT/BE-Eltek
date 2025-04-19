export type IEmployee = {
  id?: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  position: string;
  department: string;
  role: "employee";
  gender: "male" | "female" | "other";
  race?: string;
  status: "active" | "inactive";
  location: string;
  assigned: boolean;
  utilization?:number
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
  normalizedPhases:string;
  start: Date;
  end: Date;
  hoursWeek: number;
  status: "confirmed" | "tentative";
  chargeOutRate?: number;
  chargeType?: "fixed" | "markup";
  createdAt?: Date;
  updatedAt?: Date;
  canOverride: boolean,

};

export type Commitment = {
  type: "training" | "leave" | "other";
  title: string;
  start: Date;
  end: Date;
};
