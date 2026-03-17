import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';

describe('ShortenUrl (e2e integration)', () => {
  let app: INestApplication;
  let createdShortCode: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const getRequest = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return supertest(app.getHttpServer());
  };

  it('POST /shorten (Create)', () => {
    return getRequest()
      .post('/shorten')
      .send({ url: 'https://sizebay.com' })
      .expect(201)
      .expect((res: supertest.Response) => {
        const body = res.body as { shortCode: string; url: string };
        expect(body).toHaveProperty('shortCode');
        expect(body.url).toBe('https://sizebay.com');
        createdShortCode = body.shortCode;
      });
  });

  it('GET /shorten/:shortCode (Find One)', () => {
    return getRequest()
      .get(`/shorten/${createdShortCode}`)
      .expect(200)
      .expect((res: supertest.Response) => {
        const body = res.body as { shortCode: string; url: string };
        expect(body.shortCode).toBe(createdShortCode);
        expect(body.url).toBe('https://sizebay.com');
      });
  });

  it('PUT /shorten/:shortCode (Update)', () => {
    return getRequest()
      .put(`/shorten/${createdShortCode}`)
      .send({ url: 'https://updated-sizebay.com' })
      .expect(200)
      .expect((res: supertest.Response) => {
        const body = res.body as { url: string };
        expect(body.url).toBe('https://updated-sizebay.com');
      });
  });

  it('GET /shorten/:shortCode/stats (Stats)', () => {
    return getRequest()
      .get(`/shorten/${createdShortCode}/stats`)
      .expect(200)
      .expect((res: supertest.Response) => {
        const body = res.body as { accessCount: number };
        expect(body.accessCount).toBeGreaterThanOrEqual(1);
      });
  });

  it('DELETE /shorten/:shortCode (Remove)', () => {
    return getRequest().delete(`/shorten/${createdShortCode}`).expect(204);
  });

  it('GET /shorten/:shortCode (Not Found after delete)', () => {
    return getRequest().get(`/shorten/${createdShortCode}`).expect(404);
  });
});
