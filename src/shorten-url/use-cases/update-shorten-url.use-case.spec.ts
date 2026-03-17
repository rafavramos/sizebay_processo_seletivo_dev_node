import { TestingModule } from '@nestjs/testing';
import { UpdateShortenUrlUseCase } from './update-shorten-url.use-case';
import { ShortenUrl } from '../entities/shorten-url.entity';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { createIntegrationTestModule } from '../../../test/utils/test-setup.util';

describe('UpdateShortenUrlUseCase (Integration)', () => {
  let useCase: UpdateShortenUrlUseCase;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await createIntegrationTestModule([
      UpdateShortenUrlUseCase,
    ]);

    useCase = module.get<UpdateShortenUrlUseCase>(UpdateShortenUrlUseCase);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.getRepository(ShortenUrl).clear();
  });

  it('should update the original URL of an existing short code', async () => {
    const code = 'abc123';
    await dataSource.getRepository(ShortenUrl).save({
      originalUrl: 'https://old-url.com',
      shortCode: code,
    });

    const newUrl = 'https://new-url.com';
    const result = await useCase.execute(code, { url: newUrl });

    expect(result).toBeDefined();
    expect(result.originalUrl).toBe(newUrl);

    const updated = await dataSource
      .getRepository(ShortenUrl)
      .findOneBy({ shortCode: code });
    expect(updated?.originalUrl).toBe(newUrl);
  });

  it('should throw NotFoundException if short URL does not exist', async () => {
    const code = 'notfound';
    await expect(
      useCase.execute(code, { url: 'https://example.com' }),
    ).rejects.toThrow(NotFoundException);
  });
});
