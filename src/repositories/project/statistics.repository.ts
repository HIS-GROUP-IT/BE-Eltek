import { Service } from "typedi";
import Project from "@/models/project/project.model";
import { HttpException } from "@/exceptions/HttpException";
import { Op, Transaction } from "sequelize";
import { IProject } from "@/types/project.types";
import { IStatisticsRepository } from "@/interfaces/project/StatisticsRepository.interface";
import { Phase } from "@/types/project.types";
import Task from "@/models/task/task.model";
import AllocationModel from "@/models/allocation/allocation.model";
import Employee from "@/models/employee/employee.model";

@Service()
export class StatisticsRepository implements IStatisticsRepository {
  public async getProjectsCompletionRates(): Promise<
    Array<{ name: string; rate: number }>
  > {
    try {
      const projects = await Project.findAll({
        attributes: ["id", "name", "phases"],
        where: {
          status: {
            [Op.notIn]: ["cancelled"],
          },
        },
      });
      const projectsWithRates = projects.map((project) => {
        const phases = project.phases as Phase[];

        if (!phases || phases.length === 0) {
          return {
            name: project.name,
            rate: 0,
          };
        }

        const totalRate = phases.reduce(
          (sum, phase) => sum + (phase.completionRate || 0),
          0
        );
        const averageRate = totalRate / phases.length;

        return {
          name: project.name,
          rate: Math.round(averageRate * 100) / 100,
        };
      });

      return projectsWithRates;
    } catch (error) {
      throw new HttpException(
        500,
        "Error calculating project completion rates"
      );
    }
  }
  public async getProjectsApprovalHoursDetailed(): Promise<
    Array<{
      name: string;
      approved: number;
      rejected: number;
    }>
  > {
    try {
      const projects = await Project.findAll({
        attributes: ["id", "name"],
        where: {
          status: {
            [Op.notIn]: ["cancelled"],
          },
        },
        raw: true,
      });
      const projectsWithHours = await Promise.all(
        projects.map(async (project) => {
          const hours = await Task.findAll({
            attributes: [
              [
                Task.sequelize.fn(
                  "SUM",
                  Task.sequelize.literal(
                    `CASE WHEN status = 'completed' THEN actualHours ELSE 0 END`
                  )
                ),
                "approvedHours",
              ],
              [
                Task.sequelize.fn(
                  "SUM",
                  Task.sequelize.literal(
                    `CASE WHEN status = 'rejected' THEN actualHours ELSE 0 END`
                  )
                ),
                "rejectedHours",
              ],
            ],
            where: {
              projectId: project.id,
              status: {
                [Op.in]: ["completed", "rejected"],
              },
            },
            raw: true,
          });

          return {
            name: project.name,
            approved: parseFloat(hours[0]?.approvedHours || "0") || 0,
            rejected: parseFloat(hours[0]?.rejectedHours || "0") || 0,
          };
        })
      );

      return projectsWithHours;
    } catch (error) {
      throw new HttpException(500, error.message);
    }
  }

