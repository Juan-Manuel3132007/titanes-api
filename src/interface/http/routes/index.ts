import { Router } from 'express';
import { authRouter } from './authRoutes';
import { grupoRouter } from './grupoRoutes';
import { categoriaRouter, entrenadorRouter } from './catalogoRoutes';

export const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRouter);
router.use('/grupos', grupoRouter);
router.use('/categorias', categoriaRouter);
router.use('/entrenadores', entrenadorRouter);