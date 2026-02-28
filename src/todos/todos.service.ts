import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';
import { CreateTodoDto } from './dto';
import { Todo } from 'src/generated/prisma/client';

@Injectable()
export class TodosService {
  constructor(private database: DatabaseService) {}

  async createTodo(userId: number, dto: CreateTodoDto): Promise<Todo> {
    return this.database.todo.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  updateTodo(userId: number) {
    console.log(userId);
  }
}
