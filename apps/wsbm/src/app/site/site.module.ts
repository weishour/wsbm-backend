import { Module } from '@nestjs/common';
import { CoreModule } from '@weishour/core';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';

@Module({
  imports: [CoreModule],
  controllers: [SiteController],
  providers: [SiteService],
  exports: [SiteService],
})
export class SiteModule {}
