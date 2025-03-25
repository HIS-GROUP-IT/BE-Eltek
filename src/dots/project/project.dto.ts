import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  employees?: string[]; // Array of employee IDs

  @IsInt()
  @IsOptional()
  budget?: number; // Optional field for budget
}




export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string; // Optional field for project name

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string; // Optional field for project description

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  employees?: string[]; // Array of employee IDs to assign to the project

  @IsInt()
  @IsOptional()
  budget?: number; // Optional field for project budget
}
