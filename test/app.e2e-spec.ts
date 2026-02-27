import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

import { AppModule } from 'src/app.module';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/bookmark-users/dto';
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
    describe('Create Bookmark', () => {});

    describe('Get Bookmarks', () => {});

    describe('Get Bookmark By Id', () => {});

    describe('Edit Bookmark By Id', () => {});

    describe('Delete Bookmark By Id', () => {});
  });
});
