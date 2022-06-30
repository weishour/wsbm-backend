import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Result } from '@weishour/core/interfaces';
import { JwtAuthGuard } from '@weishour/core/guards';
import { SiteService } from './site.service';
import { Throttle } from '@nestjs/throttler';

@ApiTags('网站')
// @UseGuards(JwtAuthGuard)
@Controller()
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Throttle(1, 1)
  @Get()
  @ApiOperation({ summary: '获取网站信息' })
  async getInfo(@Query('url') url: string): Promise<Result> {
    return await this.siteService.getInfo(url);
  }
}
