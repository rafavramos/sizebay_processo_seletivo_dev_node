import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortenUrl } from '../entities/shorten-url.entity';

@Injectable()
export class GetShortenUrlStatsUseCase {
  constructor(
    @InjectRepository(ShortenUrl)
    private readonly shortenUrlRepository: Repository<ShortenUrl>,
  ) {}

  async execute(shortCode: string): Promise<ShortenUrl> {
    const urlEntry = await this.shortenUrlRepository.findOneBy({ shortCode });

    if (!urlEntry) {
      throw new NotFoundException('Short URL not found');
    }

    return urlEntry;
  }
}
