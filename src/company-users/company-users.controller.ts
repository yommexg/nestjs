import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CompanyUsersService } from './company-users.service';
import { Prisma } from 'src/generated/prisma/client';

@Controller('company-users')
export class CompanyUsersController {
  constructor(private readonly companyUsersService: CompanyUsersService) {}

  @Post()
  create(@Body() createCompanyUserDto: Prisma.UserCreateInput) {
    return this.companyUsersService.create(createCompanyUserDto);
  }

  @Get()
  findAll(@Query('role') role?: 'INTERN' | 'EMPLOYEE' | 'MANAGER') {
    return this.companyUsersService.findAll(role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyUsersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyUserDto: Prisma.UserUpdateInput,
  ) {
    return this.companyUsersService.update(+id, updateCompanyUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyUsersService.remove(+id);
  }
}
