import { HttpException } from "@/exceptions/HttpException";
import { Op, Transaction } from "sequelize";
import { Service } from "typedi";
import AllocationModel from "@/models/allocation/allocation.model";
import Employee from "@/models/employee/employee.model";
import Project from "@/models/project/project.model";
import { Allocation } from "@/types/employee.types";
import { IAllocationRepository } from "@/interfaces/allocation/IAllocationRepository.interface";
import Task from "@/models/task/task.model";

@Service()
export class AllocationRepository implements IAllocationRepository {
  public async createAllocation(allocationData: Partial<Allocation>): Promise<Allocation> {
    try {
        if (!allocationData.phases || !Array.isArray(allocationData.phases)) {
            throw new HttpException(400, "Phases must be a non-empty array");
        }

        if (!allocationData.employeeId) {
            throw new HttpException(400, "Employee ID is required");
        }
        const employee = await Employee.findByPk(allocationData.employeeId);
        if (!employee) {
            throw new HttpException(404, "Employee not found");
        }
        const normalizedPhases = JSON.stringify([...allocationData.phases].sort());

        const allocation = await AllocationModel.create({
            ...allocationData,
            normalizedPhaseIds: normalizedPhases,
        });
        await employee.update({ assigned: true });
        const project = await Project.findByPk(allocationData.projectId);
        if (project) {
            const phases = [...project.phases];
            allocationData.phases.forEach(phaseId => {
                const phaseIndex = phases.findIndex(p => p.id === phaseId);
                if (phaseIndex !== -1) {
                    phases[phaseIndex] = {
                        ...phases[phaseIndex],
                        members: (phases[phaseIndex].members || 0) + 1
                    };
                }
            });
            await project.update({ phases });
        }

        return allocation.get({ plain: true });

    } catch (error) {
        console.error("Create allocation error:", error);
        if (error instanceof HttpException) {
            throw error;
        }
        throw new HttpException(500, error.message);
    }
}
  

  public async getAllocationById(id: number): Promise<Allocation | null> {
    return await AllocationModel.findByPk(id, {
      include: [
        { model: Employee, as: 'employee' },
        { model: Project, as: 'project' }
      ],
      raw: true
    });
  }

