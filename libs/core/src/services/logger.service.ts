import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class WsLogger extends ConsoleLogger {
  constructor() {
    super(WsLogger.name, {
      timestamp: false,
    });
  }
}
