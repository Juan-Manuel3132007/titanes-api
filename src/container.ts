import { PrismaUserRepository } from './infrastructure/repositories/PrismaUserRepository';
import { PrismaGrupoRepository } from './infrastructure/repositories/PrismaGrupoRepository';
import { BcryptPasswordHasher } from './infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from './infrastructure/security/JwtTokenService';
import { AuthService } from './application/auth/AuthService';
import { GrupoService } from './application/grupos/GrupoService';
import { AuthController } from './interface/http/controllers/AuthController';
import { GrupoController } from './interface/http/controllers/GrupoController';

export const tokenService = new JwtTokenService();

const userRepository = new PrismaUserRepository();
const grupoRepository = new PrismaGrupoRepository();

const authService = new AuthService(userRepository, new BcryptPasswordHasher(), tokenService);
const grupoService = new GrupoService(grupoRepository);

export const authController = new AuthController(authService);
export const grupoController = new GrupoController(grupoService);