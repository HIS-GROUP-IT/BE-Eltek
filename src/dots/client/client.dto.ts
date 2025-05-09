import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'Full name is required.' })
  fullName!: string;

  @IsNotEmpty({ message: 'Company name is required.' })
  company!: string;

  @IsEmail({}, { message: 'Invalid email address.' })
  email!: string;

  @IsOptional()
  @Matches(/^\+27\d{9}$/, {
    message: 'Telephone number must be a valid South African number (+27XXXXXXXXX).',
  })
  tel?: string;

  @IsOptional()
  @Matches(/^\+27\d{9}$/, {
    message: 'Cell number must be a valid South African number (+27XXXXXXXXX).',
  })
  cell?: string;
}
