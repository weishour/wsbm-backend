import { Injectable } from '@nestjs/common';
import { ThrottlerModuleOptions, ThrottlerOptionsFactory } from '@nestjs/throttler';
import { WsConfigService } from '@weishour/core/services';

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private wsConfigService: WsConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    return {
      ...this.wsConfigService.get('throttler'),
    };
  }
}
