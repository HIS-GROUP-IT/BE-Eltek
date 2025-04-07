import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { Type } from "class-transformer";

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsEnum(['employee', 'project', 'department', 'all'])
    @IsNotEmpty()
    audiance: string;

    @IsNumber()
    @ValidateIf(o => o.audiance === 'employee')
    @IsNotEmpty()
    @Type(() => Number)
    employeeId?: number;

    @IsNumber()
    @ValidateIf(o => o.audiance === 'project')
    @IsNotEmpty()
    @Type(() => Number)
    projectId?: number;

    @IsString()
    @ValidateIf(o => o.audiance === 'department')
    @IsNotEmpty()
    department?: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isRead?: boolean;
}

export class UpdateNotificationDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    id: number;

    @IsString()
    @IsOptional()
    message?: string;

    @IsString()
    @IsOptional()
    type?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    audicace?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    employeeId?: number;

    @IsString()
    @IsOptional()
    title?: string;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isRead?: boolean;
}

export class MarkAsReadDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    notificationId: number;
}

export class MarkAllAsReadDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    employeeId: number;
}

export class NotificationQueryDto {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    employeeId?: number;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isRead?: boolean;

    @IsString()
    @IsOptional()
    type?: string;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;
}

export class NotificationParamDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    notificationId: number;
}

export class EmployeeNotificationParamDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    employeeId: number;
}