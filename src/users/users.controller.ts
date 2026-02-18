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

@Controller('users')
export class UsersController {
  @Get() // GET/users or /users?role=value
  findAll(@Query('role') role?: 'INTERN' | 'EMPLOYEE' | 'MANAGER') {
    return [role];
  }

  @Get(':id') // GET/users/:id
  findOne(@Param('id') id: string) {
    return { id };
  }

  @Post() // POST/users
  create(@Body() user: object) {
    return user;
  }

  @Patch(':id') // PATCH/users/:id
  update(@Param('id') id: string, @Body() userUpdate: object) {
    return { id, ...userUpdate };
  }

  @Delete(':id') // DELETE/users/:id
  remove(@Param('id') id: string) {
    return { id };
  }
}
