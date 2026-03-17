import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortenUrl } from '../entities/shorten-url.entity';

@Injectable()
export class GetShortenUrlUseCase {
  constructor(
    @InjectRepository(ShortenUrl)
    private readonly shortenUrlRepository: Repository<ShortenUrl>,
  ) {}

  async execute(shortCode: string): Promise<ShortenUrl | null> {
    const urlEntry = await this.shortenUrlRepository.findOneBy({ shortCode });

    if (urlEntry) {
      urlEntry.accessCount += 1;
      await this.shortenUrlRepository.save(urlEntry);
    }

    return urlEntry;
  }
}
