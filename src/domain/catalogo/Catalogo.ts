export interface Categoria {
  clave: string;
  nombre: string;
  edades: string;
  resumen: string;
  trabajo: string[];
  torneos: string[];
}

export interface Entrenador {
  id: number;
  nombre: string;
  especialidad: string;
  experienciaAnios: number;
  bio: string;
  fotoUrl: string | null;
  grupos: { id: number; nombre: string }[];
}

export interface CatalogoRepository {
  listarCategorias(): Promise<Categoria[]>;
  buscarCategoria(clave: string): Promise<Categoria | null>;
  listarEntrenadores(): Promise<Entrenador[]>;
}