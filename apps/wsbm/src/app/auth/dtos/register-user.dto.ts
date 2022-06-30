import { ApiProperty } from '@nestjs/swagger';
import { ApiCode } from '@wsbm/common/enums';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ description: '用户名称' })
  @IsNotEmpty({
    message: '名称是必不可少的',
    context: {
      code: ApiCode.USER_NAME_INVALID,
    },
  })
  readonly username: string;

  @ApiProperty({ description: '用户邮箱' })
  @IsEmail(
    {},
    {
      message: '邮箱格式不正确',
      context: {
        code: ApiCode.USER_EMAIL_INVALID,
      },
    },
  )
  @IsNotEmpty({
    message: '邮箱是必不可少的',
    context: {
      code: ApiCode.USER_EMAIL_INVALID,
    },
  })
  readonly email: string;

  @ApiProperty({ description: '用户密码' })
  @IsNotEmpty({
    message: '密码是必不可少的',
  })
  password: string;
}
