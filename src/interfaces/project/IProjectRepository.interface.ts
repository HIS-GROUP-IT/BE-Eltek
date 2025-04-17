import { IProject } from "@/types/project.types";


export interface IProjectRepository {
    createProject(projectData: Partial<IProject>): Promise<IProject>;
    updateProject(projectData: Partial<IProject>): Promise<IProject>;
    deleteProject(projectId: number): Promise<void>;
    deleteProject(projectId: number): Promise<void>
    getAllProjects(): Promise<IProject[]> ;
    getProjectById(projectId: number): Promise<IProject | null>;
    getProjectByName(name: string): Promise<IProject | null> ;
    activeProject(
        projectData: Partial<IProject>
      ): Promise<IProject>

}