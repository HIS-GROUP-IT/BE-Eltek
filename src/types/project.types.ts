import { Allocation, IEmployee } from "./employee.types";
import { ITask } from "./task.type";

export type ProjectStatus =
  | "planned"
  | "on going"
  | "cancelled"
  | "completed"
  | "on hold";

export enum IProjectStatus {
  ON_HOLD = "on hold",
  ON_GOING = "on going",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export type IProject = {
  allocations?: Allocation[];
  tasks?:ITask[]
  id?: number;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  budget: number;
  duration: number;
  clientName: string;
  clientEmail: string;
  estimatedCost?: IEstimatedCost;
  createdBy: number;
  isPaused: boolean;
  clientId: number;
  lastPausedAt?: Date | null;
  pauseHistory: PauseLog[];
  clientCompany: string;
  phases: Phase[];
  resources: Role[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type Phase = {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  members: number;
  plannedHours: number;
  actualHours: number;
  plannedCost: number;
  actualCost : number;
  variance : number
};

export type Role = {
  role: string;
  description: string;
  quantity: number;
  experience: number;
  rate?: number;
};

export type IEstimatedCost = {
  [month: string]: number;
};
export interface PauseLog {
  pausedAt: Date;
  resumedAt?: Date | null;
}



  // Add these interfaces to your types file
export type IMonthlyDateEntry = {
  date: number; // day of the month (e.g., 1 - 31)
  plannedHours: number;
  workedHours: number;
}

export type IMonthlyWorkLog = {
  [month: number]: {
    [date: number]: IMonthlyDateEntry;
  };
}

export type IResourceWorkLog = {
  resource: IEmployee;
  monthlyData: IMonthlyWorkLog;
  totalPlanned: number;
  totalWorked: number;
  variance: number;
}