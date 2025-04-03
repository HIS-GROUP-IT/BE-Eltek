import { Service } from "typedi";
import { ITaskService, TASK_SERVICE_TOKEN } from "@/interfaces/task/ITaskService.interface";
import { HttpException } from "@/exceptions/HttpException"; // Custom Exception Handling
import { EmployeeTimesheet, IProjectsHours, ITask, ITaskModification, MonthlyTasks } from "@/types/task.type";
import { TaskRepository } from "@/repositories/project/task.repository";

@Service({ id: TASK_SERVICE_TOKEN, type: TaskService })
export class TaskService implements ITaskService {
    constructor(private taskRepository: TaskRepository) {}

    public async createTask(taskData: Partial<ITask>): Promise<ITask> {
        try {
            return await this.taskRepository.createTask(taskData);
        } catch (error) {
            throw new HttpException(500, `Error creating task: ${error.message}`);
        }
    }

    public async updateTask(taskData: Partial<ITask>): Promise<ITask | null> {
        try {
            return await this.taskRepository.updateTask(taskData);
        } catch (error) {
            throw new HttpException(500, `Error updating task: ${error.message}`);
        }
    }

    public async getTasksByEmployee(employeeId: number): Promise<ITask[]> {
        try {
            return await this.taskRepository.getTasksByEmployee(employeeId);
        } catch (error) {
            throw new HttpException(500, `Error fetching tasks: ${error.message}`);
        }
    }

    public async getTasksByProject(projectId: number): Promise<ITask[]> {
        try {
            return await this.taskRepository.getTasksByProject(projectId);
        } catch (error) {
            throw new HttpException(500, `Error fetching tasks: ${error.message}`);
        }
    }

    public async getAllTasks(): Promise<ITask[]> {
        try {
            return await this.taskRepository.getAllTasks();
        } catch (error) {
            throw new HttpException(500, `Error fetching tasks: ${error.message}`);
        }
    }

    public async deleteTask(id: number): Promise<void> {
        try {
            await this.taskRepository.deleteTask(id);
        } catch (error) {
            throw new HttpException(500, `Error deleting task: ${error.message}`);
        }
    }

    public async getTaskById(id: number): Promise<ITask | null> {
        try {
            return await this.taskRepository.getTaskById(id);
        } catch (error) {
            throw new HttpException(500, `Error fetching task: ${error.message}`);
        }
    }

    public async getTasksByDateRange(startDate: Date, endDate: Date): Promise<ITask[]> {
        try {
            return await this.taskRepository.getTasksByDateRange(startDate, endDate);
        } catch (error) {
            throw new HttpException(500, `Error fetching tasks: ${error.message}`);
        }
    }

    public async getTasksByEmployeeAndProject(employeeId: number, projectId: number): Promise<ITask[]> {
        try {
            return await this.taskRepository.getTasksByEmployeeAndProject(employeeId, projectId);
        } catch (error) {
            throw new HttpException(500, `Error fetching tasks: ${error.message}`);
        }
    }

    public async getTotalHoursByEmployee(employeeId: number): Promise<number> {
        try {
            return await this.taskRepository.getTotalHoursByEmployee(employeeId);
        } catch (error) {
            throw new HttpException(500, `Error calculating hours: ${error.message}`);
        }
    }

    public async getTaskSummary(employeeId: number, startDate: Date, endDate: Date): Promise<{ projectId: number, totalHours: number }[]> {
        try {
            return await this.taskRepository.getTaskSummary(employeeId, startDate, endDate);
        } catch (error) {
            throw new HttpException(500, `Error generating summary: ${error.message}`);
        }
    }

    public async approveTask(approvalData: ITaskModification): Promise<ITask> {
        try {
            return await this.taskRepository.approveTask(approvalData);
        } catch (error) {
            throw new HttpException(500, `Error approving task: ${error.message}`);
        }
    }

