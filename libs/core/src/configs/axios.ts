import { registerAs } from '@nestjs/config';

export const AxiosConfig = registerAs('axios', () => ({
  timeout: process.env.AXIOS_TIMEOUT,
}));
