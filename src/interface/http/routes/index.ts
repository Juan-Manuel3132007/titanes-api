import { Router } from 'express';
import { authRouter } from './authRoutes';
import { grupoRouter } from './grupoRoutes';

export const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRouter);
router.use('/grupos', grupoRouter);