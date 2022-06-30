import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@weishour/core';
import { FilesModule } from '@wsbm/app/files/files.module';
import { MenusModule } from '@wsbm/app/menus/menus.module';
import { LabelGroupsModule } from '@wsbm/app/label-groups/label-groups.module';
import { LabelsController } from './labels.controller';
import { LabelsService } from './labels.service';
import { LabelEntity } from './label.entity';
import { LabelSubscriber } from './label.subscriber';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forFeature([LabelEntity]),
    FilesModule,
    MenusModule,
    LabelGroupsModule,
  ],
  controllers: [LabelsController],
  providers: [LabelsService, LabelSubscriber],
  exports: [LabelsService],
})
export class LabelsModule {}
