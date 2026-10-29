import { AppError } from '../../domain/errors/AppError';
import type { PasswordHasher, TokenService } from '../../domain/auth/ports';
import type { User, UserRepository } from '../../domain/user/User';

export interface AuthResultado {
  token: string;
  user: User;
}

export interface RegistroDatos {
  nombre: string;
  email: string;
  password: string;
}

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async registrar(datos: RegistroDatos): Promise<AuthResultado> {
    const existente = await this.users.buscarPorEmail(datos.email);
    if (existente) {
      throw AppError.conflict('El email ya está registrado', [
        { campo: 'email', mensaje: 'Este email ya está registrado' },
      ]);
    }

    const passwordHash = await this.hasher.hash(datos.password);
    const user = await this.users.crear({
      nombre: datos.nombre,
      email: datos.email,
      passwordHash,
    });

    return { token: this.tokens.firmar({ id: user.id, role: user.role }), user };
  }

  async login(email: string, password: string): Promise<AuthResultado> {
    const encontrado = await this.users.buscarPorEmail(email);
    const valido = encontrado ? await this.hasher.comparar(password, encontrado.password) : false;

    // Mismo mensaje si falla el email o la contraseña: no revelamos cuál
    if (!encontrado || !valido) {
      throw AppError.unauthorized('Credenciales inválidas');
    }

    const { password: _password, ...user } = encontrado;
    return { token: this.tokens.firmar({ id: user.id, role: user.role }), user };
  }

  async perfil(id: number): Promise<User> {
    const user = await this.users.buscarPorId(id);
    if (!user) {
      throw AppError.unauthorized('El usuario del token ya no existe');
    }
    return user;
  }
}