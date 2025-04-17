import { Allocation } from '@/types/employee.types';
import { Token } from 'typedi';

export interface IAllocationService {
    createAllocation(allocationData: Partial<Allocation>): Promise<Allocation>;
    updateAllocation(id: number, updates: Partial<Allocation>): Promise<Allocation>;
    deleteAllocation(id: number): Promise<void>;
    getEmployeeAllocations(employeeId: number): Promise<Allocation[]>;
    getProjectAllocations(projectId: number): Promise<Allocation[]>;
    getAllocationById(id: number): Promise<Allocation>;
}

export const ALLOCATION_SERVICE_TOKEN = new Token<IAllocationService>("IAllocationService");