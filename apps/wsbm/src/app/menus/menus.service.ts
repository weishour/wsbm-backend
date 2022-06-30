import { Injectable, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiException } from '@weishour/core/exceptions';
import { Result } from '@weishour/core/interfaces';
import { PinyinUtil, success } from '@weishour/core/utils';
import { LabelGroupsService } from '@wsbm/app/label-groups/label-groups.service';
import { AddMenuDto, EditMenuDto, DeleteMenuDto, SortMenuDto } from './dtos';
import { MenuEntity } from './menu.entity';
import _, { isUndefined } from 'lodash';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(MenuEntity) private menusRepository: Repository<MenuEntity>,
    private pinyinUtil: PinyinUtil,
    @Inject(forwardRef(() => LabelGroupsService)) private labelGroupsService: LabelGroupsService,
  ) {}

  /**
   * 创建菜单
   * @param {AddMenuDto} addMenuDto 菜单信息
   * @return {Promise<Result>} result
   */
  async add(addMenuDto: AddMenuDto): Promise<Result> {
    let menu: MenuEntity;

    try {
      // 链接生成
      addMenuDto.link = `/bookmark/${this.pinyinUtil.firstLetter(addMenuDto.title)}`.replace(
        /\s+/g,
        '',
      );
      menu = await this.menusRepository.save<MenuEntity>(this.menusRepository.create(addMenuDto));
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ApiException('菜单已存在', HttpStatus.CONFLICT);
      throw new ApiException('发生了一些错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return success('新增成功', menu);
  }

  /**
   * 修改菜单
   * @param {EditMenuDto} editMenuDto 菜单信息
   * @return {Promise<Result>} result
   */
  async edit({ id, userId, icon, title }: EditMenuDto): Promise<Result> {
    let menu: MenuEntity;
    const existing = await this.menusRepository.findOneBy({ id, userId });
    if (!existing) throw new ApiException(`修改失败，ID 为 '${id}' 的菜单不存在`, 404);

    const link = `/bookmark/${this.pinyinUtil.firstLetter(title)}`.replace(/\s+/g, '');

    try {
      menu = await this.menusRepository.save<MenuEntity>(
        this.menusRepository.merge(existing, { icon, title, link }),
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ApiException('分类菜单已存在', HttpStatus.CONFLICT);
      throw new ApiException('发生了一些错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return success('修改分类菜单成功', menu);
  }

  /**
   * 删除菜单
   * @param {DeleteMenuDto} deleteMenuDto 菜单信息
   * @return {Promise<Result>} result
   */
  async remove({ id, userId }: DeleteMenuDto): Promise<Result> {
    const existing = await this.menusRepository.findOneBy({ id, userId });
    if (!existing) throw new ApiException(`删除失败，ID 为 '${id}' 的菜单不存在`, 404);

    // 删除分类菜单
    const menu = await this.menusRepository.remove(existing);

    // 删除分组以及标签
    await this.labelGroupsService.removeByMenuId(id);

    if (isUndefined(menu.id)) {
      menu.id = id;
      return success('删除分类菜单成功', menu);
    }
  }

  /**
   * 菜单排序
   * @param {SortMenuDto} editMenuDto 菜单信息
   * @return {Promise<Result>} result
   */
  async sort({ ids, userId }: SortMenuDto): Promise<Result> {
    const menus = await this.menusRepository
      .createQueryBuilder('menu')
      .where('menu.user_id = :userId', { userId })
      .orderBy('menu.sort', 'ASC')
      .getMany();

    menus.forEach(async (menu, index) => {
      // 查询现有的排序
      const existing = await this.menusRepository
        .createQueryBuilder('menu')
        .select(['menu.id', 'menu.sort'])
        .where('menu.id = :id', { id: ids[index] })
        .getOne();

      // 判断当前排序和现有排序
      if (menu.sort !== existing.sort) {
        // 更新现有排序为当前排序
        await this.menusRepository.save<MenuEntity>(
          this.menusRepository.merge(existing, { sort: menu.sort }),
        );
      }
    });

    return success('分类菜单排序成功');
  }

  /**
   * 获取所有菜单
   */
  async getAll(userId = 0): Promise<Result> {
    const menuQueryBuilder = this.menusRepository
      .createQueryBuilder('menu')
      .select(['menu.id', 'menu.title', 'menu.type', 'menu.icon', 'menu.link', 'menu.sort']);

    if (userId > 0) {
      menuQueryBuilder.where('menu.user_id = :userId', { userId }).orderBy('menu.sort', 'ASC');
    }

    const menus = await menuQueryBuilder.getMany();

    if (menus) return success('获取所有菜单成功', menus);
  }

  /**
   * 获取单个菜单
   */
  async getOne(id: string): Promise<Result> {
    let menu = await this.menusRepository
      .createQueryBuilder('menu')
      .select(['menu.id', 'menu.title', 'menu.type', 'menu.icon', 'menu.link'])
      .where('menu.id = :id', { id })
      .getOne();

    if (menu) {
      return success('获取菜单成功', menu);
    } else {
      throw new ApiException(`获取失败，ID 为 '${id}' 的菜单不存在`, 404);
    }
  }

  /**
   * 通过id查询菜单
   * @param {string} id
   */
  async getById(id: string): Promise<MenuEntity> {
    return await this.menusRepository
      .createQueryBuilder('menu')
      .where('menu.id = :id', { id })
      .getOne();
  }
}
