import type { Request, Response } from 'express';
import type { InscripcionService } from '../../../application/inscripciones/InscripcionService';
import { usuarioActual } from '../middlewares/usuarioActual';
import { idParamSchema } from '../validators/comunes';
import {
  cambiarEstadoSchema,
  crearInscripcionSchema,
  listarMiasQuerySchema,
  listarTodasQuerySchema,
} from '../validators/inscripcionSchemas';

export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  crear = async (req: Request, res: Response): Promise<void> => {
    const datos = crearInscripcionSchema.parse(req.body);
    // El dueño de la inscripción sale del token, nunca del body
    const { id: userId } = usuarioActual(req);
    const inscripcion = await this.inscripcionService.crear({ ...datos, userId });
    res.status(201).json(inscripcion);
  };

  listarMias = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = listarMiasQuerySchema.parse(req.query);
    const { id: userId } = usuarioActual(req);
    res.json(await this.inscripcionService.listarDelUsuario(userId, page, limit));
  };

  listarTodas = async (req: Request, res: Response): Promise<void> => {
    const filtros = listarTodasQuerySchema.parse(req.query);
    res.json(await this.inscripcionService.listar(filtros));
  };

  cambiarEstado = async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    const { estado } = cambiarEstadoSchema.parse(req.body);
    res.json(await this.inscripcionService.cambiarEstado(id, estado));
  };
}