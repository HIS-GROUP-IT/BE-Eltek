import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { CustomResponse } from "@/types/response.interface";
import { EmployeeTimesheet, IProjectsHours, ITask, TimeTrackingReport } from "@/types/task.type";
import { TASK_SERVICE_TOKEN } from "@/interfaces/task/ITaskService.interface";
import { RequestWithUser } from "@/types/auth.types";
import { HttpException } from "@/exceptions/HttpException";

export class TaskController {
    private taskService;

    constructor() {
        this.taskService = Container.get(TASK_SERVICE_TOKEN);
    }

    public createTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const taskData: Partial<ITask> = req.body;
            const createdTask = await this.taskService.createTask(taskData);
            const response: CustomResponse<ITask> = {
                data: createdTask,
                message: "Task created successfully",
                error: false,
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    public updateTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const taskData: Partial<ITask> = req.body;
            const updatedTask = await this.taskService.updateTask(taskData);
            const response: CustomResponse<ITask> = {
                data: updatedTask,
                message: "Task updated successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getTasksByUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            const tasks = await this.taskService.getTasksByUser(+user);
            const response: CustomResponse<ITask[]> = {
                data: tasks,
                message: "Tasks fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getTasksByProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const  allocationId  = req.params.allocationId;
            const tasks = await this.taskService.getTasksByProject(+allocationId);
            const response: CustomResponse<ITask[]> = {
                data: tasks,
                message: "Tasks fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };




    public getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tasks = await this.taskService.getAllTasks();
            const response: CustomResponse<ITask[]> = {
                data: tasks,
                message: "All tasks fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public deleteTask = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const taskId = req.params.taskId;
             await this.taskService.deleteTask(+taskId);
            const response: CustomResponse<null> = {
                data: null,
                message: "Task deleted successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getTaskById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const task = await this.taskService.getTaskById(+id);
            const response: CustomResponse<ITask | null> = {
                data: task,
                message: "Task fetched successfully",
                error: false,
            };
            res.status(task ? 200 : 404).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getTasksByDateRange = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { startDate, endDate } = req.query;
            const tasks = await this.taskService.getTasksByDateRange(
                new Date(startDate as string),
                new Date(endDate as string)
            );
            const response: CustomResponse<ITask[]> = {
                data: tasks,
                message: "Tasks fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getTaskSummary = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const user = req.user.id;
            const { startDate, endDate } = req.query;
            const summary = await this.taskService.getTaskSummary(
                +user,
                new Date(startDate as string),
                new Date(endDate as string)
            );
            const response: CustomResponse<{ allocationId: number, totalHours: number }[]> = {
                data: summary,
                message: "Task summary generated",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public approveTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const approvalData = req.body;
            const approvedTask = await this.taskService.approveTask(approvalData);
            const response: CustomResponse<ITask> = {
                data: approvedTask,
                message: "Task approved",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public rejectTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rejectionData = req.body;
            const rejectedTask = await this.taskService.rejectTask(rejectionData);
            const response: CustomResponse<ITask> = {
                data: rejectedTask,
                message: "Task rejected",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getProjectHoursSummary = async (req: Request, res: Response, next: NextFunction) => {
        try {  
            const fetchedHours = await this.taskService.getProjectHoursSummary();
            const response: CustomResponse<IProjectsHours> = {
                data: fetchedHours,
                message: "Project summary fetched",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getWeekelySummery = async (req:Request , res:Response , next:NextFunction) => {
        try {
            const allocationId = req.params.allocationId;        
            const summary = await this.taskService.getCurrentWeekHours(Number(allocationId));
            const response: CustomResponse<EmployeeTimesheet> = {
                data: summary,
                message: "Project summary fetched",
                error: false,
            };
            res.status(201).json(response);
          } catch (error) {
            console.error('Error fetching weekly summary:', error);
            res.status(500).json({ error: 'Internal server error' });
          }
    }

    public getEmployeeMonthlyTasks = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { allocationId, employeeId } = req.params;
          const { year, month } = req.query;
    
          if (!allocationId || !employeeId || !year || !month) {
            throw new HttpException(400, 'Missing required parameters: allocationId, employeeId, year, month');
          }
    
          const monthlyTasks = await this.taskService.getEmployeeMonthlyTasks(
            Number(allocationId),
            Number(employeeId),
            Number(year),
            Number(month)
          );
    
          const response: CustomResponse<typeof monthlyTasks> = {
            data: monthlyTasks,
            message: 'Monthly tasks fetched successfully',
            error: false,
          };
    
          res.status(200).json(response);
        } catch (error) {
          console.error('Error fetching monthly tasks:', error);
          next(error instanceof HttpException ? error : new HttpException(500, 'Internal server error'));
        }
      };

      public getTasksByEmployeeAndProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const  allocationId  = req.params.allocationId;
            const employeeId = req.params.employeeId;
            const tasks = await this.taskService.getTasksByEmployeeAndProject(+employeeId,+allocationId);
            const response: CustomResponse<ITask[]> = {
                data: tasks,
                message: "Tasks fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };


    public getTaskTimeStatistics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tasks = await this.taskService.getTaskTimeStatistics();
            const response: CustomResponse<TimeTrackingReport> = {
                data: tasks,
                message: "Tasks Stats fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getWeeklyTaskTimeStatistics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tasks = await this.taskService.getWeeklyTaskStatistics();
            const response: CustomResponse<any> = {
                data: tasks,
                message: "Weekly Tasks Stats fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    
    public getYearlyTaskStatistics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tasks = await this.taskService.getYearlyTaskStatistics();
            const response: CustomResponse<any> = {
                data: tasks,
                message: "yearly Tasks Stats fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };



    public getEmployeeTaskTimeStatistics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId = req.params.employeeId
            const tasks = await this.taskService.getEmployeeTaskTimeStatistics(employeeId);
            const response: CustomResponse<TimeTrackingReport> = {
                data: tasks,
                message: "Tasks Stats fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getEmployeeWeeklyTaskTimeStatistics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId = req.params.employeeId
            const tasks = await this.taskService.getEmployeeWeeklyTaskStatistics(employeeId);
            const response: CustomResponse<any> = {
                data: tasks,
                message: "Weekly Tasks Stats fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    
    public getEmployeeYearlyTaskStatistics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId = req.params.employeeId
            const tasks = await this.taskService.getEmployeeYearlyTaskStatistics(employeeId);
            const response: CustomResponse<any> = {
                data: tasks,
                message: "yearly Tasks Stats fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getEmployeeProjectHoursSummary = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId = req.params.employeeId
            const tasks = await this.taskService.getEmployeeProjectHoursSummary(employeeId);
            const response: CustomResponse<IProjectsHours> = {
                data: tasks,
                message: "Employee hours fetched successfully",
                error: false,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}
