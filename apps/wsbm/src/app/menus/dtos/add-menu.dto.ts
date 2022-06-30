import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AddMenuDto {
  @ApiProperty({ description: '类型' })
  @IsString({ message: 'type 必须是一个字符串' })
  @IsOptional()
  type: string = 'basic';

  @ApiProperty({ description: '用户id' })
  @IsNumber({}, { message: 'userId 必须是一个符合指定约束条件的数字' })
  @IsOptional()
  userId: number;

  @ApiProperty({ description: '图标' })
  @IsString({ message: 'icon 必须是一个字符串' })
  @IsNotEmpty({ message: 'icon 不能为空' })
  readonly icon: string;

  @ApiProperty({ description: '标题' })
  @IsString({ message: 'title 必须是一个字符串' })
  @IsNotEmpty({ message: 'title 不能为空' })
  readonly title: string;

  @ApiProperty({ description: '翻译键名' })
  @IsString({ message: 'translation 必须是一个字符串' })
  @IsOptional()
  translation: string;

  @ApiProperty({ description: '链接' })
  @IsOptional()
  link: string;
}
