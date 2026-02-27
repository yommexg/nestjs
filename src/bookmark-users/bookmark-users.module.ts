import { Module } from '@nestjs/common';
import { BookmarkUsersController } from './bookmark-users.controller';
import { BookmarkUsersService } from './bookmark-users.service';

@Module({
  controllers: [BookmarkUsersController],
  providers: [BookmarkUsersService],
})
export class BookmarkUsersModule {}
