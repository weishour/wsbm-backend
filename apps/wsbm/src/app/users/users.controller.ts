import { Controller, UseGuards, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Result } from '@weishour/core/interfaces';
import { JwtAuthGuard } from '@weishour/core/guards';
import { UsersService } from './users.service';

@ApiTags('用户')
@UseGuards(JwtAuthGuard)
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '获取所有用户' })
  async getAll(): Promise<Result> {
    return await this.usersService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个用户' })
  async get(@Param('id') id: number): Promise<Result> {
    return await this.usersService.getOne(id);
  }
}
