import {ENV} from '../../env.js';
import {NodeEventService} from '../../infrastructure/events/node/NodeEventService.js';
import {NoopEventService} from '../../infrastructure/events/noop/NoopEventService.js';
import {getLogger} from './getLogger.js';

let nodeEventService: NodeEventService;
let noopEventService: NoopEventService;

const getNodeEventService = () => {
  if (nodeEventService) {
    return nodeEventService;
  }

  nodeEventService = new NodeEventService({
    loggerService: getLogger(),
  });

  return nodeEventService;
};

const getNoopEventService = () => {
  if (noopEventService) {
    return noopEventService;
  }

  noopEventService = new NoopEventService();

  return noopEventService;
};

export function getEventService() {
  switch (ENV.EVENT_SERVICE_TYPE) {
    case 'node':
      return getNodeEventService();
    case 'none':
      return getNoopEventService();
    default:
      throw new Error(`Event service not supported. Received: ${ENV.EVENT_SERVICE_TYPE}`);
  }
}
