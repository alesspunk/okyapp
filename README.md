# OKY Design System — Sistema de diseño MARS

Repositorio centralizado del sistema de diseño de OKY: design tokens, componentes (átomos, moléculas, organismos), tipografía, colores, iconografía, páginas de referencia y prototipos navegables. Su objetivo es estandarizar la experiencia visual y mantener la consistencia entre las aplicaciones del ecosistema OKY.

> **Fuente de verdad:** los tokens de [`stories/mars.css`](./stories/mars.css) (colores y tipografía, en `:root`) mandan, y MARS (Figma) los copia con los mismos nombres y valores. Para el markup de referencia de componentes legacy sigue valiendo `public/ATOMIC-DESIGN-LIBRARY.html` (`Exact HTML/Library`). Ver [`STORYBOOK-INTEGRATION.md`](./STORYBOOK-INTEGRATION.md).

## Contenido

- [Stack](#stack)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos](#requisitos)
- [Inicio rápido](#inicio-rápido)
- [Scripts](#scripts)
- [Despliegue (Vercel)](#despliegue-vercel)
- [Tokens: color y tipografía](#tokens-color-y-tipografía)
- [Estilos de OKY Cash](#estilos-de-oky-cash)
- [Prototipo OKY Cash](#prototipo-oky-cash)
- [Servidor MCP de Figma](#servidor-mcp-de-figma)
- [Cómo agregar o modificar componentes](#cómo-agregar-o-modificar-componentes)
- [Flujo de trabajo y convenciones](#flujo-de-trabajo-y-convenciones)
- [Seguridad y secretos](#seguridad-y-secretos)
- [Solución de problemas](#solución-de-problemas)

## Stack

| Área | Tecnología |
|---|---|
| Documentación de componentes | Storybook 8 (`@storybook/html-vite`), sin React en las stories |
| Addons | `addon-essentials`, `addon-links`, `addon-a11y` |
| Iconografía | Font Awesome Pro (kit `@awesome.me/kit-b5a8f622db`), Font Awesome Free y kit de iconos custom |
| Banderas | `flagpack` |
| Hosting | Vercel (salida estática de Storybook) |
| Herramientas | Node.js (scripts `.cjs`), Python 3 (build del prototipo standalone) |
| Integración con diseño | Figma + servidor MCP propio (`figma-mcp/`, TypeScript) |

## Estructura del repositorio

```text
.storybook/          Configuración de Storybook (main.js, preview.js, preview-head.html)
stories/             Stories por nivel atómico
  Foundations.*      Tokens
  Atoms.*            Botones, inputs, chips, ribbons, radio, slider, toasts...
  Molecules.*        Cards, modal, payment card, tiles, saving bar...
  Organisms.*        Navegación, headers, carruseles, strips, summary box...
  Pages.*            Pantallas completas (Checkout, PLP, PDP, Category, OKY Cash)
  _shared/           Módulos JS reutilizables por stories y por el prototipo
  mars.css           Estilos base del sistema MARS
public/              Assets servidos tal cual: ATOMIC-DESIGN-LIBRARY.{html,md}, CSS de páginas, fuentes FA
images/              Imágenes, logos, banners y flags usados por stories y mockups
prototypes/oky-cash/ Prototipo clickable de OKY Cash (HTML autocontenido + README)
figma-mcp/           Servidor MCP para la API de Figma (TypeScript)
tools/               Scripts de build (prototipo standalone/web y salida para Vercel)
ai/prompts/          Prompts de apoyo para flujos UX asistidos por IA
mockup-*.html, *-page.html   Mockups HTML estáticos (PLP, PDP, checkout, success)
DS-MARS2.pen         Archivo de diseño con los IDs de componentes
vercel.json          Build, rewrites y headers de caché
```

## Requisitos

- **Node.js** 18+ (recomendado LTS vigente) y npm.
- **Python 3** (solo para regenerar el prototipo standalone).
- **`NPM_TOKEN`** de Font Awesome Pro: el `.npmrc` lo lee para instalar `@awesome.me/kit-b5a8f622db` desde `https://npm.fontawesome.com/`.

## Inicio rápido

```bash
# 1. Clonar y entrar a la rama del sprint de OKY Cash
git clone git@github.com:merkado-group-llc/oky-design-system.git
cd oky-design-system
git checkout feature/oky-cash-prototype

# 2. Token de Font Awesome Pro (pídelo al equipo; NUNCA lo subas al repo)
export NPM_TOKEN=<token>

# 3. Instalar dependencias
npm install

# 4. Levantar Storybook en http://127.0.0.1:7007
npm run storybook
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run storybook` | Storybook en modo desarrollo (`127.0.0.1:7007`, puerto exacto, telemetría desactivada) |
| `npm run build-storybook` | Compila Storybook a `storybook-static/` |
| `npm run build:vercel` | Build de Storybook + post-proceso para Vercel (`tools/prepare-vercel-output.cjs`) |
| `python3 tools/build-oky-prototype-standalone.py` | Regenera el prototipo OKY Cash standalone |
| `node tools/build-oky-prototype-web.cjs [dir]` | Genera la variante web del prototipo con assets externalizados |

## Despliegue (Vercel)

Configurado en [`vercel.json`](./vercel.json):

- **Build:** `npm run build:vercel`
- **Output:** `storybook-static`
- Variable de entorno requerida en Vercel: `NPM_TOKEN`.

El script `prepare-vercel-output.cjs`:

1. Verifica que `images/oky-cash-prototype-demo.html` y `prototypes/oky-cash/index.html` sean **idénticos**. Si difieren, el build falla a propósito.
2. Copia los mockups HTML, `stories/mars.css` y `Organisms.Carrusel.template.js` a la salida.
3. Publica `prototypes/` y genera la variante web (`prototypes/oky-cash-web/`) con assets de caché inmutable.

Rutas publicadas relevantes:

| Ruta | Contenido |
|---|---|
| `/` | Storybook |
| `/atomic` | Librería atómica HTML |
| `/prototypes/oky-cash/{usa,latam,gua}` | Prototipo standalone por país |
| `/prototypes/oky-cash-web/{usa,latam,gua}` | Variante web del prototipo |

## Tokens: color y tipografía

Todos viven en `:root` de `stories/mars.css` y se ven en Storybook en **Foundations › Tokens**.

- **Color:** 148 tokens (`--primary-main`, `--secondary-light`, `--oky-cash-dark`…). En MARS son variables de la colección «OKY Tokens»; el primer `-` se vuelve `/` (`--secondary-light` → `secondary/light`), salvo `base/white`, `base/black`, `line/divider`, `surface/background` y `oky-cash/*`.
- **Tipografía:** 111 tokens en **Nunito Sans** (no se usa Lato). Cada uno es un par `font` + `letter-spacing` con los valores exactos de MARS (estilos de texto «OKY/…»):

```css
.mi-texto {
  font: var(--type-subtitle1);              /* 700 16px/22.88px "Nunito Sans" */
  letter-spacing: var(--type-subtitle1-ls);
}
```

Reglas:

- No inventes colores ni tamaños: usa el token que ya existe. Si falta uno, agrégalo en `mars.css` **y** en MARS con el mismo nombre.
- El interlineado de los tokens viene de Figma; no lo redondees.
- Las clases `.token-*` antiguas se mantienen por compatibilidad. En código nuevo usa `--type-*`.

## Estilos de OKY Cash

Los componentes de OKY Cash (Pastilla, Balance Strip, Saving Bar, Discount Ribbon tipo OKY Cash, Super Ribbon y el chip «Ganado» de Movimiento) aceptan un estilo de color mediante una clase:

| Clase | Fondo | Texto |
|---|---|---|
| `is-estilo-aqua` *(default actual)* | `--secondary-light` | `--oky-cash-dark` |
| `is-estilo-aqua-oscuro` | `--secondary-dark` | `--tier-base-bg` |
| `is-estilo-oscuro` | degradado `--oky-cash-oscuro` | blanco |
| `is-estilo-dark-night` | negro | `--secondary-light` |
| `is-estilo-plata` | degradado `--oky-cash-plata` | `--primary-main` |

- En JS, `estiloClass(estilo)` de `stories/_shared/okyCashParts.js` devuelve la clase, y `OKY_CASH_ESTILOS` lista los cinco.
- Cada componente tiene la story **«OKY Cash · Estilos»** para compararlos.
- El estilo final está **en decisión** con el equipo de diseño. Hasta entonces todo sale en Aqua, como hoy.
- El aqua claro queda **solo para descuento** (Guatemala, donde no se gana OKY Cash): esas piezas no llevan clase de estilo.

## Prototipo OKY Cash

Flujo navegable de punta a punta: Home → PDP → carrito → checkout → métodos de pago → compra → wallet → OKY Cash. Se abre con doble clic en `prototypes/oky-cash/index.html`, sin servidor ni `npm install`. Detalle y reglas de negocio en [`prototypes/oky-cash/README.md`](./prototypes/oky-cash/README.md).

Para regenerarlo tras cambiar `stories/mars.css` o `stories/_shared/`:

```bash
python3 tools/build-oky-prototype-standalone.py
cp images/oky-cash-prototype-demo.html prototypes/oky-cash/index.html   # deben quedar idénticos
```

## Servidor MCP de Figma

`figma-mcp/` expone la API de Figma como herramientas MCP (stdio): `get_figma_file`, `get_figma_nodes`, `get_figma_components`, `get_figma_component_sets`, `get_figma_styles`, `export_figma_nodes`, `get_figma_image_fills`.

```bash
cd figma-mcp
npm install
npm run build
FIGMA_TOKEN=<token_personal_figma> npm start    # o: npm run dev
```

Requiere la variable `FIGMA_TOKEN`. Acepta tanto la URL completa de Figma como el file key.

## Cómo agregar o modificar componentes

1. Identifica la sección o el ID del componente en `DS-MARS2.pen` / `ATOMIC-DESIGN-LIBRARY.md`.
2. Crea o edita **solo esa story** en `stories/` con la nomenclatura `<Nivel>.<Componente>.stories.js` (ej. `Atoms.Chips.stories.js`).
3. Reutiliza módulos de `stories/_shared/` y los tokens de `stories/mars.css` (`--type-*` para texto, tokens de color para todo lo demás); no dupliques estilos.
4. Verifica contra `Exact HTML/Library` y revisa la pestaña **Accessibility** (addon a11y).
5. Cambios incrementales: evita reescribir historias existentes.

Regla de iconos: en la navegación, `fa-solid` se usa **solo** para el estado activo.

## Flujo de trabajo y convenciones

- Ramas: `main` y `feature/oky-cash-prototype` (sprint de OKY Cash). Trabaja en ramas `feature/*`, `fix/*` o `docs/*` y abre Pull Request. La rama destino de los PR (`main` o una `develop` nueva) está por definir con el equipo.
- Commits en formato [Conventional Commits](https://www.conventionalcommits.org/es/) (`feat:`, `fix:`, `docs:`, `chore:`).
- Antes de abrir el PR: `npm run build-storybook` debe pasar sin errores.
- Si tocas el prototipo OKY Cash, regenera y confirma que ambos HTML sean idénticos.

## Seguridad y secretos

- **Nunca** hagas commit de `NPM_TOKEN` ni `FIGMA_TOKEN`. El `.npmrc` usa `${NPM_TOKEN}` por esa razón.
- `node_modules/` y `storybook-static/` están en `.gitignore`.
- Las fuentes Font Awesome Pro son de uso licenciado: no redistribuir fuera de la organización.

## Solución de problemas

| Síntoma | Causa / solución |
|---|---|
| `E401` / `403` al instalar `@awesome.me/kit-...` | Falta o es inválido `NPM_TOKEN`. Expórtalo antes de `npm install`. |
| `ENOTFOUND registry.npmjs.org` | Sin acceso a red/proxy. Reintenta con conexión a npm. |
| Puerto 7007 ocupado | Storybook usa `--exact-port`; libera el puerto o cambia el script. |
| Build de Vercel falla con `Prototype exports differ` | Sincroniza `images/oky-cash-prototype-demo.html` con `prototypes/oky-cash/index.html`. |
| PostCSS `Unknown word` en el build | Un bloque se insertó dentro de un comentario de `mars.css`. Revisa que cada `/* … */` cierre antes del código. |
| Iconos Pro no se ven | Verifica que las fuentes de `public/fontawesome-pro/` estén presentes. |

## Licencia

Repositorio privado de Merkado Group LLC. Uso interno.
