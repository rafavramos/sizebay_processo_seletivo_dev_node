import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ShortenUrlService } from './shorten-url.service';
import { CreateShortenUrlDto } from './dto/create-shorten-url.dto';

@Controller('shorten')
export class ShortenUrlController {
  constructor(private readonly shortenUrlService: ShortenUrlService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateShortenUrlDto) {
    const result = await this.shortenUrlService.create(createDto);
    return {
      id: result.id,
      url: result.originalUrl,
      shortCode: result.shortCode,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
