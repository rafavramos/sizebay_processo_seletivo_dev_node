import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortenUrlController } from './shorten-url.controller';
import { ShortenUrlService } from './shorten-url.service';
import { ShortenUrl } from './entities/shorten-url.entity';
import { CreateShortenUrlUseCase } from './use-cases/create-shorten-url.use-case';
import { GetShortenUrlUseCase } from './use-cases/get-shorten-url.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([ShortenUrl])],
  controllers: [ShortenUrlController],
  providers: [ShortenUrlService, CreateShortenUrlUseCase, GetShortenUrlUseCase],
  exports: [CreateShortenUrlUseCase, GetShortenUrlUseCase],
})
export class ShortenUrlModule {}
