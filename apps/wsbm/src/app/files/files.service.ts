import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, In } from 'typeorm';
import { ApiException } from '@weishour/core/exceptions';
import { FileUtil } from '@weishour/core/utils';
import { FileEntity } from './file.entity';
import { isUndefined } from 'lodash';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity) private fileRepository: Repository<FileEntity>,
    private fileUtil: FileUtil,
  ) {}

  /**
   * 上传文件
   * @param {Express.Multer.File} fileData 文件信息
   * @param {string} type 文件类别
   * @return {Promise<Result>} result
   */
  async upload(fileData: Express.Multer.File, type = ''): Promise<FileEntity> {
    let file: FileEntity;

    try {
      const fileName = fileData.filename.split('.');
      const fileLike: DeepPartial<FileEntity> = {
        ...fileData,
        type,
        fieldName: fileData.fieldname,
        fileName: fileData.filename,
        fileType: fileName[1],
        mimeType: fileData.mimetype,
        originalName: fileData.originalname,
      };

      file = await this.fileRepository.save<FileEntity>(this.fileRepository.create(fileLike));
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw new ApiException('文件已存在', HttpStatus.CONFLICT);
      throw new ApiException('发生了一些错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return file;
  }

  /**
   * 获取文件实体
   * @param {string} fileName
   * @returns {Promise<FileEntity>} file
   */
  async getOne(fileName: string): Promise<FileEntity> {
    const file = await this.fileRepository.findOneBy({ fileName });
    if (!file) throw new ApiException(`'${fileName}' 文件不存在`, 404);

    return file;
  }

  /**
   * 通过文件名称删除文件实体以及文件
   * @param {string | string[]} fileName
   * @returns {Promise<FileEntity | FileEntity[]>} file
   */
  async removeByName(fileName: string | string[]): Promise<FileEntity | FileEntity[]> {
    if (typeof fileName === 'string') {
      const existing = await this.fileRepository.findOneBy({ fileName });
      if (!existing) throw new ApiException(`'${fileName}' 文件不存在`, 404);

      const file = await this.fileRepository.remove(existing);

      if (isUndefined(file.id)) {
        await this.fileUtil.unlink(join(process.cwd(), file.path));
        return file;
      }
    } else {
      const existing = await this.fileRepository.findBy({ fileName: In(fileName) });
      if (!existing) throw new ApiException(`'${fileName}' 文件不存在`, 404);

      const files = await this.fileRepository.remove(existing);

      for (let file of files) {
        if (isUndefined(file.id)) {
          await this.fileUtil.unlink(join(process.cwd(), file.path));
        }
      }

      return files;
    }
  }
}
