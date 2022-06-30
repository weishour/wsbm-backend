import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class DeleteLabelGroupDto {
  @ApiProperty({ description: '用户id' })
  @IsNumber({}, { message: 'userId 必须是一个符合指定约束条件的数字' })
  @IsOptional()
  userId: number;

  @ApiProperty({ description: '分组id' })
  @IsNumber({}, { message: 'id 必须是一个符合指定约束条件的数字' })
  readonly id: number;
}
