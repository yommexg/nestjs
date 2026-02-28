import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/database/database.service';
import { CreateTodoUsersDto } from 'src/todo-users/dto';
import { TodoUsersService } from 'src/todo-users/todo-users.service';

describe('Todo Users Service Integration', () => {
  let database: DatabaseService;
  let todoUserservice: TodoUsersService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    database = moduleRef.get(DatabaseService);
    todoUserservice = moduleRef.get(TodoUsersService);

    await database.$connect();
    await database.cleanDb();
  });

  describe('createUser()', () => {
    const dto: CreateTodoUsersDto = {
      email: 'bolu@gmail',
      firstName: 'Bolu',
      lastName: 'YOmi',
    };

    it('should create user', async () => {
      const user = await todoUserservice.createUser(dto);

      expect(user.email).toBe(dto.email);
      expect(user.firstName).toBe(dto.firstName);
      expect(user.lastName).toBe(dto.lastName);
    });

    it('should throw error on duplicate email', async () => {
      await expect(todoUserservice.createUser(dto)).rejects.toMatchObject({
        code: 'P2002',
      });
    });
  });
});
