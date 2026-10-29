import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Datos tomados de js/main.js y entrenadores.html de la Entrega 1

const categorias = [
  {
    clave: 'formativa',
    nombre: 'Formativa',
    edades: '10 a 12 años',
    resumen:
      'La etapa donde el balón se vuelve familiar. Se corrige poco y se juega mucho, porque a esta edad lo que importa es que el gesto salga solo.',
    trabajo: [
      'Manejo de balón con ambas manos',
      'Pase de pecho, picado y de béisbol',
      'Entrada a canasta en dos tiempos',
      'Posición defensiva básica',
    ],
    torneos: [
      'Festivales formativos de la liga',
      'Encuentros amistosos entre escuelas',
      'Torneo interno de la escuela',
    ],
  },
  {
    clave: 'competitiva',
    nombre: 'Competitiva',
    edades: '13 a 16 años',
    resumen:
      'Primera etapa de competencia real. Aparecen los sistemas, la lectura de juego y también la primera derrota que duele.',
    trabajo: [
      'Sistemas ofensivos básicos',
      'Defensa individual y en zona',
      'Transición y contraataque',
      'Lectura de situaciones de dos contra uno',
    ],
    torneos: [
      'Torneo departamental de Antioquia',
      'Juegos Intercolegiados',
      'Copa interclubes',
    ],
  },
  {
    clave: 'elite',
    nombre: 'Elite',
    edades: '17 a 20 años',
    resumen:
      'Alto rendimiento con cinco sesiones semanales. Se entrena pensando en el calendario de competencia, no en la sesión del día.',
    trabajo: [
      'Preparación física dirigida',
      'Análisis de video propio y del rival',
      'Sistemas de ataque y ajustes en vivo',
      'Trabajo específico por posición',
    ],
    torneos: [
      'Liga departamental de Antioquia',
      'Torneo nacional interclubes',
      'Selección departamental por convocatoria',
    ],
  },
  {
    clave: 'mayores',
    nombre: 'Mayores',
    edades: '21 años en adelante',
    resumen:
      'Categoría abierta para quienes quieren seguir compitiendo sin dejar el trabajo o el estudio. Dos sesiones semanales en horario nocturno.',
    trabajo: [
      'Mantenimiento físico y prevención de lesión',
      'Sistemas de juego adaptados al grupo',
      'Tiro y finalización',
      'Juego en espacios reducidos',
    ],
    torneos: [
      'Liga municipal de mayores',
      'Torneos empresariales',
      'Copa abierta de Medellín',
    ],
  },
];

// "idOriginal" es el id que tenían en main.js; los grupos lo usan para relacionarse
const entrenadores = [
  {
    idOriginal: 1,
    nombre: 'Andrés Quiceno',
    especialidad: 'Fundamentos individuales',
    experienciaAnios: 12,
    bio: 'Formó jugadores en escuelas de barrio durante una década antes de llegar a Titanes. Cree que la técnica se enseña jugando, no repitiendo.',
    fotoUrl: '/img/entrenador-1.jpg',
  },
  {
    idOriginal: 2,
    nombre: 'Marcela Ospina',
    especialidad: 'Defensa y lectura de juego',
    experienciaAnios: 8,
    bio: 'Exjugadora de la liga departamental de Antioquia. Su trabajo se nota en lo que el rival no logra hacer.',
    fotoUrl: '/img/entrenador-2.jpg',
  },
  {
    idOriginal: 3,
    nombre: 'Julián Restrepo',
    especialidad: 'Tiro exterior y ataque',
    experienciaAnios: 10,
    bio: 'Trabaja mecánica de tiro con jugadores de todas las categorías. Sostiene que un buen tirador se construye con repetición y paciencia.',
    fotoUrl: '/img/entrenador-3.jpg',
  },
  {
    idOriginal: 4,
    nombre: 'Camilo Arboleda',
    especialidad: 'Preparación física',
    experienciaAnios: 6,
    bio: 'Licenciado en Educación Física. Diseña las cargas de trabajo de las categorías competitivas y dirige el programa de mayores.',
    fotoUrl: '/img/entrenador-4.jpg',
  },
];

