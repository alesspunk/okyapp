# Detective UX

Juego pequeño en navegador para entrenar uso del OKY Design System.

## Ejecutar localmente

Desde la raíz del repo:

```bash
open ux-detective-game/index.html
```

Alternativa: abrir `/Users/alessandroperez/Documents/OKY/ux-detective-game/index.html` en cualquier navegador.

## Qué incluye

- 12 componentes del DS tomados de stories existentes
- 3 preguntas de opción múltiple por componente (36 en total)
- Feedback inmediato después de cada respuesta
- Puntaje final y resumen de componentes fallados
- Pantallas de inicio, juego y cierre con opción de volver a jugar
- Registro de participante al inicio
- Leaderboard global en tiempo real (API compartida en Vercel)
- Ganador actual destacado en primer lugar
- Fallback local (`localStorage`) solo si el API no está disponible

## Mapeo de fuentes de componentes

- `stories/Atoms.Buttons.stories.js`
- `stories/Atoms.Inputs.stories.js`
- `stories/Atoms.Chips.stories.js`
- `stories/Atoms.DiscountRibbon.stories.js`
- `stories/Atoms.Radio.stories.js`
- `stories/Organisms.CarouselPromoBanners.stories.js`
- `stories/Molecules.PromoCode.stories.js`
- `stories/Molecules.Tiles.stories.js`
- `stories/Organisms.Lists.stories.js`
- `stories/Organisms.SummaryBox.stories.js`
- `stories/Organisms.Navigation.stories.js`
- `stories/Organisms.Headers.stories.js`

## Notas

- Usa CSS compartido del DS desde `stories/mars.css`.
- Sin librerías externas de JS ni frameworks.
- Los componentes/archivos existentes del repo no se modifican.

## Despliegue en Vercel (multiusuario)

1. Crear un store de **Vercel KV** en tu proyecto de Vercel.
2. Verificar que estén disponibles las variables de entorno:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
3. Conectar el repo de GitHub a Vercel.
4. Hacer push de estos cambios.
5. Abrir: `https://TU-DOMINIO/ux-detective-game`

Con esta configuración, cada sesión de jugador se registra individualmente y el leaderboard se actualiza en tiempo real para todos los participantes.
