import { Module } from '@nestjs/common';
import { BookmarkUserController } from './bookmark-user.controller';

@Module({
  controllers: [BookmarkUserController],
})
export class BookmarkUserModule {}
