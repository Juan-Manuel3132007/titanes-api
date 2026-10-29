import type { Request, Response } from 'express';
import type { GrupoService } from '../../../application/grupos/GrupoService';
import { idParamSchema } from '../validators/comunes';
import {
  actualizarGrupoSchema,
  crearGrupoSchema,
  listarGruposQuerySchema,
} from '../validators/grupoSchemas';

export class GrupoController {
  constructor(private readonly grupoService: GrupoService) {}

  listar = async (req: Request, res: Response): Promise<void> => {
    const filtros = listarGruposQuerySchema.parse(req.query);
    res.json(await this.grupoService.listar(filtros));
  };

  obtener = async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    res.json(await this.grupoService.obtener(id));
  };

  crear = async (req: Request, res: Response): Promise<void> => {
    const datos = crearGrupoSchema.parse(req.body);
    res.status(201).json(await this.grupoService.crear(datos));
  };

  actualizar = async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    const datos = actualizarGrupoSchema.parse(req.body);
    res.json(await this.grupoService.actualizar(id, datos));
  };

  eliminar = async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    await this.grupoService.eliminar(id);
    res.status(204).send();
  };
}