import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TodoUser } from 'src/generated/prisma/client';
import { CreateTodoUsersDto } from './dto';

@Injectable()
export class TodoUsersService {
  constructor(private database: DatabaseService) {}

  createUser(dto: CreateTodoUsersDto): Promise<TodoUser> {
    return this.database.todoUser.create({
      data: {
        ...dto,
      },
    });
  }
}
