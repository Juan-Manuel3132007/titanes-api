import { PrismaUserRepository } from './infrastructure/repositories/PrismaUserRepository';
import { PrismaGrupoRepository } from './infrastructure/repositories/PrismaGrupoRepository';
import { PrismaCatalogoRepository } from './infrastructure/repositories/PrismaCatalogoRepository';
import { BcryptPasswordHasher } from './infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from './infrastructure/security/JwtTokenService';
import { AuthService } from './application/auth/AuthService';
import { GrupoService } from './application/grupos/GrupoService';
import { CatalogoService } from './application/catalogo/CatalogoService';
import { AuthController } from './interface/http/controllers/AuthController';
import { GrupoController } from './interface/http/controllers/GrupoController';
import { CatalogoController } from './interface/http/controllers/CatalogoController';

export const tokenService = new JwtTokenService();

const userRepository = new PrismaUserRepository();
const grupoRepository = new PrismaGrupoRepository();
const catalogoRepository = new PrismaCatalogoRepository();

const authService = new AuthService(userRepository, new BcryptPasswordHasher(), tokenService);
const grupoService = new GrupoService(grupoRepository);
const catalogoService = new CatalogoService(catalogoRepository);

export const authController = new AuthController(authService);
export const grupoController = new GrupoController(grupoService);
export const catalogoController = new CatalogoController(catalogoService);