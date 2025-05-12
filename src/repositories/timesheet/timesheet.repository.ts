import { Service } from "typedi";
import  Task  from "@/models/task/task.model"; // Task model
import { Op, Sequelize } from "sequelize";
import { ITaskRepository } from "@/interfaces/task/ITaskRepository.interface";
import { EmployeeTimesheet, IProjectsHours, ITask, ITaskModification, MonthlyTasks, PhaseTimeline, PhaseTimelineFilters, PhaseTimelineInterval } from "@/types/task.type";
import Employee from "@/models/employee/employee.model";
import { HttpException } from "@/exceptions/HttpException";
import AllocationModel from "@/models/allocation/allocation.model";
import { IUtilization } from "@/types/employee.types";
import Project from "@/models/project/project.model";
import { IEmployeeWorkMetrics } from "@/types/timesheet.types";
import { ITimesheetRepository } from "@/interfaces/timesheet/ITimesheetRepository.interface";

@Service()
export class TimesheetRepository implements ITimesheetRepository {

    
    public async getActiveEmployeesWorkMetrics(): Promise<IEmployeeWorkMetrics[]> {
        try {
          // Get all active employees
          const employees = await Employee.findAll({
            where: { status: 'active', role : "employee" },
            attributes: ['id', 'fullName',"email", "ctc","experience","position","department"],
          });
      
          if (!employees.length) return [];
      
          // Get allocation counts
          const allocationCounts = await AllocationModel.findAll({
            attributes: [
              'employeeId',
              [Sequelize.fn('COUNT', Sequelize.col('employeeId')), 'allocations']
            ],
            group: ['employeeId'],
            raw: true
          });
      
          // Get task counts and completed hours
          const taskMetrics = await Task.findAll({
            attributes: [
              'employeeId',
              [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalTasks'],
              [Sequelize.fn('SUM', Sequelize.literal(
                `CASE WHEN status = 'completed' THEN actualHours ELSE 0 END`
              )), 'totalHours']
            ],
            group: ['employeeId'],
            raw: true
          });
      
          // Create lookup maps
          const allocationMap = new Map<number, number>(
            allocationCounts.map(a => [a.employeeId, Number(a.allocations)])
          );
      
          const taskMap = new Map<number, { tasks: number, hours: number }>(
            taskMetrics.map(t => [
              t.employeeId, 
              { 
                tasks: Number(t.totalTasks),
                hours: Number(t.totalHours) || 0 
              }
            ])
          );
      
          // Combine results
          return employees.map(employee => ({
            employee: employee.get({ plain: true }),
            numberOfAllocations: allocationMap.get(employee.id) || 0,
            numberOfTasks: taskMap.get(employee.id)?.tasks || 0,
            numberOfHours: taskMap.get(employee.id)?.hours || 0,
          }));
      
        } catch (error) {
          console.error('Error fetching employee metrics:', error);
          throw new HttpException(500, error.message);
        }
      }

      public async getEmployeeWorkChartsData(): Promise<{
        hoursData: { employees: string[]; hours: number[] };
        tasksData: { employees: string[]; tasks: number[] };
      }> {
        try {
          // 1. Fetch the raw per‐employee aggregates
          const employees = await Employee.findAll({
            where: { status: 'active' },
            include: [{
              model: Task,
              as: 'tasks',
              attributes: [],
              required: false
            }],
            attributes: [
              'fullName',
              [Sequelize.fn('COUNT', Sequelize.col('tasks.id')), 'totalTasks'],
              [Sequelize.fn('SUM', Sequelize.literal(
                `CASE WHEN tasks.status = 'completed' THEN tasks.actualHours ELSE 0 END`
              )), 'totalHours']
            ],
            group: ['Employee.id'],
            raw: true
          });
      
          // 2. Pull out parallel arrays of names, hours and tasks
          const employeesList = employees.map(e => e.fullName);
          const hoursList     = employees.map(e => Number(e.totalHours)  || 0);
          const tasksList     = employees.map(e => Number(e.totalTasks) || 0);
      
          // 3. Return in the desired nested-object shape
          return {
            hoursData: {
              employees: employeesList,
              hours: hoursList
            },
            tasksData: {
              employees: employeesList,
              tasks: tasksList
            }
          };
      
        } catch (error) {
          console.error('Error fetching chart data:', error);
          throw new HttpException(500, error.message);
        }
      }
      
     }



