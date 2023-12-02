export abstract class LoggerService {
  abstract error(...args: any[]): void;
  abstract warn(...args: any[]): void;
  abstract info(...args: any[]): void;
  abstract debug(...args: any[]): void;
  abstract log(...args: any[]): void;
}
