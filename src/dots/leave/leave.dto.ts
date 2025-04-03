import { LeaveStatus, LeaveType } from "@/types/leave.types";
import { IsInt, IsEnum, IsDecimal, IsDateString, IsNotEmpty, IsOptional, IsString, IsArray } from "class-validator";


export class LeaveDTO {
    @IsOptional()
    @IsInt()
    id?: number;

    @IsEnum(LeaveType)
    @IsNotEmpty()
    leaveType: LeaveType;

    @IsOptional()
    duration: number;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @IsString()
    @IsNotEmpty()
    reason: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    documents?: string[];

    @IsEnum(LeaveStatus)
    @IsNotEmpty()
    status: LeaveStatus;

    @IsInt()
    @IsNotEmpty()
    employeeId: number;

    @IsOptional()
    @IsDateString()
    createdAt?: string;

    @IsOptional()
    @IsDateString()
    updatedAt?: string;

    
}
