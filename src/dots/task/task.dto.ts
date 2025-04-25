import { IsString, IsInt, IsOptional, IsDate, IsEnum, IsPositive, MaxLength, IsNotEmpty } from 'class-validator';
import  TaskStatus  from '@/models/task/task.model'; 

export class TaskDTO {

    
    @IsNotEmpty()
    @IsString()
    public phaseId: string;

    @IsString()
    @MaxLength(255)
    public employeeName: string;

    @IsString()
    @MaxLength(10)
    public priority: string;


    @IsString()
    @MaxLength(255)
    public position: string;

    @IsString()
    @MaxLength(255)
    public taskTitle: string;

    @IsString()
    @IsOptional()
    @MaxLength(2000)
    public taskDescription?: string;



    @IsInt()
    @IsPositive()
    public estimatedHours : number;

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
