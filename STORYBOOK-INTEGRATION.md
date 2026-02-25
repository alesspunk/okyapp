# Storybook Integration (MARS DS)

## Qué se integró
- Framework: `@storybook/html-vite` (sin React, alineado al proyecto estático).
- Fuente de verdad conectada:
  - `DS-MARS2.pen` (IDs de componentes)
  - `ATOMIC-DESIGN-LIBRARY.md` (tokens, nomenclatura, catálogo)
  - `ATOMIC-DESIGN-LIBRARY.html` (estilos/markup de referencia)
- Estructura:
  - `.storybook/main.js`
  - `.storybook/preview.js`
  - `.storybook/preview-head.html`
  - `stories/*.stories.js`
  - `stories/mars.css`

## Cobertura inicial de historias
- `Exact HTML/Library`: fuente canónica 1:1 usando `ATOMIC-DESIGN-LIBRARY.html` completo (incluye navegación por sección: overview, tokens, icons, atoms, molecules, organisms, reference).
- `MARS/Overview`: mapa de integración y IDs principales.
- `Foundations/Tokens`: paleta base.
- `Atoms/Buttons`: playground + matriz.
- `Atoms/Inputs`: search + phone.
- `Molecules/Tiles`: tiles de servicio.
- `Organisms/Navigation`: bottom nav con regla FA (`fa-solid` solo activo).

## Regla de consistencia
- Si hay diferencia visual entre historias generadas y la librería real, tomar como verdad `Exact HTML/Library/*`.
- Las historias por categoría (`Atoms/*`, `Molecules/*`, `Organisms/*`) se consideran derivadas para navegación rápida.

## Scripts
- `npm run storybook`
- `npm run build-storybook`

## Nota de entorno
Si `npm install` falla por red (`ENOTFOUND registry.npmjs.org`), ejecuta instalación cuando tengas acceso a npm:

```bash
npm install
```

## Cómo extender (modo slice, Golden Prompt)
1. Elegir sección o ID del `.pen` (ej. `nf2yE`).
2. Crear una story nueva solo para ese slice.
3. Mantener cambios incrementales, sin reescribir todo.
