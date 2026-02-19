import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['INTERN', 'EMPLOYEE', 'MANAGER'], {
    message: 'Role must be either INTERN, EMPLOYEE, or MANAGER',
  })
  role: 'INTERN' | 'EMPLOYEE' | 'MANAGER';
}
