import { TestingModule } from '@nestjs/testing';
import { CreateShortenUrlUseCase } from './create-shorten-url.use-case';
import { ShortenUrl } from '../entities/shorten-url.entity';
import { DataSource } from 'typeorm';
import { createIntegrationTestModule } from '../../../test/utils/test-setup.util';

describe('CreateShortenUrlUseCase (Integration)', () => {
  let useCase: CreateShortenUrlUseCase;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await createIntegrationTestModule([
      CreateShortenUrlUseCase,
    ]);

    useCase = module.get<CreateShortenUrlUseCase>(CreateShortenUrlUseCase);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.getRepository(ShortenUrl).clear();
  });

  it('should create and save a new short URL in the database', async () => {
    const url = 'https://example.com';
    const result = await useCase.execute({ url });

    expect(result).toBeDefined();
    expect(result.originalUrl).toBe(url);
    expect(result.shortCode).toHaveLength(6);

    const saved = await dataSource
      .getRepository(ShortenUrl)
      .findOneBy({ shortCode: result.shortCode });
    expect(saved).toBeDefined();
    expect(saved!.originalUrl).toBe(url);
  });
});
