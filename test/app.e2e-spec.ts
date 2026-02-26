import { INestApplication } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

import { AllExceptionsFilter } from 'src/all-exceptions.filter';
import { AppModule } from 'src/app.module';
import { AuthDto } from 'src/auth/dto';
import { DatabaseService } from 'src/database/database.service';

describe('App (e2e)', () => {
  let app: INestApplication;
  let database: DatabaseService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    await app.init();
    await app.listen(3333);

    database = app.get(DatabaseService);
    await database.$connect();
    await database.cleanDb();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      const dto: AuthDto = {
        email: 'bolu@gmail.com',
        password: 'Prec12345#',
      };

      it('should sign up', () => {
        return pactum
          .spec()
          .post('http://localhost:3333/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {});
  });

  describe('Bookmark User', () => {
    describe('Get me', () => {});

    describe('Edit Bookmark User', () => {});
  });

  describe('Bookmark', () => {
    describe('Create Bookmark', () => {});

    describe('Get Bookmarks', () => {});

    describe('Get Bookmark By Id', () => {});

    describe('Edit Bookmark', () => {});

    describe('Delete Bookmark', () => {});
  });
});
