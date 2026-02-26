import * as argon2 from 'argon2';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { DatabaseService } from 'src/database/database.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: Prisma.BookmarkUserCreateInput) {
    const hashed = await argon2.hash(dto.hash);

    const user = await this.databaseService.bookmarkUser.create({
      data: {
        email: dto.email,
        hash: hashed,
      },
    });

    return this.signToken(user.id, user.email);
  }

  async signin(dto: Prisma.BookmarkUserCreateInput) {
    const user = await this.databaseService.bookmarkUser.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new UnauthorizedException('Credentials Incorrect');

    const pwMatches = await argon2.verify(user.hash, dto.hash);

    if (!pwMatches) throw new UnauthorizedException('Credentials Incorrect');

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
