import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import * as sinon from 'sinon';
import { DeleteShortenUrlUseCase } from './delete-shorten-url.use-case';
import { ShortenUrl } from '../entities/shorten-url.entity';
import { NotFoundException } from '@nestjs/common';

describe('DeleteShortenUrlUseCase', () => {
  let useCase: DeleteShortenUrlUseCase;
  let repository: sinon.SinonStubbedInstance<Repository<ShortenUrl>>;

  beforeEach(async () => {
    const repoMock = sinon.createStubInstance(Repository);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteShortenUrlUseCase,
        {
          provide: getRepositoryToken(ShortenUrl),
          useValue: repoMock,
        },
      ],
    }).compile();

    useCase = module.get<DeleteShortenUrlUseCase>(DeleteShortenUrlUseCase);
    repository = repoMock as unknown as sinon.SinonStubbedInstance<
      Repository<ShortenUrl>
    >;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should delete an existing short URL', async () => {
    const code = 'abc123';
    repository.delete.resolves({ affected: 1 } as DeleteResult);

    await expect(useCase.execute(code)).resolves.not.toThrow();
    expect(repository.delete.calledOnceWith({ shortCode: code })).toBe(true);
  });

  it('should throw NotFoundException if short URL does not exist', async () => {
    const code = 'notfound';
    repository.delete.resolves({ affected: 0 } as DeleteResult);

    await expect(useCase.execute(code)).rejects.toThrow(NotFoundException);
  });
});
