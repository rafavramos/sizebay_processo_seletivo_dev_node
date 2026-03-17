import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sinon from 'sinon';
import { UpdateShortenUrlUseCase } from './update-shorten-url.use-case';
import { ShortenUrl } from '../entities/shorten-url.entity';
import { ShortenUrlScenarios } from '../../../test/scenarios/shorten-url.scenarios';
import { NotFoundException } from '@nestjs/common';

describe('UpdateShortenUrlUseCase', () => {
  let useCase: UpdateShortenUrlUseCase;
  let repository: sinon.SinonStubbedInstance<Repository<ShortenUrl>>;

  beforeEach(async () => {
    const repoMock = sinon.createStubInstance(Repository);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateShortenUrlUseCase,
        {
          provide: getRepositoryToken(ShortenUrl),
          useValue: repoMock,
        },
      ],
    }).compile();

    useCase = module.get<UpdateShortenUrlUseCase>(UpdateShortenUrlUseCase);
    repository = repoMock as unknown as sinon.SinonStubbedInstance<
      Repository<ShortenUrl>
    >;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should update an existing short URL', async () => {
    const code = 'abc123';
    const dto = { url: 'https://updated-example.com' };
    const mockUrl = ShortenUrlScenarios.valid;
    const expectedResult = ShortenUrlScenarios.updated(dto.url, code);

    repository.findOneBy.resolves(mockUrl);
    repository.save.resolves(expectedResult);

    const result = await useCase.execute(code, dto);

    expect(result.originalUrl).toBe(dto.url);
    expect(repository.findOneBy.calledOnceWith({ shortCode: code })).toBe(true);
    expect(repository.save.calledOnce).toBe(true);
  });

  it('should throw NotFoundException if short URL does not exist', async () => {
    const code = 'notfound';
    const dto = { url: 'https://updated-example.com' };
    repository.findOneBy.resolves(null);

    await expect(useCase.execute(code, dto)).rejects.toThrow(NotFoundException);
  });
});
