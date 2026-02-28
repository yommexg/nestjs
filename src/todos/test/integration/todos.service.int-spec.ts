import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/database/database.service';
import { TodoStatus } from 'src/generated/prisma/enums';
import { CreateTodoDto } from 'src/todos/dto';
import { TodosService } from 'src/todos/todos.service';

describe('TodosService Integration', () => {
  let database: DatabaseService;
  let todosService: TodosService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    database = moduleRef.get(DatabaseService);
    todosService = moduleRef.get(TodosService);

    await database.$connect();
    await database.cleanDb();
  });

  describe('createTodo()', () => {
    let userId: number;

    const dto: CreateTodoDto = {
      title: 'Nest JS',
      description: 'This is nest',
    };

    it('should create user', async () => {
      const user = await database.todoUser.create({
        data: {
          email: 'bolu@gmail.com',
          firstName: 'Bolu',
          lastName: 'Yomi',
        },
      });

      userId = user.id;
    });

    it('should create todo', async () => {
      const todo = await todosService.createTodo(userId, dto);
      expect(todo.userId).toBe(userId);
      expect(todo.title).toBe(dto.title);
      expect(todo.description).toBe(dto.description);
      expect(todo.status).toBe(TodoStatus.OPEN);
    });

    it('should throw error on duplicate title', async () => {
      await expect(todosService.createTodo(userId, dto)).rejects.toMatchObject({
        code: 'P2002',
      });
    });
  });

  describe('updateTodo()', () => {});
});
