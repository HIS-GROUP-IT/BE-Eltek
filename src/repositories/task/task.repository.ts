import { Service } from "typedi";
import  Task  from "@/models/task/task.model"; // Task model
import { Op, Sequelize } from "sequelize";
import { ITaskRepository } from "@/interfaces/task/ITaskRepository.interface";
import { EmployeeTimesheet, IProjectsHours, ITask, ITaskModification, MonthlyTasks } from "@/types/task.type";
import Employee from "@/models/employee/employee.model";
import { HttpException } from "@/exceptions/HttpException";
import AllocationModel from "@/models/allocation/allocation.model";
import { IUtilization } from "@/types/employee.types";

@Service()
export class TaskRepository implements ITaskRepository {
  public async createTask(taskData: Partial<ITask>): Promise<ITask> {
    const task = await Task.create(taskData);
    await this.calculateUtilization(taskData.employeeId);
    return task.get({ plain: true });
  }
  
  public async updateTask(taskData: Partial<ITask>): Promise<ITask> {
    const task = await Task.findByPk(taskData.id);
    if (!task) throw new Error("Task not found");
    
    const prevEmployeeId = task.employeeId;
    await task.update(taskData);
    
    // Recalculate for both previous and current employee if changed
    await this.calculateUtilization(prevEmployeeId);
    if (prevEmployeeId !== taskData.employeeId) {
      await this.calculateUtilization(taskData.employeeId);
    }
    
    return task.get({ plain: true });
  }
  
  public async deleteTask(id: number): Promise<void> {
    const task = await Task.findByPk(id);
    if (!task) throw new Error("Task not found");
    
    const employeeId = task.employeeId;
    await task.destroy();
    await this.calculateUtilization(employeeId);
  }

    public adjustTimezone = (date: Date): Date => {
        const adjustedDate = new Date(date);
        adjustedDate.setHours(adjustedDate.getHours() + 2); // Add 2 hours to compensate
        return adjustedDate;
      };


    public async getTasksByEmployee(employeeId: number): Promise<ITask[]> {
        return await Task.findAll({ 
            where: { employeeId },
            raw: true,
            order: [['taskTitle', 'ASC']]
        });
    }

    public async getTasksByProject(allocationId: number): Promise<ITask[]> {
        return await Task.findAll({ 
            where: { allocationId }, 
            raw: true,
            order: [['taskTitle', 'ASC']]
        });
    }

    public async getAllTasks(): Promise<ITask[]> {
        return await Task.findAll({
            raw: true,
            order: [['taskTitle', 'ASC']]
        });
    }



    public async getTaskById(id: number): Promise<ITask | null> {
        return await Task.findByPk(id, { raw: true });
    }

