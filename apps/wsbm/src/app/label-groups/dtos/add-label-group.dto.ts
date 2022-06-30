import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AddLabelGroupDto {
  @ApiProperty({ description: '用户id' })
  @IsNumber({}, { message: 'userId 必须是一个符合指定约束条件的数字' })
  @IsOptional()
  userId: number;

  @ApiProperty({ description: '菜单id' })
  @IsString({ message: 'menuId 必须是一个字符串' })
  @IsNotEmpty({ message: 'menuId 不能为空' })
  readonly menuId: string;

  @ApiProperty({ description: '标题' })
  @IsString({ message: 'title 必须是一个字符串' })
  @IsNotEmpty({ message: 'title 不能为空' })
  readonly title: string;
}
