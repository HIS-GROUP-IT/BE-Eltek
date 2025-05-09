import { ProjectCostDataResponse } from "@/types/report.types";

export interface IStatisticsRepository {
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
  getProjectsCompletionRates(): Promise<Array<{ name: string; rate: number }>>;
  getProjectsApprovalHoursDetailed(): Promise<
    Array<{
      name: string;
      approved: number;
      rejected: number;
    }>
  >;
  getFinancialReport(): Promise<
    Array<{
      year: number;
      months: Array<{
        month: string;
        projects: Array<{
          name: string;
          estimatedCost: number;
          actualCost: number;
          budget: number; // Added budget
        }>;
        totalEstimated: number;
        totalActual: number;
      }>;
      totalEstimated: number;
      totalActual: number;
    }>
  >;
  getRemainingRevenueReport(): Promise<
    Array<{
      year: number;
      months: Array<{
        month: string;
        remainingRevenue: number;
        cost: number;
      }>;
    }>
  >;

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
  }>;
}
