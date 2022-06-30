import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';

export class SortLabelGroupDto {
  @ApiProperty({ description: '用户id' })
  @IsNumber({}, { message: 'userId 必须是一个符合指定约束条件的数字' })
  @IsOptional()
  userId: number;

  @ApiProperty({ description: '菜单id' })
  @IsString({ message: 'menuId 必须是一个字符串' })
  @IsNotEmpty({ message: 'menuId 不能为空' })
  readonly menuId: string;

  @ApiProperty({ description: '分组id' })
  @IsNumber({}, { message: 'ids 中的每个值必须是数字', each: true })
  @IsArray({ message: 'ids 必须是一个数组' })
  @IsNotEmpty({ message: 'ids 不能为空' })
  readonly ids: number[];
}
