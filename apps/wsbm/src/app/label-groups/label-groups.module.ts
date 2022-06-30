import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@weishour/core';
import { FilesModule } from '@wsbm/app/files/files.module';
import { MenusModule } from '@wsbm/app/menus/menus.module';
import { LabelEntity } from '@wsbm/app/labels/label.entity';
import { LabelGroupsController } from './label-groups.controller';
import { LabelGroupsService } from './label-groups.service';
import { LabelGroupEntity } from './label-group.entity';
import { LabelGroupsSubscriber } from './label-groups.subscriber';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([LabelGroupEntity, LabelEntity]),
    FilesModule,
    forwardRef(() => MenusModule),
  ],
  controllers: [LabelGroupsController],
  providers: [LabelGroupsService, LabelGroupsSubscriber],
  exports: [LabelGroupsService],
})
export class LabelGroupsModule {}
