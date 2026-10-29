import { PrismaUserRepository } from './infrastructure/repositories/PrismaUserRepository';
import { BcryptPasswordHasher } from './infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from './infrastructure/security/JwtTokenService';
import { AuthService } from './application/auth/AuthService';
import { AuthController } from './interface/http/controllers/AuthController';

export const tokenService = new JwtTokenService();

const userRepository = new PrismaUserRepository();
const authService = new AuthService(userRepository, new BcryptPasswordHasher(), tokenService);

export const authController = new AuthController(authService);