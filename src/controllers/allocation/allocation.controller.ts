import { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { Allocation } from "@/types/employee.types";
import { CustomResponse } from "@/types/response.interface";
import { ALLOCATION_SERVICE_TOKEN } from "@/interfaces/allocation/IAllocationService.interface";
import { RequestWithUser } from "@/types/auth.types";

export class AllocationController {
  private allocationService;

  constructor() {
    this.allocationService = Container.get(ALLOCATION_SERVICE_TOKEN);
  }

  public createAllocation = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const allocationData: Allocation = req.body;
      const data = {
        ...allocationData,
        createdBy: req.user.id
      }
      const allocation = await this.allocationService.createAllocation(data);
      
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

  public deleteAllocationsByEmployeeAndProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {employeeId,projectId} =req.params
      await this.allocationService.deleteAllocationsByEmployeeAndProject(employeeId,projectId);
      
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
  public deleteAllocationsByEmployeeAndPhase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {employeeId,phaseId} =req.params
      await this.allocationService.deleteAllocationsByEmployeeAndPhase(employeeId,phaseId);
      
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

  public getPhaseAllocations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phaseId = req.params.phaseId
      const allocation = await this.allocationService.getPhaseAllocations(phaseId);
      
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

  public checkForOverlaps = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const allocation = await this.allocationService.checkForOverlaps(data.employeeId,
        data.startDate,
        data.endDate);      
      const response: CustomResponse<Allocation> = {
        data: allocation,
        message: "Overlaping allocations retrieved successfully",
        error: false
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public overrideConflictingAllocations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const allocation = await this.allocationService.overrideConflictingAllocations(data.employeeId,
        data.startDate,
        data.endDate);      
      const response: CustomResponse<Allocation> = {
        data: null,
        message: "Overlaping allocations solved successfully",
        error: false
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
  
  public checkOverridePossibility = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const allocation = await this.allocationService.checkOverridePossibility(data.employeeId,
        data.startDate,
        data.endDate);      
      const response: CustomResponse<Allocation> = {
        data: allocation,
        message: "Possibility for solving conflicts checked successfully",
        error: false
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}