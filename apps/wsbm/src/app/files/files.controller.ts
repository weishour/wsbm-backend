import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { Response } from 'express';
import { join } from 'path';
import { FilesService } from './files.service';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('文件')
@Controller()
export class FilesController {
  constructor(private filesService: FilesService) {}

  @SkipThrottle()
  @Get(':fileName')
  async getFile(@Param('fileName') fileName: string, @Res() res: Response) {
    const fileEntity = await this.filesService.getOne(fileName);
    // 设置响应内容类型
    res.set({ 'Content-Type': fileEntity.mimeType });

    createReadStream(join(process.cwd(), fileEntity.path)).pipe(res);
  }
}
