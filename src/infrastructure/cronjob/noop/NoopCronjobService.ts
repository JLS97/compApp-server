import {CronjobService} from '../../../domain/cronjob/CronjobService.js';

export class NoopCronjobService extends CronjobService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  schedule(crontab: string, cb: () => void | Promise<void>): void {}
}
