import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiException } from '@weishour/core/exceptions';
import { Result } from '@weishour/core/interfaces';
import { success } from '@weishour/core/utils';
import { FilesService } from '@wsbm/app/files/files.service';
import { MenusService } from '@wsbm/app/menus/menus.service';
import { LabelGroupsService } from '@wsbm/app/label-groups/label-groups.service';
import { AddLabelDto, EditLabelDto, DeleteLabelDto, SortLabelDto } from './dtos';
import { LabelEntity } from './label.entity';
import _, { isEmpty, isUndefined } from 'lodash';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(LabelEntity) private labelRepository: Repository<LabelEntity>,
    private filesService: FilesService,
    private menusService: MenusService,
    private labelGroupsService: LabelGroupsService,
  ) {}

  /**
   * 创建标签
   * @param {AddLabelDto} addLabelDto 标签信息
   * @param {Express.Multer.File} fileData 图标文件
   * @return {Promise<Result>} result
   */
  async add(addLabelDto: AddLabelDto, fileData: Express.Multer.File): Promise<Result> {
    let label: LabelEntity;

    if (addLabelDto.menuId !== 'home') {
      const menu = await this.menusService.getById(addLabelDto.menuId);
      if (!menu)
        throw new ApiException(`新增失败，ID 为 '${addLabelDto.menuId}' 的分类菜单不存在`, 404);
    }

    const labelGroup = await this.labelGroupsService.getById(addLabelDto.groupId);
    if (!labelGroup)
      throw new ApiException(`新增失败，ID 为 '${addLabelDto.groupId}' 的分组不存在`, 404);

    const file = await this.filesService.upload(fileData, 'labels');
    if (!file) throw new ApiException(`图标上传失败`, HttpStatus.NOT_IMPLEMENTED);

    try {
      addLabelDto.iconId = file.id;
      addLabelDto.iconName = file.fileName;
      addLabelDto.group = labelGroup;

      label = await this.labelRepository.save<LabelEntity>(
        this.labelRepository.create(addLabelDto),
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ApiException('标签已存在', HttpStatus.CONFLICT);
      throw new ApiException('发生了一些错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return success('新增成功', label);
  }

  /**
   * 修改标签
   * @param {EditLabelDto} editLabelDto 标签信息
   * @param {Express.Multer.File} fileData 图标文件
   * @return {Promise<Result>} result
   */
  async edit(
    { id, iconId, iconName, iconType, ...editLabelDto }: EditLabelDto,
    fileData: Express.Multer.File,
  ): Promise<Result> {
    let label: LabelEntity;

    const labelGroup = await this.labelGroupsService.getById(editLabelDto.groupId);
    if (!labelGroup)
      throw new ApiException(`修改失败，ID 为 '${editLabelDto.groupId}' 的分组不存在`, 404);

    const existing = await this.labelRepository.findOneBy({ id });
    if (!existing) throw new ApiException(`修改失败，ID 为 '${id}' 的标签不存在`, 404);

    // 判断上传图标是否修改
    if (fileData) {
      const file = await this.filesService.upload(fileData, 'labels');
      if (!file) throw new ApiException(`图标上传失败`, HttpStatus.NOT_IMPLEMENTED);

      // 删除当前图标
      await this.filesService.removeByName(existing.iconName);

      iconId = file.id;
      iconName = file.fileName;
    }

    try {
      label = await this.labelRepository.save<LabelEntity>(
        this.labelRepository.merge(existing, {
          group: labelGroup,
          address: editLabelDto.address,
          iconId,
          iconName,
          iconType,
          iconTitle: editLabelDto.iconTitle,
          title: editLabelDto.title,
          description: editLabelDto.description,
        }),
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ApiException('标签已存在', HttpStatus.CONFLICT);
      throw new ApiException('发生了一些错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return success('修改标签成功', label);
  }

  /**
   * 删除标签
   * @param {DeleteLabelDto} deleteLabelDto 标签信息
   * @return {Promise<Result>} result
   */
  async remove({ id }: DeleteLabelDto): Promise<Result> {
    const existing = await this.labelRepository.findOneBy({ id });
    if (!existing) throw new ApiException(`删除失败，ID 为 '${id}' 的标签不存在`, 404);
    const label = await this.labelRepository.remove(existing);
    if (isUndefined(label.id)) {
      label.id = id;
      return success('删除标签成功', label);
    }
  }

  /**
   * 标签排序
   * @param {SortLabelDto} editLabelDto 标签信息
   * @return {Promise<Result>} result
   */
  async sort({ ids, menuId, userId }: SortLabelDto): Promise<Result> {
    const labels = await this.labelRepository
      .createQueryBuilder('label')
      .where('label.user_id = :userId', { userId })
      .andWhere('label.menu_id = :menuId', { menuId })
      .orderBy('label.sort', 'ASC')
      .getMany();

    labels.forEach(async (label, index) => {
      // 查询现有的排序
      const existing = await this.labelRepository
        .createQueryBuilder('label')
        .select(['label.id', 'label.sort'])
        .where('label.id = :id', { id: ids[index] })
        .getOne();

      // 判断当前排序和现有排序
      if (label.sort !== existing.sort) {
        // 更新现有排序为当前排序
        await this.labelRepository.save<LabelEntity>(
          this.labelRepository.merge(existing, { sort: label.sort }),
        );
      }
    });

    return success('标签排序成功');
  }

  /**
   * 获取所有标签
   */
  async getAll(menuId = '', userId = 0): Promise<Result> {
    const labelQueryBuilder = this.labelRepository
      .createQueryBuilder('label')
      .orderBy('label.sort', 'ASC');

    if (!isEmpty(menuId)) {
      labelQueryBuilder.where('label.menu_id = :menuId', { menuId });
    }

    if (userId > 0) {
      if (isEmpty(menuId)) {
        labelQueryBuilder.where('label.user_id = :userId', { userId });
      } else {
        labelQueryBuilder.andWhere('label.user_id = :userId', { userId });
      }
    }

    const labels = await labelQueryBuilder.getMany();

    if (labels) return success('获取所有标签成功', labels);
  }

  /**
   * 获取单个标签
   */
  async getOne(id: string): Promise<Result> {
    let label = await this.labelRepository
      .createQueryBuilder('label')
      .where('label.id = :id', { id })
      .getOne();

    if (label) {
      return success('获取标签成功', label);
    } else {
      throw new ApiException(`获取失败，ID 为 '${id}' 的标签不存在`, 404);
    }
  }
}
