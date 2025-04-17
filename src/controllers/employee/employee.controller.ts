import { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { Allocation, IEmployee } from "@/types/employee.types";
import { CustomResponse } from "@/types/response.interface";
import { EMPLOYEE_SERVICE_TOKEN } from "@/interfaces/employee/IEmployeeService";
import { RequestWithUser } from "@/types/auth.types";
import { IProject } from "@/types/project.types";

export class EmployeeController {
    private employeeService;

    constructor() {
        this.employeeService = Container.get(EMPLOYEE_SERVICE_TOKEN);
    }

    public createEmployee = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const employeeData: Partial<IEmployee> = req.body;
            const createdBy = Number(req.user.id);
            const data = {
              ...employeeData,
              createdBy:createdBy
            }
            const createdEmployee = await this.employeeService.createEmployee(data);
            const response: CustomResponse<IEmployee> = {
                data: createdEmployee,
                message: "Employee created successfully",
                error: false
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    public GetNumberOfAssignedEmployees = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const numberOfEmployees = await this.employeeService.getNumberOfAssignedEmployees();
        const response: CustomResponse<any> = {
          data: numberOfEmployees,
          message: "number of assigned employees retrieved successfully",
          error: false
      };
      res.status(200).json(response);
        
      } catch (error) {
        next(error);
      }
    }

    public getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employees = await this.employeeService.getAllEmployees();
            const response: CustomResponse<IEmployee[]> = {
                data: employees,
                message: "Employees retrieved successfully",
                error: false
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId: number = parseInt(req.params.id);
            const employee = await this.employeeService.getEmployeeById(employeeId);
            const response: CustomResponse<IEmployee> = {
                data: employee,
                message: employee ? "Employee retrieved successfully" : "Employee not found",
                error: !employee
            };
            res.status(employee ? 200 : 404).json(response);
        } catch (error) {
            next(error);
        }
    };

    public updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeData: Partial<IEmployee> = req.body;
            const updatedEmployee = await this.employeeService.updateEmployee(employeeData);
            const response: CustomResponse<IEmployee> = {
                data: updatedEmployee,
                message: "Employee updated successfully",
                error: false
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    public deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId: number = parseInt(req.params.id);
            await this.employeeService.deleteEmployee(employeeId);
            const response: CustomResponse<null> = {
                data: null,
                message: "Employee deleted successfully",
                error: false
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

public assignEmployeesToProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const assignedEmployees = req.body;

        if (!assignedEmployees || !Array.isArray(assignedEmployees) || assignedEmployees.length === 0) {
            return res.status(400).json({ message: "Invalid employee IDs", error: true });
        }

        await this.employeeService.assignEmployeesToProject(assignedEmployees);
        res.status(201).json({
            data: null,
            message: "Employees assigned successfully",
            error: false
        });
    } catch (error) {
        next(error);
    }
};

// public getEmployeesByProjectId = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const  projectId  = req.params.projectId;  
//       const parsedProjectId = Number(projectId);
//       if (isNaN(parsedProjectId)) {
//         return res.status(400).json({
//           message: "Invalid project ID format",
//           error: true
//         });
//       }  
//       const employees = await this.employeeService.getEmployeesByProjectId(parsedProjectId);  
//       const response : CustomResponse<IProject> = {
//         data: employees,
//         message: "Employees retrieved successfully",
//         error: false
//       }
//       res.status(201).json(response);
//     } catch (error) {
//       next(error);
//     }
//   };

  public removeEmployeeFromProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId, employeeId } = req.params;  
      const parsedProjectId = Number(projectId);
      const parsedEmployeeId = Number(employeeId);  
      if (isNaN(parsedProjectId) || isNaN(parsedEmployeeId)) {
        return res.status(400).json({
          message: "Invalid project ID or employee ID format",
          error: true
        });
      }  
      const success = await this.employeeService.removeEmployeeFromProject(parsedEmployeeId, parsedProjectId);
    
      const response: CustomResponse<null> = {
        data: null,
        message: "Employee removed successfully",
        error: false
      };
  
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
  public activeEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeData = req.body;
      const activatedEmployee = await this.employeeService.activeEmployee(employeeData);
      
      const response: CustomResponse<IEmployee> = {
        data: activatedEmployee,
        message: "Employee activated successfully",
        error: false
      };
  
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };


public getEmployeeProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employeeId  = req.params.employeeId;
      const parsedEmployeeId = Number(employeeId);  
      if (isNaN(parsedEmployeeId)) {
        return res.status(400).json({ message: "Invalid employee ID", error: true });
      }  
      const projects = await this.employeeService.getEmployeeProjects(parsedEmployeeId);
      const response : CustomResponse<IProject> = {
        data: projects,
        message: "Projects retrieved successfully",
        error: false
      }
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };
  public addAllocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employeeId = parseInt(req.params.employeeId);
        const allocation: Allocation = req.body;
        
        const updatedEmployee = await this.employeeService.addAllocation(
            employeeId,
            allocation
        );
        
        const response: CustomResponse<IEmployee> = {
            data: updatedEmployee,
            message: "Allocation added successfully",
            error: false
        };
        
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

public removeAllocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const data = req.body
      const updatedEmployee = await this.employeeService.removeAllocation(
         data
      );      
      const response: CustomResponse<IEmployee> = {
          data: updatedEmployee,
          message: `All allocations for project ID ${data.projectId} removed successfully`,
          error: false
      };
      
      res.status(200).json(response);
  } catch (error) {
      next(error);
  }
};


public updateAllocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employeeId = parseInt(req.params.employeeId);
        const { project, phase } = req.query;
        const updates: Partial<Allocation> = req.body;
        
        const updatedEmployee = await this.employeeService.updateAllocation(
            employeeId,
            project as string,
            phase as string,
            updates
        );
        
        const response: CustomResponse<IEmployee> = {
            data: updatedEmployee,
            message: "Allocation updated successfully",
            error: false
        };
        
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

public getAllocations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employeeId = parseInt(req.params.employeeId);
        const allocations = await this.employeeService.getEmployeeAllocations(employeeId);
        
        const response: CustomResponse<Allocation[]> = {
            data: allocations,
            message: "Allocations retrieved successfully",
            error: false
        };
        
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};
public getEmployeesByProjectId = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const projectId = parseInt(req.params.projectId);
      console.log("My Id", projectId)
      const projects = await this.employeeService.getEmployeesByProjectId(projectId);
      
      const response: CustomResponse<Allocation[]> = {
          data: projects,
          message: "projects retrieved successfully",
          error: false
      };
      
      res.status(200).json(response);
  } catch (error) {
      next(error);
  }
};

}
