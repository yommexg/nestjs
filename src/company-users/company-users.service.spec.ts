import { Test, TestingModule } from '@nestjs/testing';
import { CompanyUsersService } from './company-users.service';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from 'src/generated/prisma/client';

describe('CompanyUsersService', () => {
  let service: CompanyUsersService;

  const mockDatabaseService = {
    user: {
      create: jest
        .fn()
        .mockImplementation(({ data }: { data: Prisma.UserCreateInput }) => ({
          id: 1,
          ...data,
        })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyUsersService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<CompanyUsersService>(CompanyUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new company user', async () => {
    const dto: Prisma.UserCreateInput = {
      email: 'bolu@gmail.com',
      role: 'EMPLOYEE',
      name: 'bolu',
    };

    expect(await service.create(dto)).toEqual({ id: 1, ...dto });
  });
});
