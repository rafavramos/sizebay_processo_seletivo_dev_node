import { TestingModule } from '@nestjs/testing';
import { GetShortenUrlUseCase } from './get-shorten-url.use-case';
import { ShortenUrl } from '../entities/shorten-url.entity';
import { DataSource } from 'typeorm';
import { createIntegrationTestModule } from '../../../test/utils/test-setup.util';

describe('GetShortenUrlUseCase (Integration)', () => {
  let useCase: GetShortenUrlUseCase;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await createIntegrationTestModule([
      GetShortenUrlUseCase,
    ]);

    useCase = module.get<GetShortenUrlUseCase>(GetShortenUrlUseCase);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.getRepository(ShortenUrl).clear();
  });

  it('should return the original URL and increment access count', async () => {
    const code = 'abc123';
    await dataSource.getRepository(ShortenUrl).save({
      originalUrl: 'https://example.com',
      shortCode: code,
      accessCount: 0,
    });

    const result = await useCase.execute(code);

    expect(result).toBeDefined();
    expect(result!.originalUrl).toBe('https://example.com');

    const updated = await dataSource
      .getRepository(ShortenUrl)
      .findOneBy({ shortCode: code });
    expect(updated!.accessCount).toBe(1);
  });

  it('should return null if short URL does not exist', async () => {
    const code = 'notfound';
    const result = await useCase.execute(code);
    expect(result).toBeNull();
  });
});
