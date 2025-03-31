import { Router } from "express";
import { Routes } from "@/types/routes.interface";
import { ValidationMiddleware } from "@/middlewares/ValidationMiddleware";
import { EmployeeController } from "@/controllers/employee/employee.controller";
import { authorizationMiddleware } from "@/middlewares/authorizationMiddleware";
import { CreateEmployeeDto } from "@/dots/employee/employee.dto";

export class EmployeeRoute implements Routes {
  public path = "/employees";
  public router = Router();
  public employeeController = new EmployeeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/createEmployee`,
      authorizationMiddleware,
      ValidationMiddleware(CreateEmployeeDto),
      this.employeeController.createEmployee
    );

    this.router.put(
      `${this.path}/updateEmployee`,
      authorizationMiddleware,
      ValidationMiddleware(CreateEmployeeDto),
      this.employeeController.updateEmployee
    );

    this.router.delete(
      `${this.path}/deleteEmployee/:id`,
      authorizationMiddleware,
      this.employeeController.deleteEmployee
    );

    this.router.get(
      `${this.path}/getAllEmployees`,
      authorizationMiddleware,
      this.employeeController.getAllEmployees
    );

    this.router.get(
      `${this.path}/getEmployee/:id`,
      authorizationMiddleware,
      this.employeeController.getEmployeeById
    );

    this.router.post(
      `${this.path}/assignEmployees`,
      authorizationMiddleware,
      this.employeeController.assignEmployeesToProject
    );
    this.router.get(
      `${this.path}/getProjectEmployees/:projectId`,
      authorizationMiddleware,
      this.employeeController.getEmployeesByProjectId
    );
    this.router.get(
        `${this.path}/getEmployeeProjects/:employeeId`,
        authorizationMiddleware,
        this.employeeController.getEmployeeProjects
      );
      this.router.delete(
        `${this.path}/removeEmployee/:projectId/:employeeId`,
        authorizationMiddleware,
        this.employeeController.removeEmployeeFromProject
      );
      this.router.get(
        `${this.path}/getNumberOfAssignedEmployees`,
        authorizationMiddleware,
        this.employeeController.GetNumberOfAssignedEmployees
      );
  }
}
