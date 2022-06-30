import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { TimeUtil } from '@weishour/core/utils';
import { Result } from '@weishour/core/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Result> {
  constructor(private timeUtil: TimeUtil) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Result> {
    // 解析ExecutionContext的数据内容获取请求体
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data: Result) => {
        let result;

        if (typeof data === 'string') {
          result = {
            status: true,
            code: HttpStatus.OK,
            data,
            time: this.timeUtil.CurrentTime,
            path: request.url,
          };
        } else {
          result = {
            ...data,
            time: this.timeUtil.CurrentTime,
            path: request.url,
          };
        }

        return result;
      }),
    );
  }
}
