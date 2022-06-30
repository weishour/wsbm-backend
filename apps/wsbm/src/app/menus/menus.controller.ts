import { Controller, UseGuards, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Result } from '@weishour/core/interfaces';
import { User } from '@weishour/core/decorators';
import { JwtAuthGuard } from '@weishour/core/guards';
import { MenusService } from './menus.service';
import { AddMenuDto, EditMenuDto, DeleteMenuDto, SortMenuDto } from './dtos';

@ApiTags('分类')
@UseGuards(JwtAuthGuard)
@Controller()
export class MenusController {
  constructor(private menusService: MenusService) {}

  @Post('add')
  @ApiOperation({ summary: '新增菜单' })
  async add(@User('id') userId: number, @Body() addMenuDto: AddMenuDto): Promise<Result> {
    addMenuDto.userId = userId;
    return await this.menusService.add(addMenuDto);
  }

  @Post('edit')
  @ApiOperation({ summary: '修改菜单' })
  async edit(@User('id') userId: number, @Body() editMenuDto: EditMenuDto): Promise<Result> {
    editMenuDto.userId = userId;
    return await this.menusService.edit(editMenuDto);
  }

  @Post('remove')
  @ApiOperation({ summary: '删除菜单' })
  async remove(@User('id') userId: number, @Body() deleteMenuDto: DeleteMenuDto): Promise<Result> {
    deleteMenuDto.userId = userId;
    return await this.menusService.remove(deleteMenuDto);
  }

  @Post('sort')
  @ApiOperation({ summary: '菜单排序' })
  async sort(@User('id') userId: number, @Body() sortMenuDto: SortMenuDto): Promise<Result> {
    sortMenuDto.userId = userId;
    return await this.menusService.sort(sortMenuDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有菜单' })
  async getAll(@User('id') userId: number): Promise<Result> {
    return await this.menusService.getAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个菜单' })
  async get(@Param('id') id: string): Promise<Result> {
    return await this.menusService.getOne(id);
  }
}
