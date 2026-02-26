import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private database: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET') || '',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.database.bookmarkUser.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (user)
      return {
        email: user.email,
        id: user.id,
      };
  }
}
