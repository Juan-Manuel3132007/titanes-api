import bcrypt from 'bcrypt';
import type { PasswordHasher } from '../../domain/auth/ports';

const RONDAS = 10;

export class BcryptPasswordHasher implements PasswordHasher {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, RONDAS);
  }

  comparar(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}