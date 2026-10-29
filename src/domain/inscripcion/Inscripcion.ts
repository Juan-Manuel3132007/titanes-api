export type Experiencia = 'NINGUNA' | 'MENOS_DE_UN_ANIO' | 'MAS_DE_UN_ANIO';
export type EstadoInscripcion = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';

export const MAYORIA_DE_EDAD = 18;

export interface Inscripcion {
  id: number;
  nombreAspirante: string;
  edad: number;
  correo: string;
  telefono: string;
  experiencia: Experiencia;
  nombreAcudiente: string | null;
  telefonoAcudiente: string | null;
  permisoAcudiente: boolean;
  mensaje: string | null;
  aceptaDatos: boolean;
  estado: EstadoInscripcion;
  userId: number;
  grupoId: number;
  createdAt: Date;
  grupo: { id: number; nombre: string; dias: string; horario: string; precio: number };
  user: { id: number; nombre: string; email: string };
}

export interface CrearInscripcionDatos {
  nombreAspirante: string;
  edad: number;
  correo: string;
  telefono: string;
  experiencia: Experiencia;
  nombreAcudiente?: string | null;
  telefonoAcudiente?: string | null;
  permisoAcudiente: boolean;
  mensaje?: string | null;
  aceptaDatos: boolean;
  grupoId: number;
  userId: number;
}

export interface FiltrosInscripcion {
  page: number;
  limit: number;
  userId?: number;
  estado?: EstadoInscripcion;
}

// Lo mínimo del grupo que necesitan las reglas de negocio
export interface GrupoParaInscripcion {
  id: number;
  nombre: string;
  cupos: number;
  edadMin: number;
  edadMax: number;
}

export interface InscripcionRepository {
  buscarGrupo(grupoId: number): Promise<GrupoParaInscripcion | null>;
  crear(datos: CrearInscripcionDatos): Promise<Inscripcion>;
  listar(filtros: FiltrosInscripcion): Promise<{ total: number; items: Inscripcion[] }>;
  buscarPorId(id: number): Promise<Inscripcion | null>;
  cambiarEstado(id: number, estado: EstadoInscripcion): Promise<Inscripcion>;
}