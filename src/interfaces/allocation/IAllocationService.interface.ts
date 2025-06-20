import { Allocation } from '@/types/employee.types';
import { IResourceWorkLog } from '@/types/project.types';
import { Token } from 'typedi';

export interface IAllocationService {
    createAllocation(allocationData: Partial<Allocation>): Promise<Allocation>;
    updateAllocation(id: number, updates: Partial<Allocation>): Promise<Allocation>;
    deleteAllocationsByEmployeeAndProject(employeeId: number, projectId: number): Promise<void>
    getEmployeeAllocations(employeeId: number): Promise<Allocation[]>;
    getProjectAllocations(projectId: number): Promise<Allocation[]>;
     deleteAllocationsByEmployeeAndPhase(employeeId: number, phaseId: string): Promise<void> 
    getAllocationById(id: number): Promise<Allocation>;
    getPhaseAllocations(phaseId: string): Promise<Allocation[]> 
    getResourceWorkLogByPhase(phaseId: string): Promise<IResourceWorkLog[]>
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

export const ALLOCATION_SERVICE_TOKEN = new Token<IAllocationService>("IAllocationService");