import { Service } from "typedi";
import Project from "@/models/project/project.model";
import { HttpException } from "@/exceptions/HttpException";
import { Op, Transaction } from "sequelize";
import {  IProject } from "@/types/project.types";
import { IReportRepository } from "@/interfaces/project/reportsRepository.interface";
import AllocationModel from "@/models/allocation/allocation.model";
import Employee from "@/models/employee/employee.model";
import Task from "@/models/task/task.model";
import { ProjectCostDataResponse } from "@/types/report.types";
import { Allocation } from "@/types/employee.types";

type UpdateProjectData = IProject & { id?: number };
const MONTHS = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
@Service()
export class ReportRepository implements IReportRepository {
    public async getPhaseCompletionPercentages(projectId: number): Promise<[number, number]> {
        try {
          const project = await Project.findByPk(projectId);
          
          if (!project) {
            throw new HttpException(404, "Project not found");         }
          
          const phases = project.phases;
          
          if (!phases || phases.length === 0) {
            return [0, 100]; 
          }
          
          let completedCount = 0;
          
          phases.forEach(phase => {
            if (phase.completionRate === 100) {
              completedCount++;
            }
          });
          
          const completedPercentage = (completedCount / phases.length) * 100;
          const notCompletedPercentage = 100 - completedPercentage;
          
          return [completedPercentage, notCompletedPercentage];
        } catch (error) {
          if (error instanceof HttpException) {
            throw error;
          }
          throw new HttpException(500, "Error calculating phase completion percentages");
        }
      }

      public async getProjectCostData(projectId: number): Promise<ProjectCostDataResponse[]> {
        try {
          const project = await Project.findByPk(projectId, {
            include: [
                {
                  model: AllocationModel,
                  as: 'allocations',
                  include: [
                    {
                      model: Employee,
                      as: 'employee'
                    }
                  ]
                },
                {
                  model: Task,
                  as: 'tasks'
                }
              ],
              raw: false 
          });
    
          if (!project) {
            throw new HttpException(404, "Project not found");
          }
    
          const startYear = new Date(project.startDate).getFullYear();
          const endYear = new Date(project.endDate).getFullYear();
          const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
    
          return years.map(year => this.calculateYearlyCosts(year, project));
        } catch (error) {
          if (error instanceof HttpException) throw error;
          throw new HttpException(500, error.message);
        }
      }
    
      private calculateYearlyCosts(year: number, project: IProject): ProjectCostDataResponse {
        const monthlyEstimated: Record<string, number> = {};
        const monthlyActual: Record<string, number> = {};
        MONTHS.forEach(month => {
          monthlyEstimated[month] = 0;
          monthlyActual[month] = 0;
        });
            project.allocations?.forEach(allocation => {
          const allocationStart = new Date(allocation.start);
          const allocationEnd = new Date(allocation.end);
          const chargeRate = allocation.chargeOutRate || 0; 
    
          const monthsInYear = this.getMonthsInYear(allocationStart, allocationEnd, year);
    
          monthsInYear.forEach(month => {
            const weeksInMonth = 4; 
            monthlyEstimated[month] += allocation.hoursWeek * weeksInMonth * chargeRate;
          });
        });
    
        project.tasks?.forEach(task => {
          const taskDate = new Date(task.taskDate);
          if (taskDate.getFullYear() === year) {
            const month = MONTHS[taskDate.getMonth()];
            const chargeRate = this.getEmployeeChargeRate(task.employeeId, project.allocations);
            monthlyActual[month] += (task.actualHours || 0) * chargeRate;
          }
        });
    
        return {
          year,
          budget: project.budget,
          estimatedCost: monthlyEstimated,
          actualCost: monthlyActual
        };
      }
    
      private getMonthsInYear(start: Date, end: Date, targetYear: number): string[] {
        const months: string[] = [];
        const current = new Date(start);
        
        while (current <= end && current.getFullYear() <= targetYear) {
          if (current.getFullYear() === targetYear) {
            months.push(MONTHS[current.getMonth()]);
          }
          current.setMonth(current.getMonth() + 1);
        }
        
        return [...new Set(months)]; 
      }
    
      private getEmployeeChargeRate(employeeId: number, allocations: Allocation[]): number {
        const allocation = allocations.find(a => a.employeeId === employeeId);
        return allocation?.chargeOutRate || 0;
      }

