import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sinon from 'sinon';
import { GetShortenUrlStatsUseCase } from './get-shorten-url-stats.use-case';
import { ShortenUrl } from '../entities/shorten-url.entity';
import { NotFoundException } from '@nestjs/common';
import { ShortenUrlScenarios } from '../../../test/scenarios/shorten-url.scenarios';

describe('GetShortenUrlStatsUseCase', () => {
  let useCase: GetShortenUrlStatsUseCase;
  let repository: sinon.SinonStubbedInstance<Repository<ShortenUrl>>;

  beforeEach(async () => {
    const repoMock = sinon.createStubInstance(Repository);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetShortenUrlStatsUseCase,
        {
          provide: getRepositoryToken(ShortenUrl),
          useValue: repoMock,
        },
      ],
    }).compile();

    useCase = module.get<GetShortenUrlStatsUseCase>(GetShortenUrlStatsUseCase);
    repository = repoMock as unknown as sinon.SinonStubbedInstance<
      Repository<ShortenUrl>
    >;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return stats for an existing short URL', async () => {
    const code = 'abc123';
    const expectedResult = ShortenUrlScenarios.valid;
    repository.findOneBy.resolves(expectedResult);

    const result = await useCase.execute(code);

    expect(result).toEqual(expectedResult);
    expect(repository.findOneBy.calledOnceWith({ shortCode: code })).toBe(true);
  });

  it('should throw NotFoundException if short URL does not exist', async () => {
    const code = 'notfound';
    repository.findOneBy.resolves(null);

    await expect(useCase.execute(code)).rejects.toThrow(NotFoundException);
  });
});
