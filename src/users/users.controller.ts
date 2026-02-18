import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // GET/users or /users?role=value
  findAll(@Query('role') role?: 'INTERN' | 'EMPLOYEE' | 'MANAGER') {
    return this.usersService.findAll(role);
  }

  @Get(':id') // GET/users/:id
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Post() // POST/users
  create(
    @Body()
    user: {
      name: string;
      email: string;
      role: 'INTERN' | 'EMPLOYEE' | 'MANAGER';
    },
  ) {
    return this.usersService.create(user);
  }

  @Patch(':id') // PATCH/users/:id
  update(
    @Param('id') id: string,
    @Body()
    userUpdate: {
      name: string;
      email: string;
      role: 'INTERN' | 'EMPLOYEE' | 'MANAGER';
    },
  ) {
    return this.usersService.update(Number(id), userUpdate);
  }

  @Delete(':id') // DELETE/users/:id
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
