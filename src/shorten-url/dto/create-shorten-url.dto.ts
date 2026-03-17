import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateShortenUrlDto {
  @IsNotEmpty()
  @IsUrl({}, { message: 'The provided URL is not valid' })
  url: string;
}
