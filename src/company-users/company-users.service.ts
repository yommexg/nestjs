import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class CompanyUsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCompanyUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({
      data: createCompanyUserDto,
    });
  }

  async findAll(role?: 'INTERN' | 'EMPLOYEE' | 'MANAGER') {
    if (role)
      return this.databaseService.user.findMany({
        where: {
          role,
        },
      });

    return this.databaseService.user.findMany({});
  }

  async findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateCompanyUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: { id },
      data: updateCompanyUserDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.user.delete({
      where: { id },
    });
  }
}
