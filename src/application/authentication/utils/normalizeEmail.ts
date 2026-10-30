/**
 * Normaliza un email para guardarlo y buscarlo siempre igual, sin importar mayúsculas ni espacios.
 * Si no recibe un string lo devuelve tal cual para que lo rechace la validación
 * @param email Email a normalizar
 */
export function normalizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return email;
  }

  return email.trim().toLowerCase();
}
