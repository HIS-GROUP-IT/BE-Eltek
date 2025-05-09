
import { IClient, IClientCreate } from "@/types/client.types";
export interface IClientRepository {
  createClient(clientData: IClientCreate): Promise<IClient>;
  updateClient(clientData: IClient): Promise<IClient>;
  getClientById(clientId: number): Promise<IClient>;
  getAllClients(): Promise<IClient[]>;
  deleteClient(clientId: number): Promise<void>;
}