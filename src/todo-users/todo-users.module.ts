import { Module } from '@nestjs/common';
import { TodoUsersController } from './todo-users.controller';
import { TodoUsersService } from './todo-users.service';

@Module({
  controllers: [TodoUsersController],
  providers: [TodoUsersService]
})
export class TodoUsersModule {}
