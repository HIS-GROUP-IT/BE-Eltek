export type IProfile = {
    id?: number;
    userId: number;
    
    bio?: string;
    avatarUrl?: string;
    phoneNumber?: string;
    location?: string;
  
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    projectId?: number;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'inactive';
  
    createdAt?: Date;
    updatedAt?: Date;
  };
  