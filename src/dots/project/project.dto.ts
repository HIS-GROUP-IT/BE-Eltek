import { IsString, IsNotEmpty, IsOptional, IsEnum, IsInt, IsDate, IsDateString, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['planned', 'on going', 'cancelled', 'completed', 'on hold'])
  status: 'planned' | 'on going' | 'cancelled' | 'completed' | 'on hold';

  @IsDateString()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;


  @IsOptional()
  duration : number


  @IsOptional()
  budget : number
}


export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  status: string

  @IsDateString()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;


  @IsOptional()
  duration : number



  @IsOptional()
  budget : number
}
