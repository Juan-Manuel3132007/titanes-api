import { Router } from 'express';
import { authController } from '../../../container';

export const authRouter = Router();

authRouter.post('/register', authController.registrar);
authRouter.post('/login', authController.login);