import { z } from 'zod';

export const registroSchema = z.object({
  nombre: z
    .string({ error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'El nombre es demasiado largo'),
  email: z
    .string({ error: 'El email es obligatorio' })
    .trim()
    .toLowerCase()
    .email('El email no es válido'),
  password: z
    .string({ error: 'La contraseña es obligatoria' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña es demasiado larga'),
});

export const loginSchema = z.object({
  email: z
    .string({ error: 'El email es obligatorio' })
    .trim()
    .toLowerCase()
    .email('El email no es válido'),
  password: z
    .string({ error: 'La contraseña es obligatoria' })
    .min(1, 'La contraseña es obligatoria'),
});