import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

import { CompanyUsersModule } from 'src/company-users/company-users.module';
import { ConfigModule } from 'src/config/config.module';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';

describe('Company Users (e2e)', () => {
  let app: INestApplication;
  let database: DatabaseService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CompanyUsersModule, ConfigModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
    await app.listen(3333);

    database = app.get(DatabaseService);
    await database.$connect();
    await database.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333/api/company-users');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Signup', () => {
    it('should throw an error if both email and password are empty', () => {
      return pactum.spec().post('/auth/signup').withBody({}).expectStatus(400);
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
  });
});
