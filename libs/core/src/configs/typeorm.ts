import { registerAs } from '@nestjs/config';
import { DEFAULT_CONNECTION } from '@weishour/core/constants';

export const TypeormConfig = registerAs('typeorm', () => ({
  type: process.env.DATABASE_TYPE,
  name: DEFAULT_CONNECTION,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PWD,
  database: process.env.DATABASE_DB,
  charset: process.env.DATABASE_CHARSET,
  synchronize: process.env.DATABASE_SYNCHRONIZE,
  entityPrefix: process.env.DATABASE_PREFIX,
  logging: process.env.DATABASE_LOG,
  logger: process.env.DATABASE_LOG_TYPE,
  cache: {
    type: process.env.CACHE_TYPE,
    alwaysEnabled: true,
    options: {
      host: process.env.CACHE_HOST,
      port: process.env.CACHE_PORT,
      password: process.env.CACHE_PASSWORD,
    },
  },
}));
