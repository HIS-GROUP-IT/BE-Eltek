import { Service } from "typedi";
import { HttpException } from "@/exceptions/HttpException";
import { IClientService, CLIENT_SERVICE_TOKEN } from "@/interfaces/client/IClientService.interface";
import { IClient, IClientCreate, IClientUpdate } from "@/types/client.types";
import { ClientRepository } from "@/repositories/client/client.repository";

@Service({ id: CLIENT_SERVICE_TOKEN })
export class ClientService implements IClientService {
  constructor(private clientRepository: ClientRepository) {}

  public async createClient(clientData: IClientCreate): Promise<IClient> {
    try {
      return await this.clientRepository.createClient(clientData);
    } catch (error) {
      throw new HttpException(500, `Error creating client: ${error.message}`);
    }
  }

  public async updateClient(clientData: IClient): Promise<IClient> {

    try {
      return await this.clientRepository.updateClient(clientData);
    } catch (error) {
      throw new HttpException(500, `Error updating client: ${error.message}`);
    }
  }

  public async getClient(clientId: number): Promise<IClient> {
    try {
      return await this.clientRepository.getClientById(clientId);
    } catch (error) {
      throw new HttpException(500, `Error fetching client: ${error.message}`);
    }
  }

  public async getAllClients(): Promise<IClient[]> {
    try {
      return await this.clientRepository.getAllClients();
    } catch (error) {
      throw new HttpException(500, `Error fetching clients: ${error.message}`);
    }
  }

  public async deleteClient(clientId: number): Promise<void> {
    try {
      await this.clientRepository.deleteClient(clientId);
    } catch (error) {
      throw new HttpException(500, `Error deleting client: ${error.message}`);
    }
  }
}