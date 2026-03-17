import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortenUrl } from '../entities/shorten-url.entity';
import { CreateShortenUrlDto } from '../dto/create-shorten-url.dto';

@Injectable()
export class UpdateShortenUrlUseCase {
  constructor(
    @InjectRepository(ShortenUrl)
    private readonly shortenUrlRepository: Repository<ShortenUrl>,
  ) {}

  async execute(
    shortCode: string,
    updateDto: CreateShortenUrlDto,
  ): Promise<ShortenUrl> {
    const urlEntry = await this.shortenUrlRepository.findOneBy({ shortCode });

    if (!urlEntry) {
      throw new NotFoundException('Short URL not found');
    }

    urlEntry.originalUrl = updateDto.url;

    return await this.shortenUrlRepository.save(urlEntry);
  }
}
