import { registerAs } from '@nestjs/config';

export const ThrottlerConfig = registerAs('throttler', () => ({
  ttl: process.env.THROTTLE_TTL,
  limit: process.env.THROTTLE_LIMIT,
}));
