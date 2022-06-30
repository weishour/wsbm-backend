import { REQUEST } from '@nestjs/core';
import { Injectable, HttpStatus, Inject, Scope } from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiException } from '@weishour/core/exceptions';
import { Result } from '@weishour/core/interfaces';
import { success } from '@weishour/core/utils';
import { MenusService } from '@wsbm/app/menus/menus.service';
import {
  AddLabelGroupDto,
  EditLabelGroupDto,
  DeleteLabelGroupDto,
  SortLabelGroupDto,
} from './dtos';
import { LabelGroupEntity } from './label-group.entity';
import _, { isEmpty, isUndefined } from 'lodash';

@Injectable({ scope: Scope.REQUEST })
export class LabelGroupsService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(LabelGroupEntity) private labelGroupRepository: Repository<LabelGroupEntity>,
    private menusService: MenusService,
  ) {}

  /**
   * 创建分组
   * @param {AddLabelGroupDto} addLabelGroupDto 分组信息
   * @return {Promise<Result>} result
   */
  async add(addLabelGroupDto: AddLabelGroupDto): Promise<Result> {
    let labelGroup: LabelGroupEntity;

    if (addLabelGroupDto.menuId !== 'home') {
      const menu = await this.menusService.getById(addLabelGroupDto.menuId);
      if (!menu)
        throw new ApiException(
          `新增失败，ID 为 '${addLabelGroupDto.menuId}' 的分类菜单不存在`,
          404,
        );
    }

    try {
      labelGroup = await this.labelGroupRepository.save<LabelGroupEntity>(
        this.labelGroupRepository.create(addLabelGroupDto),
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ApiException('分组已存在', HttpStatus.CONFLICT);
      throw new ApiException('发生了一些错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return success('新增成功', labelGroup);
  }

  /**
   * 修改分组
   * @param {EditLabelGroupDto} editLabelGroupDto 分组信息
   * @return {Promise<Result>} result
   */
  async edit({ id, title }: EditLabelGroupDto): Promise<Result> {
    let labelGroup: LabelGroupEntity;

    const existing = await this.labelGroupRepository.findOneBy({ id });
    if (!existing) throw new ApiException(`修改失败，ID 为 '${id}' 的分组不存在`, 404);

    try {
      labelGroup = await this.labelGroupRepository.save<LabelGroupEntity>(
        this.labelGroupRepository.merge(existing, { title }),
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ApiException('分组已存在', HttpStatus.CONFLICT);
      throw new ApiException('发生了一些错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return success('修改分组成功', labelGroup);
  }

  /**
   * 删除分组
   * @param {DeleteLabelGroupDto} deleteLabelGroupDto 分组信息
   * @return {Promise<Result>} result
   */
  async remove({ id }: DeleteLabelGroupDto): Promise<Result> {
    const existing = await this.labelGroupRepository.findOneBy({ id });
    if (!existing) throw new ApiException(`删除失败，ID 为 '${id}' 的分组不存在`, 404);
    const labelGroup = await this.labelGroupRepository.remove(existing);
    if (isUndefined(labelGroup.id)) {
      labelGroup.id = id;
      return success('删除分组成功', labelGroup);
    }
  }

  /**
   * 分组排序
   * @param {SortLabelGroupDto} editLabelGroupDto 分组信息
   * @return {Promise<Result>} result
   */
  async sort({ ids, menuId, userId }: SortLabelGroupDto): Promise<Result> {
    const labelGroups = await this.labelGroupRepository
      .createQueryBuilder('label_group')
      .where('label_group.user_id = :userId', { userId })
      .andWhere('label_group.menu_id = :menuId', { menuId })
      .orderBy('label_group.sort', 'ASC')
      .getMany();

    labelGroups.forEach(async (labelGroup, index) => {
      // 查询现有的排序
      const existing = await this.labelGroupRepository
        .createQueryBuilder('label_group')
        .select(['label_group.id', 'label_group.sort'])
        .where('label_group.id = :id', { id: ids[index] })
        .getOne();

      // 判断当前排序和现有排序
      if (labelGroup.sort !== existing.sort) {
        // 更新现有排序为当前排序
        await this.labelGroupRepository.save<LabelGroupEntity>(
          this.labelGroupRepository.merge(existing, { sort: labelGroup.sort }),
        );
      }
    });

    return success('分组排序成功');
  }

  /**
   * 获取所有分组
   */
  async getAll(menuId = '', userId = 0): Promise<Result> {
    const labelQueryBuilder = this.labelGroupRepository
      .createQueryBuilder('label_group')
      .leftJoinAndSelect('label_group.labels', 'label')
      .orderBy('label_group.sort', 'ASC');

    if (!isEmpty(menuId)) {
      labelQueryBuilder.where('label_group.menu_id = :menuId', { menuId });
    }

    if (userId > 0) {
      if (isEmpty(menuId)) {
        labelQueryBuilder.where('label_group.user_id = :userId', { userId });
      } else {
        labelQueryBuilder.andWhere('label_group.user_id = :userId', { userId });
      }
    }

    const labelGroups = await labelQueryBuilder.getMany();

    if (labelGroups) return success('获取所有分组成功', labelGroups);
  }

  /**
   * 获取单个分组
   */
  async getOne(id: string): Promise<Result> {
    let labelGroup = await this.labelGroupRepository
      .createQueryBuilder('label_group')
      .where('label_group.id = :id', { id })
      .getOne();

    if (labelGroup) {
      return success('获取分组成功', labelGroup);
    } else {
      throw new ApiException(`获取失败，ID 为 '${id}' 的分组不存在`, 404);
    }
  }

  /**
   * 通过id查询分组
   * @param {number} id
   */
  async getById(id: number): Promise<LabelGroupEntity> {
    return await this.labelGroupRepository
      .createQueryBuilder('label_group')
      .where('label_group.id = :id', { id })
      .getOne();
  }

  /**
   * 通过menuId删除相关分组
   * @param {string} menuId
   */
  async removeByMenuId(menuId: string): Promise<LabelGroupEntity[]> {
    let labelGroups = await this.labelGroupRepository
      .createQueryBuilder('label_group')
      .where('label_group.menu_id = :menuId', { menuId })
      .getMany();

    if (labelGroups.length > 0) {
      labelGroups = await this.labelGroupRepository.remove(labelGroups);
    }

    return labelGroups;
  }
}
