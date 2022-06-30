import { Entity, Column, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ unsigned: true, comment: '用户id' })
  id: number;

  @Column({ default: '', comment: '用户名' })
  username: string;

  @Column({ default: '', unique: true, comment: '邮箱' })
  email: string;

  @Column({ default: '', select: false, comment: '登录密码' })
  password: string;

  @Column({ default: false, name: 'remember_me', comment: '记住我' })
  rememberMe: boolean;

  @Column({ default: '', comment: '头像' })
  avatar: string;

  @Column({ default: '', select: false, name: 'refresh_token', comment: '刷新token' })
  @Exclude()
  refreshToken: string;

  @UpdateDateColumn({ name: 'last_time', type: 'timestamp' })
  lastTime: Date;
}
