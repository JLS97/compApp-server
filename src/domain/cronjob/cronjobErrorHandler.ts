import {LoggerService} from '../logger/LoggerService.js';

export function cronjobErrorHandler(cb: () => Promise<void> | void, logger?: LoggerService) {
  return async (): Promise<void> => {
    try {
      await cb();
    } catch (error) {
      logger?.error(`[CRONJOB ERROR]:`);
      logger?.error(error);
    }
  };
}
