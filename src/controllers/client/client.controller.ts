import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { CustomResponse } from "@/types/response.interface";
import { CLIENT_SERVICE_TOKEN } from "@/interfaces/client/IClientService.interface";
import { IClient, IClientCreate, IClientUpdate } from "@/types/client.types";

export class ClientController {
  private clientService ;
  constructor() {
    this.clientService = Container.get(CLIENT_SERVICE_TOKEN);
  }

  public createClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientData: IClientCreate = req.body;
      const createdClient = await this.clientService.createClient(clientData);
      const response: CustomResponse<IClient> = {
        data: createdClient,
        message: "Client created successfully",
        error: false
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientData: IClient = req.body;
      const updatedClient = await this.clientService.updateClient(clientData);
      const response: CustomResponse<IClient> = {
        data: updatedClient,
        message: "Client updated successfully",
        error: false
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const client = await this.clientService.getClient(clientId);
      const response: CustomResponse<IClient> = {
        data: client,
        message: "Client retrieved successfully",
        error: false
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getAllClients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clients = await this.clientService.getAllClients();
      const response: CustomResponse<IClient[]> = {
        data: clients,
        message: "Clients retrieved successfully",
        error: false
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public deleteClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientId = parseInt(req.params.clientId);
      await this.clientService.deleteClient(clientId);
      const response: CustomResponse<null> = {
        data: null,
        message: "Client deleted successfully",
        error: false
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}