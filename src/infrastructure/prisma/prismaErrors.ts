import { Prisma } from '@prisma/client';
import { AppError } from '../../domain/errors/AppError';

// Traduce errores de Prisma a errores HTTP; así Prisma no sale de infrastructure
export function traducirErrorPrisma(error: unknown): AppError | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  switch (error.code) {
    case 'P2002':
      return AppError.conflict('El registro ya existe');
    case 'P2025':
      return AppError.notFound('Recurso no encontrado');
    case 'P2003':
      return AppError.badRequest('Referencia inválida a otro registro');
    default:
      return null;
  }
}