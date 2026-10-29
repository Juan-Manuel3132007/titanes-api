import { z } from 'zod';
import { limiteSchema, paginaSchema } from './comunes';

// Para filtros opcionales: "?precioMax=" vacío se trata como si no viniera
const enteroOpcional = (campo: string) =>
  z.preprocess(
    (valor) => (valor === '' || valor === undefined ? undefined : valor),
    z.coerce
      .number({ error: `${campo} debe ser un número` })
      .int(`${campo} debe ser un número entero`)
      .min(0, `${campo} no puede ser negativo`)
      .optional(),
  );

const textoOpcional = (max: number) =>
  z.preprocess(
    (valor) => (typeof valor === 'string' && valor.trim() === '' ? undefined : valor),
    z.string().trim().max(max, 'El texto es demasiado largo').optional(),
  );

export const listarGruposQuerySchema = z
  .object({
    page: paginaSchema,
    limit: limiteSchema(4),
    q: textoOpcional(60),
    categoria: textoOpcional(40),
    precioMin: enteroOpcional('precioMin'),
    precioMax: enteroOpcional('precioMax'),
  })
  .refine(
    (f) => f.precioMin === undefined || f.precioMax === undefined || f.precioMin <= f.precioMax,
    { message: 'precioMin no puede ser mayor que precioMax', path: ['precioMin'] },
  );

const grupoBase = z.object({
  nombre: z
    .string({ error: 'El nombre es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(80, 'El nombre es demasiado largo'),
  categoriaClave: z
    .string({ error: 'La categoría es obligatoria' })
    .trim()
    .min(1, 'La categoría es obligatoria'),
  edadMin: z
    .number({ error: 'La edad mínima debe ser un número' })
    .int('La edad mínima debe ser un número entero')
    .min(5, 'La edad mínima es 5 años')
    .max(99, 'La edad máxima permitida es 99 años'),
  edadMax: z
    .number({ error: 'La edad máxima debe ser un número' })
    .int('La edad máxima debe ser un número entero')
    .min(5, 'La edad mínima es 5 años')
    .max(99, 'La edad máxima permitida es 99 años'),
  dias: z
    .string({ error: 'Los días son obligatorios' })
    .trim()
    .min(3, 'Indica los días de entrenamiento')
    .max(60, 'El texto de días es demasiado largo'),
  horario: z
    .string({ error: 'El horario es obligatorio' })
    .trim()
    .min(3, 'Indica el horario')
    .max(60, 'El horario es demasiado largo'),
  precio: z
    .number({ error: 'El precio debe ser un número' })
    .int('El precio debe ser un número entero')
    .min(0, 'El precio no puede ser negativo'),
  cupos: z
    .number({ error: 'Los cupos deben ser un número' })
    .int('Los cupos deben ser un número entero')
    .min(0, 'Los cupos no pueden ser negativos')
    .max(200, 'Máximo 200 cupos'),
  descripcion: z
    .string({ error: 'La descripción es obligatoria' })
    .trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción es demasiado larga'),
  imagenUrl: z.string().trim().max(500, 'La URL es demasiado larga').nullable().optional(),
  entrenadorId: z
    .number({ error: 'Selecciona un entrenador' })
    .int('El entrenador no es válido')
    .positive('Selecciona un entrenador'),
});

export const crearGrupoSchema = grupoBase;

export const actualizarGrupoSchema = grupoBase
  .partial()
  .refine((datos) => Object.keys(datos).length > 0, {
    message: 'Envía al menos un campo para actualizar',
  });