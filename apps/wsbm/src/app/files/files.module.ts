import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@weishour/core';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileEntity } from './file.entity';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([FileEntity])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
