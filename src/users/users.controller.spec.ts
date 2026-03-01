import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Always overide dependecy injection for unit testing

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn((dto: CreateUserDto) => {
      return { dto };
    }),

    update: jest
      .fn()
      .mockImplementation((userId: number, dto: UpdateUserDto) => {
        return { userId, ...dto };
      }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const dto: CreateUserDto = {
      email: 'bolu@gmail.com',
      role: 'EMPLOYEE',
      name: 'bolu',
    };

    expect(controller.create(dto)).toEqual({
      dto,
    });

    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });

  it('should update a user', () => {
    const userId = 20;
    const dto: UpdateUserDto = {
      role: 'MANAGER',
    };

    expect(controller.update(userId, dto)).toEqual({
      userId,
      ...dto,
    });

    expect(mockUsersService.update).toHaveBeenCalledWith(userId, dto);
  });
});