  public async updateAllocation(id: number, updates: Partial<Allocation>): Promise<Allocation> {
    const transaction = await AllocationModel.sequelize!.transaction();
    
    try {
      const allocation = await AllocationModel.findByPk(id, { transaction });
      if (!allocation) {
        throw new HttpException(404, "Allocation not found");
      }
      const oldPhases = allocation.phases.map(String);
      let newPhases: string[] = [];

      if (updates.phases) {
        newPhases = [...new Set(updates.phases.map(String))].sort();
        updates.phases = newPhases; 
      }
      const newStart = updates.start ? new Date(updates.start) : allocation.start;
      const newEnd = updates.end ? new Date(updates.end) : allocation.end;
      
      if (newEnd <= newStart) {
        throw new HttpException(400, "End date must be after start date");
      }  
      const employeeId = allocation.employeeId;
        const allConflicts = await this.checkForOverlaps(
        employeeId,
        newStart,
        newEnd,
        transaction
      );
        const externalConflicts = allConflicts.filter(c => c.id !== id);
  
      if (externalConflicts.length > 0) {
        const overrideCheck = await this.checkOverridePossibility(
          employeeId,
          newStart,
          newEnd,
          id 
        );
          const nonOverridableConflicts = externalConflicts.filter(c => !c.canOverride);
        if (nonOverridableConflicts.length > 0) {
          const conflictIds = nonOverridableConflicts.map(c => c.id);
          throw new HttpException(409,
            `Cannot update due to non-overridable conflicts: ${conflictIds.join(', ')}`
          );
        }
          await this.overrideConflictingAllocations(
          employeeId,
          newStart,
          newEnd,
          id, 
          transaction
        );
      }
        const finalStart = updates.start ? new Date(updates.start) : allocation.start;
      const finalEnd = updates.end ? new Date(updates.end) : allocation.end;
      
      if (finalEnd <= finalStart) {
        throw new HttpException(400, "End date must be after start date after conflict resolution");
      }
        await allocation.update({
        ...updates,
        start: finalStart,
        end: finalEnd
      }, { transaction });
        if (updates.phases) {
        const project = await Project.findByPk(allocation.projectId, { transaction });
        if (project) {
          const phases = [...project.phases];
                    const removedPhases = oldPhases.filter(phaseId => !newPhases.includes(phaseId));
                    const addedPhases = newPhases.filter(phaseId => !oldPhases.includes(phaseId));
          removedPhases.forEach(phaseId => {
            const phaseIndex = phases.findIndex(p => String(p.id) === phaseId);
            if (phaseIndex !== -1) {
              phases[phaseIndex] = {
                ...phases[phaseIndex],
                members: Math.max(0, (phases[phaseIndex].members || 0) - 1)
              };
            }
          });
          addedPhases.forEach(phaseId => {
            const phaseIndex = phases.findIndex(p => String(p.id) === phaseId);
            if (phaseIndex !== -1) {
              phases[phaseIndex] = {
                ...phases[phaseIndex],
                members: (phases[phaseIndex].members || 0) + 1
              };
            }
          });

          await project.update({ phases }, { transaction });
                    await allocation.update({
            normalizedPhaseIds: JSON.stringify(newPhases)
          }, { transaction });
        }
      }

      await transaction.commit();
      return allocation.get({ plain: true });
  
    } catch (error) {
      await transaction.rollback();
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, "Failed to update allocation");
    }
  }

  public async deleteAllocationsByEmployeeAndProject(employeeId: number, projectId: number): Promise<void> {
    const transaction = await AllocationModel.sequelize!.transaction();
    
    try {
        const allocations = await AllocationModel.findAll({
            where: { 
                employeeId,
                projectId
            },
            transaction
        });

        if (!allocations || allocations.length === 0) {
            throw new HttpException(404, "No allocations found for this employee and project");
        }
        const hasTasks = await Task.count({
            where: { 
                employeeId,
                projectId
            },
            transaction
        }) > 0;

        if (hasTasks) {
            await AllocationModel.update(
                { isActive: false,
                  canOverride:true
                 }, 
                { 
                    where: { 
                        employeeId,
                        projectId 
                    },
                    transaction 
                }
            );
        } else {
            for (const allocation of allocations) {
                await this.performAllocationDeletion(allocation, transaction);
            }
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error instanceof HttpException
            ? error
            : new HttpException(500, "Error processing allocations deletion");
    }
}

private async performAllocationDeletion(allocation: AllocationModel, transaction: Transaction) {
    const project = await Project.findByPk(allocation.projectId, { transaction });
    if (project) {
        const updatedPhases = project.phases.map(phase => {
            if (allocation.phases.includes(phase.id)) {
                return {
                    ...phase,
                    members: Math.max(0, (phase.members || 0) - 1)
                };
            }
            return phase;
        });
        await project.update({ phases: updatedPhases }, { transaction });
    }
    const remainingAllocations = await AllocationModel.count({
        where: { employeeId: allocation.employeeId },
        transaction
    });

    if (remainingAllocations === 1) {
        await Employee.update(
            { assigned: false },
            { where: { id: allocation.employeeId }, transaction }
        );
    }
    await allocation.destroy({ transaction });
}

public async getEmployeeAllocations(employeeId: number): Promise<Allocation[]> {
    return await AllocationModel.findAll({
        where: { 
            employeeId,
            isActive: true
        },  
        include: [{
            model: Project,
            as: 'project',
            where: {
                status: {
                    [Op.or]: ['completed', 'on going']
                },
                isActive: true  // Optional: only include active projects
            },
            required: true
        }],
    });
}

public async getProjectAllocations(projectId: number): Promise<Allocation[]> {
  return await AllocationModel.findAll({
    where: { 
      projectId,
      isActive: true // Only active allocations
    },
    include: [{
      model: Employee,
      as: 'employee',
      attributes: { exclude: ['password'] }, 
      include: [{
        model: AllocationModel,
        as: 'allocations',
        where: { isActive: true }, // Only active allocations for employee
        attributes: [
          'id',
          'projectName',
          'employeeId',
          'projectId',
          'phases',
          'start',
          'end',
          'hoursWeek',
          'status',
          'chargeOutRate',
          'chargeType',
          'createdAt',
          'updatedAt'
        ]
      }]
    }]   
  });
}

public async getPhaseAllocations(phaseId: string): Promise<Allocation[]> {
  return await AllocationModel.findAll({
    where: {
      [Op.and]: [
        AllocationModel.sequelize.literal(`JSON_CONTAINS(Allocation.phases, JSON_ARRAY('${phaseId}'))`),
        { isActive: true } // Only active allocations
      ]
    },
    include: [{
      model: Employee,
      as: 'employee',
      attributes: { exclude: ['password'] },
      include: [{
        model: AllocationModel,
        as: 'allocations',
        where: { isActive: true }, // Only active allocations for employee
        attributes: [
          'id',
          'projectName',
          'employeeId', 
          'projectId',
          'phases',
          'start',
          'end',
          'hoursWeek',
          'status',
          'chargeOutRate',
          'chargeType',
          'createdAt',
          'updatedAt'
        ]
      }]
    }]
  });
}

public async findExistingAllocations(
  employeeId: number,
  projectId: number,
  phaseIds: string[] 
): Promise<Allocation | null> {
  const normalizedPhaseIds = JSON.stringify([...phaseIds].sort());
  
  return await AllocationModel.findOne({
    where: {
      employeeId,
      projectId,
      normalizedPhaseIds,
      isActive: true // Only active allocations
    },
    raw: true
  });
}
  
  
  public async checkForOverlaps(
    employeeId: number, 
    startDate: Date, 
    endDate: Date,
    transaction?: Transaction
  ): Promise<Allocation[]> {
    return AllocationModel.findAll({
      where: {
        employeeId,
        [Op.and]: [
          { start: { [Op.lt]: endDate } },
          { end: { [Op.gt]: startDate } }
        ]
      },
      transaction,
      raw: true
    });
  }
  
  public async overrideConflictingAllocations(
    employeeId: number,
    newStart: Date | string,
    newEnd: Date | string,
    excludeAllocationId?: number,
    transaction?: Transaction
  ): Promise<void> {
    const newStartDate = newStart instanceof Date ? newStart : new Date(newStart);
    const newEndDate = newEnd instanceof Date ? newEnd : new Date(newEnd);
  
    // Get all conflicting allocations
    const conflicts = await this.checkForOverlaps(
      employeeId,
      newStartDate,
      newEndDate,
      transaction
    );
  
    // Filter out the allocation we're excluding
    const conflictsToProcess = conflicts.filter(alloc => 
      !excludeAllocationId || alloc.id !== excludeAllocationId
    );
  
    // Check if we can override all conflicts
    if (conflictsToProcess.length > 0) {
      const { canOverride } = await this.checkOverridePossibility(
        employeeId,
        newStartDate,
        newEndDate,
        excludeAllocationId
      );
  
      if (!canOverride) {
        const nonOverridable = conflictsToProcess.filter(a => !a.canOverride);
        throw new HttpException(409, 
          `Cannot override conflicting allocations. Non-overridable conflicts: ${
            nonOverridable.map(a => a.id).join(', ')
          }`
        );
      }
  
      // Process each conflicting allocation
      for (const alloc of conflictsToProcess) {
        const allocStart = new Date(alloc.start);
        const allocEnd = new Date(alloc.end);
  
        // Case 1: Conflict completely contains the new allocation (split needed)
        if (allocStart < newStartDate && allocEnd > newEndDate) {
          // First update existing allocation to end before new allocation
          const existingEnd = new Date(newStartDate);
          existingEnd.setDate(existingEnd.getDate() - 1);
          
          // Validate the existing allocation won't be invalid
          if (allocStart < existingEnd) {
            await AllocationModel.update(
              { end: existingEnd },
              { where: { id: alloc.id }, transaction }
            );
  
            // Create new allocation for the right portion (start after new allocation)
            const splitStart = new Date(newEndDate);
            splitStart.setDate(splitStart.getDate() + 1);
  
            // Validate the split allocation won't be invalid
            if (splitStart < allocEnd) {
              await AllocationModel.create({
                ...alloc,
                id: undefined,
                start: splitStart,
                end: allocEnd
              }, { transaction });
            }
          }
          continue;
        }
  
        // Case 2: Conflict overlaps at the start (trim end to day before new allocation)
        if (allocStart < newStartDate && allocEnd > newStartDate) {
          const trimmedEnd = new Date(newStartDate);
          trimmedEnd.setDate(trimmedEnd.getDate() - 1);
          
          // Only update if it won't create an invalid allocation
          if (allocStart < trimmedEnd) {
            await AllocationModel.update(
              { end: trimmedEnd },
              { where: { id: alloc.id }, transaction }
            );
          } else {
            // If trimming would make it invalid, just delete it
            await AllocationModel.destroy({
              where: { id: alloc.id },
              transaction
            });
          }
          continue;
        }
  
        // Case 3: Conflict overlaps at the end (trim start to day after new allocation)
        if (allocStart < newEndDate && allocEnd > newEndDate) {
          const trimmedStart = new Date(newEndDate);
          trimmedStart.setDate(trimmedStart.getDate() + 1);
          
          // Only update if it won't create an invalid allocation
          if (trimmedStart < allocEnd) {
            await AllocationModel.update(
              { start: trimmedStart },
              { where: { id: alloc.id }, transaction }
            );
          } else {
            // If trimming would make it invalid, just delete it
            await AllocationModel.destroy({
              where: { id: alloc.id },
              transaction
            });
          }
          continue;
        }
  
        // Case 4: Conflict is completely within new allocation (delete)
        if (allocStart >= newStartDate && allocEnd <= newEndDate) {
          await AllocationModel.destroy({
            where: { id: alloc.id },
            transaction
          });
        }
      }
    }
  }

  
  public async checkOverridePossibility(
    employeeId: number,
    startDate: Date | string,
    endDate: Date | string,
    excludeAllocationId?: number // Add exclusion parameter
  ): Promise<{
    canOverride: boolean;
    conflicts: Allocation[];
    wouldDelete: Allocation[];
    wouldModify: Allocation[];
  }> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const conflicts = await this.checkForOverlaps(employeeId, start, end);
  
    // Filter out excluded allocation
    const filteredConflicts = excludeAllocationId 
      ? conflicts.filter(c => c.id !== excludeAllocationId)
      : conflicts;
    
    const wouldDelete = filteredConflicts.filter(alloc => {
      const allocStart = new Date(alloc.start);
      const allocEnd = new Date(alloc.end);
      return allocStart >= start && allocEnd <= end;
    });
  
    const wouldModify = filteredConflicts.filter(alloc => {
      const allocStart = new Date(alloc.start);
      const allocEnd = new Date(alloc.end);
      return !(allocStart >= start && allocEnd <= end);
    });
  
    return {
      canOverride: filteredConflicts.every(alloc => alloc.canOverride),
      conflicts: filteredConflicts,
      wouldDelete,
      wouldModify
    };
  }
  
}