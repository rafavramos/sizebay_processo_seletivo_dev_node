import { ShortenUrl } from '../../src/shorten-url/entities/shorten-url.entity';

export const ShortenUrlScenarios = {
  valid: {
    id: 1,
    originalUrl: 'https://www.google.com',
    shortCode: 'goog12',
    createdAt: new Date(),
    updatedAt: new Date(),
    accessCount: 5,
  } as ShortenUrl,

  created: (url: string, code: string): ShortenUrl =>
    ({
      id: Math.floor(Math.random() * 1000),
      originalUrl: url,
      shortCode: code,
      createdAt: new Date(),
      updatedAt: new Date(),
      accessCount: 0,
    }) as ShortenUrl,

  updated: (url: string, code: string): ShortenUrl =>
    ({
      id: 1,
      originalUrl: url,
      shortCode: code,
      createdAt: new Date(),
      updatedAt: new Date(),
      accessCount: 10,
    }) as ShortenUrl,
};
