import * as argon2 from 'argon2';

import { ForbiddenException, Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';
import { Prisma } from 'src/generated/prisma/client';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthService {
  constructor(
    private database: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signupLocal(dto: Prisma.JwtUserCreateInput): Promise<Tokens> {
    const hashed = await this.hashData(dto.hash);

    const newUser = await this.database.jwtUser.create({
      data: {
        email: dto.email,
        hash: hashed,
      },
    });

    const tokens = await this.generateTokens(newUser.id, newUser.email);

    await this.saveRefreshTokenDb(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async signinLocal(dto: Prisma.JwtUserCreateInput): Promise<Tokens> {
    const user = await this.database.jwtUser.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const passwordMatches = await argon2.verify(user.hash, dto.hash);

    if (!passwordMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await this.saveRefreshTokenDb(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    await this.database.jwtUser.update({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.database.jwtUser.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await argon2.verify(user.hashedRt, rt);

    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await this.saveRefreshTokenDb(user.id, tokens.refresh_token);

    return tokens;
  }

  async generateTokens(userId: number, email: string): Promise<Tokens> {
    const payload = {
      sub: userId,
      email,
    };

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('AT_SECRET'),
      }),

      this.jwt.signAsync(payload, {
        expiresIn: '1w',
        secret: this.config.get('RT_SECRET'),
      }),
    ]);

    return {
      acccess_token: at,
      refresh_token: rt,
    };
  }

  async saveRefreshTokenDb(userId: number, rt: string) {
    const hashedRt = await this.hashData(rt);

    await this.database.jwtUser.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt,
      },
    });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }
}
