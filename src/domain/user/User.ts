export type Rol = 'ADMIN' | 'USER';

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: Rol;
  createdAt: Date;
}

export interface UserConPassword extends User {
  password: string;
}

export interface CrearUserDatos {
  nombre: string;
  email: string;
  passwordHash: string;
}

export interface UserRepository {
  buscarPorEmail(email: string): Promise<UserConPassword | null>;
  buscarPorId(id: number): Promise<User | null>;
  crear(datos: CrearUserDatos): Promise<User>;
}