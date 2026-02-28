import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CompanyUsersModule } from './company-users/company-users.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BookmarkUsersModule } from './bookmark-users/bookmark-users.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ConfigModule } from './config/config.module';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    UsersModule,
    DatabaseModule,
    CompanyUsersModule,
    ThrottlerModule.forRoot(
      process.env.NODE_ENV === 'test'
        ? []
        : [
            {
              name: 'short',
              ttl: 1000,
              limit: 3,
            },
            {
              name: 'long',
              ttl: 60000,
              limit: 100,
            },
          ],
    ),
    LoggerModule,
    ProfilesModule,
    BookmarkUsersModule,
    BookmarksModule,
    JwtAuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
