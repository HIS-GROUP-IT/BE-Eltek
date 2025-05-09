import { Router } from "express";
import { Routes } from "@/types/routes.interface";
import { ClientController } from "@/controllers/client/client.controller";
import { authorizationMiddleware } from "@/middlewares/authorizationMiddleware";
import { ValidationMiddleware } from "@/middlewares/ValidationMiddleware";
import { CreateClientDto } from "@/dots/client/client.dto";

export class ClientRoute implements Routes {
  public path = "/clients";
  public router = Router();
  public clientController = new ClientController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/createClient`,
      authorizationMiddleware,
      ValidationMiddleware(CreateClientDto),
      this.clientController.createClient
    );

    this.router.put(
      `${this.path}/updateClient`,
      authorizationMiddleware,
      this.clientController.updateClient
    );

    this.router.get(
      `${this.path}/getAllClients`,
      authorizationMiddleware,
      this.clientController.getAllClients
    );

    this.router.get(
      `${this.path}/getClientById/:clientId`,
      authorizationMiddleware,
      this.clientController.getClient
    );

    this.router.delete(
      `${this.path}/deleteClient/:clientId`,
      authorizationMiddleware,
      this.clientController.deleteClient
    );
  }
}