import { Allocation } from '@/types/employee.types';

export interface IAllocationRepository {
  createAllocation(allocationData: Partial<Allocation>): Promise<Allocation>;
  getAllocationById(id: number): Promise<Allocation | null>;
  updateAllocation(id: number, updates: Partial<Allocation>): Promise<Allocation>;
  deleteAllocationsByEmployeeAndProject(employeeId: number, projectId: number): Promise<void>
  getEmployeeAllocations(employeeId: number): Promise<Allocation[]>;
  getProjectAllocations(projectId: number): Promise<Allocation[]>;
  findExistingAllocations(employeeId: number, projectId: number, phaseIds: string): Promise<Allocation | null>;
   deleteAllocationsByEmployeeAndPhase(employeeId: number, phaseId: string): Promise<void> 
  getPhaseAllocations(phaseId: string): Promise<Allocation[]> 
  checkForOverlaps(
    employeeId: number, 
    startDate: Date, 
    endDate: Date, 
  ): Promise<Allocation[]>
overrideConflictingAllocations(
    employeeId: number,
    newStart: Date,
    newEnd: Date,
    currentAllocationId?: number
  ): Promise<void>;
  checkOverridePossibility(
    employeeId: number,
    startDate: Date | string,
    endDate: Date | string
  ): Promise<{
    canOverride: boolean;
    conflicts: Allocation[];
    wouldDelete: Allocation[];
    wouldModify: Allocation[];
  }>
}