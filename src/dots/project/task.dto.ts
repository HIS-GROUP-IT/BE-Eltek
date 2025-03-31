import { IsString, IsInt, IsOptional, IsDate, IsEnum, IsPositive, MaxLength } from 'class-validator';
import  TaskStatus  from '@/models/project/task.model'; 

export class TaskDTO {
    @IsInt()
    @IsPositive()
    public employeeId: number;
    
    @IsInt()
    @IsPositive()
    public projectId: number;

    @IsString()
    @MaxLength(255)
    public employeeName: string;

    @IsString()
    @MaxLength(255)
    public position: string;

    @IsString()
    @MaxLength(255)
    public taskTitle: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    public taskDescription?: string;

    @IsInt()
    @IsPositive()
    public hours: number;

    @IsString()
    @IsOptional()
    public status: TaskStatus;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    public reasonForRejection?: string;

    @IsInt()
    @IsPositive()
    public modifiedBy: number; 
}
