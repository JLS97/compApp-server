import {EventEmitter} from 'events';
import {EventsService} from '../../../domain/events/EventsService.js';
import {LoggerService} from '../../../domain/logger/LoggerService.js';
import {eventErrorHandler} from '../../../domain/events/eventErrorHandler.js';

interface NodeEventServiceParams {
  loggerService?: LoggerService;
}

export class NodeEventService extends EventsService {
  private _eventEmitter: EventEmitter;
  private _logger?: LoggerService;

  constructor(params?: NodeEventServiceParams) {
    super();
    this._logger = params?.loggerService;

    this._eventEmitter = new EventEmitter({
      captureRejections: true,
    });

    this._eventEmitter.on('error', (...args) => {
      this._logger?.error('Error sending events');
      this._logger?.error(args);
    });
  }

  on<T>(eventName: string, cb: (payload: T) => void | Promise<void>) {
    this._eventEmitter.on(eventName, eventErrorHandler(cb, this._logger));
  }

  emit<T>(eventName: string, payload: T) {
    this._eventEmitter.emit(eventName, payload);
  }
}