      public async getStructuredAllocations(projectId: number): Promise<any[]> {
        try {
            const project = await Project.findByPk(projectId, {
                include: [
                    {
                        model: AllocationModel,
                        as: 'allocations',
                        include: [{
                            model: Employee,
                            as: 'employee'
                        }]
                    },
                    {
                        model: Task,
                        as: 'tasks'
                    }
                ]
            });
    
            if (!project) {
                throw new HttpException(404, "Project not found");
            }
    
            // Create phase ID to name mapping
            const phaseMap = new Map(project.phases.map(phase => [phase.id, phase.name]));
    
            // Create task maps for quick lookup
            const taskMaps = {
                count: new Map<number, Map<string, Map<string, number>>>(),
                hours: new Map<number, Map<string, Map<string, number>>>(),
            };
    
            project.tasks?.forEach(task => {
                const taskDate = new Date(task.taskDate);
                const monthKey = `${taskDate.getFullYear()}-${taskDate.getMonth()}`;
                const phaseId = task.phaseId;
    
                // Update task count map
                if (!taskMaps.count.has(task.employeeId)) {
                    taskMaps.count.set(task.employeeId, new Map());
                }
                const employeePhaseMap = taskMaps.count.get(task.employeeId)!;
                if (!employeePhaseMap.has(phaseId)) {
                    employeePhaseMap.set(phaseId, new Map());
                }
                const monthCountMap = employeePhaseMap.get(phaseId)!;
                monthCountMap.set(monthKey, (monthCountMap.get(monthKey) || 0) + 1);
    
                // Update actual hours map
                if (!taskMaps.hours.has(task.employeeId)) {
                    taskMaps.hours.set(task.employeeId, new Map());
                }
                const employeeHoursMap = taskMaps.hours.get(task.employeeId)!;
                if (!employeeHoursMap.has(phaseId)) {
                    employeeHoursMap.set(phaseId, new Map());
                }
                const monthHoursMap = employeeHoursMap.get(phaseId)!;
                monthHoursMap.set(monthKey, (monthHoursMap.get(monthKey) || 0) + (task.actualHours || 0));
            });
    
            // Generate all months in project duration
            const startDate = new Date(project.startDate);
            const endDate = new Date(project.endDate);
            const result = [];
            
            let currentYear = startDate.getFullYear();
            const endYear = endDate.getFullYear();
    
            while (currentYear <= endYear) {
                const yearEntry = { year: currentYear, months: {} as Record<string, any[]> };
                
                for (let month = 0; month < 12; month++) {
                    const monthStart = new Date(currentYear, month, 1);
                    const monthEnd = new Date(currentYear, month + 1, 0);
                    
                    // Skip months before project start or after project end
                    if (monthStart > endDate || monthEnd < startDate) continue;
    
                    const monthKey = MONTHS[month];
                    const allocationsData = [];
    
                    // Process all allocations
                    project.allocations?.forEach(allocation => {
                        const allocStart = new Date(allocation.start);
                        const allocEnd = new Date(allocation.end);
    
                        // Check if allocation overlaps with current month
                        if (allocStart <= monthEnd && allocEnd >= monthStart) {
                            allocation.phases.forEach(phaseId => {
                                const phaseName = phaseMap.get(phaseId) || 'Unknown Phase';
                                const yearMonthKey = `${currentYear}-${month}`;
    
                                // Get task data for this employee+phase+month
                                const taskCount = taskMaps.count.get(allocation.employeeId)
                                    ?.get(phaseId)
                                    ?.get(yearMonthKey) || 0;
    
                                const actualHours = taskMaps.hours.get(allocation.employeeId)
                                    ?.get(phaseId)
                                    ?.get(yearMonthKey) || 0;
    
                                // Calculate costs
                                const chargeRate = Number(allocation.chargeOutRate) || 0;
                                const estimatedCost = (Number(allocation.hoursWeek) * 4) * chargeRate;
                                const actualCost = actualHours * chargeRate;
    
                                allocationsData.push({
                                    id: allocation.id,
                                    projectName: allocation.projectName,
                                    employeeId: allocation.employeeId,
                                    projectId: allocation.projectId,
                                    phase: phaseName,
                                    start: allocation.start,
                                    end: allocation.end,
                                    hoursWeek: allocation.hoursWeek,
                                    status: allocation.status,
                                    chargeOutRate: allocation.chargeOutRate,
                                    chargeType: allocation.chargeType,
                                    employee: allocation.employee,
                                    numberOfTask: taskCount,
                                    hoursWorked: actualHours, // Added this field
                                    actualCost,
                                    estimatedCost
                                });
                            });
                        }
                    });
    
                    if (allocationsData.length > 0) {
                        yearEntry.months[monthKey] = allocationsData;
                    }
                }
    
                if (Object.keys(yearEntry.months).length > 0) {
                    result.push(yearEntry);
                }
                currentYear++;
            }
    
            return result;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(500, "Error generating structured allocations");
        }
    }
}