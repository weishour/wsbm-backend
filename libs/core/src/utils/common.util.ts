import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonUtil {
  /**
   * 是否实现接口
   * @param data
   * @param prop
   */
  isProps<T>(data: any, prop: string): data is T {
    return typeof (data as T)[prop] !== 'undefined';
  }

  /**
   * 传入对象返回url参数
   * @param {Object} data
   * @returns {string}
   */
  getParam(data: Object): string {
    let url = '';
    for (const k in data) {
      const value = data[k] !== undefined ? data[k] : '';
      url += `&${k}=${encodeURIComponent(value)}`;
    }
    return url ? url.substring(1) : '';
  }
}
