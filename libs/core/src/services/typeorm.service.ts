import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WsConfigService } from '@weishour/core/services';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private wsConfigService: WsConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...this.wsConfigService.get('typeorm'),
      autoLoadEntities: true,
      verboseRetryLog: true,
    };
  }
}
