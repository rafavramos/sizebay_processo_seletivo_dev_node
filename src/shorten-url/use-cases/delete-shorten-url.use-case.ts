import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortenUrl } from '../entities/shorten-url.entity';

@Injectable()
export class DeleteShortenUrlUseCase {
  constructor(
    @InjectRepository(ShortenUrl)
    private readonly shortenUrlRepository: Repository<ShortenUrl>,
  ) {}

  async execute(shortCode: string): Promise<void> {
    const result = await this.shortenUrlRepository.delete({ shortCode });

    if (result.affected === 0) {
      throw new NotFoundException('Short URL not found');
    }
  }
}
