import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { BookmarkUserUpdateInput } from 'src/generated/prisma/models';

@Injectable()
export class BookmarkUsersService {
  constructor(private database: DatabaseService) {}

  async editUser(userId: number, dto: BookmarkUserUpdateInput) {
    const user = await this.database.bookmarkUser.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    return {
      email: user.email,
      firstName: user.firstName,
      lastNamee: user.lastName,
    };
  }
}
