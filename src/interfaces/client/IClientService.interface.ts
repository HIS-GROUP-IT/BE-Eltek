import { IClient, IClientCreate, IClientUpdate } from "@/types/client.types";


export const CLIENT_SERVICE_TOKEN = 'CLIENT_SERVICE_TOKEN';

export interface IClientService {
  createClient(clientData: IClientCreate): Promise<IClient>;
  updateClient(clientData: IClient): Promise<IClient>;
  getClient(clientId: number): Promise<IClient>;
  getAllClients(): Promise<IClient[]>;
  deleteClient(clientId: number): Promise<void>;
}