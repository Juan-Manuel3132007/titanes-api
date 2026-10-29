import { AppError } from '../../domain/errors/AppError';
import { paginar, type Paginado } from '../../domain/shared/Paginacion';
import type {
  ActualizarGrupoDatos,
  CrearGrupoDatos,
  FiltrosGrupo,
  Grupo,
  GrupoRepository,
} from '../../domain/grupo/Grupo';

interface ErrorCampo {
  campo: string;
  mensaje: string;
}

export class GrupoService {
  constructor(private readonly grupos: GrupoRepository) {}

  async listar(filtros: FiltrosGrupo): Promise<Paginado<Grupo>> {
    const { total, items } = await this.grupos.listar(filtros);
    return paginar(items, total, filtros.page, filtros.limit);
  }

  async obtener(id: number): Promise<Grupo> {
    const grupo = await this.grupos.buscarPorId(id);
    if (!grupo) {
      throw AppError.notFound('El grupo no existe');
    }
    return grupo;
  }

  async crear(datos: CrearGrupoDatos): Promise<Grupo> {
    this.validarEdades(datos.edadMin, datos.edadMax);
    await this.validarRelaciones(datos.categoriaClave, datos.entrenadorId);
    return this.grupos.crear(datos);
  }

  async actualizar(id: number, datos: ActualizarGrupoDatos): Promise<Grupo> {
    const actual = await this.obtener(id);
    this.validarEdades(datos.edadMin ?? actual.edadMin, datos.edadMax ?? actual.edadMax);
    await this.validarRelaciones(datos.categoriaClave, datos.entrenadorId);
    return this.grupos.actualizar(id, datos);
  }

  async eliminar(id: number): Promise<void> {
    await this.obtener(id);
    await this.grupos.eliminar(id);
  }

  private validarEdades(edadMin: number, edadMax: number): void {
    if (edadMin > edadMax) {
      throw AppError.badRequest('Datos inválidos', [
        { campo: 'edadMax', mensaje: 'La edad máxima debe ser mayor o igual a la mínima' },
      ]);
    }
  }

  private async validarRelaciones(categoriaClave?: string, entrenadorId?: number): Promise<void> {
    const errores: ErrorCampo[] = [];

    if (categoriaClave !== undefined && !(await this.grupos.existeCategoria(categoriaClave))) {
      errores.push({ campo: 'categoriaClave', mensaje: 'La categoría no existe' });
    }
    if (entrenadorId !== undefined && !(await this.grupos.existeEntrenador(entrenadorId))) {
      errores.push({ campo: 'entrenadorId', mensaje: 'El entrenador no existe' });
    }

    if (errores.length > 0) {
      throw AppError.badRequest('Datos inválidos', errores);
    }
  }
}