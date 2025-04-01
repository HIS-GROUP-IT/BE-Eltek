import { Service } from "typedi";
import  Task  from "@/models/project/task.model"; // Task model
import { Op, Sequelize } from "sequelize";
import { ITaskRepository } from "@/interfaces/task/ITaskRepository.interface";
import { EmployeeTimesheet, IProjectsHours, ITask, ITaskModification, MonthlyTasks } from "@/types/task.type";
import Employee from "@/models/employee/employee.model";
import { HttpException } from "@/exceptions/HttpException";
import EmployeeProject from "@/models/employee/projectEmployees.model";

@Service()
export class TaskRepository implements ITaskRepository {
    public async createTask(taskData: Partial<ITask>): Promise<ITask> {
        const task = await Task.create(taskData);
        return task.get({ plain: true });
    }

    public async updateTask(taskData: Partial<ITask>): Promise<ITask> {
        const task = await Task.findByPk(taskData.id);
        if (!task) throw new Error("Task not found");
        await task.update(taskData);
        return task.get({ plain: true });
    }

    public async getTasksByEmployee(employeeId: number): Promise<ITask[]> {
        return await Task.findAll({ 
            where: { employeeId },
            raw: true,
            order: [['taskTitle', 'ASC']]
        });
    }

    public async getTasksByProject(projectId: number): Promise<ITask[]> {
        return await Task.findAll({ 
            where: { projectId }, 
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

    public async deleteTask(id: number): Promise<void> {
        const task = await Task.findByPk(id);
        if (!task) throw new Error("Task not found");
        await task.destroy();
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

    public async getTasksByEmployeeAndProject(employeeId: number, projectId: number): Promise<ITask[]> {
        return await Task.findAll({
            where: { employeeId, projectId },
            raw: true,
            order: [['taskTitle', 'ASC']]
        });
    }

    public async getTotalHoursByEmployee(employeeId: number): Promise<number> {
        const result = await Task.findOne({
            where: { employeeId },
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('hours')), 'totalHours']
            ],
            raw: true
        });
        return result?.hours || 0;
    }

    public async getTaskSummary(employeeId: number, startDate: Date, endDate: Date): Promise<{ projectId: number, totalHours: number }[]> {
        return await Task.findAll({
            where: {
                employeeId,
                startDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            attributes: [
                'projectId', 
                [Sequelize.fn('SUM', Sequelize.col('hours')), 'totalHours']
            ],
            group: ['projectId'],
            raw: true
        }) as unknown as { projectId: number, totalHours: number }[];
    }

    public async approveTask(approvalData: ITaskModification): Promise<ITask> {
        const task = await Task.findByPk(approvalData.taskId);
        if (!task) throw new Error("Task not found");
        await task.update({ status: 'completed', modifiedBy: approvalData.modifiedBy });
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

      public async getCurrentWeekHours(projectId: number): Promise<EmployeeTimesheet[]> {
        const { start, end } = this.getCurrentWeekDates();
        const weekDays = this.generateWeekDays(start);
    
        const tasks = await Task.findAll({
            where: {
                projectId,
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
                    projectId: task.projectId,
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
                employeeData!.days[taskDateString] += task.hours;
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
        projectId: number,
        employeeId: number,
        year: number,
        month: number
      ): Promise<MonthlyTasks> {
        try {
          if (!projectId || !employeeId || !year || !month) {
            throw new HttpException(400, 'Missing required parameters');
          }
      
          const employeeProject = await EmployeeProject.findOne({
            where: {
              employeeId,
              projectId
            },
            raw: true
          });
      
          if (!employeeProject) {
            throw new HttpException(404, 'Employee is not assigned to this project');
          }
      
          const startDate = new Date(Date.UTC(year, month - 1, 1));
          const endDate = new Date(Date.UTC(year, month, 0));
          endDate.setUTCHours(23, 59, 59, 999);
      
          const tasks = await Task.findAll({
            where: {
              projectId,
              employeeId,
              status: 'completed',
              createdAt: {
                [Op.between]: [startDate, endDate]
              }
            },
            order: [['createdAt', 'ASC']],
            raw: true
          });
      
          const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);
          const rate =Number(employeeProject.rate);
          const totalCost = totalHours * rate;
      
          return {
            totalHours,
            rate,
            totalCost,
            tasks: tasks.map(task => ({
              id: task.id,
              taskTitle: task.taskTitle,
              taskDescription: task.taskDescription,
              hours: task.hours,
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
      
}
