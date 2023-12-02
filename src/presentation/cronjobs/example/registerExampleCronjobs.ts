import {getCronjobService} from '../../services/getCronjobService.js';
import {getLogger} from '../../services/getLogger.js';
import {cronjobExample} from './cronjobExample.js';

const cronjobService = getCronjobService();
const loggerService = getLogger();

export function registerExampleCronjobs() {
  cronjobService.schedule(
    '11 11 * * *',
    cronjobExample({
      loggerService,
    })
  );
}
