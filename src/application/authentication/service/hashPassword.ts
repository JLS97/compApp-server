import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  /**
   * bcryptjs es JavaScript puro: con un factor de 14 cada hash tarda en torno a un segundo de CPU y el login se convierte en un vector de denegación de servicio.
   * Los hashes ya guardados con otro factor se siguen validando, porque el factor va dentro del propio hash
   */
  const SALT_WORK_FACTOR = 12;

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}
