# OKY Truth-Lie (Multiplayer)

Mini app multijugador para sesiones de Zoom: cada jugador envía 3 enunciados (2 verdades + 1 mentira), el host controla la ronda y revela la mentira.

## Alcance

- Carpeta aislada: `games/truth-lie`
- No requiere cambios en el resto del repo
- Despliegue compatible con Vercel
- Persistencia con Vercel Postgres (`@vercel/postgres`)
- Polling en vivo cada 2.5s

## Rutas

Con `basePath` configurado en `/games/truth-lie`:

- `/games/truth-lie` → Landing
- `/games/truth-lie/join` → Formulario de jugador
- `/games/truth-lie/waiting` → Sala de espera del jugador
- `/games/truth-lie/host` → Dashboard del host (protegido con `HOST_CODE`)
- `/games/truth-lie/board` → Board público

## Variables de entorno

Crea `games/truth-lie/.env.local` con:

```bash
HOST_CODE=tu_codigo_host

# Vercel Postgres (las agrega Vercel automáticamente al conectar Storage)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
```

## Desarrollo local

```bash
cd games/truth-lie
npm install
npm run db:migrate
npm run dev
```

Abrir: `http://localhost:3000/games/truth-lie`

## Base de datos

- Schema SQL: `db/schema.sql`
- Script de migración: `npm run db:migrate`
- También hay creación automática de tabla al primer request (`ensureSchema`), para evitar caída si olvidan migrar.

Tabla principal:
- `truth_lie_entries`
  - `display_name`, `statement_one/two/three`, `lie_index`
  - `status` (`queued`, `active`, `revealed`, `archived`)
  - `submitted_at`, `round_started_at`, `revealed_at`, `archived_at`
  - `player_token` (sesión individual de jugador)

## Seguridad y validaciones

- Host protegido por `HOST_CODE` en header `x-host-code`.
- Sin email ni datos sensibles.
- Sanitización básica de texto en backend.
- Límite de longitud para nombre/enunciados.
- Rate limit liviano en memoria por IP (join/host/board).

## Integración de estilo OKY

Se usa tema local en `styles/oky-theme.css` con tokens y estilo púrpura alineados al DS MARS.

Referencia de tokens DS en el repo:
- `stories/mars.css`

## Deploy en Vercel

1. En Vercel, crea proyecto nuevo apuntando a este repo.
2. Configura **Root Directory**: `games/truth-lie`.
3. Conecta **Vercel Postgres** al proyecto.
4. Define `HOST_CODE` en Environment Variables.
5. Deploy.

Al desplegar, la app quedará en la misma basePath configurada (`/games/truth-lie`).
