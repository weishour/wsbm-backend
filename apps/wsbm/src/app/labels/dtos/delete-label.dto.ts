import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class DeleteLabelDto {
  @ApiProperty({ description: '用户id' })
  @IsNumber({}, { message: 'userId 必须是一个符合指定约束条件的数字' })
  @IsOptional()
  userId: number;

  @ApiProperty({ description: '标签id' })
  @IsNumber({}, { message: 'id 必须是一个符合指定约束条件的数字' })
  readonly id: number;
}
