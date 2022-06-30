import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { ApiException } from '@weishour/core/exceptions';
import { Result } from '@weishour/core/interfaces';
import { CryptoUtil, success, error } from '@weishour/core/utils';
import { TokenPayload } from '@wsbm/common/interfaces';
import { CreateUserDto } from './dtos';
import { UserEntity } from './user.entity';
import _ from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private cryptoUtil: CryptoUtil,
  ) {}

  /**
   * 创建用户
   * @param createUserDto 用户信息
   */
  async create(createUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
    const user: Partial<UserEntity> = await this.usersRepository.save<UserEntity>(
      this.usersRepository.create(createUserDto),
    );

    return _.omit(user, ['password', 'refreshToken']);
  }

  /**
   * 删除用户
   *
   * @param id 用户ID
   */
  async remove(id: number): Promise<void> {
    const existing = await this.usersRepository.findOneBy({ id });
    if (!existing) throw new ApiException(`删除失败，ID 为 '${id}' 的用户不存在`, 404);
    await this.usersRepository.remove(existing);
  }

  /**
   * 获取所有用户
   */
  async getAll(): Promise<Result> {
    const users = await this.usersRepository.find();
    if (users) return success('获取所有用户成功', users);
  }

  /**
   * 获取单个用户
   */
  async getOne(id: number): Promise<Result> {
    const user = await this.getById(id);

    if (user) {
      return success('获取用户成功', user);
    } else {
      throw new ApiException(`获取失败，ID 为 '${id}' 的用户不存在`, 404);
    }
  }

  /**
   * 通过id查询用户
   * @param {number} id
   */
  async getById(id: number): Promise<UserEntity> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.refreshToken')
      .where('user.id = :id', { id })
      .getOne();
  }

  /**
   * 通过名称查询用户
   * @param {string} username 用户名称
   */
  async getByName(username: string): Promise<Partial<UserEntity>> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  }

  /**
   * 通过邮箱查询用户
   * @param {string} email 邮箱
   */
  async getByEmail(email: string): Promise<Partial<UserEntity>> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  /**
   * 验证访问令牌
   * @param {TokenPayload} payload 访问令牌载荷
   */
  async verifyToken(payload: TokenPayload): Promise<UserEntity> {
    const user = await this.getById(payload.userId);
    if (!user) throw new ApiException('访问令牌无效', HttpStatus.UNAUTHORIZED);
    return user;
  }

  /**
   * 设置对应用户的刷新令牌
   * @param {} refreshToken 刷新令牌
   * @param {} userId 用户id
   */
  async setRefreshToken(refreshToken: string, userId: number) {
    const hashedRefreshToken = await this.cryptoUtil.encryptPassword(refreshToken);
    await this.usersRepository.update(userId, { refreshToken: hashedRefreshToken });
  }

  /**
   * 验证刷新令牌
   * @param {string} refreshToken 刷新令牌
   * @param {number} userId 用户id
   */
  async verifyRefreshToken(refreshToken: string, userId: number): Promise<UserEntity> {
    const user = await this.getById(userId);
    const isRefreshTokenMatching = await this.cryptoUtil.checkPassword(
      user.refreshToken,
      refreshToken,
    );

    if (isRefreshTokenMatching) return user;

    throw new ApiException('刷新令牌无效', HttpStatus.UNAUTHORIZED);
  }

  /**
   * 更新remember_me状态
   * @param {number} userId 用户id
   * @param {boolean} rememberMe
   */
  async updateRememberMe(userId: number, rememberMe: boolean): Promise<UpdateResult> {
    return await this.usersRepository.update(userId, { rememberMe });
  }

  /**
   * 删除刷新令牌
   * @param {number} userId 用户id
   */
  async removeRefreshToken(userId: number): Promise<UpdateResult> {
    return await this.usersRepository.update(userId, { refreshToken: '' });
  }
}
