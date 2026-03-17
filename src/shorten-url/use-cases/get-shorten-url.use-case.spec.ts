import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sinon from 'sinon';
import { GetShortenUrlUseCase } from './get-shorten-url.use-case';
import { ShortenUrl } from '../entities/shorten-url.entity';
import { ShortenUrlScenarios } from '../../../test/scenarios/shorten-url.scenarios';

describe('GetShortenUrlUseCase', () => {
  let useCase: GetShortenUrlUseCase;
  let repository: sinon.SinonStubbedInstance<Repository<ShortenUrl>>;

  beforeEach(async () => {
    const repoMock = sinon.createStubInstance(Repository);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetShortenUrlUseCase,
        {
          provide: getRepositoryToken(ShortenUrl),
          useValue: repoMock,
        },
      ],
    }).compile();

    useCase = module.get<GetShortenUrlUseCase>(GetShortenUrlUseCase);
    repository = repoMock as unknown as sinon.SinonStubbedInstance<
      Repository<ShortenUrl>
    >;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return the short URL and increment access count', async () => {
    const code = 'abc123';
    const mockUrl = { ...ShortenUrlScenarios.valid, accessCount: 5 };
    repository.findOneBy.resolves(mockUrl);
    repository.save.resolves({ ...mockUrl, accessCount: 6 });

    const result = await useCase.execute(code);

    expect(result).toBeDefined();
    expect(result?.accessCount).toBe(6);
    expect(repository.findOneBy.calledOnceWith({ shortCode: code })).toBe(true);
    expect(repository.save.calledOnce).toBe(true);
  });

  it('should return null if short URL does not exist', async () => {
    const code = 'notfound';
    repository.findOneBy.resolves(null);

    const result = await useCase.execute(code);

    expect(result).toBeNull();
    expect(repository.save.called).toBe(false);
  });
});
