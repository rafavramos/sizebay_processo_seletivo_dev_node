import { ApiProperty } from '@nestjs/swagger';

export class ShortenUrlResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'https://www.google.com' })
  url: string;

  @ApiProperty({ example: 'abc123' })
  shortCode: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
