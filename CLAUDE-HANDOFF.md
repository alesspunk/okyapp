# Traspaso para continuar el prototipo OKY Cash

Última actualización: 19 de septiembre de 2026.

Lee este archivo antes de modificar el prototipo. La rama de trabajo preparada para continuar es `feature/oky-cash-prototype`. Parte del mismo commit que producción: `f02f2a7651c250c0370305bca19da17ec8273561`.

## Estado publicado

La versión de producción incluye todos los cambios del prototipo hasta `bbb2adf`, las optimizaciones de imágenes, la eliminación de copias duplicadas en el build de Vercel y una variante web con recursos externos.

URLs del prototipo autónomo actual, que debe seguir funcionando sin servidor:

- Guatemala por defecto: <https://okyapp.vercel.app/prototypes/oky-cash/>
- Guatemala: <https://okyapp.vercel.app/prototypes/oky-cash/latam>
- Estados Unidos: <https://okyapp.vercel.app/prototypes/oky-cash/usa>

URLs de la variante web ligera, que reutiliza imágenes y fuentes con caché:

- Guatemala por defecto: <https://okyapp.vercel.app/prototypes/oky-cash-web/>
- Guatemala: <https://okyapp.vercel.app/prototypes/oky-cash-web/latam>
- Estados Unidos: <https://okyapp.vercel.app/prototypes/oky-cash-web/usa>

La variante web se genera durante el build de Vercel. No existe como archivo fuente versionado dentro de `prototypes/`; sale de `prototypes/oky-cash/index.html` y se escribe en `storybook-static/prototypes/oky-cash-web/`.

## Archivos fuente que se editan

- `stories/_shared/okyCashPrototype.js`: pantallas, estado, navegación y selección del mercado por URL.
- `stories/mars.css`: estilos del sistema y del prototipo.
- `stories/_shared/primeCards.js`: moléculas de cards.
- `stories/_shared/guaHome.js`: Home de Guatemala.
- `tools/build-oky-prototype-standalone.py`: genera las tres exportaciones autónomas.

Después de cambiar el código fuente, ejecuta siempre:

```bash
cd /Users/alessandroperezv./code/okyapp
python3 tools/build-oky-prototype-standalone.py
```

Ese comando regenera:

- `prototypes/oky-cash/index.html`
- `images/oky-cash-prototype-demo.html`
- `tools/oky-cash-prototype-artifact.html`

Los dos primeros deben ser idénticos. El archivo de Artifact tiene deliberadamente un wrapper distinto, pero debe contener el mismo JavaScript generado.

No edites esos HTML generados manualmente. Corrige el archivo fuente y vuelve a ejecutar el generador.

## Optimizaciones que hay que conservar

`package.json` ya no vuelve a copiar toda la carpeta `images/` dentro de otra carpeta `images/`. Storybook publica una sola copia en la raíz del output y `vercel.json` conserva las URLs anteriores mediante rewrites.

`tools/prepare-vercel-output.cjs`:

- copia únicamente los mockups, stories y prototipos adicionales necesarios;
- comprueba que las dos exportaciones autónomas coincidan antes de eliminar la copia redundante del output;
- invoca `tools/build-oky-prototype-web.cjs` para crear la variante web ligera.

`tools/build-oky-prototype-web.cjs` extrae los `data:` URI del HTML autónomo, busca recursos idénticos por SHA-256 dentro del output y reutiliza sus URLs. Solo crea un asset nuevo, con nombre basado en hash, cuando no existe otro idéntico. No sustituyas esta comparación por nombres de archivo: varias referencias comparten contenido.

La variante web tiene aproximadamente 0,88 MB de HTML, frente a 15,69 MB del HTML autónomo. La versión autónoma sigue existiendo a propósito para abrirla sin conexión y como respaldo.

Las imágenes `*-lossless.webp` son conversiones WebP sin pérdida. Se comprobó que conservan las dimensiones y los mismos píxeles RGBA que los PNG de origen. Los PNG originales siguen versionados por compatibilidad con otras pantallas.

Los primeros banners de USA y Guatemala usan `fetchpriority="high"`, `loading="eager"` y `decoding="async"`. Conserva esos atributos cuando cambies el markup del Home.

## Reglas de rutas y mercados

En `okyCashPrototype.js`, `initialScreen()` reconoce:

- `usa`, `eeuu`, `estados` como Estados Unidos;
- `gua`, `guate`, `guatemala`, `latam` como Guatemala.

`markCountryInUrl()` mantiene la familia de URL que se abrió:

- `/prototypes/oky-cash/...` para el HTML autónomo;
- `/prototypes/oky-cash-web/...` para la variante web.

Si modificas esta lógica, verifica al menos `/latam` y `/usa` en ambas familias. No hagas que la variante web cambie silenciosamente a la URL autónoma.

## Flujo seguro para los siguientes cambios

1. Confirma que estás en `feature/oky-cash-prototype` y que el árbol está limpio.
2. Edita los archivos fuente, no los HTML generados.
3. Ejecuta `python3 tools/build-oky-prototype-standalone.py`.
4. Comprueba que `prototypes/oky-cash/index.html` e `images/oky-cash-prototype-demo.html` sean idénticos.
5. Revisa visualmente USA y Guatemala, especialmente banners, cards, iconos, navegación y el flujo Home → PDP → carrito → checkout → compra → wallet.
6. Ejecuta `npm run build:vercel` cuando estén disponibles las credenciales del paquete privado de Font Awesome. Si la instalación local devuelve HTTP 401, no sustituyas la dependencia: usa el preview de Vercel para validar el build.
7. Prueba las seis URLs de país listadas arriba y comprueba que no existan recursos con 404.
8. Haz commit en esta rama y abre un PR hacia `main`. Vercel publicará producción cuando el PR se fusione.

## Verificaciones ya realizadas

- La versión autónoma publicada coincide byte por byte con `prototypes/oky-cash/index.html`.
- `/latam` abre Guatemala y `/usa` abre Estados Unidos.
- La variante web no contiene imágenes ni fuentes en base64.
- Se extrajeron 229 referencias a 142 recursos únicos; todos se publicaron con el mismo contenido que las referencias embebidas originales.
- La URL autónoma permaneció intacta al añadir la variante web.
- Los builds de producción `ea5fe5d6` y `f02f2a76` terminaron en estado READY.

## Historial de los cambios de optimización

- PR #1: <https://github.com/alesspunk/okyapp/pull/1>
- PR #2: <https://github.com/alesspunk/okyapp/pull/2>
- Producción actual: `f02f2a7651c250c0370305bca19da17ec8273561`

Antes de empezar una modificación nueva, ejecuta:

```bash
cd /Users/alessandroperezv./code/okyapp
git status
git branch --show-current
git pull --ff-only origin feature/oky-cash-prototype
```

El resultado esperado es la rama `feature/oky-cash-prototype` y un árbol limpio.
