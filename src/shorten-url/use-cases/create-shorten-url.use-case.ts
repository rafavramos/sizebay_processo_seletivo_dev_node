import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortenUrl } from '../entities/shorten-url.entity';
import { CreateShortenUrlDto } from '../dto/create-shorten-url.dto';

@Injectable()
export class CreateShortenUrlUseCase {
  private readonly SHORT_CODE_LENGTH = 6;

  constructor(
    @InjectRepository(ShortenUrl)
    private readonly shortenUrlRepository: Repository<ShortenUrl>,
  ) {}

  async execute(createDto: CreateShortenUrlDto): Promise<ShortenUrl> {
    const { url } = createDto;
    const shortCode = await this.generateUniqueShortCode();

    const newUrl = this.shortenUrlRepository.create({
      originalUrl: url,
      shortCode,
    });

    return await this.shortenUrlRepository.save(newUrl);
  }

  private async generateUniqueShortCode(): Promise<string> {
    let shortCode: string;
    let isUnique = false;

    while (!isUnique) {
      shortCode = this.generateRandomCode();
      const existing = await this.shortenUrlRepository.findOneBy({ shortCode });
      if (!existing) {
        isUnique = true;
      }
    }

    return shortCode;
  }

  private generateRandomCode(): string {
    return Math.random()
      .toString(36)
      .substring(2, 2 + this.SHORT_CODE_LENGTH);
  }
}
