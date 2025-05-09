import { ProjectCostDataResponse } from "@/types/report.types";

export interface IReportRepository {
    getPhaseCompletionPercentages(projectId: number): Promise<[number, number]>;
    getProjectCostData(projectId: number): Promise<ProjectCostDataResponse[]>;
    getStructuredAllocations(projectId: number): Promise<any[]>
}