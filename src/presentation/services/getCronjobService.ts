import {ENV} from '../../env.js';
import {NodeCronjobService} from '../../infrastructure/cronjob/node/NodeCronjobService.js';
import {NoopCronjobService} from '../../infrastructure/cronjob/noop/NoopCronjobService.js';
import {getLogger} from './getLogger.js';

let nodeCronjobService: NodeCronjobService;
let noopCronjobService: NoopCronjobService;

const getNodeCronjobService = () => {
  if (nodeCronjobService) {
    return nodeCronjobService;
  }

  nodeCronjobService = new NodeCronjobService({
    loggerService: getLogger(),
  });

  return nodeCronjobService;
};

const getNoopCronjobService = () => {
  if (noopCronjobService) {
    return noopCronjobService;
  }

  noopCronjobService = new NoopCronjobService();

  return noopCronjobService;
};

export function getCronjobService() {
  switch (ENV.CRONJOB_SERVICE_TYPE) {
    case 'node':
      return getNodeCronjobService();
    case 'none':
      return getNoopCronjobService();
    default:
      throw new Error(`Cronjob service not supported. Received: ${ENV.CRONJOB_SERVICE_TYPE}`);
  }
}
