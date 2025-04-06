import { Token } from 'typedi';
import { IProject } from "@/types/project.types";


export interface IProjectService {
    createProject(projectData: Partial<IProject>): Promise<IProject>;
    updateProject(projectData: Partial<IProject>): Promise<IProject>;
    // deleteProject(projectId: number): Promise<void>
    deleteProject(projectId: number): Promise<void>;
    getAllProjects(): Promise<IProject[]> ;
    getProjectById(projectId: number): Promise<IProject | null>;
    getProjectsByEmployee(employeeId: number): Promise<IProject[]>
    activeProject(
        projectData: Partial<IProject>
      ): Promise<IProject>
}


export const PROJECT_SERVICE_TOKEN = new Token<IProjectService>("IProjectService");