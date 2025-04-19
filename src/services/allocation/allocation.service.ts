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

@Service({ id: ALLOCATION_SERVICE_TOKEN, type: AllocationService })
export class AllocationService implements IAllocationService {
  constructor(private allocationRepository: AllocationRepository) {}

  public async createAllocation(
    allocationData: Partial<Allocation>
  ): Promise<Allocation> {
    const existing = await this.allocationRepository.findExistingAllocation(
      allocationData.employeeId!,
      allocationData.projectId,
      allocationData.phases
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

  public async deleteAllocation(id: number): Promise<void> {
    return this.allocationRepository.deleteAllocation(id);
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
}
