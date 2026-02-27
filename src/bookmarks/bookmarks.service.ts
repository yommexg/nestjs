import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  BookmarkCreateInput,
  BookmarkUpdateInput,
} from 'src/generated/prisma/models';

@Injectable()
export class BookmarksService {
  constructor(private database: DatabaseService) {}

  getBookmarks(userId: number) {
    return this.database.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.database.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });
  }

  async createBookmark(userId: number, dto: Omit<BookmarkCreateInput, 'user'>) {
    const bookmark = await this.database.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: BookmarkUpdateInput,
  ) {
    const bookmark = await this.database.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access Denied');

    return this.database.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.database.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access Denied');

    await this.database.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
