import {EventsService} from '../../../domain/events/EventsService.js';

export class NoopEventService extends EventsService {
  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  on<T>(eventName: string, cb: (payload: T) => void | Promise<void>) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emit<T>(eventName: string, payload: T) {}
}
