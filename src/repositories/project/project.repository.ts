import { Service } from "typedi";
import { IProjectRepository } from "@/interfaces/project/IProjectRepository.interface";
import { IProject } from "@/types/project.types";
import Project from "@/models/project/project.model";
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

    public async deleteProject(projectId: number): Promise<void> {
        const project = await Project.findByPk(projectId);
        if (!project) throw new Error("Project not found");
        await project.destroy();
    }

    public async getAllProjects(): Promise<IProject[]> {
        const projects = await Project.findAll({
            order: [['createdAt', 'DESC']],
            raw: true
        });
        return projects;
    }

    public async getProjectById(projectId: number): Promise<IProject | null> {
        const project = await Project.findByPk(projectId, { raw: true });
        return project;
    }

    // public async getProjectsByStatus(status: string): Promise<IProject[]> {
    //     const projects = await Project.findAll({
    //         where: { status },
    //         order: [['createdAt', 'DESC']],
    //         raw: true
    //     });
    //     return projects;
    // }

    // public async searchProjects(searchTerm: string): Promise<IProject[]> {
    //     const projects = await Project.findAll({
    //         where: {
    //             [Op.or]: [
    //                 { name: { [Op.iLike]: `%${searchTerm}%` } },
    //                 { description: { [Op.iLike]: `%${searchTerm}%` } }
    //             ]
    //         },
    //         raw: true
    //     });
    //     return projects;
    // }

    // public async getProjectsWithTeamMembers(projectId: number): Promise<IProject | null> {
    //     const project = await Project.findByPk(projectId, {
    //         include: [{
    //             model: User,
    //             as: 'teamMembers',
    //             through: { attributes: [] },
    //             attributes: ['id', 'name', 'email']
    //         }],
    //         raw: true,
    //         nest: true
    //     });
    //     return project;
    // }

    // public async countProjects(): Promise<number> {
    //     const count = await Project.count();
    //     return count;
    // }

    // public async getPaginatedProjects(page: number, limit: number): Promise<{ projects: IProject[]; total: number }> {
    //     const offset = (page - 1) * limit;
    //     const result = await Project.findAndCountAll({
    //         limit,
    //         offset,
    //         order: [['createdAt', 'DESC']],
    //         raw: true
    //     });
    //     return {
    //         projects: result.rows,
    //         total: result.count
    //     };
    // }
}