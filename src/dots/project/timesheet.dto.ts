import { IsString, IsNotEmpty, IsInt, IsEnum, IsDate, IsOptional } from 'class-validator';

export class CreateTimesheetDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  hours: number;

  @IsEnum(['pending', 'approved', 'rejected'])
  @IsNotEmpty()
  status: string;

  @IsInt()
  @IsNotEmpty()
  projectId: number;

  @IsDate()
  @IsNotEmpty()
  date: Date;
}

export class UpdateTimesheetDto {
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsInt()
    @IsOptional()
    hours?: number;
  
    @IsEnum(['pending', 'approved', 'rejected'])
    @IsOptional()
    status?: string;
  
    @IsInt()
    @IsOptional()
    projectId?: number;
  
    @IsDate()
    @IsOptional()
    date?: Date;
  }