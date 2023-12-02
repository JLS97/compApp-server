import {LoggerService} from '../../../domain/logger/LoggerService.js';

interface Params {
  loggerService: LoggerService;
}

export function cronjobExample(params: Params) {
  return async () => {
    const currentDate = new Date(Date.now());
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const timezone = (currentDate.getTimezoneOffset() / 60) * -1;
    params.loggerService.info(
      `[CRONJOB ${cronjobExample.name}]: Running example cronjob at ${hour}:${minute} on local time. The server timezone is ${timezone}`
    );
  };
}
