import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    public email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    public password: string

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(10)
    public role: string
}

