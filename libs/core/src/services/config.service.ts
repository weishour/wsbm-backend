import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dotenv from 'dotenv';
import fs from 'fs';

@Injectable()
export class WsConfigService {
  constructor(private configService: ConfigService) {}

  get<T = any>(propertyPath: string, defaultValue?: T): T {
    return this.configService.get(propertyPath, defaultValue);
  }

  get envConfig(): dotenv.DotenvParseOutput {
    return dotenv.parse(fs.readFileSync('.env'));
  }

  get port(): number {
    return this.configService.get('database.port');
  }

  /**
   * JWT访问密钥
   */
  get jwtSecret(): string | Buffer {
    return this.configService.get('jwt.secret');
  }

  /**
   * JWT访问密钥有效时间
   */
  get jwtTokenExpiresIn(): string {
    return this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME');
  }

  /**
   * JWT刷新令牌密钥
   */
  get jwtRefreshTokenSecret(): string {
    return this.configService.get('JWT_REFRESH_TOKEN_SECRET');
  }

  /**
   * JWT刷新令牌有效时间
   */
  get jwtRefreshTokenExpiresIn(): string {
    return this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }

  /**
   * JWT记住我有效时间
   */
  get jwtRememberMeExpiresIn(): string {
    return this.configService.get('JWT_REMEMBER_ME_EXPIRATION_TIME');
  }
}
