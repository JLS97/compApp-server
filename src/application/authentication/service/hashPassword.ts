import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const SALT_WORK_FACTOR = 14;

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}
