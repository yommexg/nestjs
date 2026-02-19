import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CompanyUsersModule } from './company-users/company-users.module';

@Module({
  imports: [UsersModule, DatabaseModule, CompanyUsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
