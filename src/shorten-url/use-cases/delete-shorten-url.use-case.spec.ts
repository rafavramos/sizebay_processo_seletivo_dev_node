import { TestingModule } from '@nestjs/testing';
import { DeleteShortenUrlUseCase } from './delete-shorten-url.use-case';
import { ShortenUrl } from '../entities/shorten-url.entity';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { createIntegrationTestModule } from '../../../test/utils/test-setup.util';

describe('DeleteShortenUrlUseCase (Integration)', () => {
  let useCase: DeleteShortenUrlUseCase;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await createIntegrationTestModule([
      DeleteShortenUrlUseCase,
    ]);

    useCase = module.get<DeleteShortenUrlUseCase>(DeleteShortenUrlUseCase);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.getRepository(ShortenUrl).clear();
  });

  it('should delete an existing short URL', async () => {
    const code = 'abc123';
    await dataSource.getRepository(ShortenUrl).save({
      originalUrl: 'https://example.com',
      shortCode: code,
    });

    await expect(useCase.execute(code)).resolves.not.toThrow();

    const result = await dataSource
      .getRepository(ShortenUrl)
      .findOneBy({ shortCode: code });
    expect(result).toBeNull();
  });

  it('should throw NotFoundException if short URL does not exist', async () => {
    const code = 'notfound';
    await expect(useCase.execute(code)).rejects.toThrow(NotFoundException);
  });
});
