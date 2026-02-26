import { Controller, Get, UseGuards } from '@nestjs/common';

import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

import type { BookmarkUser } from 'src/generated/prisma/client';

@UseGuards(JwtGuard)
@Controller('bookmark-users')
export class BookmarkUserController {
  @Get('me')
  getMe(
    @GetUser() user: BookmarkUser,
    // @GetUser('email') email: string
  ) {
    // console.log(email);
    return user;
  }
}
