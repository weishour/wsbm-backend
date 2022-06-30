import { Injectable, Scope, Inject, HttpStatus } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';
import { Color } from '@weishour/core/enums';
import { ColorUtil } from '@weishour/core/utils';
import { Request } from 'express';
import { Logger } from 'winston';
import { AxiosError } from 'axios';
import stacktrace from 'stacktrace-js';
import path from 'path';

@Injectable({ scope: Scope.REQUEST })
export class WsLoggerService extends WinstonLogger {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winston: Logger,
    private colorUtil: ColorUtil,
  ) {
    super(winston);
  }

  info = (message: any): void => super.log(message);

  /**
   * Http请求信息处理
   * @param {HttpStatus} status
   * @param {string} logFormat
   */
  http(status: HttpStatus, logFormat: string): void {
    // 根据状态码，进行日志类型区分
    if (status >= 500) {
      this.error(`${status} ${logFormat}`);
    } else if (status >= 400) {
      this.warn(`${status} ${logFormat}`);
    } else {
      this.info(`${status} ${logFormat}`);
    }
  }

  /**
   * 异常报错
   * @param data
   * @param req
   * @param error
   */
  exception(status: HttpStatus, data: any, req: Request, error: any): void {
    // 限制错误堆栈行数
    Error.captureStackTrace(this, error);
    Error.stackTraceLimit = 1;

    let errorMsg = '';
    if (error instanceof AxiosError) {
      errorMsg = error.message;
    } else {
      if (error.stack) errorMsg = error.stack.split('at ')[1];
    }

    const logFormat = `${req.method} 请求地址: ${req.originalUrl} 请求IP: ${
      req.ip
    }\n 响应内容: ${JSON.stringify(data)}\n 错误信息: ${this.colorUtil.hex(Color.error, errorMsg)}`;

    this.error(`${this.colorUtil.hex(Color.error, status)} ` + logFormat, error);
  }

  /**
   * 日志追踪，可以追溯到哪个文件、第几行第几列
   * @param deep
   */
  private getStackTrace(deep = 2): string {
    const stackList: stacktrace.StackFrame[] = stacktrace.getSync();
    const stackInfo: stacktrace.StackFrame = stackList[deep];

    const lineNumber = stackInfo.lineNumber;
    const columnNumber = stackInfo.columnNumber;
    const fileName = stackInfo.fileName;
    const basename = path.basename(fileName);
    return `${basename} (line: ${lineNumber}, column: ${columnNumber}): \n`;
  }
}
