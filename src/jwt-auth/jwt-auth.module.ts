import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthController } from './jwt-auth.controller';
import { JwtAuthService } from './jwt-auth.service';

import { AtStrategy, RtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [JwtAuthController],
  providers: [JwtAuthService, AtStrategy, RtStrategy],
})
export class JwtAuthModule {}
