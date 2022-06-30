import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString, IsNumber, IsUrl } from 'class-validator';
import { LabelGroupEntity } from '@wsbm/app/label-groups/label-group.entity';

export class AddLabelDto {
  @ApiProperty({ description: '用户id' })
  @IsNumber({}, { message: 'userId 必须是一个符合指定约束条件的数字' })
  @IsOptional()
  userId: number;

  @ApiProperty({ description: '菜单id' })
  @IsString({ message: 'menuId 必须是一个字符串' })
  @IsNotEmpty({ message: 'menuId 不能为空' })
  readonly menuId: string;

  @ApiProperty({ description: '分组id' })
  @IsNotEmpty({ message: 'groupId 不能为空' })
  readonly groupId: number;

  @ApiProperty({ description: '分组' })
  @IsOptional()
  group: LabelGroupEntity;

  @ApiProperty({ description: '图标文件id' })
  @IsOptional()
  iconId: number;

  @ApiProperty({ description: '图标文件名称' })
  @IsString({ message: 'iconName 必须是一个字符串' })
  @IsOptional()
  iconName: string;

  @ApiProperty({ description: '图标文件类型' })
  @IsString({ message: 'iconType 必须是一个字符串' })
  @IsNotEmpty({ message: 'iconType 不能为空' })
  readonly iconType: string;

  @ApiProperty({ description: '图标文字' })
  @IsString({ message: 'iconTitle 必须是一个字符串' })
  @IsOptional()
  readonly iconTitle: string;

  @ApiProperty({ description: '地址' })
  @IsUrl({ message: 'address 必须是一个正确的地址' })
  @IsString({ message: 'address 必须是一个字符串' })
  @IsNotEmpty({ message: 'address 不能为空' })
  readonly address: string;

  @ApiProperty({ description: '标题' })
  @IsString({ message: 'title 必须是一个字符串' })
  @IsNotEmpty({ message: 'title 不能为空' })
  readonly title: string;

  @ApiProperty({ description: '描述' })
  @IsString({ message: 'description 必须是一个字符串' })
  @IsOptional()
  readonly description: string;
}
