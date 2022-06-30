import { Injectable } from '@nestjs/common';
import pinyin from 'pinyin';

@Injectable()
export class PinyinUtil {
  /**
   * 获取汉字简拼
   */
  firstLetter(value: string): string {
    return pinyin(value, {
      style: pinyin.STYLE_FIRST_LETTER,
    }).join('');
  }
}
