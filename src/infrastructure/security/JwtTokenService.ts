import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import type { TokenPayload, TokenService } from '../../domain/auth/ports';

export class JwtTokenService implements TokenService {
  firmar(payload: TokenPayload): string {
    return jwt.sign({ id: payload.id, role: payload.role }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
    });
  }

  // Lanza error si el token está vencido, mal firmado o con formato raro
  verificar(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (
      typeof decoded === 'string' ||
      typeof decoded.id !== 'number' ||
      (decoded.role !== 'ADMIN' && decoded.role !== 'USER')
    ) {
      throw new Error('Token con formato inválido');
    }

    return { id: decoded.id, role: decoded.role };
  }
}