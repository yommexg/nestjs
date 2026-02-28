import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoUsersDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
