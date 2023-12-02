export abstract class EventsService {
  /**
   * Escucha un determinado evento
   * @param eventName Nombre del evento a escuchar
   * @param cb Función a ejecutar cuando se reciba el evento
   */
  abstract on<T>(eventName: string, cb: (payload: T) => void | Promise<void>): void;

  /**
   * Emite un determinado evento
   * @param eventName Nombre del evento a emitir
   * @param payload Payload a mandar con el evento
   */
  abstract emit<T>(eventName: string, payload: T): void;
}
