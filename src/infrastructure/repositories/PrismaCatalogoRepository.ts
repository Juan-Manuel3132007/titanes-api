import { prisma } from '../prisma/client';
import type { Categoria, CatalogoRepository, Entrenador } from '../../domain/catalogo/Catalogo';

// Orden de la Entrega 1: de la etapa formativa a mayores
const ORDEN_CATEGORIAS = ['formativa', 'competitiva', 'elite', 'mayores'];

function posicion(clave: string): number {
  const indice = ORDEN_CATEGORIAS.indexOf(clave);
  return indice === -1 ? ORDEN_CATEGORIAS.length : indice;
}

export class PrismaCatalogoRepository implements CatalogoRepository {
  async listarCategorias(): Promise<Categoria[]> {
    const categorias = await prisma.categoria.findMany();
    return categorias.sort((a, b) => posicion(a.clave) - posicion(b.clave));
  }

  async buscarCategoria(clave: string): Promise<Categoria | null> {
    return prisma.categoria.findUnique({ where: { clave } });
  }

  async listarEntrenadores(): Promise<Entrenador[]> {
    return prisma.entrenador.findMany({
      orderBy: { id: 'asc' },
      include: { grupos: { select: { id: true, nombre: true }, orderBy: { id: 'asc' } } },
    });
  }
}