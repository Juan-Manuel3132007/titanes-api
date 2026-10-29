import { prisma } from '../prisma/client';
import type {
  CrearUserDatos,
  User,
  UserConPassword,
  UserRepository,
} from '../../domain/user/User';

// select sin password: la contraseña nunca sale hacia afuera
const camposPublicos = {
  id: true,
  nombre: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export class PrismaUserRepository implements UserRepository {
  async buscarPorEmail(email: string): Promise<UserConPassword | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async buscarPorId(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id }, select: camposPublicos });
  }

  async crear(datos: CrearUserDatos): Promise<User> {
    return prisma.user.create({
      data: { nombre: datos.nombre, email: datos.email, password: datos.passwordHash },
      select: camposPublicos,
    });
  }
}