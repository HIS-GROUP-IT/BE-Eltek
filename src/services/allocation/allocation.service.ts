import { HttpException } from "@/exceptions/HttpException";
import { Service } from "typedi";
import { AllocationRepository } from "@/repositories/allocation/allocation.repository";
import {
  ALLOCATION_SERVICE_TOKEN,
  IAllocationService,
} from "@/interfaces/allocation/IAllocationService.interface";
import { Allocation } from "@/types/employee.types";
import Employee from "@/models/employee/employee.model";
import Project from "@/models/project/project.model";
import { IResourceWorkLog } from "@/types/project.types";

@Service({ id: ALLOCATION_SERVICE_TOKEN, type: AllocationService })
export class AllocationService implements IAllocationService {
  constructor(private allocationRepository: AllocationRepository) {}

  public async createAllocation(
    allocationData: Partial<Allocation>
  ): Promise<Allocation> {
    const existing = await this.allocationRepository.findExistingAllocations(
      allocationData.employeeId!,
      allocationData.projectId,
      allocationData.phaseId
    );

    if (existing) {
      throw new HttpException(409, "Allocation for this phase already exists");
    }

    return this.allocationRepository.createAllocation(allocationData);
  }

  public async updateAllocation(
    id: number,
    updates: Partial<Allocation>
  ): Promise<Allocation> {
    return this.allocationRepository.updateAllocation(id, updates);
  }

  public async deleteAllocationsByEmployeeAndPhase(employeeId: number, phaseId: string): Promise<void> {
    try {
      await this.allocationRepository.deleteAllocationsByEmployeeAndPhase(employeeId, phaseId);
    } catch (error) {
   throw new HttpException(400, error.message);
    }
  }

  public async deleteAllocationsByEmployeeAndProject(employeeId: number, projectId: number): Promise<void>{
    return this.allocationRepository.deleteAllocationsByEmployeeAndProject(employeeId, projectId);
  }

  public async getEmployeeAllocations(
    employeeId: number
  ): Promise<Allocation[]> {
    return this.allocationRepository.getEmployeeAllocations(employeeId);
  }

  public async getProjectAllocations(projectId: number): Promise<Allocation[]> {
    return this.allocationRepository.getProjectAllocations(projectId);
  }
  

  public async getAllocationById(id: number): Promise<Allocation> {
    const allocation = await this.allocationRepository.getAllocationById(id);
    if (!allocation) throw new HttpException(404, "Allocation not found");
    return allocation;
  }

  public async checkForOverlaps(
    employeeId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Allocation[]> {
    try {
      const allocation = await this.allocationRepository.checkForOverlaps(
        employeeId,
        startDate,
        endDate
      );
      return allocation;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async overrideConflictingAllocations(
    employeeId: number,
    newStart: Date,
    newEnd: Date
  ): Promise<void> {
    try {
      await this.allocationRepository.overrideConflictingAllocations(
        employeeId,
        newStart,
        newEnd
      );
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async checkOverridePossibility(
    employeeId: number,
    startDate: Date | string,
    endDate: Date | string
  ): Promise<{
    canOverride: boolean;
    conflicts: Allocation[];
    wouldDelete: Allocation[];
    wouldModify: Allocation[];
  }> {
    try {
      const canBeOverriden =
        await this.allocationRepository.checkOverridePossibility(
          employeeId,
          startDate,
          endDate
        );
      return canBeOverriden;
    } catch (error) {
      throw new HttpException(400, "Cannot override conflicting allocations. Please resolve manually");
    }
  }

  public async getPhaseAllocations(phaseId: string): Promise<Allocation[]> {
    try {
      return await this.allocationRepository.getPhaseAllocations(phaseId);
    } catch (error) {
      throw new HttpException(500, `Error fetching phase allocations: ${error.message}`);
    }
  }

  public async getResourceWorkLogByPhase(phaseId: string): Promise<IResourceWorkLog[]> {
    try {
      return await this.allocationRepository.getResourceWorkLogByPhase(phaseId);
    } catch (error) {
      throw new HttpException(500, error.message)
    }
  }
}
