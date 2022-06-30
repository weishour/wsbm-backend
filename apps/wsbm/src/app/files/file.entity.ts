import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn({ unsigned: true, comment: '文件id' })
  id: number;

  @Column({ default: '', comment: '分类' })
  type: string;

  @Column({ default: '', name: 'file_name', comment: '文件名称' })
  fileName: string;

  @Column({ default: '', name: 'file_type', comment: '文件扩展名' })
  fileType: string;

  @Column({ default: '', name: 'mime_type', comment: '文件的mime类型' })
  mimeType: string;

  @Column({ default: 0, comment: '文件大小（以字节为单位）' })
  size: number;

  @Column({ default: '', name: 'field_name', comment: '表单中指定的字段名称' })
  fieldName: string;

  @Column({ default: '', name: 'original_name', comment: '原文件名' })
  originalName: string;

  @Column({ default: '', comment: '文件的编码类型' })
  encoding: string;

  @Column({ default: '', comment: '文件保存到的文件夹' })
  destination: string;

  @Column({ default: '', unique: true, comment: '上传文件的完整路径' })
  path: string;

  @Column({ default: 0, comment: '排序' })
  sort: number;
}
