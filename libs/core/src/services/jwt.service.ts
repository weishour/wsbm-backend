import { Injectable } from '@nestjs/common';
import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';
import { WsConfigService } from '@weishour/core/services';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private wsConfigService: WsConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return this.wsConfigService.get('jwt');
  }
}
