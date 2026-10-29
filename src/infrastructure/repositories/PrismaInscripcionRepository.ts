import type { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';
import type {
  CrearInscripcionDatos,
  EstadoInscripcion,
  FiltrosInscripcion,
  GrupoParaInscripcion,
  Inscripcion,
  InscripcionRepository,
} from '../../domain/inscripcion/Inscripcion';

const incluir = {
  grupo: { select: { id: true, nombre: true, dias: true, horario: true, precio: true } },
  user: { select: { id: true, nombre: true, email: true } },
} satisfies Prisma.InscripcionInclude;

export class PrismaInscripcionRepository implements InscripcionRepository {
  async buscarGrupo(grupoId: number): Promise<GrupoParaInscripcion | null> {
    return prisma.grupo.findUnique({
      where: { id: grupoId },
      select: { id: true, nombre: true, cupos: true, edadMin: true, edadMax: true },
    });
  }

  async crear(datos: CrearInscripcionDatos): Promise<Inscripcion> {
    return prisma.inscripcion.create({ data: datos, include: incluir });
  }

  async listar(filtros: FiltrosInscripcion): Promise<{ total: number; items: Inscripcion[] }> {
    const where: Prisma.InscripcionWhereInput = {
      ...(filtros.userId !== undefined ? { userId: filtros.userId } : {}),
      ...(filtros.estado !== undefined ? { estado: filtros.estado } : {}),
    };

    const [total, items] = await prisma.$transaction([
      prisma.inscripcion.count({ where }),
      prisma.inscripcion.findMany({
        where,
        include: incluir,
        orderBy: { createdAt: 'desc' },
        skip: (filtros.page - 1) * filtros.limit,
        take: filtros.limit,
      }),
    ]);

    return { total, items };
  }

  async buscarPorId(id: number): Promise<Inscripcion | null> {
    return prisma.inscripcion.findUnique({ where: { id }, include: incluir });
  }

  async cambiarEstado(id: number, estado: EstadoInscripcion): Promise<Inscripcion> {
    return prisma.inscripcion.update({ where: { id }, data: { estado }, include: incluir });
  }
}