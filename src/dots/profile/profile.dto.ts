import { IsString, IsEmail, IsOptional, IsEnum, IsInt, IsDateString, IsPhoneNumber, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  position: string;

  @IsOptional()
  @IsInt()
  projectId?: number;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsEnum(['active', 'inactive'])
  status: 'active' | 'inactive';
}

export class UpdateProfileDto extends CreateProfileDto {
  @IsInt()
  id: number;
}


export class AssignRemoveEmployee {

  @IsInt()
  projectId: number;
  @IsInt()
  employeeId: number;
}

