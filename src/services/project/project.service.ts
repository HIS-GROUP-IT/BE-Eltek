import { Service } from "typedi";
import { IProject } from "@/types/project.types";
import { HttpException } from "@/exceptions/HttpException"; // Custom Exception handling class
import { IProjectService, PROJECT_SERVICE_TOKEN } from "@/interfaces/project/IProjectService";
import { ProjectRepository } from "@/repositories/project/project.repository";

@Service({ id: PROJECT_SERVICE_TOKEN, type: ProjectService })
export class ProjectService implements IProjectService {
    constructor(private projectRepository: ProjectRepository) {}

    public async createProject(projectData: Partial<IProject>): Promise<IProject> {
        try {
            return await this.projectRepository.createProject(projectData);
        } catch (error) {
            throw new HttpException(500, `Error creating project: ${error.message}`);
        }
    }

    public async updateProject(projectData: Partial<IProject>): Promise<IProject> {
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
            throw new HttpException(500, `Error retrieving projects: ${error.message}`);
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

    public async getProjectsByEmployee(employeeId: number): Promise<IProject[]> {
        try {
            const fetchedProjects = await this.projectRepository.getProjectsByEmployee(employeeId);
            return fetchedProjects;
        } catch (error) {
            throw new HttpException(400, error);
        }
    }

    

}
