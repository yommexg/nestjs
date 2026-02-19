import { Test, TestingModule } from '@nestjs/testing';
import { CompanyUsersController } from './company-users.controller';
import { CompanyUsersService } from './company-users.service';

describe('CompanyUsersController', () => {
  let controller: CompanyUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyUsersController],
      providers: [CompanyUsersService],
    }).compile();

    controller = module.get<CompanyUsersController>(CompanyUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
