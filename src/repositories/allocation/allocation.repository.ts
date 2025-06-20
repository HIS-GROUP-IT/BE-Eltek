import { HttpException } from "@/exceptions/HttpException";
import { Op, Transaction } from "sequelize";
import { Service } from "typedi";
import AllocationModel from "@/models/allocation/allocation.model";
import Employee from "@/models/employee/employee.model";
import Project from "@/models/project/project.model";
import { Allocation } from "@/types/employee.types";
import { IAllocationRepository } from "@/interfaces/allocation/IAllocationRepository.interface";
import Task from "@/models/task/task.model";
import { IMonthlyWorkLog, IResourceWorkLog } from "@/types/project.types";

@Service()
export class AllocationRepository implements IAllocationRepository {

  // Helper method to update phase members count
  private async updatePhaseMembers(
    project: any,
    phaseId: string,
    transaction?: Transaction
  ): Promise<void> {
    if (!project.phases || !Array.isArray(project.phases)) {
      return;
    }

    // Count unique employees allocated to this phase
    const uniqueEmployees = await AllocationModel.count({
      where: {
        projectId: project.id,
        phaseId: phaseId,
        isActive: true
      },
      distinct: true,
      col: 'employeeId',
      transaction
    });

    // Update the phase with the new member count
    const updatedPhases = project.phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          members: uniqueEmployees
        };
      }
      return phase;
    });

    await project.update({ phases: updatedPhases }, { transaction });
  }

  // Helper method to update phase financial data and members
  private async updatePhaseData(
    project: any,
    phaseId: string,
    plannedHoursDelta: number,
    plannedCostDelta: number,
    transaction?: Transaction
  ): Promise<void> {
    if (!project.phases || !Array.isArray(project.phases)) {
      return;
    }

    // Count unique employees allocated to this phase
    const uniqueEmployees = await AllocationModel.count({
      where: {
        projectId: project.id,
        phaseId: phaseId,
        isActive: true
      },
      distinct: true,
      col: 'employeeId',
      transaction
    });

    const updatedPhases = project.phases.map(phase => {
      if (phase.id === phaseId) {
        const newPlannedHours = Math.max(0, phase.plannedHours + plannedHoursDelta);
        const newPlannedCost = Math.max(0, phase.plannedCost + plannedCostDelta);
        const variance = newPlannedCost - phase.actualCost;
        
        return {
          ...phase,
          plannedHours: newPlannedHours,
          plannedCost: newPlannedCost,
          variance: variance,
          members: uniqueEmployees
        };
      }
      return phase;
    });

    await project.update({ phases: updatedPhases }, { transaction });
  }

  public async createAllocation(allocationData: Partial<Allocation>): Promise<Allocation> {
    const transaction = await AllocationModel.sequelize!.transaction();

    try {
      if (!allocationData.phaseId || typeof allocationData.phaseId !== "string") {
        throw new HttpException(400, "phaseId must be a non-empty string");
      }

      if (!allocationData.employeeId) {
        throw new HttpException(400, "Employee ID is required");
      }

      if (!allocationData.projectId) {
        throw new HttpException(400, "Project ID is required");
      }

      const employee = await Employee.findByPk(allocationData.employeeId, { transaction });
      if (!employee) {
        throw new HttpException(404, "Employee not found");
      }

      // Get the project to update phase information
      const project = await Project.findByPk(allocationData.projectId, { transaction });
      if (!project) {
        throw new HttpException(404, "Project not found");
      }

      // Calculate total planned hours from dailyHours
      const totalPlannedHours = allocationData.dailyHours?.reduce((total, dailyHour) => {
        return total + (dailyHour.hours || 0);
      }, 0) || 0;

      // Calculate planned cost
      const chargeOutRate = allocationData.chargeOutRate || 0;
      const totalPlannedCost = totalPlannedHours * chargeOutRate;

      // Create the allocation
      const allocation = await AllocationModel.create({
        ...allocationData,
        phaseId: allocationData.phaseId,
        normalizedPhaseIds: allocationData.phaseId,
      }, { transaction });

      await employee.update({ assigned: true }, { transaction });

      // Update project phase with new planned hours, cost, and members
      await this.updatePhaseData(
        project,
        allocationData.phaseId,
        totalPlannedHours,
        totalPlannedCost,
        transaction
      );

      // Create tasks based on dailyHours array
      if (allocationData.dailyHours && allocationData.dailyHours.length > 0) {
        const tasksToCreate = allocationData.dailyHours
          .filter(dailyHour => dailyHour.hours !== null && dailyHour.hours > 0)
          .map(dailyHour => ({
            employeeId: allocationData.employeeId!,
            phaseId: allocationData.phaseId!,
            projectId: allocationData.projectId!,
            allocationId: allocation.id,
            position: employee.position || 'Developer',
            taskTitle: `Task for ${dailyHour.date}`,
            taskDescription: `Auto-generated task for allocation on ${dailyHour.date}`,
            phase: allocationData.projectName || 'Development',
            priority: 'medium',
            estimatedHours: dailyHour.hours,
            actualHours: 0,
            taskDate: new Date(dailyHour.date),
            status: 'pending' as const,
            isSubmitted: false,
          }));

        await Task.bulkCreate(tasksToCreate, { transaction });
      }

      await transaction.commit();
      return allocation.get({ plain: true });

    } catch (error) {
      await transaction.rollback();
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

      // Get the project to update phase information
      const project = await Project.findByPk(allocation.projectId, { transaction });
      if (!project) {
        throw new HttpException(404, "Project not found");
      }

      // Get employee for task creation
      const employee = await Employee.findByPk(allocation.employeeId, { transaction });
      if (!employee) {
        throw new HttpException(404, "Employee not found");
      }

      // Handle phaseId (string) instead of phases (array)
      const oldPhaseId = allocation.phaseId;
      let newPhaseId = updates.phaseId ?? oldPhaseId;

      if (typeof newPhaseId !== "string" || !newPhaseId) {
        throw new HttpException(400, "phaseId must be a non-empty string");
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

      // Calculate old planned hours and cost for phase adjustment
      const oldDailyHours = allocation.dailyHours || [];
      const oldTotalPlannedHours = oldDailyHours.reduce((total, dailyHour) => {
        return total + (dailyHour.hours || 0);
      }, 0);
      const oldChargeOutRate = allocation.chargeOutRate || 0;
      const oldTotalPlannedCost = oldTotalPlannedHours * oldChargeOutRate;

      // Calculate new planned hours and cost
      const newDailyHours = updates.dailyHours || allocation.dailyHours || [];
      const newTotalPlannedHours = newDailyHours.reduce((total, dailyHour) => {
        return total + (dailyHour.hours || 0);
      }, 0);
      const newChargeOutRate = updates.chargeOutRate ?? allocation.chargeOutRate ?? 0;
      const newTotalPlannedCost = newTotalPlannedHours * newChargeOutRate;

      // Update phases - handle both same phase and phase change scenarios
      if (oldPhaseId === newPhaseId) {
        // Same phase - update with net difference
        const hoursDelta = newTotalPlannedHours - oldTotalPlannedHours;
        const costDelta = newTotalPlannedCost - oldTotalPlannedCost;
        
        await this.updatePhaseData(
          project,
          newPhaseId,
          hoursDelta,
          costDelta,
          transaction
        );
      } else {
        // Phase changed - remove from old phase and add to new phase
        await this.updatePhaseData(
          project,
          oldPhaseId,
          -oldTotalPlannedHours,
          -oldTotalPlannedCost,
          transaction
        );
        
        await this.updatePhaseData(
          project,
          newPhaseId,
          newTotalPlannedHours,
          newTotalPlannedCost,
          transaction
        );
      }

      // Remove tasks that are outside the new date range
      await Task.destroy({
        where: {
          allocationId: id,
          [Op.or]: [
            { taskDate: { [Op.lt]: finalStart } },
            { taskDate: { [Op.gt]: finalEnd } }
          ]
        },
        transaction
      });

      // Create new tasks based on updated dailyHours
      if (updates.dailyHours && updates.dailyHours.length > 0) {
        // First, remove all existing tasks for this allocation to avoid duplicates
        await Task.destroy({
          where: { allocationId: id },
          transaction
        });

        // Create new tasks
        const tasksToCreate = updates.dailyHours
          .filter(dailyHour => {
            const taskDate = new Date(dailyHour.date);
            return (
              dailyHour.hours !== null && 
              dailyHour.hours > 0 &&
              taskDate >= finalStart &&
              taskDate <= finalEnd
            );
          })
          .map(dailyHour => ({
            employeeId: allocation.employeeId,
            phaseId: newPhaseId,
            projectId: allocation.projectId,
            allocationId: id,
            position: employee.position || 'Developer',
            taskTitle: `Task for ${dailyHour.date}`,
            taskDescription: `Auto-generated task for allocation on ${dailyHour.date}`,
            phase: updates.projectName || allocation.projectName || 'Development',
            priority: 'medium',
            estimatedHours: dailyHour.hours,
            actualHours: 0,
            taskDate: new Date(dailyHour.date),
            status: 'pending' as const,
            isSubmitted: false,
          }));

        if (tasksToCreate.length > 0) {
          await Task.bulkCreate(tasksToCreate, { transaction });
        }
      }

      // Update allocation with new phaseId and normalizedPhaseIds for compatibility
      await allocation.update({
        ...updates,
        phaseId: newPhaseId,
        normalizedPhaseIds: newPhaseId,
        start: finalStart,
        end: finalEnd
      }, { transaction });

      await transaction.commit();
      return allocation.get({ plain: true });

    } catch (error) {
      await transaction.rollback();
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, "Failed to update allocation");
    }
  }

  private async performAllocationDeletion(allocation: AllocationModel, transaction: Transaction) {
    // Get the project to update phase information
    const project = await Project.findByPk(allocation.projectId, { transaction });
    
    if (project && project.phases && Array.isArray(project.phases)) {
      // Calculate planned hours and cost to remove from phase
      const dailyHours = allocation.dailyHours || [];
      const totalPlannedHours = dailyHours.reduce((total, dailyHour) => {
        return total + (dailyHour.hours || 0);
      }, 0);
      const chargeOutRate = allocation.chargeOutRate || 0;
      const totalPlannedCost = totalPlannedHours * chargeOutRate;

      // Update project phase by removing the allocation's contribution and updating members
      await this.updatePhaseData(
        project,
        allocation.phaseId,
        -totalPlannedHours,
        -totalPlannedCost,
        transaction
      );
    }

    // Delete all tasks associated with this allocation
    await Task.destroy({
      where: { allocationId: allocation.id },
      transaction
    });

    // Check remaining allocations for employee assignment status
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

    // After deletion, update the phase members count again to ensure accuracy
    if (project) {
      await this.updatePhaseMembers(project, allocation.phaseId, transaction);
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

      // Get affected phases for member count updates
      const affectedPhases = [...new Set(allocations.map(alloc => alloc.phaseId))];
      const project = await Project.findByPk(projectId, { transaction });

      // Check if there are tasks with status other than 'pending'
      const hasActiveTasks = await Task.count({
        where: { 
          employeeId,
          projectId,
          status: {
            [Op.not]: 'pending'
          }
        },
        transaction
      }) > 0;

      if (hasActiveTasks) {
        // If there are active tasks (in-progress, completed, etc.), mark allocations as inactive
        await AllocationModel.update(
          { 
            isActive: false,
            canOverride: true
          }, 
          { 
            where: { 
              employeeId,
              projectId 
            },
            transaction 
          }
        );
        
        // Also mark associated pending tasks as inactive or delete them
        await Task.destroy({
          where: {
            employeeId,
            projectId,
            status: 'pending'
          },
          transaction
        });

        // Update member counts for all affected phases
        if (project) {
          for (const phaseId of affectedPhases) {
            await this.updatePhaseMembers(project, phaseId, transaction);
          }
        }
      } else {
        // If no active tasks, perform full deletion
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

  public async deleteAllocationsByEmployeeAndPhase(employeeId: number, phaseId: string): Promise<void> {
    const transaction = await AllocationModel.sequelize!.transaction();

    try {
      const allocations = await AllocationModel.findAll({
        where: {
          employeeId,
          phaseId
        },
        transaction
      });

      if (!allocations || allocations.length === 0) {
        throw new HttpException(404, "No allocations found for this employee and phase");
      }

      // Get project for phase member updates
      const project = allocations.length > 0 ? 
        await Project.findByPk(allocations[0].projectId, { transaction }) : null;

      // Check if there are tasks with status other than 'pending'
      const hasActiveTasks = await Task.count({
        where: {
          employeeId,
          phaseId,
          status: {
            [Op.not]: 'pending'
          }
        },
        transaction
      }) > 0;

      if (hasActiveTasks) {
        // If there are active tasks, mark allocations as inactive
        await AllocationModel.update(
          { 
            isActive: false, 
            canOverride: true 
          },
          {
            where: { employeeId, phaseId },
            transaction
          }
        );
        
        // Delete only pending tasks
        await Task.destroy({
          where: {
            employeeId,
            phaseId,
            status: 'pending'
          },
          transaction
        });

        // Update phase members after marking as inactive
        if (project) {
          await this.updatePhaseMembers(project, phaseId, transaction);
        }
      } else {
        // If no active tasks, perform full deletion
        for (const allocation of allocations) {
          await this.performAllocationDeletion(allocation, transaction);
        }
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error instanceof HttpException
        ? error
        : new HttpException(500, "Error processing allocations deletion by phase");
    }
  }

  // Additional method to force delete allocations and all associated tasks (use with caution)
  public async forceDeleteAllocationsByEmployeeAndProject(employeeId: number, projectId: number): Promise<void> {
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

      // Force delete all allocations and their tasks regardless of task status
      for (const allocation of allocations) {
        await this.performAllocationDeletion(allocation, transaction);
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error instanceof HttpException
        ? error
        : new HttpException(500, "Error force deleting allocations");
    }
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
        },
        required: true
      }],
    });
  }

  public async getProjectAllocations(projectId: number): Promise<Allocation[]> {
    return await AllocationModel.findAll({
      where: { 
        projectId,
        isActive: true
      },
      include: [{
        model: Employee,
        as: 'employee',
        attributes: { exclude: ['password'] }, 
        include: [{
          model: AllocationModel,
          as: 'allocations',
          where: { isActive: true },
          attributes: [
            'id',
            'projectName',
            'employeeId',
            'projectId',
            'phaseId',
            'start',
            'end',
            'dailyHours',
            'status',
            'canOverride',
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
        phaseId,
        isActive: true
      },
      include: [{
        model: Employee,
        as: 'employee',
        attributes: { exclude: ['password'] },
        include: [{
          model: AllocationModel,
          as: 'allocations',
          where: { isActive: true },
          attributes: [
            'id',
            'projectName',
            'employeeId', 
            'projectId',
            'phaseId',
            'start',
            'end',
            'dailyHours',
            'status',
            'chargeOutRate',
            'chargeType',
            'canOverride',
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
    phaseId: string
  ): Promise<Allocation | null> {
    return await AllocationModel.findOne({
      where: {
        employeeId,
        projectId,
        phaseId,
        isActive: true
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
    excludeAllocationId?: number
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

  // Utility method to manually refresh phase members for a project
  public async refreshProjectPhaseMembers(projectId: number): Promise<void> {
    const transaction = await AllocationModel.sequelize!.transaction();
    
    try {
      const project = await Project.findByPk(projectId, { transaction });
      if (!project || !project.phases || !Array.isArray(project.phases)) {
        throw new HttpException(404, "Project not found or has no phases");
      }

      // Update member count for each phase
      for (const phase of project.phases) {
        await this.updatePhaseMembers(project, phase.id, transaction);
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error instanceof HttpException
        ? error        : new HttpException(500, "Error refreshing project phase members");
    }
  }

  // Method to get all active allocations for reporting
  public async getAllActiveAllocations(): Promise<Allocation[]> {
    return await AllocationModel.findAll({
      where: { isActive: true },
      include: [
        { 
          model: Employee,
          as: 'employee',
          attributes: { exclude: ['password'] }
        },
        { 
          model: Project,
          as: 'project'
        }
      ],
      order: [
        ['employeeId', 'ASC'],
        ['start', 'ASC']
      ]
    });
  }




// Add this method to your AllocationRepository class
public async getResourceWorkLogByPhase(phaseId: string): Promise<IResourceWorkLog[]> {
  try {
    // Get the project and phase information first
    const allocations = await AllocationModel.findAll({
      where: {
        phaseId,
        isActive: true
      },
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: { exclude: ['password'] }
        },
        {
          model: Project,
          as: 'project'
        }
      ]
    });

    if (!allocations || allocations.length === 0) {
      return [];
    }

    // Get the project to determine phase date range
    const project = allocations[0].project;
    if (!project || !project.phases || !Array.isArray(project.phases)) {
      throw new HttpException(404, "Project or phase information not found");
    }

    // Find the specific phase
    const phase = project.phases.find(p => p.id === phaseId);
    if (!phase) {
      throw new HttpException(404, "Phase not found in project");
    }

    const phaseStartDate = new Date(phase.startDate);
    const phaseEndDate = new Date(phase.endDate);

    // Get all tasks for this phase within the date range
    const tasks = await Task.findAll({
      where: {
        phaseId,
        taskDate: {
          [Op.between]: [phaseStartDate, phaseEndDate]
        }
      },
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    // Group allocations by employee
    const employeeAllocationsMap = new Map<number, {
      employee: any;
      allocations: any[];
    }>();

    allocations.forEach(allocation => {
      const employeeId = allocation.employeeId;
      if (!employeeAllocationsMap.has(employeeId)) {
        employeeAllocationsMap.set(employeeId, {
          employee: allocation.employee,
          allocations: []
        });
      }
      employeeAllocationsMap.get(employeeId)!.allocations.push(allocation);
    });

    // Group tasks by employee
    const employeeTasksMap = new Map<number, any[]>();
    tasks.forEach(task => {
      const employeeId = task.employeeId;
      if (!employeeTasksMap.has(employeeId)) {
        employeeTasksMap.set(employeeId, []);
      }
      employeeTasksMap.get(employeeId)!.push(task);
    });

    const resourceWorkLogs: IResourceWorkLog[] = [];

    // Process each employee
    for (const [employeeId, { employee, allocations: empAllocations }] of employeeAllocationsMap) {
      const monthlyData: IMonthlyWorkLog = {};
      let totalPlanned = 0;
      let totalWorked = 0;

      // Initialize monthly data structure for the phase date range
      const currentDate = new Date(phaseStartDate);
      while (currentDate <= phaseEndDate) {
        const month = currentDate.getMonth() + 1; // 1-based month
        const date = currentDate.getDate();

        if (!monthlyData[month]) {
          monthlyData[month] = {};
        }

        if (!monthlyData[month][date]) {
          monthlyData[month][date] = {
            date,
            plannedHours: 0,
            workedHours: 0
          };
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Process planned hours from allocations
      empAllocations.forEach(allocation => {
        if (allocation.dailyHours && Array.isArray(allocation.dailyHours)) {
          allocation.dailyHours.forEach((dailyHour: any) => {
            const dailyDate = new Date(dailyHour.date);
            
            // Only include dates within phase range
            if (dailyDate >= phaseStartDate && dailyDate <= phaseEndDate) {
              const month = dailyDate.getMonth() + 1;
              const date = dailyDate.getDate();
              const hours = dailyHour.hours || 0;

              if (monthlyData[month] && monthlyData[month][date]) {
                monthlyData[month][date].plannedHours += hours;
                totalPlanned += hours;
              }
            }
          });
        }
      });

      // Process worked hours from tasks
      const empTasks = employeeTasksMap.get(employeeId) || [];
      empTasks.forEach(task => {
        const taskDate = new Date(task.taskDate);
        
        // Only include dates within phase range
        if (taskDate >= phaseStartDate && taskDate <= phaseEndDate) {
          const month = taskDate.getMonth() + 1;
          const date = taskDate.getDate();
          const workedHours = task.actualHours || 0;

          if (monthlyData[month] && monthlyData[month][date]) {
            monthlyData[month][date].workedHours += workedHours;
            totalWorked += workedHours;
          }
        }
      });

      // Calculate variance (planned - worked)
      const variance = totalPlanned - totalWorked;

      resourceWorkLogs.push({
        resource: employee,
        monthlyData,
        totalPlanned,
        totalWorked,
        variance
      });
    }

    // Sort by employee name for consistent output
resourceWorkLogs.sort((a, b) => {
  const nameA = a.resource.fullName.toLowerCase();
  const nameB = b.resource.fullName.toLowerCase();
  return nameA.localeCompare(nameB);
});


    return resourceWorkLogs;

  } catch (error) {
    console.error("Get resource work log error:", error);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, "Failed to retrieve resource work log data");
  }
}

// Optional: Helper method to get work log for a specific date range instead of phase dates
public async getResourceWorkLogByPhaseAndDateRange(
  phaseId: string, 
  startDate: Date, 
  endDate: Date
): Promise<IResourceWorkLog[]> {
  try {
    // Similar logic but use provided date range instead of phase dates
    const allocations = await AllocationModel.findAll({
      where: {
        phaseId,
        isActive: true,
        [Op.or]: [
          {
            start: { [Op.between]: [startDate, endDate] }
          },
          {
            end: { [Op.between]: [startDate, endDate] }
          },
          {
            [Op.and]: [
              { start: { [Op.lte]: startDate } },
              { end: { [Op.gte]: endDate } }
            ]
          }
        ]
      },
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    if (!allocations || allocations.length === 0) {
      return [];
    }

    // Get tasks within the specified date range
    const tasks = await Task.findAll({
      where: {
        phaseId,
        taskDate: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    // Rest of the logic is similar to the main method
    // ... (implement similar processing logic)
    
    return []; // Placeholder - implement full logic similar to above
    
  } catch (error) {
    console.error("Get resource work log by date range error:", error);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, "Failed to retrieve resource work log data for date range");
  }
}

}