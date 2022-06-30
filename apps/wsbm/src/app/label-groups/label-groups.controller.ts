import { Controller, UseGuards, Get, Param, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Result } from '@weishour/core/interfaces';
import { User } from '@weishour/core/decorators';
import { JwtAuthGuard } from '@weishour/core/guards';
import { LabelGroupsService } from './label-groups.service';
import {
  AddLabelGroupDto,
  EditLabelGroupDto,
  DeleteLabelGroupDto,
  SortLabelGroupDto,
} from './dtos';

@ApiTags('分组')
@UseGuards(JwtAuthGuard)
@Controller()
export class LabelGroupsController {
  constructor(private labelGroupsService: LabelGroupsService) {}

  @Post('add')
  @ApiOperation({ summary: '新增分组' })
  async add(
    @User('id') userId: number,
    @Body() addLabelGroupDto: AddLabelGroupDto,
  ): Promise<Result> {
    addLabelGroupDto.userId = userId;
    return await this.labelGroupsService.add(addLabelGroupDto);
  }

  @Post('edit')
  @ApiOperation({ summary: '修改分组' })
  async edit(@Body() editLabelGroupDto: EditLabelGroupDto): Promise<Result> {
    return await this.labelGroupsService.edit(editLabelGroupDto);
  }

  @Post('remove')
  @ApiOperation({ summary: '删除分组' })
  async remove(@Body() deleteLabelGroupDto: DeleteLabelGroupDto): Promise<Result> {
    return await this.labelGroupsService.remove(deleteLabelGroupDto);
  }

  @Post('sort')
  @ApiOperation({ summary: '分组排序' })
  async sort(
    @User('id') userId: number,
    @Body() sortLabelGroupDto: SortLabelGroupDto,
  ): Promise<Result> {
    sortLabelGroupDto.userId = userId;
    return await this.labelGroupsService.sort(sortLabelGroupDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有分组' })
  async getAll(@Query('menuId') menuId: string, @User('id') userId: number): Promise<Result> {
    return await this.labelGroupsService.getAll(menuId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个分组' })
  async get(@Param('id') id: string): Promise<Result> {
    return await this.labelGroupsService.getOne(id);
  }
}
