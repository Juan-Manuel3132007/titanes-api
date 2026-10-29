import { Router } from 'express';
import { catalogoController } from '../../../container';

// Solo lectura y públicas: el contenido informativo del sitio
export const categoriaRouter = Router();
categoriaRouter.get('/', catalogoController.listarCategorias);
categoriaRouter.get('/:clave', catalogoController.obtenerCategoria);

export const entrenadorRouter = Router();
entrenadorRouter.get('/', catalogoController.listarEntrenadores);