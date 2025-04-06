import { TaskController } from "@/controllers/project/task.controller";
import { TaskDTO } from "@/dots/project/task.dto";
import { authorizationMiddleware } from "@/middlewares/authorizationMiddleware";
import { ValidationMiddleware } from "@/middlewares/ValidationMiddleware";
import { Router } from "express";

export class TaskRoute {
    public path = "/tasks";
    public router = Router();
    private taskController = new TaskController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/createTask`, authorizationMiddleware, ValidationMiddleware(TaskDTO), this.taskController.createTask);
        this.router.put(`${this.path}/updateTask`, authorizationMiddleware, ValidationMiddleware(TaskDTO), this.taskController.updateTask);
        this.router.get(`${this.path}/getUserTasks`, authorizationMiddleware, this.taskController.getTasksByUser);
        this.router.get(`${this.path}/getAllTasks`, authorizationMiddleware, this.taskController.getAllTasks);
        this.router.get(`${this.path}/getTaskByProject/:projectId`, authorizationMiddleware, this.taskController.getTasksByProject);
        this.router.get(`${this.path}/getTaskById/:id`, authorizationMiddleware, this.taskController.getTaskById);
        this.router.get(`${this.path}/date-range`, authorizationMiddleware, this.taskController.getTasksByDateRange);
        this.router.get(`${this.path}/summary`, authorizationMiddleware, this.taskController.getTaskSummary);
        this.router.post(`${this.path}/approveTask`, authorizationMiddleware, this.taskController.approveTask);
        this.router.post(`${this.path}/rejectTask`, authorizationMiddleware, this.taskController.rejectTask);
        this.router.get(`${this.path}/getProjectHoursSummary`, authorizationMiddleware, this.taskController.getProjectHoursSummary);
        this.router.get(`${this.path}/getProjectWeeklySummary/:projectId`, authorizationMiddleware, this.taskController.getWeekelySummery);
        this.router.get(`${this.path}/:projectId/employees/:employeeId/tasks`, authorizationMiddleware, this.taskController.getEmployeeMonthlyTasks);
        this.router.get(`${this.path}/:getTaskByEmployeeAndProject/:employeeId/:projectId`, authorizationMiddleware, this.taskController.getTasksByEmployeeAndProject);
        this.router.get(`${this.path}/getChartTaskTimeStatistics`, authorizationMiddleware, this.taskController.getTaskTimeStatistics);
        this.router.get(`${this.path}/getChartWeeklyTaskTimeStatistics`, authorizationMiddleware, this.taskController.getWeeklyTaskTimeStatistics);
        this.router.get(`${this.path}/getChartYearlyTaskTimeStatistics`, authorizationMiddleware, this.taskController.getYearlyTaskStatistics);


        this.router.get(`${this.path}/getEmployeeChartTaskTimeStatistics/:employeeId`, authorizationMiddleware, this.taskController.getEmployeeTaskTimeStatistics);
        this.router.get(`${this.path}/getEmployeeChartWeeklyTaskTimeStatistics/:employeeId`, authorizationMiddleware, this.taskController.getEmployeeWeeklyTaskTimeStatistics);
        this.router.get(`${this.path}/getEmployeeChartYearlyTaskTimeStatistics/:employeeId`, authorizationMiddleware, this.taskController.getEmployeeYearlyTaskStatistics);
        this.router.get(`${this.path}/getEmployeeProjectHours/:employeeId`, authorizationMiddleware, this.taskController.getEmployeeProjectHoursSummary);
    }
}
