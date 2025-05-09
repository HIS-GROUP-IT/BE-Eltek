import { Token } from "typedi";
import { IEstimatedCost, IProject } from "@/types/project.types";

export interface IProjectService {
  createProject(projectData: Partial<IProject>): Promise<IProject>;
  updateProject(projectData: Partial<IProject>): Promise<IProject>;
  deleteProject(projectId: number): Promise<void>;
  getAllProjects(): Promise<IProject[]>;
  getProjectById(projectId: number): Promise<IProject | null>;
  activeProject(projectData: Partial<IProject>): Promise<IProject>;
  calculateEstimatedCost(projectId: number): Promise<IEstimatedCost>;

  calculateEstimatedCostPerEmployee(
    projectId: number
  ): Promise<Array<{ employeeId: number; estimatedCost: number }>>;
  getRemainingDays(id: number): Promise<number | null>;
  pauseProject(id: number): Promise<IProject | null>;
  resumeProject(id: number): Promise<IProject | null>;
  getProjectFinancials(projectId: number):Promise<any>;
  getProjectFinancialData(projectId: number): Promise<any> 
}

export const PROJECT_SERVICE_TOKEN = new Token<IProjectService>(
  "IProjectService"
);
