import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { LabelGroupEntity } from '@wsbm/app/label-groups/label-group.entity';

@Entity('label')
export class LabelEntity {
  @PrimaryGeneratedColumn({ unsigned: true, comment: '分组id' })
  id: number;

  @Column({ default: 0, name: 'user_id', select: false, comment: '用户id' })
  userId: number;

  @Column({ default: '', name: 'menu_id', select: false, comment: '菜单id' })
  menuId: string;

  @Column({ default: '', name: 'icon_type', comment: '图标文件类型' })
  iconType: string;

  @Column({ default: '', name: 'icon_title', comment: '图标文字' })
  iconTitle: string;

  @Column({ default: 0, name: 'icon_id', comment: '图标文件id' })
  iconId: number;

  @Column({ default: '', name: 'icon_name', comment: '图标文件名称' })
  iconName: string;

  @Column({ default: '', unique: true, comment: '地址' })
  address: string;

  @Column({ default: '', comment: '标题' })
  title: string;

  @Column({ type: 'text', comment: '描述' })
  description: string;

  @Column({ default: 0, comment: '排序' })
  sort: number;

  @ManyToOne(() => LabelGroupEntity, group => group.labels, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  group: LabelGroupEntity;
}
