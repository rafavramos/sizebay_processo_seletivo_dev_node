import { IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShortenUrlDto {
  @ApiProperty({
    description: 'The original long URL to shorten',
    example: 'https://www.google.com',
  })
  @IsNotEmpty()
  @IsUrl({}, { message: 'The provided URL is not valid' })
  url: string;
}
