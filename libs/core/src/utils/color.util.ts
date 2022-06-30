import { Injectable } from '@nestjs/common';
import chalk from 'chalk';

@Injectable()
export class ColorUtil {
  /**
   * chalk
   */
  get color(): any {
    return chalk;
  }

  /**
   * 十六进制前景色
   * @param {string} color
   * @param {any} value
   */
  hex = (color: string, value: any) => chalk.hex(color)(value);

  /**
   * 十六进制背景色
   * @param {string} color
   * @param {any} value
   */
  bgHex = (color: string, value: any) => chalk.bgHex(color)(value);
}
