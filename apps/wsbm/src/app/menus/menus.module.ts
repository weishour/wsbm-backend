import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@weishour/core';
import { LabelGroupsModule } from '@wsbm/app/label-groups/label-groups.module';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { MenuEntity } from './menu.entity';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([MenuEntity]), forwardRef(() => LabelGroupsModule)],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}
