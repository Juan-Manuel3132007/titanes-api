import type { Request } from 'express';
import { AppError } from '../../../domain/errors/AppError';
import type { TokenPayload } from '../../../domain/auth/ports';

// El usuario SIEMPRE sale del token, nunca del body
export function usuarioActual(req: Request): TokenPayload {
  if (!req.user) {
    throw AppError.unauthorized();
  }
  return req.user;
}