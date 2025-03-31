import Employee from './employee/employee.model';
import Project from './project/project.model';

export function setupAssociations() {
  Employee.belongsToMany(Project, {
    through: 'ProjectEmployees',
    foreignKey: 'employeeId',
    as: 'projects',
  });

  Project.belongsToMany(Employee, {
    through: 'ProjectEmployees',
    foreignKey: 'projectId',
    as: 'employees',
  });
}