    public async getTasksByDateRange(startDate: Date, endDate: Date): Promise<ITask[]> {
        return await Task.findAll({
            where: {
                startDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            raw: true,
            order: [['startDate', 'ASC']]
        });
    }

    public async getTasksByEmployeeAndProject(employeeId: number, allocationId: number): Promise<ITask[]> {
      return await Task.findAll({
          where: { employeeId, allocationId },
          raw: true,
          order: [['taskDate', 'ASC']] 
      });
  }
  

    // public async getTotalHoursByEmployee(employeeId: number): Promise<number> {
    //     const result = await Task.findOne({
    //         where: { employeeId },
    //         attributes: [
    //             [Sequelize.fn('SUM', Sequelize.col('hours')), 'totalHours']
    //         ],
    //         raw: true
    //     });
    //     return result?.hours || 0;
    // }

    public async getTaskSummary(employeeId: number, startDate: Date, endDate: Date): Promise<{ allocationId: number, totalHours: number }[]> {
        return await Task.findAll({
            where: {
                employeeId,
                startDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            attributes: [
                'allocationId', 
                [Sequelize.fn('SUM', Sequelize.col('hours')), 'totalHours']
            ],
            group: ['allocationId'],
            raw: true
        }) as unknown as { allocationId: number, totalHours: number }[];
    }

    public async approveTask(approvalData: ITaskModification): Promise<ITask> {
        const task = await Task.findByPk(approvalData.taskId);
        if (!task) throw new Error("Task not found");
        await task.update({ status: 'completed', modifiedBy: approvalData.modifiedBy });
        await this.calculateUtilization(approvalData.employeeId);
        return task.get({ plain: true });
    }

    public async rejectTask(rejectionData : ITaskModification): Promise<ITask> {
        const task = await Task.findByPk(rejectionData.taskId);
        if (!task) throw new Error("Task not found");
        await task.update({ status: 'rejected', reasonForRejection : rejectionData.reasonForRejection, modifiedBy : rejectionData.modifiedBy });
        return task.get({ plain: true });
    }

    public async getProjectHoursSummary(): Promise<IProjectsHours> {
        const result = await Task.findOne({
          attributes: [
            [Sequelize.fn('SUM', Sequelize.col('hours')), 'totalHours'],
            [Sequelize.literal(`SUM(CASE WHEN status = 'pending' THEN hours ELSE 0 END)`), 'pendingHours'],
            [Sequelize.literal(`SUM(CASE WHEN status = 'completed' THEN hours ELSE 0 END)`), 'completedHours'],
            [Sequelize.literal(`SUM(CASE WHEN status = 'rejected' THEN hours ELSE 0 END)`), 'rejectedHours']
          ],
          raw: true
        });
      
        return {
          totalHours: Number(result?.totalHours || 0),
          pendingHours: Number(result?.pendingHours || 0),
          completedHours: Number(result?.completedHours || 0),
          rejectedHours: Number(result?.rejectedHours || 0)
        };
      }

      public async getEmployeeProjectHoursSummary(employeeId: string): Promise<IProjectsHours> {
        const result = await Task.findOne({
          attributes: [
            [Sequelize.fn('SUM', Sequelize.col('hours')), 'totalHours'],
            [Sequelize.literal(`SUM(CASE WHEN status = 'pending' THEN hours ELSE 0 END)`), 'pendingHours'],
            [Sequelize.literal(`SUM(CASE WHEN status = 'completed' THEN hours ELSE 0 END)`), 'completedHours'],
            [Sequelize.literal(`SUM(CASE WHEN status = 'rejected' THEN hours ELSE 0 END)`), 'rejectedHours']
          ],
          where: {
            employeeId: employeeId
          },
          raw: true
        });
      
        return {
          totalHours: Number(result?.totalHours || 0),
          pendingHours: Number(result?.pendingHours || 0),
          completedHours: Number(result?.completedHours || 0),
          rejectedHours: Number(result?.rejectedHours || 0)
        };
    }

      public async getCurrentWeekHours(allocationId: number): Promise<EmployeeTimesheet[]> {
        const { start, end } = this.getCurrentWeekDates();
        const weekDays = this.generateWeekDays(start);
    
        const tasks = await Task.findAll({
            where: {
                allocationId,
                status : "completed",
                createdAt: { [Op.between]: [start, end] }
            },
            include: [{ 
                model: Employee,
                attributes: ['email'] 
            }]
        });
    
        const employeesMap = new Map<number, EmployeeTimesheet>();
    
        for (const task of tasks) {
            const employeeId = task.employeeId;
            if (!employeesMap.has(employeeId)) {
                employeesMap.set(employeeId, {
                    allocationId: task.allocationId,
                    employeeId: employeeId,
                    employeeName: task.employeeName,
                    email: task.employee?.email || '',
                    position: task.position,
                    days: Object.fromEntries(weekDays.map(date => [date, 0])) as Record<string, number>
                });
            }
    
            const employeeData = employeesMap.get(employeeId);
            const taskDate = new Date(task.createdAt);
            const taskDateString = this.formatDate(taskDate);
    
            if (weekDays.includes(taskDateString)) {
                employeeData!.days[taskDateString] += task.actualHours;
            }
        }
    
        return Array.from(employeesMap.values());
    }
    private getCurrentWeekDates(): { start: Date; end: Date } {
        const now = new Date();
        const currentDay = now.getDay();
        const monday = new Date(now);
        monday.setDate(now.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
        monday.setHours(0, 0, 0, 0);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);
        return { start: monday, end: sunday };
    }

    private generateWeekDays(startDate: Date): string[] {
        const weekDays: string[] = [];
        const current = new Date(startDate);
        for (let i = 0; i < 7; i++) {
            const date = new Date(current);
            weekDays.push(this.formatDate(date));
            current.setDate(current.getDate() + 1);
        }
        return weekDays;
    }

    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }


    public async getEmployeeMonthlyTasks(
      allocationId: number,
      employeeId: number,
      year: number,
      month: number
  ): Promise<MonthlyTasks> {
      try {
          if (!allocationId || !employeeId || !year || !month) {
              throw new HttpException(400, 'Missing required parameters');
          }
  
          const employee = await Employee.findOne({
              where: { id: employeeId },
              include: [{
                  association: 'allocations',
                  where: { allocationId: allocationId.toString() } 
              }],
              raw: false 
          });
  
          if (!employee || !employee || employee.allAllocation.length === 0) {
              throw new HttpException(404, 'Employee is not assigned to this project');
          }
  
          const projectAllocation = employee.allAllocation.find(a => a.id === allocationId);
          if (!projectAllocation) {
              throw new HttpException(404, 'Employee allocation not found for this project');
          }
  
          const startDate = new Date(Date.UTC(year, month - 1, 1));
          const endDate = new Date(Date.UTC(year, month, 0));
          endDate.setUTCHours(23, 59, 59, 999);
  
          const tasks = await Task.findAll({
              where: {
                  allocationId,
                  employeeId,
                  status: 'completed',
                  createdAt: {
                      [Op.between]: [startDate, endDate]
                  }
              },
              order: [['createdAt', 'ASC']],
              raw: true
          });
  
          const totalHours = tasks.reduce((sum, task) => sum + task.actualHours, 0);
          const rate = Number(projectAllocation.chargeOutRate);
          const totalCost = totalHours * rate;
  
          return {
              totalHours,
              rate,
              totalCost,
              tasks: tasks.map(task => ({
                  id: task.id,
                  taskTitle: task.taskTitle,
                  taskDescription: task.taskDescription,
                  hours: task.actualHours,
                  status: task.status,
                  employeeName: task.employeeName,
                  position: task.position,
                  date: task.createdAt.toISOString().split('T')[0],
                  rate: rate 
              }))
          };
  
      } catch (error) {
          if (error instanceof HttpException) throw error;
          throw new HttpException(500, 'Failed to fetch monthly tasks');
      }
  }
      
  public async getTotalHoursByEmployee(employeeId: number): Promise<number> {
    const result = await Task.findOne({
        where: { employeeId },
        attributes: [
            [Sequelize.fn('SUM', Sequelize.col('hours')), 'totalHours']
        ],
        raw: true
    });
    return result?.actualHours || 0;
}
      

        public async getTaskTimeStatistics(): Promise<{
          today: { totalHours: number, average: number, completionRate: number, data: number[] },
          yesterday: { totalHours: number, average: number, completionRate: number, data: number[] }
        }> {
          const getDateRange = (daysOffset: number) => {
            const date = new Date();
            date.setDate(date.getDate() - daysOffset);
            date.setHours(0, 0, 0, 0);
            const start = new Date(date);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            return { start, end };
          };
      
          const getTimeBucket = (createdAt: Date) => {
            const adjustedDate = this.adjustTimezone(createdAt);
            const hours = adjustedDate.getHours();
            if (hours >= 9 && hours < 12) return 0;
            if (hours >= 12 && hours < 15) return 1;
            if (hours >= 15 && hours < 18) return 2;
            if (hours >= 18 && hours < 21) return 3;
            if (hours >= 21) return 4;
            return -1;
          };
      
          const processDay = async (daysOffset: number) => {
            const { start, end } = getDateRange(daysOffset);
            const tasks = await Task.findAll({
              where: { createdAt: { [Op.between]: [start, end] } },
              raw: true
            });
      
            let totalHours = 0;
            let completedTasks = 0;
            let totalTaskCount = 0;
            const data = [0, 0, 0, 0, 0];
      
            tasks.forEach(task => {
              totalHours += task.actualHours;
              totalTaskCount++;
      
              if (task.status === 'completed') {
                completedTasks++;
                const bucket = getTimeBucket(new Date(task.createdAt));
                if (bucket !== -1) {
                  data[bucket] += task.actualHours;
                }
              }
            });
      
            return {
              totalHours,
              average: totalTaskCount > 0 ? totalHours / totalTaskCount : 0,
              completionRate: totalTaskCount > 0 ? (completedTasks / totalTaskCount) * 100 : 0,
              data
            };
          };
      
          return {
            today: await processDay(0),
            yesterday: await processDay(1)
          };
        }
      
        public async getWeeklyTaskStatistics(): Promise<{
          thisWeek: { totalHours: number, average: number, completionRate: number, data: number[] },
          lastWeek: { totalHours: number, average: number, completionRate: number, data: number[] }
        }> {
          const getWeekRange = (weeksOffset: number) => {
            const date = new Date();
            date.setDate(date.getDate() - (weeksOffset * 7));
            const dayOfWeek = date.getDay();
            const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            const start = new Date(date.setDate(diff));
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            return { start, end };
          };
      
          const getDayIndex = (createdAt: Date) => {
            const adjustedDate = this.adjustTimezone(createdAt);
            const day = adjustedDate.getDay();
            return day === 0 ? 6 : day - 1;
          };
      
          const processWeek = async (weeksOffset: number) => {
            const { start, end } = getWeekRange(weeksOffset);          
            const tasks = await Task.findAll({
              where: { createdAt: { [Op.between]: [start, end] } },
              raw: true
            });
      
            let totalHours = 0;
            let completedTasks = 0;
            let totalTaskCount = 0;
            const data = new Array(7).fill(0);
      
            tasks.forEach(task => {
              totalHours += task.actualHours;
              totalTaskCount++;
      
              if (task.status === 'completed') {
                completedTasks++;
                const dayIndex = getDayIndex(new Date(task.createdAt));
                data[dayIndex] += task.actualHours;
              }
            });
      
            return {
              totalHours,
              average: totalTaskCount > 0 ? totalHours / totalTaskCount : 0,
              completionRate: totalTaskCount > 0 ? (completedTasks / totalTaskCount) * 100 : 0,
              data
            };
          };
      
          return {
            thisWeek: await processWeek(0),
            lastWeek: await processWeek(1)
          };
        }
      
        public async getYearlyTaskStatistics(): Promise<{
          thisYear: { totalHours: number, average: number, completionRate: number, data: number[] },
          lastYear: { totalHours: number, average: number, completionRate: number, data: number[] }
        }> {
          const getYearRange = (yearOffset: number) => {
            const now = new Date();
            const year = now.getFullYear() - yearOffset;
            const start = new Date(year, 0, 1); 
            start.setHours(0, 0, 0, 0);
            const end = new Date(year, 11, 31); 
            end.setHours(23, 59, 59, 999);
            return { start, end, year };
          };
      
          const processYear = async (yearOffset: number) => {
            const { start, end, year } = getYearRange(yearOffset);
            const tasks = await Task.findAll({
              where: { createdAt: { [Op.between]: [start, end] } },
              raw: true
            });
      
            let totalHours = 0;
            let completedTasks = 0;
            let totalTaskCount = 0;
            const data = new Array(12).fill(0);
      
            tasks.forEach(task => {
              totalHours += task.actualHours;
              totalTaskCount++;
      
              if (task.status === 'completed') {
                completedTasks++;
                const taskDate = this.adjustTimezone(new Date(task.createdAt));
                if (taskDate.getFullYear() === year) {
                  const monthIndex = taskDate.getMonth();
                  data[monthIndex] += task.actualHours;
                }
              }
            });
      
            return {
              totalHours,
              average: totalTaskCount > 0 ? totalHours / totalTaskCount : 0,
              completionRate: totalTaskCount > 0 ? (completedTasks / totalTaskCount) * 100 : 0,
              data
            };
          };
      
          return {
            thisYear: await processYear(0),
            lastYear: await processYear(1)
          };
        }
      
        public async getEmployeeTaskTimeStatistics(employeeId: number): Promise<{
          today: { totalHours: number, average: number, completionRate: number, data: number[] },
          yesterday: { totalHours: number, average: number, completionRate: number, data: number[] }
        }> {
          const getDateRange = (daysOffset: number) => {
            const date = new Date();
            date.setDate(date.getDate() - daysOffset);
            date.setHours(0, 0, 0, 0);
            const start = new Date(date);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            return { start, end };
          };
      
          const getTimeBucket = (createdAt: Date) => {
            const adjustedDate = this.adjustTimezone(createdAt);
            const hours = adjustedDate.getHours();
            if (hours >= 9 && hours < 12) return 0;
            if (hours >= 12 && hours < 15) return 1;
            if (hours >= 15 && hours < 18) return 2;
            if (hours >= 18 && hours < 21) return 3;
            if (hours >= 21) return 4;
            return -1;
          };
      
          const processDay = async (daysOffset: number) => {
            const { start, end } = getDateRange(daysOffset);
            const tasks = await Task.findAll({
              where: { 
                employeeId,
                createdAt: { [Op.between]: [start, end] }
              },
              raw: true
            });
      
            let totalHours = 0;
            let completedTasks = 0;
            let totalTaskCount = 0;
            const data = [0, 0, 0, 0, 0];
      
            tasks.forEach(task => {
              totalHours += task.actualHours;
              totalTaskCount++;
      
              if (task.status === 'completed') {
                completedTasks++;
                const bucket = getTimeBucket(new Date(task.createdAt));
                if (bucket !== -1) {
                  data[bucket] += task.actualHours;
                }
              }
            });
      
            return {
              totalHours,
              average: totalTaskCount > 0 ? totalHours / totalTaskCount : 0,
              completionRate: totalTaskCount > 0 ? (completedTasks / totalTaskCount) * 100 : 0,
              data
            };
          };
      
          return {
            today: await processDay(0),
            yesterday: await processDay(1)
          };
        }
      
        public async getEmployeeWeeklyTaskStatistics(employeeId: number): Promise<{
          thisWeek: { totalHours: number, average: number, completionRate: number, data: number[] },
          lastWeek: { totalHours: number, average: number, completionRate: number, data: number[] }
        }> {
          const getWeekRange = (weeksOffset: number) => {
            const date = new Date();
            date.setDate(date.getDate() - (weeksOffset * 7));
            const dayOfWeek = date.getDay();
            const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            const start = new Date(date.setDate(diff));
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            return { start, end };
          };
      
          const getDayIndex = (createdAt: Date) => {
            const adjustedDate = this.adjustTimezone(createdAt);
            const day = adjustedDate.getDay();
            return day === 0 ? 6 : day - 1;
          };
      
          const processWeek = async (weeksOffset: number) => {
            const { start, end } = getWeekRange(weeksOffset);          
            const tasks = await Task.findAll({
              where: { 
                employeeId,
                createdAt: { [Op.between]: [start, end] }
              },
              raw: true
            });
      
            let totalHours = 0;
            let completedTasks = 0;
            let totalTaskCount = 0;
            const data = new Array(7).fill(0);
      
            tasks.forEach(task => {
              totalHours += task.actualHours;
              totalTaskCount++;
      
              if (task.status === 'completed') {
                completedTasks++;
                const dayIndex = getDayIndex(new Date(task.createdAt));
                data[dayIndex] += task.actualHours;
              }
            });
      
            return {
              totalHours,
              average: totalTaskCount > 0 ? totalHours / totalTaskCount : 0,
              completionRate: totalTaskCount > 0 ? (completedTasks / totalTaskCount) * 100 : 0,
              data
            };
          };
      
          return {
            thisWeek: await processWeek(0),
            lastWeek: await processWeek(1)
          };
        }
      
        public async getEmployeeYearlyTaskStatistics(employeeId: number): Promise<{
          thisYear: { totalHours: number, average: number, completionRate: number, data: number[] },
          lastYear: { totalHours: number, average: number, completionRate: number, data: number[] }
        }> {
          const getYearRange = (yearOffset: number) => {
            const now = new Date();
            const year = now.getFullYear() - yearOffset;
            const start = new Date(year, 0, 1); 
            start.setHours(0, 0, 0, 0);
            const end = new Date(year, 11, 31); 
            end.setHours(23, 59, 59, 999);
            return { start, end, year };
          };
      
          const processYear = async (yearOffset: number) => {
            const { start, end, year } = getYearRange(yearOffset);
            const tasks = await Task.findAll({
              where: { 
                employeeId,
                createdAt: { [Op.between]: [start, end] }
              },
              raw: true
            });
      
            let totalHours = 0;
            let completedTasks = 0;
            let totalTaskCount = 0;
            const data = new Array(12).fill(0);
      
            tasks.forEach(task => {
              totalHours += task.actualHours;
              totalTaskCount++;
      
              if (task.status === 'completed') {
                completedTasks++;
                const taskDate = this.adjustTimezone(new Date(task.createdAt));
                if (taskDate.getFullYear() === year) {
                  const monthIndex = taskDate.getMonth();
                  data[monthIndex] += task.actualHours;
                }
              }
            });
      
            return {
              totalHours,
              average: totalTaskCount > 0 ? totalHours / totalTaskCount : 0,
              completionRate: totalTaskCount > 0 ? (completedTasks / totalTaskCount) * 100 : 0,
              data
            };
          };
      
          return {
            thisYear: await processYear(0),
            lastYear: await processYear(1)
          };
        }
        

        public async calculateUtilization(employeeId: number): Promise<IUtilization> {
          try {
            const [tasks, allocations] = await Promise.all([
              Task.findAll({
                where: { 
                  employeeId,
                  status: 'completed'
                },
                raw: true
              }),
              AllocationModel.findAll({
                where: { employeeId },
                raw: true
              })
            ]);
        
            const utilizationMap: {
              [year: number]: {
                [month: string]: {
                  [week: string]: { actual: number; allocated: number }
                }
              }
            } = {};
        
            // Pre-process allocations into weekly buckets
            const allocationMap = new Map<string, number>();
            for (const allocation of allocations) {
              const start = new Date(allocation.start);
              const end = new Date(allocation.end);
              const weeks = this.getWeeksBetweenDates(start, end);
              const weeklyHours = Number(allocation.hoursWeek) || 0;
              
              // Distribute allocation hours evenly across weeks
              const hoursPerWeek = weeklyHours / weeks;
              
              let current = new Date(start);
              while (current <= end) {
                const year = current.getFullYear();
                const month = String(current.getMonth() + 1).padStart(2, '0');
                const week = this.getWeekOfMonth(current);
                const key = `${year}-${month}-${week}`;
        
                allocationMap.set(key, (allocationMap.get(key) || 0) + hoursPerWeek);
                
                // Move to next week
                current.setDate(current.getDate() + 7);
              }
            }
        
            // Process tasks
            for (const task of tasks) {
              const taskDate = new Date(task.taskDate);
              const year = taskDate.getFullYear();
              const month = String(taskDate.getMonth() + 1).padStart(2, '0');
              const week = this.getWeekOfMonth(taskDate);
              const key = `${year}-${month}-${week}`;
        
              // Initialize structure
              if (!utilizationMap[year]) utilizationMap[year] = {};
              if (!utilizationMap[year][month]) utilizationMap[year][month] = {};
              if (!utilizationMap[year][month][week]) {
                utilizationMap[year][month][week] = { 
                  actual: 0, 
                  allocated: allocationMap.get(key) || 0 
                };
              }
        
              // Accumulate actual hours
              utilizationMap[year][month][week].actual += Number(task.actualHours) || 0;
            }
        
            // Convert to IUtilization format and calculate percentages
            const utilization: IUtilization = {};
            for (const [yearStr, months] of Object.entries(utilizationMap)) {
              const year = Number(yearStr);
              utilization[year] = {};
              
              for (const [month, weeks] of Object.entries(months)) {
                utilization[year][month] = { 
                  week1: 0, 
                  week2: 0, 
                  week3: 0, 
                  week4: 0 
                };
        
                for (const [week, data] of Object.entries(weeks)) {
                  const weekNumber = Number(week);
                  if (weekNumber > 4) continue; // Only support up to week4
        
                  const weekKey = `week${weekNumber}` as keyof typeof utilization[number][string];
                  const utilizationPercent = data.allocated > 0 
                    ? Math.min((data.actual / data.allocated) * 100, 100)
                    : 0;
        
                  utilization[year][month][weekKey] = Number(utilizationPercent.toFixed(1));
                }
              }
            }
        
            // Update employee record
            await Employee.update(
              { utilization },
              { where: { id: employeeId } }
            );
        
            return utilization;
        
          } catch (error) {
            console.error('Utilization calculation error:', error);
            throw new HttpException(500, 'Failed to calculate utilization');
          }
        }
        
        private getWeeksBetweenDates(start: Date, end: Date): number {
          const msPerWeek = 1000 * 60 * 60 * 24 * 7;
          return Math.ceil((end.getTime() - start.getTime()) / msPerWeek);
        }
        
        private getWeekOfMonth(date: Date): number {
          const start = new Date(date);
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
        
          const day = date.getDay() || 7; 
          const diff = date.getDate() - start.getDate() + ((start.getDay() || 7) - day);
          return Math.ceil((diff + 1) / 7);
        }
      }



