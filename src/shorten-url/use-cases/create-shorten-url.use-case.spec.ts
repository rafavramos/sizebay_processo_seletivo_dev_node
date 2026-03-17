import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sinon from 'sinon';
import { CreateShortenUrlUseCase } from './create-shorten-url.use-case';
import { ShortenUrl } from '../entities/shorten-url.entity';
import { ShortenUrlScenarios } from '../../../test/scenarios/shorten-url.scenarios';

describe('CreateShortenUrlUseCase', () => {
  let useCase: CreateShortenUrlUseCase;
  let repository: sinon.SinonStubbedInstance<Repository<ShortenUrl>>;

  beforeEach(async () => {
    const repoMock = sinon.createStubInstance(Repository);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateShortenUrlUseCase,
        {
          provide: getRepositoryToken(ShortenUrl),
          useValue: repoMock,
        },
      ],
    }).compile();

    useCase = module.get<CreateShortenUrlUseCase>(CreateShortenUrlUseCase);
    repository = repoMock as unknown as sinon.SinonStubbedInstance<
      Repository<ShortenUrl>
    >;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create and save a new short URL', async () => {
    const dto = { url: 'https://example.com' };
    const expectedResult = ShortenUrlScenarios.created(dto.url, 'abc123');

    repository.findOneBy.resolves(null);
    repository.create.returns(expectedResult);
    repository.save.resolves(expectedResult);

    const result = await useCase.execute(dto);

    expect(result).toEqual(expectedResult);
    expect(
      repository.create.calledOnceWith({
        originalUrl: dto.url,
        shortCode: sinon.match.string,
      }),
    ).toBe(true);
    expect(repository.save.calledOnceWith(expectedResult)).toBe(true);
  });

  it('should retry if generated short code is not unique', async () => {
    const dto = { url: 'https://example.com' };
    const expectedResult = ShortenUrlScenarios.created(dto.url, 'unique');

    repository.findOneBy
      .onFirstCall()
      .resolves({ id: 99 } as ShortenUrl) // First code exists
      .onSecondCall()
      .resolves(null); // Second code is unique

    repository.create.returns(expectedResult);
    repository.save.resolves(expectedResult);

    const result = await useCase.execute(dto);

    expect(result).toEqual(expectedResult);
    expect(repository.findOneBy.calledTwice).toBe(true);
  });
});
