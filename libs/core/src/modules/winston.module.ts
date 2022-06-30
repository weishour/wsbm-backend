import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService, WsLoggerService, WsLogger } from '@weishour/core/services';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
  ],
  providers: [WsLoggerService, WsLogger],
  exports: [WsLoggerService, WsLogger],
})
export class WsWinstonModule {}
