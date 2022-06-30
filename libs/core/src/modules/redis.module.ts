import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from '@weishour/core/services';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useClass: RedisConfigService,
    }, true),
  ],
  exports: [RedisModule],
})
export class WsRedisModule {}
