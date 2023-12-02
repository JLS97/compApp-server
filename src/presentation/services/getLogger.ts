import {ENV} from '../../env.js';
import {ConsoleLoggerService} from '../../infrastructure/logger/console/ConsoleLoggerService.js';
import {NoopLoggerService} from '../../infrastructure/logger/noop/NoopLoggerService.js';

let consoleLogger: ConsoleLoggerService;
let noopLogger: NoopLoggerService;

function getConsoleLogger() {
  if (consoleLogger) {
    return consoleLogger;
  }

  consoleLogger = new ConsoleLoggerService();

  return consoleLogger;
}

function getNoopLogger() {
  if (noopLogger) {
    return noopLogger;
  }

  noopLogger = new NoopLoggerService();

  return noopLogger;
}

export function getLogger() {
  switch (ENV.LOGGER_TYPE) {
    case 'console':
      return getConsoleLogger();
    case 'none':
      return getNoopLogger();
    default:
      throw new Error(`Logger not supported. Received: ${ENV.LOGGER_TYPE}`);
  }
}
