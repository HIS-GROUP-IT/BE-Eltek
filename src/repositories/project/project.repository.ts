import { Allocation } from '@/types/employee.types';
import { Service } from "typedi";
import { IProjectRepository } from "@/interfaces/project/IProjectRepository.interface";
import Project from "@/models/project/project.model";
import Employee from "@/models/employee/employee.model"; 
import { HttpException } from "@/exceptions/HttpException";
import { Op, Transaction } from "sequelize";
import { IEstimatedCost, IProject, IProjectStatus, ProjectStatus } from "@/types/project.types";
import AllocationModel from "@/models/allocation/allocation.model";
import Task from "@/models/task/task.model";

type UpdateProjectData = IProject & { id?: number };

@Service()
export class ProjectRepository implements IProjectRepository {
  public async createProject(projectData: IProject): Promise<IProject> {
    try {
      const project = await Project.create(projectData);
      return project.get({ plain: true }) as IProject;
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  public async getProjectByName(name: string): Promise<IProject | null> {
    return await Project.findOne({ 
      where: { name }, 
      raw: true 
    }) as IProject | null;
  }

  public async updateProject(projectData: UpdateProjectData): Promise<IProject> {
    const transaction = await Project.sequelize!.transaction();
    
    try {
      const project = await Project.findByPk(projectData.id, { transaction });
      if (!project) throw new HttpException(404, "Project not found");
      
      await project.update(projectData, { transaction });
      await transaction.commit();
      
      return project.get({ plain: true }) as IProject;
    } catch (error) {
      await transaction.rollback();
      throw error instanceof HttpException 
        ? error 
        : new HttpException(500, "Error updating project");
    }
  }

  public async getAllProjects(): Promise<IProject[]> {
    try {
      const projects = await Project.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
          model: AllocationModel,
          as: 'allocations'
        }],
      });
      return projects as IProject[];
    } catch (error) {
      throw new HttpException(500,error.message);
    }
  }


  public async getProjectById(projectId: number): Promise<IProject | null> {
    try {
      const project = await Project.findByPk(projectId, {           
        raw: true,
        nest: true
      });
      return project as IProject | null;
    } catch (error) {
      throw new HttpException(500, "Error fetching project");
    }
  }


  public async activeProject(projectData: UpdateProjectData): Promise<IProject> {
    const transaction = await Project.sequelize!.transaction();
  
    try {
      const project = await Project.findOne({ 
        where: { name: projectData.name },
        transaction
      });
  
      if (!project) {
        throw new HttpException(404, "Project not found");
      }
  
      await project.update(projectData, { transaction });
      await transaction.commit();
      
      return project.get({ plain: true }) as IProject;
    } catch (error) {
      await transaction.rollback();
      throw error instanceof HttpException
        ? error
        : new HttpException(500, "Error updating project");
    }
  }
      
  public async deleteProject(projectId: number): Promise<void> {
    const transaction = await Project.sequelize!.transaction();
    
    try {
      const project = await Project.findByPk(projectId, { transaction });
      if (!project) {
        throw new HttpException(404, "Project not found");
      }    


      await project.update({ status: "cancelled" }, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error instanceof HttpException 
        ? error 
        : new HttpException(500, "Error deleting project");
    }
  }


  public async calculateEstimatedCost(projectId: number): Promise<IEstimatedCost> {
    const project = await Project.findByPk(projectId);
    if (!project) {
        throw new HttpException(404, "Project not found");
    }
    const allocations = await AllocationModel.findAll({
        where: { projectId },
        attributes: ['id', 'employeeId', 'chargeOutRate', 'chargeType']
    });
    const allocationMap = new Map<number, AllocationModel>();
    allocations.forEach(allocation => {
        allocationMap.set(allocation.employeeId, allocation);
    });
    const tasks = await Task.findAll({
        where: { 
            projectId,
            status: "completed"
        }
    });

    const monthlyCosts: IEstimatedCost = {};

    for (const task of tasks) {
        if (!task.employeeId) continue;

        const allocation = allocationMap.get(task.employeeId);
        if (!allocation?.chargeOutRate) continue;

        const actualHours = task.actualHours || 0;
        if (actualHours <= 0) continue;
        const taskDate = new Date(task.taskDate);
        const monthKey = `${taskDate.getFullYear()}-${(taskDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
        let cost = 0;
        if (allocation.chargeType === "fixed") {
            cost = allocation.chargeOutRate; 
        } else {
            cost = actualHours * allocation.chargeOutRate;
        }
        monthlyCosts[monthKey] = (monthlyCosts[monthKey] || 0) + cost;
    }
    return monthlyCosts;
}

public async calculateEstimatedCostPerEmployee(projectId: number): Promise<Array<{ employeeId: number; estimatedCost: number }>> {
  const project = await Project.findByPk(projectId);
  if (!project) {
      throw new HttpException(404, "Project not found");
  }
  const allocations = await AllocationModel.findAll({
      where: { projectId },
      attributes: ['id', 'employeeId', 'chargeOutRate', 'chargeType']
  });
  const allocationMap = new Map<number, AllocationModel>();
  allocations.forEach(allocation => {
      allocationMap.set(allocation.employeeId, allocation);
  });
  const tasks = await Task.findAll({
      where: { 
          projectId,
          status: "completed"
      }
  });
  const employeeCosts = new Map<number, number>();
  for (const task of tasks) {
      if (!task.employeeId) continue;

      const allocation = allocationMap.get(task.employeeId);
      if (!allocation?.chargeOutRate) continue;
      const actualHours = task.actualHours || 0;
      if (actualHours <= 0) continue;
      let cost = 0;
      if (allocation.chargeType === "fixed") {
          cost = allocation.chargeOutRate; 
      } else {
          cost = actualHours * allocation.chargeOutRate; 
      }
      const currentTotal = employeeCosts.get(task.employeeId) || 0;
      employeeCosts.set(task.employeeId, currentTotal + cost);
  }
  return Array.from(employeeCosts, ([employeeId, estimatedCost]) => ({
      employeeId,
      estimatedCost
  }));
}

async pauseProject(id: number): Promise<IProject | null> {
  const project = await Project.findByPk(id);
  if (!project || project.status === 'on hold') return project;

  const updatedPauseHistory = [
    ...project.pauseHistory,
    { pausedAt: new Date(), resumedAt: null }
  ];

  await project.update({
    status: 'on hold',
    isPaused: true,
    lastPausedAt: new Date(),
    pauseHistory: updatedPauseHistory
  });

  return project.get({ plain: true });
}

async resumeProject(id: number): Promise<IProject | null> {
  const project = await Project.findByPk(id);
  if (!project || project.status !== 'on hold') return project;

  const updatedPauseHistory = [...project.pauseHistory];
  const lastPause = updatedPauseHistory[updatedPauseHistory.length - 1];
  
  if (lastPause && !lastPause.resumedAt) {
    lastPause.resumedAt = new Date();
  }

  await project.update({
    status: 'on going',
    isPaused: false,
    pauseHistory: updatedPauseHistory
  });

  return project.get({ plain: true });
}

async getRemainingDays(id: number): Promise<number | null> {
  const project = await Project.findByPk(id);
  if (!project || !project.endDate) return null;

  const now = new Date();
  let totalPausedMs = 0;

  for (const pause of project.pauseHistory) {
    const pausedAt = new Date(pause.pausedAt);
    const resumedAt = pause.resumedAt ? new Date(pause.resumedAt) : now;
    totalPausedMs += resumedAt.getTime() - pausedAt.getTime();
  }

  const adjustedNow = new Date(now.getTime() - totalPausedMs);
  const endDate = new Date(project.endDate);
  
  const diffMs = endDate.getTime() - adjustedNow.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

public async getProjectFinancials(projectId: number) {
  try {
    const project = await Project.findByPk(projectId, {
      attributes: ['id', 'budget']
    });

    if (!project) {
      throw new HttpException(404, "Project not found");
    }

    // Get current month/year boundaries (UTC to avoid timezone issues)
    const currentDate = new Date();
    const currentYear = currentDate.getUTCFullYear();
    const currentMonth = currentDate.getUTCMonth() + 1; // 1-12
    const firstDayOfMonth = new Date(Date.UTC(currentYear, currentMonth - 1, 1));
    const lastDayOfMonth = new Date(Date.UTC(currentYear, currentMonth, 0, 23, 59, 59));

    // Fetch tasks completed in CURRENT MONTH
    const completedTasks = await Task.findAll({
      where: {
        projectId,
        status: 'completed',
        taskDate: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth]
        }
      },
      attributes: ['id', 'actualHours', 'employeeId', 'taskDate'],
      raw: true
    });

    const employeeIds = [...new Set(completedTasks.map(t => t.employeeId))];
    const allocations = await AllocationModel.findAll({
      where: {
        projectId,
        employeeId: employeeIds,
        start: { [Op.lte]: lastDayOfMonth },
        end: { [Op.gte]: firstDayOfMonth }
      },
      raw: true
    });

    const rateMap = new Map();
    allocations.forEach(alloc => {
      rateMap.set(alloc.employeeId, alloc.chargeOutRate || 0);
    });

    let totalCost = 0;
    completedTasks.forEach(task => {
      const rate = rateMap.get(task.employeeId) || 0;
      const hours = Number(task.actualHours) || 0;
      totalCost += hours * rate;
    });

    // Calculate Monthly Estimated Cost (current month allocations)
    let monthlyEstimatedCost = allocations.reduce((sum, alloc) => {
      return sum + ((alloc.dailyHours[0].hours || 0) * 4 * (alloc.chargeOutRate || 0));
    }, 0);

    return {
      budget: Number(project.budget),
      totalCost,
      monthlyEstimatedCost,
      remainingRevenue: Number(project.budget) - totalCost,
    };

  } catch (error) {
    console.error('Error in getProjectFinancials:', error);
    throw new HttpException(500, "Error calculating project financials");
  }
}


public async getProjectFinancialData(projectId: number): Promise<any> {
  const project = await Project.findByPk(projectId);
  if (!project) {
      throw new Error('Project not found');
  }

  const allocations = await AllocationModel.findAll({
    where: { projectId },
    include: [
      { model: Employee, as: 'employee' },
      {
        model: Task,
        as: 'tasks',
        where: { status: 'completed' }, 
        required: false,
      },
    ],
  });
  
  const taskMap = new Map<string, number>();
  for (const allocation of allocations) {
      for (const task of allocation.tasks) {
          const taskDate = new Date(task.taskDate);
          const year = taskDate.getFullYear();
          const month = taskDate.getMonth() + 1; // 1-12
          const key = `${allocation.employeeId}-${year}-${month}`;
          taskMap.set(key, (taskMap.get(key) || 0) + (task.actualHours || 0));
      }
  }

  const result = {};

  for (const allocation of allocations) {
      const employee = allocation.employee;
      const employeeName = employee.fullName;
      const chargeOutRate = allocation.chargeOutRate || 0;
      const hoursWeek = allocation.dailyHours[0].hours;
      const allocationStart = new Date(allocation.start);
      const allocationEnd = new Date(allocation.end);

      let currentMonth = new Date(allocationStart.getFullYear(), allocationStart.getMonth(), 1);
      const endMonth = new Date(allocationEnd.getFullYear(), allocationEnd.getMonth(), 1);

      while (currentMonth <= endMonth) {
          const year = currentMonth.getFullYear();
          const monthNumber = currentMonth.getMonth() + 1;
          const monthName = new Date(year, currentMonth.getMonth(), 1).toLocaleString('default', { month: 'long' });

          const firstDayOfMonth = new Date(year, currentMonth.getMonth(), 1);
          const lastDayOfMonth = new Date(year, currentMonth.getMonth() + 1, 0);

          const overlapStart = allocationStart > firstDayOfMonth ? allocationStart : firstDayOfMonth;
          const overlapEnd = allocationEnd < lastDayOfMonth ? allocationEnd : lastDayOfMonth;

          if (overlapStart > overlapEnd) {
              currentMonth.setMonth(currentMonth.getMonth() + 1);
              continue;
          }

          const timeDiff = overlapEnd.getTime() - overlapStart.getTime();
          const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
          const weeks = days / 7;
          const estimatedCost = hoursWeek * weeks * chargeOutRate;

          const taskKey = `${allocation.employeeId}-${year}-${monthNumber}`;
          const actualHours = taskMap.get(taskKey) || 0;
          const actualCost = actualHours * chargeOutRate;

          if (!result[year]) result[year] = {};
          if (!result[year][monthName]) result[year][monthName] = [];

          const existingEntryIndex = result[year][monthName].findIndex((e: any) => e.name === employeeName);
          if (existingEntryIndex === -1) {
              result[year][monthName].push({
                  name: employeeName,
                  actualCost,
                  estimatedCost,
                  budget: project.budget,
              });
          } else {
              const existing = result[year][monthName][existingEntryIndex];
              existing.actualCost += actualCost;
              existing.estimatedCost += estimatedCost;
          }

          currentMonth.setMonth(currentMonth.getMonth() + 1);
      }
  }

  return result;
}
}