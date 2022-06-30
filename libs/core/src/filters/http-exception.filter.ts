import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { WsLoggerService } from '@weishour/core/services';
import { ApiException } from '@weishour/core/exceptions';
import { ApiMsg } from '@weishour/core/constants';
import { TimeUtil } from '@weishour/core/utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private timeUtil: TimeUtil, private wsLoggerService: WsLoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    const status = exception.getStatus();
    const data = {
      code: exception instanceof ApiException ? exception?.Code || status : status,
      status: false,
      message: exception.message || ApiMsg[status],
      time: this.timeUtil.CurrentTime,
      path: req.url,
    };

    if (exception instanceof ThrottlerException) {
      data.message = '请求太过频繁，请稍后再试';
    }

    this.wsLoggerService.setContext(HttpExceptionFilter.name);
    const logFormat = `${req.method} 请求地址: ${req.originalUrl} 请求IP: ${
      req.ip
    }\n 响应内容: ${JSON.stringify(data.message)}`;
    this.wsLoggerService.http(status, logFormat);

    res.status(status).json(data);
  }
}
