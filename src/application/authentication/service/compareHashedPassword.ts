import bcrypt from 'bcryptjs';

export async function compareHashedPassword(passwordCandidate: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(passwordCandidate, hashedPassword);
}
