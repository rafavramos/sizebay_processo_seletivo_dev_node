import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShortenUrl } from '../../src/shorten-url/entities/shorten-url.entity';
import { join } from 'path';
import { Provider } from '@nestjs/common';

export async function createIntegrationTestModule(
  providers: Provider[],
  entities: any[] = [ShortenUrl],
) {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        envFilePath: [
          join(process.cwd(), '.env.test'),
          join(process.cwd(), '.env'),
        ],
        isGlobal: true,
      }),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities,
          synchronize: true,
          dropSchema: true,
        }),
      }),
      TypeOrmModule.forFeature(entities),
    ],
    providers,
  }).compile();
}
