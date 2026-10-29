import { Router } from 'express';
import { inscripcionController } from '../../../container';
import { autenticar, soloAdmin } from '../middlewares/auth';

export const inscripcionRouter = Router();

// Todas las rutas de inscripciones exigen sesión
inscripcionRouter.use(autenticar);

inscripcionRouter.post('/', inscripcionController.crear);
inscripcionRouter.get('/mias', inscripcionController.listarMias);

// Solo admin
inscripcionRouter.get('/', soloAdmin, inscripcionController.listarTodas);
inscripcionRouter.patch('/:id/estado', soloAdmin, inscripcionController.cambiarEstado);