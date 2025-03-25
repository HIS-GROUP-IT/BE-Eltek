import { Service } from "typedi";
import { IProjectRepository } from "@/interfaces/project/IProjectRepository.interface";
import { IProject } from "@/types/project.types";
import Project from "@/models/project/project.model";

@Service()
export class ProjectRepository implements IProjectRepository {
    public async createProject(projectData: Partial<IProject>): Promise<IProject> {
        return await Project.create(projectData);
    }

    public async updateProject(projectData: Partial<IProject>): Promise<IProject> {
        const project = await Project.findByPk(projectData.id);
        if (!project) throw new Error("Project not found");
        return await project.update(projectData);
    }

    public async deleteProject(projectId: number): Promise<void> {
        const project = await Project.findByPk(projectId);
        if (!project) throw new Error("Project not found");
        await project.destroy();
    }

    public async getAllProjects(): Promise<IProject[]> {
        return await Project.findAll();
    }

    public async getProjectById(projectId: number): Promise<IProject | null> {
        return await Project.findByPk(projectId);
    }
}
