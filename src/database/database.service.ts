// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from 'src/generated/prisma/client';

// @Injectable()
// export class DatabaseService extends PrismaClient implements OnModuleInit {
//   async onModuleInit() {
//     await this.$connect();
//   }
// }

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
  constructor(config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.get('DATABASE_URL'),
    });
    super({ adapter });
  }

  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.bookmarkUser.deleteMany(),
    ]);
  }
}
// @Injectable()
// export class DatabaseService extends PrismaClient {
//   constructor() {
//     const adapter = new PrismaPg({
//       connectionString: process.env.DATABASE_URL,
//     });
//     super({ adapter });
//   }
// }
