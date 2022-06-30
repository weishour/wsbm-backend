import { Controller, UseGuards, Req, Body, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LocalAuthGuard, JwtRefreshGuard } from '@weishour/core/guards';
import { Result } from '@weishour/core/interfaces';
import { RequestWithUser } from '@wsbm/common/interfaces';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos';

@ApiTags('认证')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<Result> {
    return await this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: '登录' })
  async login(@Req() { user }: RequestWithUser): Promise<Result> {
    return await this.authService.login(user);
  }

  @Post('logout')
  @ApiOperation({ summary: '注销' })
  async logout(@Body('id') id: number): Promise<Result> {
    return await this.authService.logout(id);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @ApiOperation({ summary: '刷新访问令牌' })
  async refresh(@Req() { user }: RequestWithUser): Promise<Result> {
    return await this.authService.refresh(user);
  }
}
