export type IClient = {
    id: number;
    email: string;
    tel: string;
    cell: string;
    fullName: string;
    company: string;
    isActive : boolean;
  }
  
  export type IClientCreate = {
    email: string;
    tel: string;
    cell: string;
    fullName: string;
    company: string;
  }
  
  export interface IClientUpdate extends Partial<IClientCreate> {}