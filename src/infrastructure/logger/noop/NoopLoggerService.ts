import {LoggerService} from '../../../domain/logger/LoggerService.js';

export class NoopLoggerService extends LoggerService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(...args: any[]): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  log(...args: any[]): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(...args: any[]): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(...args: any[]): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  debug(...args: any[]): void {}
}
