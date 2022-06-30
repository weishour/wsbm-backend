import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('menu')
export class MenuEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '菜单id' })
  id: string

  @Column({ default: 0, name: 'user_id', comment: '用户id' })
  userId: number;

  @Column({ default: '', comment: '图标' })
  icon: string;

  @Column({ default: '', unique: true, comment: '标题' })
  title: string;

  @Column({ default: '', comment: '翻译键名' })
  translation: string;

  @Column({ default: '', comment: '副标题' })
  subtitle: string;

  @Column({ default: '', comment: '类型' })
  type: string;

  @Column({ default: false, comment: '是否活动' })
  active: boolean;

  @Column({ default: false, comment: '是否禁用' })
  disabled: boolean;

  @Column({ default: '', comment: '工具提示' })
  tooltip: string;

  @Column({ default: '', unique: true, comment: '路由链接或者是外部链接' })
  link: string;

  @Column({ default: false, comment: 'link是否被解析为外部链接' })
  externalLink: boolean;

  @Column({ default: '', comment: '外部链接的目标属性' })
  target: string;

  @Column({ default: false, comment: '在[routerLinkActiveOptions]上设置确切的参数' })
  exactMatch: boolean;

  @Column({ default: '', name: 'badge_title', comment: '图标' })
  badgeTitle: string;

  @Column({ default: 0, comment: '排序' })
  sort: number;
}
