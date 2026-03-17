import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
  Put,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CreateShortenUrlDto } from './dto/create-shorten-url.dto';
import { CreateShortenUrlUseCase } from './use-cases/create-shorten-url.use-case';
import { GetShortenUrlUseCase } from './use-cases/get-shorten-url.use-case';
import { UpdateShortenUrlUseCase } from './use-cases/update-shorten-url.use-case';
import { DeleteShortenUrlUseCase } from './use-cases/delete-shorten-url.use-case';

@Controller('shorten')
export class ShortenUrlController {
  constructor(
    private readonly createShortenUrlUseCase: CreateShortenUrlUseCase,
    private readonly getShortenUrlUseCase: GetShortenUrlUseCase,
    private readonly updateShortenUrlUseCase: UpdateShortenUrlUseCase,
    private readonly deleteShortenUrlUseCase: DeleteShortenUrlUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateShortenUrlDto) {
    const result = await this.createShortenUrlUseCase.execute(createDto);
    return {
      id: result.id,
      url: result.originalUrl,
      shortCode: result.shortCode,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Get(':shortCode')
  async findOne(@Param('shortCode') shortCode: string) {
    const result = await this.getShortenUrlUseCase.execute(shortCode);

    if (!result) {
      throw new NotFoundException('Short URL not found');
    }

    return {
      id: result.id,
      url: result.originalUrl,
      shortCode: result.shortCode,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Put(':shortCode')
  async update(
    @Param('shortCode') shortCode: string,
    @Body() updateDto: CreateShortenUrlDto,
  ) {
    const result = await this.updateShortenUrlUseCase.execute(
      shortCode,
      updateDto,
    );
    return {
      id: result.id,
      url: result.originalUrl,
      shortCode: result.shortCode,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Delete(':shortCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('shortCode') shortCode: string) {
    await this.deleteShortenUrlUseCase.execute(shortCode);
  }
}
