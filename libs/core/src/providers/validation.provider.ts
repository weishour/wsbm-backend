import { HttpStatus, ValidationError, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { APP_PIPE } from '@nestjs/core';
import { WsConfigService } from '@weishour/core/services';
import { ApiException } from '@weishour/core/exceptions';
import { ApiCode } from '@weishour/core/enums';

export const ValidationProvider = {
  provide: APP_PIPE,
  useFactory: (config: WsConfigService) => {
    const options: ValidationPipeOptions = {
      disableErrorMessages: false,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    };
    const { disableErrorMessages, errorHttpStatusCode } = options;

    return new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const firstError = errors.shift();
        const { constraints, contexts } = firstError;

        // 禁用错误信息
        if (disableErrorMessages) {
          const errorHttp: any = new HttpErrorByCode[errorHttpStatusCode]();
          return new ApiException(errorHttp.message, errorHttp.status);
        }

        // 将未通过验证的字段的错误信息和状态码，以ApiException的形式抛给我们的全局异常过滤器
        for (const key in constraints) {
          return new ApiException(
            constraints[key],
            errorHttpStatusCode,
            contexts ? contexts[key].code : ApiCode.PARAM_ERROR || 0,
          );
        }
      },
    });
  },
  inject: [WsConfigService],
};
