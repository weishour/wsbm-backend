import { Injectable } from '@nestjs/common';
import { HttpModuleOptionsFactory, HttpModuleOptions } from '@nestjs/axios';
import { WsConfigService } from '@weishour/core/services';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(private wsConfigService: WsConfigService) {}

  createHttpOptions(): HttpModuleOptions {
    return {
      ...this.wsConfigService.get('axios'),
      timeoutErrorMessage: '请求超时，请稍后重试！',
    };
  }
}
