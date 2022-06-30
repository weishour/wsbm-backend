import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Result } from '@weishour/core/interfaces';
import { ApiException } from '@weishour/core/exceptions';
import { WsConfigService } from '@weishour/core/services';
import { CryptoUtil, success, TimeUtil } from '@weishour/core/utils';
import { UsersService } from '@wsbm/app/users/users.service';
import { UserEntity } from '@wsbm/app/users/user.entity';
import { TokenPayload } from '@wsbm/common/interfaces';
import { LoginUserDto, RegisterUserDto } from './dtos';
import _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private wsConfigService: WsConfigService,
    private redisService: RedisService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private cryptoUtil: CryptoUtil,
    private timeUtil: TimeUtil,
  ) {}

  /**
   * 用户注册
   * @param {RegisterUserDto} registerUserDto 用户注册信息
   * @return {Promise<Result>} result
   */
  async register(registerUserDto: RegisterUserDto): Promise<Result> {
    // 密码加密
    registerUserDto.password = await this.cryptoUtil.encryptPassword(registerUserDto.password);

    let user: Partial<UserEntity>;
    try {
      const usernameExist = await this.usersService.getByName(registerUserDto.username);
      if (usernameExist) throw new ApiException('用户名已被使用', HttpStatus.CONFLICT);

      user = await this.usersService.create(registerUserDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ApiException('邮箱已注册', HttpStatus.CONFLICT);
      throw new ApiException('发生了一些错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return success('注册成功', user);
  }

  /**
   * 用户登录
   * @param {UserEntity} user 用户信息
   */
  async login(user: UserEntity): Promise<Result> {
    const payload: TokenPayload = { userId: user.id };
    const accessToken = await this.jwtAccessToken(payload);
    const refreshToken = await this.jwtRefreshToken(payload, user.rememberMe);

    // 保存刷新令牌
    await this.usersService.setRefreshToken(refreshToken, user.id);

    return success('登录成功', { ...user, accessToken, refreshToken });
  }

  /**
   * 注销
   * @param {number} id 用户id
   */
  async logout(id: number): Promise<Result> {
    const user = await this.usersService.getById(id);

    // 删除刷新令牌
    await this.usersService.removeRefreshToken(user.id);

    // 更新remember_me状态
    await this.usersService.updateRememberMe(user.id, false);

    return success('注销成功');
  }

  /**
   * 刷新访问令牌
   * @param {UserEntity} user 用户信息
   */
  async refresh(user: UserEntity): Promise<Result> {
    const payload: TokenPayload = { userId: user.id };
    const accessToken = await this.jwtAccessToken(payload);

    // 勾选记住我，则不更新刷新令牌
    const refreshToken = user.rememberMe ? '' : await this.jwtRefreshToken(payload);

    if (!user.rememberMe) {
      // 保存刷新令牌
      await this.usersService.setRefreshToken(refreshToken, user.id);
    }

    return success('刷新成功', { accessToken, refreshToken });
  }

  /**
   * 访问令牌
   * @param {TokenPayload} payload 载荷
   */
  async jwtAccessToken(payload: TokenPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload);

    // 缓存用户访问令牌
    const client: Redis = this.redisService.getClient();
    const milliseconds = this.timeUtil.getMs(this.wsConfigService.jwtTokenExpiresIn);
    await client.psetex(`${payload.userId}`, milliseconds, accessToken);

    return accessToken;
  }

  /**
   * 刷新令牌
   * @param {TokenPayload} payload 载荷
   * @param {boolean} rememberMe 记住我状态
   */
  async jwtRefreshToken(payload: TokenPayload, rememberMe: boolean = false): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.wsConfigService.jwtRefreshTokenSecret,
      expiresIn: rememberMe
        ? this.wsConfigService.jwtRememberMeExpiresIn
        : this.wsConfigService.jwtRefreshTokenExpiresIn,
    });
  }

  /**
   * 验证用户
   * @param {LoginUserDto} credentials 登录凭证
   * @return {Promise<UserEntity>} user 用户信息
   */
  async verifyUser(credentials: LoginUserDto): Promise<Partial<UserEntity>> {
    const user = await this.usersService.getByName(credentials.username);
    if (!user) throw new ApiException('登录账号有误', HttpStatus.NOT_ACCEPTABLE);

    await this.verifyPassword(user.password, credentials.password);

    // 更新remember_me状态
    user.rememberMe = credentials.rememberMe;
    await this.usersService.updateRememberMe(user.id, user.rememberMe);

    // 排除password字段
    return _.omit(user, ['password']);
  }

  /**
   * 验证密码
   * @param {string} hash 加密密码
   * @param {string} password 纯文本密码
   */
  private async verifyPassword(hash: string, password: string): Promise<void> {
    if (!(await this.cryptoUtil.checkPassword(hash, password)))
      throw new ApiException('登录密码有误', HttpStatus.NOT_ACCEPTABLE);
  }
}
