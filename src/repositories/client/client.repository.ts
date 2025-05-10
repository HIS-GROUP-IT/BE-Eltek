import { Service } from "typedi";
import { HttpException } from "@/exceptions/HttpException";
import { IClientRepository } from "@/interfaces/client/IClientRepository.interface";
import Client from "@/models/client/client.model";
import { IClient, IClientCreate, IClientUpdate } from "@/types/client.types";
import Project from "@/models/project/project.model";

@Service()
export class ClientRepository implements IClientRepository {
  public async createClient(clientData: IClientCreate): Promise<IClient> {
    try {
      const client = await Client.create(clientData);
      return client.get({ plain: true });
    } catch (error) {
      throw new HttpException(500, `Error creating client: ${error.message}`);
    }
  }
  public async updateClient(clientData: IClient): Promise<IClient> {
    try {
      const transaction = await Client.sequelize.transaction();
      
      try {
        const [affectedCount] = await Client.update(clientData, {
          where: { id: clientData.id },
          returning: true,
          transaction
        });
        
        if (affectedCount === 0) throw new HttpException(404, "Client not found");
        
        await Project.update({
          clientName: clientData.fullName,
          clientEmail: clientData.email,
          clientCompany: clientData.company
        }, {
          where: { clientId: clientData.id },
          transaction
        });
        
        await transaction.commit();
        return this.getClientById(clientData.id);
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, `Error updating client: ${error.message}`);
    }
  }
  public async getClientById(clientId: number): Promise<IClient> {
    try {
      const client = await Client.findOne({ where: { id: clientId, isActive: true } });
      if (!client) throw new HttpException(404, "Client not found or inactive");
      return client.get({ plain: true });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, `Error fetching client: ${error.message}`);
    }
  }
  
  public async getAllClients(): Promise<IClient[]> {
    try {
      const clients = await Client.findAll({ where: { isActive: true } });
      return clients.map(client => client.get({ plain: true }));
    } catch (error) {
      throw new HttpException(500, `Error fetching clients: ${error.message}`);
    }
  }
  
  public async deleteClient(clientId: number): Promise<void> {
    const transaction = await Client.sequelize.transaction();    
    try {
      await Project.update(
        { 
          status: 'cancelled',
          isPaused: true 
        },
        { 
          where: { clientId },
          transaction
        }
      );
        const [affectedCount] = await Client.update(
        { isActive: false },
        { 
          where: { 
            id: clientId, 
            isActive: true 
          },
          transaction
        }
      );
  
      if (affectedCount === 0) {
        await transaction.rollback();
        throw new HttpException(404, "Client not found or already inactive");
      }  
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, `Error deleting client: ${error.message}`);
    }
  }
}