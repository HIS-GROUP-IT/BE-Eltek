import { Service } from "typedi";
import { IProjectRepository } from "@/interfaces/project/IProjectRepository.interface";
import Project from "@/models/project/project.model";
import Employee from "@/models/employee/employee.model"; 
import { HttpException } from "@/exceptions/HttpException";
import { Op, Transaction } from "sequelize";
import { IEstimatedCost, IProject, ProjectStatus } from "@/types/project.types";
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
      throw new HttpException(500, "Error creating project");
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
    // First verify the project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
        throw new HttpException(404, "Project not found");
    }

    // Get all allocations for this project
    const allocations = await AllocationModel.findAll({
        where: { projectId },
        attributes: ['id', 'employeeId', 'chargeOutRate', 'chargeType']
    });

    // Create a map of employeeId to their allocation details
    const allocationMap = new Map<number, AllocationModel>();
    allocations.forEach(allocation => {
        allocationMap.set(allocation.employeeId, allocation);
    });

    // Get all completed tasks for this project
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

        // Format month as YYYY-MM
        const taskDate = new Date(task.taskDate);
        const monthKey = `${taskDate.getFullYear()}-${(taskDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;

        // Calculate cost based on charge type
        let cost = 0;
        if (allocation.chargeType === "fixed") {
            cost = allocation.chargeOutRate; // Fixed cost per task
        } else {
            cost = actualHours * allocation.chargeOutRate; // Hourly rate
        }

        // Accumulate monthly costs
        monthlyCosts[monthKey] = (monthlyCosts[monthKey] || 0) + cost;
    }

    return monthlyCosts;
}
}