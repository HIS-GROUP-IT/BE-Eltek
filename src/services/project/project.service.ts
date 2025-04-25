import { Service } from "typedi";
import { IEstimatedCost, IProject } from "@/types/project.types";
import { HttpException } from "@/exceptions/HttpException"; // Custom Exception handling class
import { IProjectService, PROJECT_SERVICE_TOKEN } from "@/interfaces/project/IProjectService";
import { ProjectRepository } from "@/repositories/project/project.repository";

@Service({ id: PROJECT_SERVICE_TOKEN, type: ProjectService })
export class ProjectService implements IProjectService {
    constructor(private projectRepository: ProjectRepository) {}

    public async createProject(projectData: IProject): Promise<IProject> {

        const existingProject = await this.projectRepository.getProjectByName(projectData.name);
        if (existingProject) {
            if (existingProject.status === "cancelled") {
                throw new HttpException(409, "Project name already exists and project is cancelled. Please reactivate the project to proceed.");
            } else {
                throw new HttpException(409, "Project name already exists");
            }
        }
        try {
            return await this.projectRepository.createProject(projectData);
        } catch (error) {
            throw new HttpException(500, `Error creating project: ${error}`);
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
            throw new HttpException(500, `Error retrieving project: ${error.message}`);
        }
    }



    public async activeProject(projectData: IProject): Promise<IProject> {
        try {
            return await this.projectRepository.activeProject(projectData);
        } catch (error) {
            throw new HttpException(500, `Error activating project: ${error.message}`);
        }
    }

    public async calculateEstimatedCost(projectId: number): Promise<IEstimatedCost> {
        try {
            return await this.projectRepository.calculateEstimatedCost(projectId);
        } catch (error) {
            throw new HttpException(500, `Error calculating estimated cost: ${error.message}`);
        }
    }
}
