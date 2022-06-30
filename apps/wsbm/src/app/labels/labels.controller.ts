import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Result } from '@weishour/core/interfaces';
import { User } from '@weishour/core/decorators';
import { JwtAuthGuard } from '@weishour/core/guards';
import { LabelsService } from './labels.service';
import { AddLabelDto, EditLabelDto, DeleteLabelDto, SortLabelDto } from './dtos';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('标签')
@UseGuards(JwtAuthGuard)
@Controller()
export class LabelsController {
  constructor(private labelsService: LabelsService) {}

  @Post('add')
  @ApiOperation({ summary: '新增标签' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/images/labels',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async add(
    @User('id') userId: number,
    @Body() addLabelDto: AddLabelDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Result> {
    addLabelDto.userId = userId;
    return await this.labelsService.add(addLabelDto, file);
  }

  @Post('edit')
  @ApiOperation({ summary: '修改标签' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/images/labels',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async edit(
    @Body() editLabelDto: EditLabelDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Result> {
    return await this.labelsService.edit(editLabelDto, file);
  }

  @Post('remove')
  @ApiOperation({ summary: '删除标签' })
  async remove(@Body() deleteLabelDto: DeleteLabelDto): Promise<Result> {
    return await this.labelsService.remove(deleteLabelDto);
  }

  @Post('sort')
  @ApiOperation({ summary: '标签排序' })
  async sort(@User('id') userId: number, @Body() sortLabelDto: SortLabelDto): Promise<Result> {
    sortLabelDto.userId = userId;
    return await this.labelsService.sort(sortLabelDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有标签' })
  async getAll(@Query('menuId') menuId: string, @User('id') userId: number): Promise<Result> {
    return await this.labelsService.getAll(menuId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个标签' })
  async get(@Param('id') id: string): Promise<Result> {
    return await this.labelsService.getOne(id);
  }
}
