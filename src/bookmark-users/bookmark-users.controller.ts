import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

import type { BookmarkUser } from 'src/generated/prisma/client';
import { EditUserDto } from './dto';
import { BookmarkUsersService } from './bookmark-users.service';

@UseGuards(JwtGuard)
@Controller('bookmark-users')
export class BookmarkUsersController {
  constructor(private bookmarkUserService: BookmarkUsersService) {}

  @Get('me')
  getMe(
    @GetUser() user: BookmarkUser,
    // @GetUser('email') email: string
  ) {
    // console.log(email);
    return user;
  }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.bookmarkUserService.editUser(userId, {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });
  }
}
