import { PrismaUserRepository } from './infrastructure/repositories/PrismaUserRepository';
import { PrismaGrupoRepository } from './infrastructure/repositories/PrismaGrupoRepository';
import { PrismaCatalogoRepository } from './infrastructure/repositories/PrismaCatalogoRepository';
import { PrismaInscripcionRepository } from './infrastructure/repositories/PrismaInscripcionRepository';
import { BcryptPasswordHasher } from './infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from './infrastructure/security/JwtTokenService';
import { AuthService } from './application/auth/AuthService';
import { GrupoService } from './application/grupos/GrupoService';
import { CatalogoService } from './application/catalogo/CatalogoService';
import { InscripcionService } from './application/inscripciones/InscripcionService';
import { AuthController } from './interface/http/controllers/AuthController';
import { GrupoController } from './interface/http/controllers/GrupoController';
import { CatalogoController } from './interface/http/controllers/CatalogoController';
import { InscripcionController } from './interface/http/controllers/InscripcionController';

export const tokenService = new JwtTokenService();

const userRepository = new PrismaUserRepository();
const grupoRepository = new PrismaGrupoRepository();
const catalogoRepository = new PrismaCatalogoRepository();
const inscripcionRepository = new PrismaInscripcionRepository();

const authService = new AuthService(userRepository, new BcryptPasswordHasher(), tokenService);
const grupoService = new GrupoService(grupoRepository);
const catalogoService = new CatalogoService(catalogoRepository);
const inscripcionService = new InscripcionService(inscripcionRepository);

export const authController = new AuthController(authService);
export const grupoController = new GrupoController(grupoService);
export const catalogoController = new CatalogoController(catalogoService);
export const inscripcionController = new InscripcionController(inscripcionService);