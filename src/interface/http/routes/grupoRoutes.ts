import { Router } from 'express';
import { grupoController } from '../../../container';
import { autenticar, soloAdmin } from '../middlewares/auth';

export const grupoRouter = Router();

// Públicas
grupoRouter.get('/', grupoController.listar);
grupoRouter.get('/:id', grupoController.obtener);

// Solo admin: primero se verifica el token (401) y luego el rol (403)
grupoRouter.post('/', autenticar, soloAdmin, grupoController.crear);
grupoRouter.put('/:id', autenticar, soloAdmin, grupoController.actualizar);
grupoRouter.delete('/:id', autenticar, soloAdmin, grupoController.eliminar);