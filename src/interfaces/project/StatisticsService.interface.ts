import { ProjectCostDataResponse } from "@/types/report.types";
import { Token } from "typedi";


export interface IStatisticsService {
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
      }> 
}

export const STATISTICS_SERVICE_TOKEN = new Token<IStatisticsService>(
  "IStatisticsService"
);
