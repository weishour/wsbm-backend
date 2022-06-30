import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { WsLoggerService } from '@weishour/core/services';
import { TimeUtil } from '@weishour/core/utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private timeUtil: TimeUtil, private wsLoggerService: WsLoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const code =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const data = {
      code,
      status: false,
      time: this.timeUtil.CurrentTime,
      path: req.url,
      error: exception.message,
    };

    this.wsLoggerService.setContext(AllExceptionsFilter.name);
    this.wsLoggerService.exception(code, data, req, exception);

    res.status(code).json(data);
  }
}
