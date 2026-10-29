# Titanes API — Escuela de Baloncesto

API REST de la escuela de baloncesto **Titanes** (Entrega 3 de Desarrollo de Aplicaciones Web, UdM). Es el backend del mismo sitio de la Entrega 1: el catálogo de programas, las categorías, los entrenadores y las inscripciones ahora viven en PostgreSQL.

- **API en producción:** https://titanes-api.onrender.com/api
- **Sitio (frontend):** https://titanes-web.vercel.app
- **Repositorio del frontend:** https://github.com/Juan-Manuel3132007/titanes-web

> Render (plan gratis) duerme el servicio tras 15 minutos sin uso: la primera petición puede tardar ~50 s.

## Tecnologías

Node.js · Express 5 · TypeScript · Prisma 6 · PostgreSQL (Neon) · JWT · bcrypt · Zod

## Arquitectura en cuatro capas

```
src/
├── domain/          → entidades, contratos (interfaces) y errores. No conoce Prisma ni Express
├── application/     → casos de uso y reglas de negocio (AuthService, GrupoService, InscripcionService…)
├── infrastructure/  → Prisma, bcrypt, JWT y configuración. Único lugar donde se usa Prisma
├── interface/http/  → rutas, controladores, validadores (Zod) y middlewares
└── container.ts     → conecta las implementaciones con los servicios
```

## Modelo de datos

| Tabla | Rol | Relación |
|---|---|---|
| `users` | usuarios con `role` ADMIN o USER, contraseña con hash bcrypt | — |
| `categorias` | Formativa, Competitiva, Elite y Mayores | — |
| `entrenadores` | los 4 entrenadores de la Entrega 1 | — |
| `grupos` | **catálogo**: los 6 programas de la Entrega 1 | FK → categorias, FK → entrenadores |
| `inscripciones` | **interacción**: el formulario de la Entrega 1 | FK → users, FK → grupos |

El seed (`prisma/seed.ts`) carga los datos reales del arreglo de `main.js` de la Entrega 1.

## Endpoints

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/auth/me` | Usuario autenticado |
| GET | `/api/grupos?page=&limit=&q=&categoria=&precioMin=&precioMax=` | Público, `{ pagination, data }` |
| GET | `/api/grupos/:id` | Público |
| POST · PUT · DELETE | `/api/grupos` · `/api/grupos/:id` | Solo admin |
| GET | `/api/categorias` · `/api/categorias/:clave` | Público |
| GET | `/api/entrenadores` | Público |
| POST | `/api/inscripciones` | Usuario autenticado (el dueño sale del token) |
| GET | `/api/inscripciones/mias` | Usuario autenticado: solo las suyas |
| GET | `/api/inscripciones?estado=` | Solo admin: todas |
| PATCH | `/api/inscripciones/:id/estado` | Solo admin |

El archivo `api.http` tiene peticiones de prueba (extensión REST Client de VS Code).

## Correr en local

```bash
npm install
cp .env.example .env      # y completa los valores
npx prisma migrate dev
npm run db:seed
npm run dev               # http://localhost:4000/api
npm test                  # pruebas de los middlewares
```

### Variables de entorno

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL (en Neon, la URL con `-pooler`) |
| `DIRECT_URL` | Conexión directa, la usa Prisma para las migraciones |
| `JWT_SECRET` | Clave para firmar los tokens |
| `JWT_EXPIRES_IN` | Duración del token, por ejemplo `1d` |
| `PORT` | Puerto (Render lo define solo) |
| `FRONTEND_URL` | Orígenes permitidos por CORS, separados por coma |

## Credenciales de prueba (solo para el ambiente de la entrega)

| Rol | Email | Contraseña |
|---|---|---|
| Admin | `admin@titanes.com` | `Admin12345` |
| User | `usuario@titanes.com` | `Usuario12345` |

## Decisiones técnicas

**Flujo completo de un login.** El formulario del frontend valida email y contraseña y llama a `authService.login`, que pasa por el cliente `http.ts` y hace `POST /api/auth/login`. En la API, `loginSchema` (Zod) valida el body; `AuthService` busca el usuario por email y compara la contraseña con `bcrypt.compare`. Si algo falla responde 401 con "Credenciales inválidas", el mismo mensaje si falla el email o la contraseña, para no revelar cuál existe. Si está bien, firma un JWT con `JWT_SECRET` y expiración, con solo `id` y `role` en el payload. El frontend guarda el token y desde ahí `http.ts` lo envía en `Authorization: Bearer <token>`. Cuando pido una ruta protegida como `GET /api/inscripciones/mias`, el middleware `autenticar` verifica la firma y la expiración, deja `req.user` en la petición y el controlador toma el `id` del usuario desde ahí.

**401 vs 403.** 401 es "no sé quién eres": no hay token, está mal firmado o ya venció. Ejemplo: `DELETE /api/grupos/1` sin header Authorization. 403 es "sé quién eres pero no tienes permiso": el token es válido pero el rol no alcanza. Ejemplo: `usuario@titanes.com` (USER) intenta `DELETE /api/grupos/1`; pasa `autenticar` pero `soloAdmin` lo frena.

**Por qué el payload es mínimo.** El JWT está firmado, no cifrado: cualquiera puede leer el payload pegándolo en jwt.io. Por eso solo lleva `id` y `role`.

**El dueño de la inscripción sale del token.** Si el `userId` viniera en el body, cualquiera podría crear inscripciones a nombre de otro. La API ignora cualquier `userId` que llegue en el body.

**Reglas de la Entrega 1 en el servidor.** Las tres reglas propias del formulario original también se validan en la API: programa sin cupos (409), edad fuera del rango del programa (400) y acudiente obligatorio para menores de 18 (400). Los errores llegan como `details: [{ campo, mensaje }]` para mostrarlos junto a cada campo.

**Pruebas automáticas.** `tests/auth.middleware.test.ts` prueba que `autenticar` responde 401 sin token, con un header que no es Bearer o con un token inválido, y que `soloAdmin` responde 403 a un USER y deja pasar a un ADMIN.

**Uso de IA.** Usé IA como apoyo para estructurar las capas y escribir el código. Tuve que corregir varias cosas: el primer modelo de datos no coincidía con los campos de la Entrega 1 y hubo que hacer una segunda migración; la política de ejecución de PowerShell bloqueaba npm; TypeScript 7 dio problemas de configuración y bajé a la 5; y el primer push salió con la cuenta de GitHub equivocada.

## Captura de Network

![Petición protegida con Authorization](docs/network.png)