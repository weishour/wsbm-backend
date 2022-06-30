import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { LabelEntity } from '@wsbm/app/labels/label.entity';

@Entity('label_group')
export class LabelGroupEntity {
  @PrimaryGeneratedColumn({ unsigned: true, comment: '分组id' })
  id: number;

  @Column({ default: 0, name: 'user_id', select: false, comment: '用户id' })
  userId: number;

  @Index()
  @Column({ default: '', name: 'menu_id', select: false, comment: '菜单id' })
  menuId: string;

  @Column({ default: '', unique: true, comment: '标题' })
  title: string;

  @Column({ default: 0, comment: '排序' })
  sort: number;

  @OneToMany(() => LabelEntity, label => label.group)
  labels: LabelEntity[];
}
