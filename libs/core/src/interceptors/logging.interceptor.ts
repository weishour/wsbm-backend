import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { WsLoggerService } from '@weishour/core/services';
import { Result } from '@weishour/core/interfaces';
import { Color } from '@weishour/core/enums';
import { ColorUtil } from '@weishour/core/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private colorUtil: ColorUtil, private wsLoggerService: WsLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 解析ExecutionContext的数据内容获取请求体
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    let params = {};
    if (req.method === 'POST') {
      params = req.body;
    } else if (req.method === 'GET') {
      params = req.query;
    }

    this.wsLoggerService.setContext(LoggingInterceptor.name);
    this.wsLoggerService.info(
      `开始...\n ${req.method} 请求地址: ${req.originalUrl} 请求IP: ${
        req.ip
      }\n 请求参数: ${JSON.stringify(params)}`,
    );

    const now = Date.now();
    return next.handle().pipe(
      map((data: Result) => {
        let content = JSON.stringify(data);
        const maxSize = 2000;
        if (content.length > maxSize) content = `${content.substring(0, maxSize)}...`;

        const logFormat = `响应内容: ${content}\n 结束... ${this.colorUtil.hex(
          Color.warn,
          '耗时: ' + (Date.now() - now) + 'ms',
        )}`;
        this.wsLoggerService.http(res.statusCode, logFormat);
        return data;
      }),
    );
  }
}
