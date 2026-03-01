import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

import { AppModule } from 'src/app.module';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/bookmark-users/dto';
import { CreateBookmarkDto } from 'src/bookmarks/dto';
import { DatabaseService } from 'src/database/database.service';

describe('App (e2e)', () => {
  let app: INestApplication;
  let database: DatabaseService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
    await app.listen(3333);

    database = app.get(DatabaseService);
    await database.$connect();
    await database.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await database.cleanDb();

    await database.$disconnect();
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'bolu@gmail.com',
      password: 'Prec12345#',
    };

    const invalidDto: AuthDto = {
      email: 'bolu.com',
      password: 'Pre345',
    };

    describe('Signup', () => {
      it('should throw an error if both email and password are empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });

      it('should throw an error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: undefined,
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw an error if email is invalid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: invalidDto.email,
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw an error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: undefined,
          })
          .expectStatus(400);
      });

      it('should throw an error if password is invalid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: invalidDto.password,
          })
          .expectStatus(400);
      });

      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw an error if both email and password are empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });

      it('should throw an error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: undefined,
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw an error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
            passwrd: undefined,
          })
          .expectStatus(400);
      });
      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('Bookmark User', () => {
    describe('Get me', () => {
      it('should get the current bookmark user', () => {
        return pactum
          .spec()
          .get('/bookmark-users/me')
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
    });

    describe('Edit Bookmark User', () => {
      const dto: EditUserDto = {
        email: 'boluwatife@gmail.com',
        firstName: 'Bolu',
        // lastName: 'Yomi',
      };

      it('should Edit the current bookmark user', () => {
        return pactum
          .spec()
          .patch('/bookmark-users')
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName);
        // .expectBodyContains(dto.lastName);
      });
    });
  });

  describe('Bookmark', () => {
    const dto: CreateBookmarkDto = {
      title: 'Love',
      link: 'https://github.com/yommexg/nestjs',
      description: 'This is a nest js tutorial test',
    };

    describe('Get empty Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create Bookmark', () => {
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withBearerToken('$S{userAt}')
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get Bookmark By Id', () => {
      it('should get bookmark by Id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains(dto.title);
      });
    });

    describe('Edit Bookmark By Id', () => {
      const editDto: CreateBookmarkDto = {
        title: 'Github',
        link: 'https://github.com/yommexg/nestjs',
        description: 'This is a nest js tutorial test for github',
      };

      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(editDto)
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains(editDto.title);
      });
    });

    describe('Delete Bookmark By Id', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBearerToken('$S{userAt}')
          .expectStatus(204);
      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
