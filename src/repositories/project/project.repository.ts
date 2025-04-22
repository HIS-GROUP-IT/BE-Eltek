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
        raw: true
      });
      return projects as IProject[];
    } catch (error) {
      throw new HttpException(500, "Error fetching projects");
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

    const tasks = await Task.findAll({
        where: { 
            status: "completed" // Add status filter here
        },
        include: [{
            model: AllocationModel,
            as: "allocation",
            where: { projectId: projectId },
            attributes: ["chargeOutRate"],
        }],
    });

    const monthlyCosts: IEstimatedCost = {};

    for (const task of tasks) {
        const allocation = task.allocation as AllocationModel;
        if (!allocation || allocation.chargeOutRate == null) continue;

        const actualHours = task.actualHours || 0;
        if (actualHours <= 0) continue;

        const taskDate = new Date(task.taskDate);
        const month = `${taskDate.getFullYear()}-${(taskDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;

        const cost = actualHours * allocation.chargeOutRate;
        monthlyCosts[month] = (monthlyCosts[month] || 0) + cost;
    }

    return monthlyCosts;
}


}