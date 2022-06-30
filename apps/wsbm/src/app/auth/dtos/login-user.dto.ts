import { ApiProperty } from '@nestjs/swagger';
import { ApiCode } from '@wsbm/common/enums';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: '用户名称' })
  @IsNotEmpty({
    message: '用户名称是必不可少的',
    context: {
      code: ApiCode.USER_NAME_INVALID,
    },
  })
  readonly username: string;

  @ApiProperty({ description: '用户密码' })
  @IsNotEmpty({
    message: '密码是必不可少的',
  })
  readonly password: string;

  @ApiProperty({ description: '记住我' })
  readonly rememberMe: boolean;
}
