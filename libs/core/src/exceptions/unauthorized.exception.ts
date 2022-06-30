import { UnauthorizedException } from '@nestjs/common';

export class UnauthorizedError extends UnauthorizedException {
  constructor(message?: string, error?: any) {
    super(message || '权限验证失败', error);
  }
}
