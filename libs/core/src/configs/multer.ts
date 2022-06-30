import { registerAs } from '@nestjs/config';

export const MulterConfig = registerAs('multer', () => ({
  dest: process.env.MULTER_DEST,
}));
