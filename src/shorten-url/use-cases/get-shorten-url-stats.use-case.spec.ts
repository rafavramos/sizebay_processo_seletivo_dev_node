import { TestingModule } from '@nestjs/testing';
import { GetShortenUrlStatsUseCase } from './get-shorten-url-stats.use-case';
import { ShortenUrl } from '../entities/shorten-url.entity';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { createIntegrationTestModule } from '../../../test/utils/test-setup.util';

describe('GetShortenUrlStatsUseCase (Integration)', () => {
  let useCase: GetShortenUrlStatsUseCase;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await createIntegrationTestModule([
      GetShortenUrlStatsUseCase,
    ]);

    useCase = module.get<GetShortenUrlStatsUseCase>(GetShortenUrlStatsUseCase);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.getRepository(ShortenUrl).clear();
  });

  it('should return stats for an existing short URL', async () => {
    const code = 'abc123';
    await dataSource.getRepository(ShortenUrl).save({
      originalUrl: 'https://example.com',
      shortCode: code,
      accessCount: 10,
    });

    const result = await useCase.execute(code);

    expect(result).toBeDefined();
    expect(result.shortCode).toBe(code);
    expect(result.accessCount).toBe(10);
  });

  it('should throw NotFoundException if short URL does not exist', async () => {
    const code = 'notfound';
    await expect(useCase.execute(code)).rejects.toThrow(NotFoundException);
  });
});
