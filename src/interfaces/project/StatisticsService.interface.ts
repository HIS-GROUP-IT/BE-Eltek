import { ProjectCostDataResponse } from "@/types/report.types";
import { Token } from "typedi";


export interface IStatisticsService {
  getGraphData(projectId: number): Promise<{
  budgetAnalysis: Array<{
    phase: string;
    plannedCost: number;
    actualCost: number;
  }>;
  hoursTracking: Array<{
    phase: string;
    plannedHours: number;
    actualHours: number;
    variance: number;
  }>;
}>
    getStatisticsDashboard(): Promise<{
        completionRates: Array<{ name: string; rate: number }>;
        approvalHours: Array<{ name: string; approved: number; rejected: number }>;
        financialReport: Array<{
          year: number;
          months: Array<{
            month: string;
            projects: Array<{
              name: string;
              estimatedCost: number;
              actualCost: number;
            }>;
            totalEstimated: number;
            totalActual: number;
          }>;
          totalEstimated: number;
          totalActual: number;
        }>;
        remainingRevenue: Array<{
          year: number;
          months: Array<{
            month: string;
            remainingRevenue: number;
            cost: number;
          }>;
        }>;
      }> ;
      getGeneralStatistics(): Promise<{
        activeEmployees: number;
        activeProjects: number;
        hoursThisMonth: number;
        commitments: number;
        totalRevenue: number;
        averageUtilization: number;
        completedTasks: number;
        pendingTasks: number;
      }>;
}

export const STATISTICS_SERVICE_TOKEN = new Token<IStatisticsService>(
  "IStatisticsService"
);
