import type { Prisma } from '@prisma/client';
import { prisma } from '../prisma/client';
import type {
  ActualizarGrupoDatos,
  CrearGrupoDatos,
  FiltrosGrupo,
  Grupo,
  GrupoRepository,
} from '../../domain/grupo/Grupo';

// Cada grupo viaja con el nombre de su categoría y de su entrenador
const incluir = {
  categoria: { select: { clave: true, nombre: true } },
  entrenador: { select: { id: true, nombre: true, especialidad: true } },
} satisfies Prisma.GrupoInclude;

function construirFiltro(filtros: FiltrosGrupo): Prisma.GrupoWhereInput {
  const where: Prisma.GrupoWhereInput = {};

  if (filtros.q) {
    where.OR = [
      { nombre: { contains: filtros.q, mode: 'insensitive' } },
      { descripcion: { contains: filtros.q, mode: 'insensitive' } },
    ];
  }

  if (filtros.categoria) {
    where.categoriaClave = filtros.categoria;
  }

  if (filtros.precioMin !== undefined || filtros.precioMax !== undefined) {
    where.precio = {
      ...(filtros.precioMin !== undefined ? { gte: filtros.precioMin } : {}),
      ...(filtros.precioMax !== undefined ? { lte: filtros.precioMax } : {}),
    };
  }

  return where;
}

export class PrismaGrupoRepository implements GrupoRepository {
  async listar(filtros: FiltrosGrupo): Promise<{ total: number; items: Grupo[] }> {
    const where = construirFiltro(filtros);

    const [total, items] = await prisma.$transaction([
      prisma.grupo.count({ where }),
      prisma.grupo.findMany({
        where,
        include: incluir,
        orderBy: { id: 'asc' },
        skip: (filtros.page - 1) * filtros.limit,
        take: filtros.limit,
      }),
    ]);

    return { total, items };
  }

  async buscarPorId(id: number): Promise<Grupo | null> {
    return prisma.grupo.findUnique({ where: { id }, include: incluir });
  }

  async crear(datos: CrearGrupoDatos): Promise<Grupo> {
    return prisma.grupo.create({ data: datos, include: incluir });
  }

  async actualizar(id: number, datos: ActualizarGrupoDatos): Promise<Grupo> {
    return prisma.grupo.update({ where: { id }, data: datos, include: incluir });
  }

  async eliminar(id: number): Promise<void> {
    await prisma.grupo.delete({ where: { id } });
  }

  async existeCategoria(clave: string): Promise<boolean> {
    return (await prisma.categoria.count({ where: { clave } })) > 0;
  }

  async existeEntrenador(id: number): Promise<boolean> {
    return (await prisma.entrenador.count({ where: { id } })) > 0;
  }
}