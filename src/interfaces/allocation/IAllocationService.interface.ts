import { Allocation } from '@/types/employee.types';
import { Token } from 'typedi';

export interface IAllocationService {
    createAllocation(allocationData: Partial<Allocation>): Promise<Allocation>;
    updateAllocation(id: number, updates: Partial<Allocation>): Promise<Allocation>;
    deleteAllocation(id: number): Promise<void>;
    getEmployeeAllocations(employeeId: number): Promise<Allocation[]>;
    getProjectAllocations(projectId: number): Promise<Allocation[]>;
    getAllocationById(id: number): Promise<Allocation>;
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