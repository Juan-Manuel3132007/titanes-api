import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../../domain/errors/AppError';
import { traducirErrorPrisma } from '../../../infrastructure/prisma/prismaErrors';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const errorApp = err instanceof AppError ? err : traducirErrorPrisma(err);

  if (errorApp) {
    res.status(errorApp.statusCode).json({
      error: errorApp.message,
      ...(errorApp.details !== undefined ? { details: errorApp.details } : {}),
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Datos inválidos',
      details: err.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensaje: issue.message,
      })),
    });
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
};