import { Module } from '@nestjs/common';
import { CompanyUsersService } from './company-users.service';
import { CompanyUsersController } from './company-users.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CompanyUsersController],
  providers: [CompanyUsersService],
})
export class CompanyUsersModule {}
