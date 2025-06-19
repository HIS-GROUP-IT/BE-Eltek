import { Service } from "typedi";
import { IEstimatedCost, IProject } from "@/types/project.types";
import { HttpException } from "@/exceptions/HttpException"; // Custom Exception handling class
import {
  IProjectService,
  PROJECT_SERVICE_TOKEN,
} from "@/interfaces/project/IProjectService";
import { ProjectRepository } from "@/repositories/project/project.repository";

@Service({ id: PROJECT_SERVICE_TOKEN, type: ProjectService })
export class ProjectService implements IProjectService {
  constructor(private projectRepository: ProjectRepository) {}

  public async createProject(projectData: IProject): Promise<IProject> {
    const existingProject = await this.projectRepository.getProjectByName(
      projectData.name
    );
    if (existingProject) {
      if (existingProject.status === "cancelled") {
        throw new HttpException(
          409,
          "Project name already exists and project is cancelled. Please reactivate the project to proceed."
        );
      } else {
        throw new HttpException(409, "Project name already exists");
      }
    }
    try {
      return await this.projectRepository.createProject(projectData);
    } catch (error) {
      throw new HttpException(500,error.message);
    }
  }

  public async updateProject(projectData: IProject): Promise<IProject> {
    try {
      return await this.projectRepository.updateProject(projectData);
    } catch (error) {
      throw new HttpException(500, `Error updating project: ${error.message}`);
    }
  }

  public async deleteProject(projectId: number): Promise<void> {
    try {
      await this.projectRepository.deleteProject(projectId);
    } catch (error) {
      throw new HttpException(500, `Error deleting project: ${error.message}`);
    }
  }

  public async getAllProjects(): Promise<IProject[]> {
    try {
      return await this.projectRepository.getAllProjects();
    } catch (error) {
      throw new HttpException(500, `Error retrieving projects: ${error}`);
    }
  }

  public async getProjectById(projectId: number): Promise<IProject | null> {
    try {
      const project = await this.projectRepository.getProjectById(projectId);
      if (!project) throw new HttpException(404, "Project not found");
      return project;
    } catch (error) {
      throw new HttpException(
        500,
        `Error retrieving project: ${error.message}`
      );
    }
  }

  public async activeProject(projectData: IProject): Promise<IProject> {
    try {
      return await this.projectRepository.activeProject(projectData);
    } catch (error) {
      throw new HttpException(
        500,
        `Error activating project: ${error.message}`
      );
    }
  }

  public async calculateEstimatedCost(
    projectId: number
  ): Promise<IEstimatedCost> {
    try {
      return await this.projectRepository.calculateEstimatedCost(projectId);
    } catch (error) {
      throw new HttpException(
        500,
        `Error calculating estimated cost: ${error.message}`
      );
    }
  }
    public async calculateEstimatedCostPerEmployee(projectId: number): Promise<Array<{ employeeId: number; estimatedCost: number }>> {
    try {
      return await this.projectRepository.calculateEstimatedCostPerEmployee(projectId);
    } catch (error) {
      throw new HttpException(
        500,
        `Error calculating estimated cost per employee: ${error.message}`
      );
    } 
    
} 

public async getProjectFinancials(projectId: number): Promise<any> {
  try {
    const fetchedFinancialData = await this.projectRepository.getProjectFinancials(projectId);
    return fetchedFinancialData;
  } catch (error) {
    throw new HttpException(500, error.message)
  }
}

public async getRemainingDays(id: number): Promise<number | null> {
  try {
    const numberOfRemainingDays = this.projectRepository.getRemainingDays(id);
    return numberOfRemainingDays;
  } catch (error) {
    throw new HttpException(500,error.message)
  }
}
public async resumeProject(id: number): Promise<IProject | null> {
  try {
    const resumedProject = await this.projectRepository.resumeProject(id);
    return resumedProject;
  } catch (error) {
    throw new HttpException(500,error.message)

  }
}
public async pauseProject(id: number): Promise<IProject | null> {
  try {
  const pausedProject = await this.projectRepository.pauseProject(id);
  return pausedProject;    
  } catch (error) {
    throw new HttpException(500,error.message)

  }
}

public async getProjectFinancialData(projectId: number): Promise<any> {
  try {
    const projectFinancialData = await this.projectRepository.getProjectFinancialData(projectId);
    return projectFinancialData;
  } catch (error) {
    throw new HttpException(500,error.message)
  }
}

}
