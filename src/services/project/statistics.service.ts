import { ReportRepository } from './../../repositories/project/reports.repository';
import { IReportService, REPORT_SERVICE_TOKEN } from './../../interfaces/project/reportsService.interface';
import { Service } from "typedi";
import { HttpException } from "@/exceptions/HttpException"; 
import { ProjectCostDataResponse } from '@/types/report.types';
import { IStatisticsService, STATISTICS_SERVICE_TOKEN } from '@/interfaces/project/StatisticsService.interface';
import { StatisticsRepository } from '@/repositories/project/statistics.repository';


@Service({ id: STATISTICS_SERVICE_TOKEN, type: StatisticsService })
export class StatisticsService implements IStatisticsService {
  constructor(private statisticsRepository: StatisticsRepository) {}
    
    public async getStatisticsDashboard(): Promise<{ completionRates: Array<{ name: string; rate: number; }>; approvalHours: Array<{ name: string; approved: number; rejected: number; }>; financialReport: Array<{ year: number; months: Array<{ month: string; projects: Array<{ name: string; estimatedCost: number; actualCost: number; }>; totalEstimated: number; totalActual: number; }>; totalEstimated: number; totalActual: number; }>; remainingRevenue: Array<{ year: number; months: Array<{ month: string; remainingRevenue: number; cost: number; }>; }>; }> {
        try {
            const fetchedStatistics = await this.statisticsRepository.getStatisticsDashboard();
            return fetchedStatistics;
        } catch (error) {
            throw new HttpException(500, error.message)
        }
    }
}
