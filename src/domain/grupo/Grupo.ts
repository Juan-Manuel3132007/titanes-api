export interface Grupo {
  id: number;
  nombre: string;
  categoriaClave: string;
  edadMin: number;
  edadMax: number;
  dias: string;
  horario: string;
  precio: number;
  cupos: number;
  descripcion: string;
  imagenUrl: string | null;
  entrenadorId: number;
  createdAt: Date;
  updatedAt: Date;
  categoria: { clave: string; nombre: string };
  entrenador: { id: number; nombre: string; especialidad: string };
}

export interface FiltrosGrupo {
  page: number;
  limit: number;
  q?: string;
  categoria?: string;
  precioMin?: number;
  precioMax?: number;
}

export interface CrearGrupoDatos {
  nombre: string;
  categoriaClave: string;
  edadMin: number;
  edadMax: number;
  dias: string;
  horario: string;
  precio: number;
  cupos: number;
  descripcion: string;
  imagenUrl?: string | null;
  entrenadorId: number;
}

export type ActualizarGrupoDatos = Partial<CrearGrupoDatos>;

export interface GrupoRepository {
  listar(filtros: FiltrosGrupo): Promise<{ total: number; items: Grupo[] }>;
  buscarPorId(id: number): Promise<Grupo | null>;
  crear(datos: CrearGrupoDatos): Promise<Grupo>;
  actualizar(id: number, datos: ActualizarGrupoDatos): Promise<Grupo>;
  eliminar(id: number): Promise<void>;
  existeCategoria(clave: string): Promise<boolean>;
  existeEntrenador(id: number): Promise<boolean>;
}