import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { JwtAuthDto } from './dto';
import { Tokens } from './types';
import { AtGuard, RtGuard } from './common/guards';
import {
  GetCurrentUserId,
  GetCurrentUserRefreshToken,
} from './common/decorator';

@Controller('jwt-auth')
export class JwtAuthController {
  constructor(private jwtAuthService: JwtAuthService) {}

  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body(ValidationPipe) dto: JwtAuthDto): Promise<Tokens> {
    return this.jwtAuthService.signupLocal({
      email: dto.email,
      hash: dto.password,
    });
  }

  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body(ValidationPipe) dto: JwtAuthDto): Promise<Tokens> {
    return this.jwtAuthService.signinLocal({
      email: dto.email,
      hash: dto.password,
    });
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return this.jwtAuthService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUserRefreshToken() rt: string,
  ) {
    return this.jwtAuthService.refreshTokens(userId, rt);
  }
}
