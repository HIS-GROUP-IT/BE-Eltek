

export type ProjectStatus = 'planned' | 'on going' | 'cancelled' | 'completed' | 'on hold';
export type IProject = {
    id?:number;
    name: string;
    description: string;
    status: ProjectStatus;
    startDate: Date;
    endDate: Date;
    budget: number;
    duration: number;
    clientName: string;
    clientEmail: string;
    createdBy:number;
    clientCompany: string;
    phases: Phase[];
    resources: Role[];
    createdAt? : Date;
    updatedAt?: Date;

  };
  
  export type Phase = {
    name: string;
    description: string;
    duration: string;
    assignedResources: number[];
  };
  
  export type Role = {
    role: string;
    description: string;
    quantity: number;
    experience: number;
    rate?: number; 
  };
