import { IsString, IsEmail, IsEnum, IsOptional, IsNotEmpty, IsPhoneNumber, isNumber, IsNumber } from "class-validator";

export class CreateEmployeeDto {
    @IsString()
    @IsNotEmpty()
    public fullName!: string;

    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    public phoneNumber!: string;

    @IsString()
    @IsNotEmpty()
    public idNumber!: string;

    @IsString()
    @IsNotEmpty()
    public position!: string;

    @IsEnum(['admin', 'manager', 'employee'])
    @IsNotEmpty()
    public role!: 'admin' | 'manager' | 'employee';

    @IsEnum(['male', 'female', 'other'])
    @IsNotEmpty()
    public gender!: 'male' | 'female' | 'other';

    @IsOptional()
    @IsString()
    public race?: string;

    @IsString()
    @IsNotEmpty()
    public location!: string;

    @IsString()
    @IsNotEmpty()
    public password!: string;
}
