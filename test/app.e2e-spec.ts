import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/start-game (POST)', () => {
    return request(app.getHttpServer())
      .post('/start-game')
      .send({ columns: 2, rows: 2, bombs: 2 })
      .expect(201)
      .expect([
        { revealed: false },
        { revealed: false },
        { revealed: false },
        { revealed: false },
      ]);
  });

  it('/play-turn (POST)', async () => {
    await request(app.getHttpServer())
      .post('/start-game')
      .send({ columns: 2, rows: 2, bombs: 0 });

    return request(app.getHttpServer())
      .post('/play-turn')
      .send({ x: 0, y: 0 })
      .expect(201)
      .expect([
        { revealed: true, nearBombs: 0, isBomb: false },
        { revealed: true, nearBombs: 0, isBomb: false },
        { revealed: true, nearBombs: 0, isBomb: false },
        { revealed: true, nearBombs: 0, isBomb: false },
      ]);
  });
});
