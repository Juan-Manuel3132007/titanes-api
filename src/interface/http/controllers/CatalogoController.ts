import type { Request, Response } from 'express';
import type { CatalogoService } from '../../../application/catalogo/CatalogoService';
import { claveParamSchema } from '../validators/catalogoSchemas';

export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  listarCategorias = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.catalogoService.listarCategorias());
  };

  obtenerCategoria = async (req: Request, res: Response): Promise<void> => {
    const { clave } = claveParamSchema.parse(req.params);
    res.json(await this.catalogoService.obtenerCategoria(clave));
  };

  listarEntrenadores = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.catalogoService.listarEntrenadores());
  };
}