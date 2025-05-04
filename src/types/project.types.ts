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
  completionRate: number;
  numberOfTasks: number;
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
