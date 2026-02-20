import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Ip,
} from '@nestjs/common';
import { CompanyUsersService } from './company-users.service';
import { Prisma } from 'src/generated/prisma/client';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { LoggerService } from 'src/logger/logger.service';

@SkipThrottle()
@Controller('company-users')
export class CompanyUsersController {
  constructor(private readonly companyUsersService: CompanyUsersService) {}

  private readonly logger = new LoggerService(CompanyUsersController.name);

  @Post()
  create(@Body() createCompanyUserDto: Prisma.UserCreateInput) {
    return this.companyUsersService.create(createCompanyUserDto);
  }

  @SkipThrottle({ default: false }) // Disable Rate limiting for this route
  @Get()
  findAll(
    @Ip() ip: string,
    @Query('role') role?: 'INTERN' | 'EMPLOYEE' | 'MANAGER',
  ) {
    this.logger.log(
      `Request for All Company Users \t IP: ${ip} \t Role Filter: ${role ?? 'None'}`,
      CompanyUsersController.name,
    );
    return this.companyUsersService.findAll(role);
  }

  @Throttle({ short: { ttl: 5000, limit: 1 } }) // Apply short rate limit for this route
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
