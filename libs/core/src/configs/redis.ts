import { registerAs } from '@nestjs/config';

export const RedisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: process.env.REDIS_DB,
  password: process.env.REDIS_PASSWORD,
  keyPrefix: process.env.REDIS_PRIFIX,
}));
