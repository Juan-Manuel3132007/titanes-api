import { AppError } from '../../domain/errors/AppError';
import type { Categoria, CatalogoRepository, Entrenador } from '../../domain/catalogo/Catalogo';

// Contenido de apoyo del sitio: categorías y entrenadores de la Entrega 1
export class CatalogoService {
  constructor(private readonly catalogo: CatalogoRepository) {}

  listarCategorias(): Promise<Categoria[]> {
    return this.catalogo.listarCategorias();
  }

  async obtenerCategoria(clave: string): Promise<Categoria> {
    const categoria = await this.catalogo.buscarCategoria(clave);
    if (!categoria) {
      throw AppError.notFound('La categoría no existe');
    }
    return categoria;
  }

  listarEntrenadores(): Promise<Entrenador[]> {
    return this.catalogo.listarEntrenadores();
  }
}