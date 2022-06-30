import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerConfigService } from '@weishour/core/services';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useClass: ThrottlerConfigService,
    }),
  ],
  exports: [ThrottlerModule],
})
export class WsThrottlerModule {}
