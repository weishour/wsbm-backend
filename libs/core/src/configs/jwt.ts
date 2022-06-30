import { registerAs } from '@nestjs/config';

export const JwtConfig = registerAs('jwt', () => ({
  signOptions: {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  },
  secret: process.env.JWT_ACCESS_TOKEN_SECRET,
}));
