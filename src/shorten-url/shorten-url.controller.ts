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
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { CreateShortenUrlDto } from './dto/create-shorten-url.dto';
import { ShortenUrlResponseDto } from './dto/shorten-url-response.dto';
import { ShortenUrlStatsResponseDto } from './dto/shorten-url-stats-response.dto';
import { CreateShortenUrlUseCase } from './use-cases/create-shorten-url.use-case';
import { GetShortenUrlUseCase } from './use-cases/get-shorten-url.use-case';
import { UpdateShortenUrlUseCase } from './use-cases/update-shorten-url.use-case';
import { DeleteShortenUrlUseCase } from './use-cases/delete-shorten-url.use-case';
import { GetShortenUrlStatsUseCase } from './use-cases/get-shorten-url-stats.use-case';

@ApiTags('shorten')
@Controller('shorten')
export class ShortenUrlController {
  constructor(
    private readonly createShortenUrlUseCase: CreateShortenUrlUseCase,
    private readonly getShortenUrlUseCase: GetShortenUrlUseCase,
    private readonly updateShortenUrlUseCase: UpdateShortenUrlUseCase,
    private readonly deleteShortenUrlUseCase: DeleteShortenUrlUseCase,
    private readonly getShortenUrlStatsUseCase: GetShortenUrlStatsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new short URL' })
  @ApiCreatedResponse({
    description: 'The short URL has been successfully created.',
    type: ShortenUrlResponseDto,
  })
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
  @ApiOperation({ summary: 'Retrieve original URL from short code' })
  @ApiOkResponse({
    description: 'Return the original URL data.',
    type: ShortenUrlResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Short URL not found.' })
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
  @ApiOperation({ summary: 'Update an existing short URL' })
  @ApiOkResponse({
    description: 'The original URL has been successfully updated.',
    type: ShortenUrlResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Short URL not found.' })
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
  @ApiOperation({ summary: 'Delete an existing short URL' })
  @ApiNoContentResponse({
    description: 'The short URL has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Short URL not found.' })
  async remove(@Param('shortCode') shortCode: string) {
    await this.deleteShortenUrlUseCase.execute(shortCode);
  }

  @Get(':shortCode/stats')
  @ApiOperation({ summary: 'Get statistics on the short URL' })
  @ApiOkResponse({
    description: 'Return access statistics for the short URL.',
    type: ShortenUrlStatsResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Short URL not found.' })
  async getStats(@Param('shortCode') shortCode: string) {
    const result = await this.getShortenUrlStatsUseCase.execute(shortCode);
    return {
      id: result.id,
      url: result.originalUrl,
      shortCode: result.shortCode,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      accessCount: result.accessCount,
    };
  }
}
