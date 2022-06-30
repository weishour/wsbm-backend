import { Injectable } from '@nestjs/common';
import {
  getTime,
  format,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import ms from 'ms';

@Injectable()
export class TimeUtil {
  /**
   * 格式化日期
   */
  public dateFormat = (fm: string, date: Date = new Date()) => {
    return format(date, fm, { locale: zhCN });
  };

  /**
   * 各种时间格式转换为毫秒
   */
  public getMs = (value: string) => ms(value);

  /**
   * 获取当前时间戳
   */
  get TimeStamp(): number {
    return getTime(new Date());
  }

  /**
   * 获取当前日期 (YYYY-MM-DD)
   */
  get CurrentDate(): string {
    return format(new Date(), 'yyyy-MM-dd');
  }

  /**
   * 获取当前时间 (YYYY-MM-DD HH:mm:ss)
   */
  get CurrentTime(): string {
    return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  }

  /**
   * 秒数转换时间显示
   * @param dateLeft {number | Date}
   * @param dateRight {number | Date}
   * @param type {string}
   */
  secondToDate(seconds: number): string {
    // 计算天数
    const days = seconds / 86400;
    // 计算小时数
    let remain = seconds % 86400;
    const hours = remain / 3600;
    // 计算分钟数
    remain = seconds % 3600;
    const mins = remain / 60;
    // 计算秒数
    const secs = remain % 60;

    if (days >= 1) {
      return `${days.toFixed(2)}天`;
    } else if (hours >= 1) {
      return `${hours.toFixed(2)}小时`;
    } else if (mins >= 1) {
      return `${mins.toFixed(2)}分钟 ${secs}秒`;
    } else {
      return `${seconds}秒`;
    }
  }

  /**
   * 获取两个时间差
   * @param dateLeft {number | Date}
   * @param dateRight {number | Date}
   * @param type {string}
   */
  diffTime(dateLeft: number | Date, dateRight: number | Date, type = ''): string | number {
    const timediff = differenceInSeconds(dateRight, dateLeft);

    // 计算天数
    const days = timediff / 86400;
    // 计算小时数
    let remain = timediff % 86400;
    const hours = remain / 3600;
    // 计算分钟数
    remain = timediff % 3600;
    const mins = remain / 60;
    // 计算秒数
    const secs = remain % 60;

    if (type !== '') {
      switch (type) {
        case 'day':
          return days;
        case 'hour':
          return hours;
        case 'min':
          return mins;
        case 'sec':
          return timediff;
      }
    } else {
      if (days >= 1) {
        return `${differenceInDays(dateRight, dateLeft)}天`;
      } else if (hours >= 1) {
        return `${differenceInHours(dateRight, dateLeft)}小时`;
      } else if (mins >= 1) {
        return `${differenceInMinutes(dateRight, dateLeft)}分钟 ${secs}秒`;
      } else {
        return `${timediff}秒`;
      }
    }
  }
}
