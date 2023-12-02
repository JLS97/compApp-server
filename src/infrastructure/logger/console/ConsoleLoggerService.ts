import {LoggerService} from '../../../domain/logger/LoggerService.js';

export class ConsoleLoggerService extends LoggerService {
  error(...args: any[]): void {
    console.error(...args);
  }
  log(...args: any[]): void {
    console.log(...args);
  }
  info(...args: any[]): void {
    console.info(...args);
  }
  warn(...args: any[]): void {
    console.warn(...args);
  }
  debug(...args: any[]): void {
    console.debug(...args);
  }
}
