import {schedule as nodeSchedule} from 'node-cron';
import {CronjobService} from '../../../domain/cronjob/CronjobService.js';
import {cronjobErrorHandler} from '../../../domain/cronjob/cronjobErrorHandler.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';

interface NodeCronjobServiceParams {
  loggerService?: LoggerService;
}

export class NodeCronjobService extends CronjobService {
  private _logger?: LoggerService;

  constructor(params?: NodeCronjobServiceParams) {
    super();
    this._logger = params?.loggerService;
  }

  schedule(crontab: string, cb: () => void | Promise<void>): void {
    nodeSchedule(crontab, cronjobErrorHandler(cb, this._logger));
  }
}
