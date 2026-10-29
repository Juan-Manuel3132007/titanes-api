import { z } from 'zod';
import { MAYORIA_DE_EDAD } from '../../../domain/inscripcion/Inscripcion';
import { limiteSchema, paginaSchema } from './comunes';

// Igual que en la Entrega 1: se quitan espacios y guiones y deben quedar 10 dígitos
const telefono = (requerido: string) =>
  z
    .string({ error: requerido })
    .transform((valor) => valor.replace(/[\s-]/g, ''))
    .pipe(z.string().min(1, requerido).regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos.'));

const textoOpcional = (max: number, mensaje: string) =>
  z.preprocess(
    (valor) => (typeof valor === 'string' && valor.trim() === '' ? undefined : valor),
    z.string().trim().max(max, mensaje).optional(),
  );

export const crearInscripcionSchema = z
  .object({
    grupoId: z
      .number({ error: 'Selecciona el programa que te interesa.' })
      .int('Selecciona el programa que te interesa.')
      .positive('Selecciona el programa que te interesa.'),
    nombreAspirante: z
      .string({ error: 'Escribe el nombre completo del aspirante.' })
      .trim()
      .min(1, 'Escribe el nombre completo del aspirante.')
      .min(5, 'El nombre debe tener al menos 5 caracteres.')
      .max(100, 'El nombre es demasiado largo.'),
    edad: z
      .number({ error: 'Indica la edad del aspirante.' })
      .int('La edad debe ser un número entero.')
      .min(10, 'La escuela recibe jugadores entre 10 y 60 años.')
      .max(60, 'La escuela recibe jugadores entre 10 y 60 años.'),
    correo: z
      .string({ error: 'Escribe un correo de contacto.' })
      .trim()
      .toLowerCase()
      .min(1, 'Escribe un correo de contacto.')
      .regex(
        /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
        'Ese correo no tiene un formato válido. Ejemplo: nombre@correo.com',
      ),
    telefono: telefono('Escribe un número de contacto.'),
    experiencia: z.enum(['NINGUNA', 'MENOS_DE_UN_ANIO', 'MAS_DE_UN_ANIO'], {
      error: 'Selecciona tu nivel de experiencia.',
    }),
    nombreAcudiente: textoOpcional(100, 'El nombre es demasiado largo.'),
    telefonoAcudiente: textoOpcional(20, 'El teléfono es demasiado largo.'),
    permisoAcudiente: z.boolean().default(false),
    mensaje: textoOpcional(300, 'El mensaje no puede pasar de 300 caracteres.'),
    aceptaDatos: z.literal(true, {
      error: 'Debes autorizar el tratamiento de datos para continuar.',
    }),
  })
  .superRefine((datos, ctx) => {
    // Regla propia 1: si el aspirante es menor, el acudiente es obligatorio
    if (datos.edad >= MAYORIA_DE_EDAD) {
      return;
    }

    const acudiente = datos.nombreAcudiente ?? '';
    if (acudiente.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['nombreAcudiente'], message: 'Escribe el nombre del acudiente.' });
    } else if (acudiente.length < 5) {
      ctx.addIssue({ code: 'custom', path: ['nombreAcudiente'], message: 'El nombre debe tener al menos 5 caracteres.' });
    }

    const telAcudiente = (datos.telefonoAcudiente ?? '').replace(/[\s-]/g, '');
    if (telAcudiente.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['telefonoAcudiente'], message: 'Escribe el teléfono del acudiente.' });
    } else if (!/^\d{10}$/.test(telAcudiente)) {
      ctx.addIssue({ code: 'custom', path: ['telefonoAcudiente'], message: 'El teléfono debe tener 10 dígitos.' });
    }

    if (!datos.permisoAcudiente) {
      ctx.addIssue({ code: 'custom', path: ['permisoAcudiente'], message: 'Se necesita la autorización del acudiente.' });
    }
  })
  .transform((datos) => ({
    ...datos,
    telefonoAcudiente: datos.telefonoAcudiente?.replace(/[\s-]/g, ''),
  }));

export const listarMiasQuerySchema = z.object({
  page: paginaSchema,
  limit: limiteSchema(10),
});

export const listarTodasQuerySchema = z.object({
  page: paginaSchema,
  limit: limiteSchema(10),
  estado: z
    .preprocess(
      (valor) => (valor === '' ? undefined : valor),
      z.enum(['PENDIENTE', 'APROBADA', 'RECHAZADA'], { error: 'Estado no válido' }).optional(),
    ),
});

export const cambiarEstadoSchema = z.object({
  estado: z.enum(['PENDIENTE', 'APROBADA', 'RECHAZADA'], {
    error: 'El estado debe ser PENDIENTE, APROBADA o RECHAZADA',
  }),
});