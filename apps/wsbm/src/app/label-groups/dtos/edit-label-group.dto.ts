import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class EditLabelGroupDto {
  @ApiProperty({ description: '用户id' })
  @IsNumber({}, { message: 'userId 必须是一个符合指定约束条件的数字' })
  @IsOptional()
  userId: number;

  @ApiProperty({ description: '分组id' })
  @IsNumber({}, { message: 'id 必须是一个符合指定约束条件的数字' })
  readonly id: number;

  @ApiProperty({ description: '标题' })
  @IsString({ message: 'title 必须是一个字符串' })
  @IsNotEmpty({ message: 'title 不能为空' })
  readonly title: string;
}