    public async rejectTask(rejectionData: ITaskModification): Promise<ITask> {
        try {
            return await this.taskRepository.rejectTask(rejectionData);
        } catch (error) {
            throw new HttpException(500, `Error rejecting task: ${error.message}`);
        }
    }

    public async getProjectHoursSummary(): Promise<IProjectsHours> {
        try {
            const fetchedHours = await this.taskRepository.getProjectHoursSummary();
            return fetchedHours;
        } catch (error) {
            throw new HttpException(400, "Error getting all projects hours")
        }
    }

    public async getCurrentWeekHours(projectId: number): Promise<EmployeeTimesheet[]> {
        try {
            const timsheetSummary = await this.taskRepository.getCurrentWeekHours(projectId);
            return timsheetSummary;
        } catch (error) {
            throw new HttpException(400, error)
        }
    }

    public async getEmployeeMonthlyTasks( projectId: number,
        employeeId: number,
        year: number,
        month: number): Promise<MonthlyTasks> {
        try {
            const fetchedHours = await this.taskRepository.getEmployeeMonthlyTasks(projectId,employeeId,year,month);
            return fetchedHours;
        } catch (error) {
            throw new HttpException(400, error)
        }
    }
    public async getTaskTimeStatistics(): Promise<{ today: { totalHours: number; average: number; completionRate: number; data: number[]; }; yesterday: { totalHours: number; average: number; completionRate: number; data: number[]; }; }> {
        try {
            const timeStatistics = await this.taskRepository.getTaskTimeStatistics();
            return timeStatistics; 
        } catch (error) {
            throw new HttpException(400,error)
        }
    }

    public async getWeeklyTaskStatistics(): Promise<{ thisWeek: { totalHours: number; average: number; completionRate: number; data: number[]; }; lastWeek: { totalHours: number; average: number; completionRate: number; data: number[]; }; }> {
        try {
            const weeklyTimeStats = await this.taskRepository.getWeeklyTaskStatistics();
            return weeklyTimeStats;
        } catch (error) {
            throw new HttpException(400,error)
        }
    }
    

    public async  getYearlyTaskStatistics(): Promise<{ thisYear: { totalHours: number; average: number; completionRate: number; data: number[]; }; lastYear: { totalHours: number; average: number; completionRate: number; data: number[]; }; }> {
        try {
            const yearlyTimeStats = await this.taskRepository.getYearlyTaskStatistics();
            return yearlyTimeStats;
        } catch (error) {
            throw new HttpException(400,error)
        }
    }


    public async getEmployeeTaskTimeStatistics(employeeId:number): Promise<{ today: { totalHours: number; average: number; completionRate: number; data: number[]; }; yesterday: { totalHours: number; average: number; completionRate: number; data: number[]; }; }> {
        try {
            const timeStatistics = await this.taskRepository.getEmployeeTaskTimeStatistics(employeeId);
            return timeStatistics; 
        } catch (error) {
            throw new HttpException(400,error)
        }
    }

    public async getEmployeeWeeklyTaskStatistics(employeeId:number): Promise<{ thisWeek: { totalHours: number; average: number; completionRate: number; data: number[]; }; lastWeek: { totalHours: number; average: number; completionRate: number; data: number[]; }; }> {
        try {
            const weeklyTimeStats = await this.taskRepository.getEmployeeWeeklyTaskStatistics(employeeId);
            return weeklyTimeStats;
        } catch (error) {
            throw new HttpException(400,error)
        }
    }
    

    public async  getEmployeeYearlyTaskStatistics(employeeId:number): Promise<{ thisYear: { totalHours: number; average: number; completionRate: number; data: number[]; }; lastYear: { totalHours: number; average: number; completionRate: number; data: number[]; }; }> {
        try {
            const yearlyTimeStats = await this.taskRepository.getEmployeeYearlyTaskStatistics(employeeId);
            return yearlyTimeStats;
        } catch (error) {
            throw new HttpException(400,error)
        }
    }


}