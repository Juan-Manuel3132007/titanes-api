import type { Request, Response } from 'express';
import type { AuthService } from '../../../application/auth/AuthService';
import { loginSchema, registroSchema } from '../validators/authSchemas';
import { usuarioActual } from '../middlewares/usuarioActual';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  registrar = async (req: Request, res: Response): Promise<void> => {
    const datos = registroSchema.parse(req.body);
    const resultado = await this.authService.registrar(datos);
    res.status(201).json(resultado);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = loginSchema.parse(req.body);
    const resultado = await this.authService.login(email, password);
    res.json(resultado);
  };

  // El frontend lo usa al refrescar la página para saber quién está logueado
  perfil = async (req: Request, res: Response): Promise<void> => {
    const { id } = usuarioActual(req);
    const user = await this.authService.perfil(id);
    res.json(user);
  };
}