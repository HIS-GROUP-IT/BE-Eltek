import { Allocation } from '@/types/employee.types';

export interface IAllocationRepository {
  createAllocation(allocationData: Partial<Allocation>): Promise<Allocation>;
  getAllocationById(id: number): Promise<Allocation | null>;
  updateAllocation(id: number, updates: Partial<Allocation>): Promise<Allocation>;
  deleteAllocation(id: number): Promise<void>;
  getEmployeeAllocations(employeeId: number): Promise<Allocation[]>;
  getProjectAllocations(projectId: number): Promise<Allocation[]>;
  findExistingAllocation(employeeId: number, projectId: number, phase: string): Promise<Allocation | null>;
}