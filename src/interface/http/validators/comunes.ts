import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce
    .number({ error: 'El id debe ser un número' })
    .int('El id debe ser un número entero')
    .positive('El id debe ser positivo'),
});

export const paginaSchema = z.coerce
  .number({ error: 'page debe ser un número' })
  .int('page debe ser un número entero')
  .min(1, 'page debe ser mayor o igual a 1')
  .default(1);

export const limiteSchema = (porDefecto: number) =>
  z.coerce
    .number({ error: 'limit debe ser un número' })
    .int('limit debe ser un número entero')
    .min(1, 'limit debe ser mayor o igual a 1')
    .max(50, 'limit no puede ser mayor a 50')
    .default(porDefecto);