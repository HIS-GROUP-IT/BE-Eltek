import { ReportRepository } from './../../repositories/project/reports.repository';
import { IReportService, REPORT_SERVICE_TOKEN } from './../../interfaces/project/reportsService.interface';
import { Service } from "typedi";
import { HttpException } from "@/exceptions/HttpException"; 
import { ProjectCostDataResponse } from '@/types/report.types';


@Service({ id: REPORT_SERVICE_TOKEN, type: ReportService })
export class ReportService implements IReportService {
  constructor(private reportRepository: ReportRepository) {}
    public async getPhaseCompletionPercentages(projectId: number): Promise<[number, number]> {
        try {
            const phasesCompletionRate = await this.reportRepository.getPhaseCompletionPercentages(projectId);
            return phasesCompletionRate;
        } catch (error) {
            throw new HttpException(500,error.message)
        }
    }
    public  async  getProjectCostData(projectId: number): Promise<ProjectCostDataResponse[]> {
        try {
            const projectCostData = await this.reportRepository.getProjectCostData(projectId);
            return projectCostData;
        } catch (error) {
            throw new HttpException(500,error.message)
        }
    }

    public async getStructuredAllocations(projectId: number): Promise<any[]>{
        try {
            const structuredAllocation = await this.reportRepository.getStructuredAllocations(projectId);
            return structuredAllocation;
        } catch (error) {
            throw new HttpException(500, error.message)
        }
    }
    
}
