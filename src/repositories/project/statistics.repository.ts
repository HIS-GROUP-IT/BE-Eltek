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
import Leave from "@/models/leave/leave.model";

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

    
        const averageRate = 0 / phases.length;

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

public async getGraphData(projectId: number): Promise<{
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
}> {
  try {
    const project = await Project.findOne({
      attributes: ["id", "name", "phases"],
      include: [
        {
          model: AllocationModel,
          as: 'allocations',
          attributes: ['employeeId', 'phaseId', 'chargeOutRate', 'start', 'end', 'dailyHours']
        },
        {
          model: Task,
          as: 'tasks',
          attributes: ['employeeId', 'phaseId', 'taskDate', 'actualHours', 'status']
        }
      ],
      where: {
        id: projectId,
        status: {
          [Op.notIn]: ["cancelled"],
        },
      },
    });

    if (!project) {
      throw new HttpException(404, `Project with ID ${projectId} not found`);
    }

    const budgetAnalysisMap = new Map<string, { plannedCost: number; actualCost: number }>();
    const hoursTrackingMap = new Map<string, { plannedHours: number; actualHours: number; variance: number }>();

    const phases = project.phases as Phase[];
    
    if (!phases || phases.length === 0) {
      return {
        budgetAnalysis: [],
        hoursTracking: []
      };
    }

    // Create employee rate mapping for this project
    const employeeRateMap = new Map<number, number>();
    project.allocations?.forEach(allocation => {
      if (allocation.chargeOutRate) {
        employeeRateMap.set(allocation.employeeId, Number(allocation.chargeOutRate));
      }
    });

    phases.forEach(phase => {
      const phaseName = phase.name;
      const phaseId = phase.id;

      // Initialize phase data
      budgetAnalysisMap.set(phaseName, { 
        plannedCost: phase.plannedCost || 0, 
        actualCost: 0 
      });
      hoursTrackingMap.set(phaseName, { 
        plannedHours: phase.plannedHours || 0, 
        actualHours: 0, 
        variance: 0 
      });

      const budgetData = budgetAnalysisMap.get(phaseName)!;
      const hoursData = hoursTrackingMap.get(phaseName)!;

      // Calculate actual costs from tasks for this specific phase
      const phaseTasks = project.tasks?.filter(task => 
        task.phaseId === phaseId && 
        (task.status === 'completed' || task.status === 'in-progress')
      ) || [];

      let phaseActualHours = 0;
      let phaseActualCost = 0;

      phaseTasks.forEach(task => {
        const taskHours = Number(task.actualHours) || 0;
        const employeeRate = employeeRateMap.get(task.employeeId) || 0;
        const taskCost = taskHours * employeeRate;

        phaseActualHours += taskHours;
        phaseActualCost += taskCost;
      });

      // Set actual values for this phase
      budgetData.actualCost = phaseActualCost;
      hoursData.actualHours = phaseActualHours;

      // Calculate variance (actual - planned)
      hoursData.variance = hoursData.actualHours - hoursData.plannedHours;
    });

    // Convert maps to arrays for chart consumption
    const budgetAnalysis = Array.from(budgetAnalysisMap.entries()).map(([phase, data]) => ({
      phase,
      plannedCost: Math.round(data.plannedCost * 100) / 100,
      actualCost: Math.round(data.actualCost * 100) / 100,
    }));

    const hoursTracking = Array.from(hoursTrackingMap.entries()).map(([phase, data]) => ({
      phase,
      plannedHours: Math.round(data.plannedHours * 100) / 100,
      actualHours: Math.round(data.actualHours * 100) / 100,
      variance: Math.round(data.variance * 100) / 100,
    }));

    return {
      budgetAnalysis,
      hoursTracking
    };

  } catch (error) {
    throw new HttpException(500, "Error generating graph data: " + error.message);
  }
}

// Alternative method if you want separate methods for each chart
public async getBudgetAnalysisGraphData(projectId: number): Promise<Array<{
  phase: string;
  plannedCost: number;
  actualCost: number;
}>> {
  const data = await this.getGraphData(projectId);
  return data.budgetAnalysis;
}

