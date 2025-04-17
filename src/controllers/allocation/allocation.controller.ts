import { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { Allocation } from "@/types/employee.types";
import { CustomResponse } from "@/types/response.interface";
import { ALLOCATION_SERVICE_TOKEN } from "@/interfaces/allocation/IAllocationService.interface";

export class AllocationController {
  private allocationService;

  constructor() {
    this.allocationService = Container.get(ALLOCATION_SERVICE_TOKEN);
  }

  public createAllocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allocationData: Allocation = req.body;
      const allocation = await this.allocationService.createAllocation(allocationData);
      
      const response: CustomResponse<Allocation> = {
        data: allocation,
        message: "Allocation created successfully",
        error: false
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateAllocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const updates: Partial<Allocation> = req.body;
      const allocation = await this.allocationService.updateAllocation(id, updates);
      
      const response: CustomResponse<Allocation> = {
        data: allocation,
        message: "Allocation updated successfully",
        error: false
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public deleteAllocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      await this.allocationService.deleteAllocation(id);
      
      const response: CustomResponse<null> = {
        data: null,
        message: "Allocation deleted successfully",
        error: false
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getEmployeeAllocations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const allocations = await this.allocationService.getEmployeeAllocations(employeeId);
      
      const response: CustomResponse<Allocation[]> = {
        data: allocations,
        message: "Allocations retrieved successfully",
        error: false
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getProjectAllocations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const allocations = await this.allocationService.getProjectAllocations(projectId);
      
      const response: CustomResponse<Allocation[]> = {
        data: allocations,
        message: "Project allocations retrieved successfully",
        error: false
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getAllocationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const allocation = await this.allocationService.getAllocationById(id);
      
      const response: CustomResponse<Allocation> = {
        data: allocation,
        message: "Allocation retrieved successfully",
        error: false
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}