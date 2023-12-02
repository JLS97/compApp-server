/**
 * Especifica que los resultados están paginados y la información necesaria para saber si se ha llegado al final de la paginación o no
 */
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
