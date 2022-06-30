import { Injectable } from '@nestjs/common';
import path from 'path';
import fs, { PathLike } from 'fs';

@Injectable()
export class FileUtil {
  /**
   * 读取路径信息
   * @param {string} path 路径
   */
  async getStat(path: string): Promise<fs.Stats | boolean> {
    return new Promise(resolve => {
      fs.stat(path, (err, stats) => {
        if (err) {
          resolve(false);
        } else {
          resolve(stats);
        }
      });
    });
  }

  /**
   * 创建路径
   * @param {string} dir 路径
   */
  async mkdir(dir: string): Promise<boolean> {
    return new Promise(resolve => {
      fs.mkdir(dir, err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * 路径是否存在，不存在则创建
   * @param {string} dir 路径
   */
  async dirExists(dir: string): Promise<boolean> {
    const isExists = await this.getStat(dir);

    if (typeof isExists !== 'boolean') {
      //如果该路径且不是文件，返回true
      if (isExists && isExists.isDirectory()) {
        return true;
      } else if (isExists) {
        //如果该路径存在但是文件，返回false
        return false;
      }
    }

    //如果该路径不存在
    const tempDir = path.parse(dir).dir; //拿到上级路径
    //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    const status = await this.dirExists(tempDir);
    let mkdirStatus: boolean;

    if (status) {
      mkdirStatus = await this.mkdir(dir);
    }
    return mkdirStatus;
  }

  /**
   * 删除文件
   * @param {PathLike} path 路径
   */
  async unlink(path: PathLike): Promise<boolean> {
    return new Promise(resolve => {
      fs.unlink(path, err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * 文件权限
   * @param {string} path 文件路径
   * @param {string} mode 读写权限
   */
  async chmod(path: string, mode = '0777'): Promise<boolean> {
    return new Promise(resolve => {
      fs.chmod(path, mode, err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
