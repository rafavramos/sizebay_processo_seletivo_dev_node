import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortenUrlController } from './shorten-url.controller';
import { ShortenUrlService } from './shorten-url.service';
import { ShortenUrl } from './entities/shorten-url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShortenUrl])],
  controllers: [ShortenUrlController],
  providers: [ShortenUrlService],
  exports: [ShortenUrlService],
})
export class ShortenUrlModule {}
