import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
  constructor(config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.get('DATABASE_URL')!,
    });
    super({ adapter });
  }

  cleanDb() {
    if (process.env.NODE_ENV === 'production') return;

    return this.$transaction([
      this.todo.deleteMany(),
      this.todoUser.deleteMany(),
      this.bookmark.deleteMany(),
      this.bookmarkUser.deleteMany(),
    ]);
  }
}
