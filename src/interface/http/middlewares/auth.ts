import type { RequestHandler } from 'express';
import { AppError } from '../../../domain/errors/AppError';
import type { Rol } from '../../../domain/user/User';
import { tokenService } from '../../../container';

// Sin token, o token inválido/vencido → 401
export const autenticar: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    next(AppError.unauthorized('Token no proporcionado'));
    return;
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    req.user = tokenService.verificar(token);
    next();
  } catch {
    next(AppError.unauthorized('Token inválido o expirado'));
  }
};

// Token válido pero el rol no tiene permiso → 403
export function permitirRoles(...roles: Rol[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      next(AppError.unauthorized());
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(AppError.forbidden());
      return;
    }
    next();
  };
}

export const soloAdmin = permitirRoles('ADMIN');