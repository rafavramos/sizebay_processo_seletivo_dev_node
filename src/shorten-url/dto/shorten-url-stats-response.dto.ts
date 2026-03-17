import { ApiProperty } from '@nestjs/swagger';
import { ShortenUrlResponseDto } from './shorten-url-response.dto';

export class ShortenUrlStatsResponseDto extends ShortenUrlResponseDto {
  @ApiProperty({ example: 5 })
  accessCount: number;
}