public async getHoursTrackingGraphData(projectId: number): Promise<Array<{
  phase: string;
  plannedHours: number;
  actualHours: number;
  variance: number;
}>> {
  const data = await this.getGraphData(projectId);
  return data.hoursTracking;
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
        budget: number; 
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

    const report = new Map<number, Map<number, {
      projects: Map<string, { estimated: number; actual: number; budget: number }>; 
      totalEstimated: number;
      totalActual: number;
    }>>();

    projects.forEach(project => {
      const projectBudget = Number(project.budget) || 0; 

      const employeeRateMap = new Map<number, number>(
        project.allocations.map(alloc => [
          alloc.employeeId,
          Number(alloc.chargeOutRate) || 0
        ])
      );

  

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

        if (!monthData.projects.has(projectKey)) {
          monthData.projects.set(projectKey, { 
            estimated: 0, 
            actual: 0,
            budget: projectBudget 
          });
        }
        monthData.projects.get(projectKey)!.actual += cost;
        monthData.totalActual += cost;
      });
    });

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
              budget: costs.budget 
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

    const monthlyCosts = new Map<number, Map<number, number>>();

    projects.forEach(project => {
      const employeeRateMap = new Map<number, number>();
      project.allocations.forEach(alloc => {
        employeeRateMap.set(alloc.employeeId, Number(alloc.chargeOutRate) || 0);
      });

      project.tasks.forEach(task => {
        const taskDate = new Date(task.taskDate);
        const year = taskDate.getFullYear();
        const month = taskDate.getMonth(); 
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


  public async getGeneralStatistics() : Promise<{ activeEmployees: number;
    activeProjects: number;
    hoursThisMonth: number;
    commitments: number;
    totalRevenue: number;
    averageUtilization: number;
    completedTasks: number;
    pendingTasks: number;}> {
    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    try {
      const activeEmployeesCount = await Employee.count({
        where: {
          status: 'active',
          assigned: true
        }
      });

      const activeProjectsCount = await Project.count({
        where: {
          status: 'on going'
        }
      });

      const hoursThisMonth = await Task.sum('actualHours', {
        where: {
          taskDate: {
            [Op.between]: [currentMonthStart, currentMonthEnd]
          }
        }
      }) || 0;

      const commitmentsCount = await Leave.count({
        where: {
          status: 'approved',
          startDate: { [Op.lte]: currentDate },
          endDate: { [Op.gte]: currentDate }
        },
        distinct: true,
        col: 'employeeId'
      });

      const totalRevenue = await Project.sum('budget', {
        where: {
          status: {
            [Op.ne]: 'cancelled' 
          }
        }
      });

      const activeEmployees = await Employee.findAll({
        where: { status: 'active', assigned: true },
        include: [
          {
            model: AllocationModel,
            as: 'allocations',
            where: {
              start: { [Op.lte]: currentDate },
              end: { [Op.gte]: currentDate },
              status: 'confirmed' 
            },
            required: false
          },
          {
            model: Task,
            as:"tasks",
            where: {
              taskDate: {
                [Op.between]: [currentMonthStart, currentMonthEnd]
              },
              status: 'completed'
            },
            required: false
          }
        ]
      });

   
      let totalUtilization = 0;
      let employeesWithAllocations = 0;
    
      activeEmployees.forEach(employee => {
        const allocatedHours = employee.allocations?.reduce((sum, alloc) => {
         
          const weeksInMonth = 4; 
          return sum + (0 * weeksInMonth);
        }, 0) || 0;
            const actualHours = employee.tasks?.reduce((sum, task) => 
          sum + (task.actualHours || 0), 0) || 0;
            if (allocatedHours > 0) {
          const utilization = Math.min((actualHours / allocatedHours) * 100, 100);
          totalUtilization += utilization;
          employeesWithAllocations++;
        }
      });
    
      const averageUtilization = employeesWithAllocations > 0 
        ? Number((totalUtilization / employeesWithAllocations).toFixed(2))
        : 0;

      const completedTasks = await Task.count({
        where: {
          status: 'completed'
        }
      });

      const pendingTasks = await Task.count({
        where: {
          status: ['pending', 'in-progress']
        }
      });

      return {
        activeEmployees: activeEmployeesCount,
        activeProjects: activeProjectsCount,
        hoursThisMonth,
        commitments: commitmentsCount,
        totalRevenue,
        averageUtilization,
        completedTasks,
        pendingTasks
      };
    } catch (error) {
      throw new HttpException(500, "Error retrieving general statistics: " + error.message);
    }
  }
}
