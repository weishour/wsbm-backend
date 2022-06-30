import { HttpStatus } from '@nestjs/common';
import { Environment } from '@weishour/core/enums';
import { ApiException } from '@weishour/core/exceptions';
import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;
}

export function EnvValidate(config: Record<string, any>): Record<string, any> {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    enableDebugMessages: true,
    skipMissingProperties: false,
    stopAtFirstError: true,
  });

  if (errors.length > 0) {
    const firstError = errors.shift();
    const { constraints } = firstError;

    for (const key in constraints) {
      throw new ApiException(constraints[key], HttpStatus.NOT_IMPLEMENTED);
    }
  }

  return validatedConfig;
}
