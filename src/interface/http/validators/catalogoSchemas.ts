import { z } from 'zod';

export const claveParamSchema = z.object({
  clave: z
    .string()
    .trim()
    .min(1, 'La clave es obligatoria')
    .max(40, 'La clave es demasiado larga')
    .regex(/^[a-z0-9-]+$/, 'La clave solo admite minúsculas, números y guiones'),
});