const grupos = [
  {
    nombre: 'Formativa Mañana',
    categoriaClave: 'formativa',
    edadMin: 10,
    edadMax: 12,
    dias: 'Martes y jueves',
    horario: '8:00 a.m. – 9:30 a.m.',
    precio: 95000,
    cupos: 6,
    entrenadorOriginal: 1,
    imagenUrl: '/img/grupo-formativa.jpg',
    descripcion:
      'Programa de iniciación para quienes empiezan desde cero. Se trabaja manejo de balón, pase y entrada a canasta, siempre en formato de juego.',
  },
  {
    nombre: 'Formativa Tarde',
    categoriaClave: 'formativa',
    edadMin: 10,
    edadMax: 12,
    dias: 'Lunes, miércoles y viernes',
    horario: '4:00 p.m. – 5:30 p.m.',
    precio: 110000,
    cupos: 4,
    entrenadorOriginal: 1,
    imagenUrl: '/img/grupo-formativa.jpg',
    descripcion:
      'Mismo contenido que el programa de la mañana pero con una sesión adicional por semana. Pensado para quienes estudian en jornada matinal.',
  },
  {
    nombre: 'Competitiva Mixta',
    categoriaClave: 'competitiva',
    edadMin: 13,
    edadMax: 16,
    dias: 'Martes, jueves y sábado',
    horario: '5:00 p.m. – 7:00 p.m.',
    precio: 130000,
    cupos: 8,
    entrenadorOriginal: 2,
    imagenUrl: '/img/grupo-competitiva.jpg',
    descripcion:
      'Primera etapa de competencia. Se suman sistemas defensivos, transición y lectura de juego. El grupo participa en el torneo departamental.',
  },
  {
    nombre: 'Elite Masculino',
    categoriaClave: 'elite',
    edadMin: 17,
    edadMax: 20,
    dias: 'Lunes a viernes',
    horario: '6:00 p.m. – 8:00 p.m.',
    precio: 180000,
    cupos: 0,
    entrenadorOriginal: 3,
    imagenUrl: '/img/grupo-elite.jpg',
    descripcion:
      'Alto rendimiento con cinco sesiones semanales, preparación física dirigida y análisis de video. Requiere prueba de ingreso.',
  },
  {
    nombre: 'Elite Femenino',
    categoriaClave: 'elite',
    edadMin: 17,
    edadMax: 20,
    dias: 'Lunes a viernes',
    horario: '4:00 p.m. – 6:00 p.m.',
    precio: 180000,
    cupos: 5,
    entrenadorOriginal: 3,
    imagenUrl: '/img/grupo-elite.jpg',
    descripcion:
      'Mismo plan de trabajo que la rama masculina, con calendario propio en el torneo departamental femenino. Requiere prueba de ingreso.',
  },
  {
    nombre: 'Mayores',
    categoriaClave: 'mayores',
    edadMin: 21,
    edadMax: 60,
    dias: 'Miércoles y viernes',
    horario: '8:00 p.m. – 10:00 p.m.',
    precio: 120000,
    cupos: 10,
    entrenadorOriginal: 4,
    imagenUrl: '/img/grupo-mayores.jpg',
    descripcion:
      'Categoría abierta para quienes quieren seguir compitiendo. El grupo representa a la escuela en la liga municipal de mayores.',
  },
];

async function main(): Promise<void> {
  // Vacía las tablas y reinicia los ids para que empiecen en 1, como en la Entrega 1
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "inscripciones", "grupos", "entrenadores", "categorias", "users" RESTART IDENTITY CASCADE',
  );

  // Usuarios de prueba: van en el README para que el profesor pruebe los roles
  await prisma.user.createMany({
    data: [
      {
        nombre: 'Administrador Titanes',
        email: 'admin@titanes.com',
        password: await bcrypt.hash('Admin12345', 10),
        role: Role.ADMIN,
      },
      {
        nombre: 'Usuario de Prueba',
        email: 'usuario@titanes.com',
        password: await bcrypt.hash('Usuario12345', 10),
        role: Role.USER,
      },
    ],
  });

  await prisma.categoria.createMany({ data: categorias });

  // Mapa: id de la Entrega 1 → id real en la base de datos
  const idReal = new Map<number, number>();
  for (const { idOriginal, ...datos } of entrenadores) {
    const creado = await prisma.entrenador.create({ data: datos });
    idReal.set(idOriginal, creado.id);
  }

  for (const { entrenadorOriginal, ...grupo } of grupos) {
    const entrenadorId = idReal.get(entrenadorOriginal);
    if (!entrenadorId) {
      throw new Error(`No existe el entrenador ${entrenadorOriginal} para "${grupo.nombre}"`);
    }
    await prisma.grupo.create({ data: { ...grupo, entrenadorId } });
  }

  console.log(
    `Seed listo: 2 usuarios, ${categorias.length} categorías, ${entrenadores.length} entrenadores, ${grupos.length} grupos`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });