import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { QueryException } from '@weishour/core/interfaces';
import { WsLoggerService } from '@weishour/core/services';
import { TimeUtil } from '@weishour/core/utils';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  constructor(private timeUtil: TimeUtil, private wsLoggerService: WsLoggerService) {}

  catch(exception: QueryException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const data = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      status: false,
      message: exception.message,
      time: this.timeUtil.CurrentTime,
      path: req.url,
    };

    this.wsLoggerService.setContext(QueryFailedExceptionFilter.name);
    this.wsLoggerService.exception(HttpStatus.INTERNAL_SERVER_ERROR, data, req, exception);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(data);
  }
}
