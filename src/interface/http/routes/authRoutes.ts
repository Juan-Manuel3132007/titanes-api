import { Router } from 'express';
import { authController } from '../../../container';
import { autenticar } from '../middlewares/auth';

export const authRouter = Router();

authRouter.post('/register', authController.registrar);
authRouter.post('/login', authController.login);
authRouter.get('/me', autenticar, authController.perfil);