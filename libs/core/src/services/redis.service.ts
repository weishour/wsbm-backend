import { Injectable } from '@nestjs/common';
import { RedisOptionsFactory, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { WsConfigService } from '@weishour/core/services';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  constructor(private wsConfigService: WsConfigService) {}

  createRedisOptions(): RedisModuleOptions {
    return {
      readyLog: false,
      config: this.wsConfigService.get('redis'),
    };
  }
}
