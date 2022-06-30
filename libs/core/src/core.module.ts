import { Module } from '@nestjs/common';
import {
  UtilsModule,
  WsConfigModule,
  WsWinstonModule,
  DatabaseModule,
  WsMulterModule,
  WsRedisModule,
  WsJwtModule,
  WsHttpModule,
  WsThrottlerModule,
} from '@weishour/core/modules';

@Module({
  imports: [
    UtilsModule,
    WsConfigModule,
    WsWinstonModule,
    DatabaseModule,
    WsMulterModule,
    WsRedisModule,
    WsJwtModule,
    WsHttpModule,
    WsThrottlerModule,
  ],
  exports: [
    UtilsModule,
    WsConfigModule,
    WsWinstonModule,
    WsMulterModule,
    WsRedisModule,
    WsJwtModule,
    WsHttpModule,
    WsThrottlerModule,
  ],
})
export class CoreModule {}
