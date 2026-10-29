import type { Rol } from '../user/User';

// Lo único que viaja en el token: el payload se puede leer sin la clave
export interface TokenPayload {
  id: number;
  role: Rol;
}

export interface TokenService {
  firmar(payload: TokenPayload): string;
  verificar(token: string): TokenPayload;
}

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  comparar(password: string, hash: string): Promise<boolean>;
}