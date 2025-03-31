import { Service } from "typedi";
import { IProjectRepository } from "@/interfaces/project/IProjectRepository.interface";
import { IProject } from "@/types/project.types";
import Project from "@/models/project/project.model";
import Employee from "@/models/employee/employee.model"; 
import EmployeeProject from "@/models/employee/projectEmployees.model";
import { HttpException } from "@/exceptions/HttpException";
import { Op } from "sequelize";


@Service()
export class ProjectRepository implements IProjectRepository {
    public async createProject(projectData: Partial<IProject>): Promise<IProject> {
        const project = await Project.create(projectData);
        return project.get({ plain: true });
    }

    public async updateProject(projectData: Partial<IProject>): Promise<IProject> {
        const project = await Project.findByPk(projectData.id);
        if (!project) throw new Error("Project not found");
        await project.update(projectData);
        return project.get({ plain: true });
    }

    public async getAllProjects(): Promise<IProject[]> {
        const projects = await Project.findAll({
            order: [['createdAt', 'DESC']],
            raw: true
        });
        return projects;
    }

    public async getProjectById(projectId: number): Promise<IProject | null> {
        const project = await Project.findByPk(projectId, {           
            raw: true,
            nest: true
        });
        return project;
    }

    public async getProjectsByEmployee(employeeId: number): Promise<IProject[]> {
        const employeeProjects = await EmployeeProject.findAll({
          where: { employeeId },
          include: [{
            model: Project,
            as: 'project',
            attributes: ['id', 'name', 'description', 'duration', 'budget', 'startDate', 'endDate', 'status']
          }]
        });
      
        if (!employeeProjects || employeeProjects.length === 0) {
          throw new Error("No projects assigned to this employee");
        }
      
        // Extract the project from each EmployeeProject record
        const projects = employeeProjects.map(ep => (ep as any).project);
        return projects;
      }
      

    public async deleteProject(projectId: number): Promise<void> {
        const transaction = await Project.sequelize!.transaction();
        
        try {
            const project = await Project.findByPk(projectId, { transaction });
            if (!project) {
                throw new HttpException(404, "Project not found");
            }    
            await EmployeeProject.destroy({
                where: { projectId },
                transaction
            });    
            const assignedEmployees = await EmployeeProject.findAll({
                attributes: ['employeeId'],
                where: { projectId },
                transaction
            });
    
            const employeeIds = assignedEmployees.map(e => e.employeeId);
            
            if (employeeIds.length > 0) {
                const employeesWithNoOtherProjects = await Employee.findAll({
                    where: {
                        id: employeeIds,
                        [Op.not]: {
                            id: {
                                [Op.in]: await EmployeeProject.findAll({
                                    attributes: ['employeeId'],
                                    where: {
                                        employeeId: employeeIds,
                                        projectId: { [Op.ne]: projectId }
                                    },
                                    transaction
                                }).then(res => res.map(r => r.employeeId))
                            }
                        }
                    },
                    transaction
                });
                    if (employeesWithNoOtherProjects.length > 0) {
                    await Employee.update(
                        { assigned: false },
                        {
                            where: { id: employeesWithNoOtherProjects.map(e => e.id) },
                            transaction
                        }
                    );
                }
            }
    
            await project.update({ status: "cancelled" }, { transaction });
    
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error instanceof HttpException ? error : new HttpException(500, "Error deleting project");
        }
    }
}
