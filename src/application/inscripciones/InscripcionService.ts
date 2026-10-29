import { AppError } from '../../domain/errors/AppError';
import { paginar, type Paginado } from '../../domain/shared/Paginacion';
import {
  MAYORIA_DE_EDAD,
  type CrearInscripcionDatos,
  type EstadoInscripcion,
  type FiltrosInscripcion,
  type Inscripcion,
  type InscripcionRepository,
} from '../../domain/inscripcion/Inscripcion';

export class InscripcionService {
  constructor(private readonly inscripciones: InscripcionRepository) {}

  // Mismas reglas propias del formulario de la Entrega 1, ahora en el servidor
  async crear(datos: CrearInscripcionDatos): Promise<Inscripcion> {
    const grupo = await this.inscripciones.buscarGrupo(datos.grupoId);
    if (!grupo) {
      throw AppError.badRequest('Datos inválidos', [
        { campo: 'grupoId', mensaje: 'El programa seleccionado no existe' },
      ]);
    }

    // Regla propia 2: un programa sin cupos no admite inscripción
    if (grupo.cupos <= 0) {
      throw AppError.conflict(`${grupo.nombre} no tiene cupos disponibles`, [
        { campo: 'grupoId', mensaje: `${grupo.nombre} no tiene cupos disponibles. Elige otro programa.` },
      ]);
    }

    // Regla propia 3: la edad debe corresponder al rango del programa
    if (datos.edad < grupo.edadMin || datos.edad > grupo.edadMax) {
      throw AppError.badRequest('Datos inválidos', [
        {
          campo: 'grupoId',
          mensaje: `${grupo.nombre} es para jugadores de ${grupo.edadMin} a ${grupo.edadMax} años. Revisa el programa seleccionado.`,
        },
      ]);
    }

    // Regla propia 1: los datos del acudiente solo se guardan si el aspirante es menor
    const esMenor = datos.edad < MAYORIA_DE_EDAD;

    return this.inscripciones.crear({
      ...datos,
      nombreAcudiente: esMenor ? datos.nombreAcudiente : null,
      telefonoAcudiente: esMenor ? datos.telefonoAcudiente : null,
      permisoAcudiente: esMenor ? datos.permisoAcudiente : false,
    });
  }

  async listarDelUsuario(userId: number, page: number, limit: number): Promise<Paginado<Inscripcion>> {
    return this.listar({ userId, page, limit });
  }

  async listar(filtros: FiltrosInscripcion): Promise<Paginado<Inscripcion>> {
    const { total, items } = await this.inscripciones.listar(filtros);
    return paginar(items, total, filtros.page, filtros.limit);
  }

  async cambiarEstado(id: number, estado: EstadoInscripcion): Promise<Inscripcion> {
    const inscripcion = await this.inscripciones.buscarPorId(id);
    if (!inscripcion) {
      throw AppError.notFound('La inscripción no existe');
    }
    return this.inscripciones.cambiarEstado(id, estado);
  }
}