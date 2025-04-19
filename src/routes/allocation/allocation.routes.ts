import { Router } from "express";
import { Routes } from "@/types/routes.interface";
import { AllocationController } from "@/controllers/allocation/allocation.controller";
import { authorizationMiddleware } from "@/middlewares/authorizationMiddleware";

export class AllocationRoute implements Routes {
  public path = "/allocations";
  public router = Router();
  public allocationController = new AllocationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/createAllocation`,
      authorizationMiddleware,
      this.allocationController.createAllocation
    );

    this.router.put(
      `${this.path}/updateAllocation/:id`,
      authorizationMiddleware,
      this.allocationController.updateAllocation
    );

    this.router.delete(
      `${this.path}/deleteAllocation/:id`,
      authorizationMiddleware,
      this.allocationController.deleteAllocation
    );

    this.router.get(
      `${this.path}/getEmployeeAllocations/:employeeId`,
      authorizationMiddleware,
      this.allocationController.getEmployeeAllocations
    );

    this.router.get(
      `${this.path}/getProjectAllocations/:projectId`,
      authorizationMiddleware,
      this.allocationController.getProjectAllocations
    );

    this.router.get(
      `${this.path}/getAllocation/:id`,
      authorizationMiddleware,
      this.allocationController.getAllocationById
    );

    this.router.post(
      `${this.path}/checkResourceConflicts`,
      authorizationMiddleware,
      this.allocationController.checkForOverlaps
    );
    this.router.put(
      `${this.path}/solveResourceConflicts`,
      authorizationMiddleware,
      this.allocationController.overrideConflictingAllocations
    );
    this.router.post(
      `${this.path}/checkOverridePossibility`,
      authorizationMiddleware,
      this.allocationController.checkOverridePossibility
    );
  }
}