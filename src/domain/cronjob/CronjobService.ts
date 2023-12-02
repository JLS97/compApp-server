export abstract class CronjobService {
  /**
   * Agenda la llamada a una determinada función en una fecha determinada
   * @param crontab Recurrencia en formato cron con la que ejecutar la función (* * * * *)
   * @param cb Función a ejecutar
   */
  abstract schedule(crontab: string, cb: () => void | Promise<void>): void;
}