  public async getFinancialReport(): Promise<
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
> {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: AllocationModel,
          as: 'allocations',
          attributes: ['employeeId', 'start', 'end', 'hoursWeek', 'chargeOutRate']
        },
        {
          model: Task,
          as: 'tasks',
          attributes: ['employeeId', 'taskDate', 'actualHours']
        }
      ]
    });

    // Map<year, Map<month, { projects, totals }>>
    const report = new Map<number, Map<number, {
      projects: Map<string, { estimated: number; actual: number; budget: number }>; // Added budget
      totalEstimated: number;
      totalActual: number;
    }>>();

    // Process each project
    projects.forEach(project => {
      const projectBudget = Number(project.budget) || 0; // Extract project budget

      // Create employee rate map
      const employeeRateMap = new Map<number, number>(
        project.allocations.map(alloc => [
          alloc.employeeId,
          Number(alloc.chargeOutRate) || 0
        ])
      );

      // Process allocations for monthly estimated costs
      project.allocations.forEach(alloc => {
        const start = new Date(alloc.start);
        const end = new Date(alloc.end);
        const monthlyCost = (Number(alloc.hoursWeek) * 4 * (Number(alloc.chargeOutRate) || 0));

        // Get all months this allocation covers
        const current = new Date(start.getFullYear(), start.getMonth());
        const endMonth = new Date(end.getFullYear(), end.getMonth());

        while (current <= endMonth) {
          const year = current.getFullYear();
          const month = current.getMonth();

          if (!report.has(year)) {
            report.set(year, new Map());
          }
          const yearData = report.get(year)!;

          if (!yearData.has(month)) {
            yearData.set(month, {
              projects: new Map(),
              totalEstimated: 0,
              totalActual: 0
            });
          }

          const monthData = yearData.get(month)!;
          const projectKey = project.name;

          // Update estimated cost and set budget if new entry
          if (!monthData.projects.has(projectKey)) {
            monthData.projects.set(projectKey, { 
              estimated: 0, 
              actual: 0,
              budget: projectBudget // Set budget here
            });
          }
          monthData.projects.get(projectKey)!.estimated += monthlyCost;
          monthData.totalEstimated += monthlyCost;

          current.setMonth(current.getMonth() + 1);
        }
      });

      // Process tasks for monthly actual costs
      project.tasks.forEach(task => {
        const taskDate = new Date(task.taskDate);
        const year = taskDate.getFullYear();
        const month = taskDate.getMonth();
        const hours = task.actualHours || 0;
        const rate = employeeRateMap.get(task.employeeId) || 0;
        const cost = hours * rate;

        if (!report.has(year)) {
          report.set(year, new Map());
        }
        const yearData = report.get(year)!;

        if (!yearData.has(month)) {
          yearData.set(month, {
            projects: new Map(),
            totalEstimated: 0,
            totalActual: 0
          });
        }

        const monthData = yearData.get(month)!;
        const projectKey = project.name;

        // Update actual cost and set budget if new entry
        if (!monthData.projects.has(projectKey)) {
          monthData.projects.set(projectKey, { 
            estimated: 0, 
            actual: 0,
            budget: projectBudget // Set budget here
          });
        }
        monthData.projects.get(projectKey)!.actual += cost;
        monthData.totalActual += cost;
      });
    });

    // Convert to final output format
    return Array.from(report.entries())
      .sort(([yearA], [yearB]) => yearA - yearB)
      .map(([year, months]) => {
        const monthEntries = Array.from(months.entries())
          .sort(([monthA], [monthB]) => monthA - monthB)
          .map(([month, data]) => ({
            month: new Date(year, month).toLocaleString('default', { month: 'long' }),
            projects: Array.from(data.projects.entries()).map(([name, costs]) => ({
              name,
              estimatedCost: costs.estimated,
              actualCost: costs.actual,
              budget: costs.budget // Include budget in output
            })),
            totalEstimated: data.totalEstimated,
            totalActual: data.totalActual
          }));

        return {
          year,
          months: monthEntries,
          totalEstimated: monthEntries.reduce((sum, m) => sum + m.totalEstimated, 0),
          totalActual: monthEntries.reduce((sum, m) => sum + m.totalActual, 0)
        };
      });
  } catch (error) {
    throw new HttpException(500, "Error generating financial report");
  }
}
public async getRemainingRevenueReport(): Promise<
  Array<{
    year: number;
    months: Array<{
      month: string;
      remainingRevenue: number;
      cost: number;
    }>;
  }>
> {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: AllocationModel,
          as: 'allocations',
          attributes: ['employeeId', 'chargeOutRate']
        },
        {
          model: Task,
          as: 'tasks',
          attributes: ['employeeId', 'taskDate', 'actualHours']
        }
      ]
    });

    const totalBudget = projects.reduce((sum, project) => sum + Number(project.budget), 0);

    // Map<year, Map<month, cost>>
    const monthlyCosts = new Map<number, Map<number, number>>();

    // Process tasks
    projects.forEach(project => {
      const employeeRateMap = new Map<number, number>();
      project.allocations.forEach(alloc => {
        employeeRateMap.set(alloc.employeeId, Number(alloc.chargeOutRate) || 0);
      });

      project.tasks.forEach(task => {
        const taskDate = new Date(task.taskDate);
        const year = taskDate.getFullYear();
        const month = taskDate.getMonth(); // 0 = January
        const rate = employeeRateMap.get(task.employeeId) || 0;
        const cost = (Number(task.actualHours) || 0) * rate;

        if (!monthlyCosts.has(year)) {
          monthlyCosts.set(year, new Map<number, number>());
        }

        const yearMap = monthlyCosts.get(year)!;
        yearMap.set(month, (yearMap.get(month) || 0) + cost);
      });
    });

    const sortedYears = Array.from(monthlyCosts.keys()).sort((a, b) => a - b);
    let cumulativeCost = 0;
    const result = [];

    for (const year of sortedYears) {
      const monthsMap = monthlyCosts.get(year)!;
      const months = [];

      for (let month = 0; month < 12; month++) {
        const cost = monthsMap.get(month) || 0;
        cumulativeCost += cost;
        const remainingRevenue = totalBudget - cumulativeCost;

        months.push({
          month: new Date(year, month).toLocaleString('default', { month: 'long' }),
          remainingRevenue,
          cost
        });
      }

      result.push({ year, months });
    }

    return result;
  } catch (error) {
    throw new HttpException(500, "Error generating remaining revenue report");
  }
}

public async getStatisticsDashboard(): Promise<{
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
  }> {
    try {
      const [
        completionRates,
        approvalHours,
        financialReport,
        remainingRevenue
      ] = await Promise.all([
        this.getProjectsCompletionRates(),
        this.getProjectsApprovalHoursDetailed(),
        this.getFinancialReport(),
        this.getRemainingRevenueReport()
      ]);
  
      return {
        completionRates,
        approvalHours,
        financialReport,
        remainingRevenue
      };
    } catch (error) {
      throw new HttpException(500, "Error generating statistics dashboard");
    }
  }

}
