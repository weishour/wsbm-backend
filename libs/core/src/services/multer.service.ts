import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { WsConfigService } from '@weishour/core/services';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private wsConfigService: WsConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      ...this.wsConfigService.get('multer'),
    };
  }
}
