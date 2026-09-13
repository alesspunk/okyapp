# OKY Cash — prototipo clickable

Flujo completo de OKY Cash / Cashback, de punta a punta y navegable.

## Cómo abrirlo

Doble clic en **`index.html`**. No necesita servidor, ni `npm install`, ni el
resto del repo: CSS, imágenes y tipografías van embebidas en el archivo.

También está publicado en
<https://claude.ai/code/artifact/a787a0ce-29c8-4466-9fbb-e0f846136104>.

## Qué se puede recorrer

Home → PLP de marca → PDP → carrito → paso de contacto → checkout →
métodos de pago → compra → Tus compras → detalle de la orden → Mi wallet →
OKY Cash.

Lo que responde de verdad, no es maqueta:

- **Cada marca tiene su PLP.** El Home lista quince marcas reales y todas
  abren su propia PLP —Brand Item, Plateu de catálogo y la lista de
  denominaciones con su ribbon—, y de ahí se entra al PDP con ese monto. Nike
  y Lyft siguen abriendo el PDP directo desde el strip táctico, que es el
  camino corto del flujo de cashback.
- **Tiers de cashback.** El monto del PDP se escribe y el ribbon y el saving
  bar cambian en vivo: hasta $50 y sobre $200 va 5% aqua, entre $50 y $200 va
  20% mostaza. Ambos productos arrancan en $51, dentro del rango especial.
- **Split payment.** OKY Cash se aplica con el checkbox del checkout y el
  monto se mueve con el slider de Métodos de pago; los chips, el summary y el
  saldo impreso en la Payment Card se recalculan juntos.
- **Combinar con cualquier tarjeta.** Al elegir la otra tarjeta tokenizada,
  esa pasa a agruparse con OKY Cash y la anterior baja como fila suelta.
- **Saldo real.** Se descuenta lo usado y se suma el cashback ganado; el
  historial de OKY Cash queda agrupado por mes.
- **Carruseles circulares.** Con más de un vale, checkout y detalle de la
  orden pasan de uno a otro sin salir de la pantalla.
- **La compra termina en tres tiempos.** El sello de *Compra exitosa*, con una
  píldora que adelanta cuánto OKY Cash dejó esa compra; la animación *Ganaste
  OKY Cash*; y el acuse. La animación se puede saltar tocándola.
- **El acuse no acumula.** *Tus compras* enseña solo las gift cards de la orden
  recién pagada. El repositorio que sí acumula es Mi wallet.

El cashback vive solo en el ribbon y el saving bar: nunca se suma al summary
de precio.

## De dónde sale el diseño

Figma **7600 - UX Exploration**, canvas "Cash Back" (`99101:20345`). Cada
pantalla lleva anotado su frame en la cabecera de
`stories/_shared/okyCashPrototype.js`.

El Home sigue la disposición del frame **"Theme 1"** (`99135:106016`): banda
de campaña con buscador y carrusel, strip táctico, píldora de OKY Cash, fila
de marcas con CTA, accesos por categoría y los HomeCard de marcas. La PLP
copia la anatomía de `plp-page.html`.

La animación de cashback es el `animacion.lottie` que exportó el equipo de
diseño ([LottieFiles](https://app.lottiefiles.com/share/0dc159a5-fea6-48c6-b8fd-70d0a0ade9af)),
aplanado a un JSON con sus webp en data URI y reproducido con lottie-web 5.12.2
(build light) hecho vendor en `stories/_shared/lottieLight.js`, porque el repo
no tiene npm.

Se compone con los componentes que ya existen en el Storybook —Discovery
Header, Card, Tactic Strip, Payment Card, History Card, Middle Card, Brand
Item, Summary Box, Discount Ribbon, Saving Bar, Plateu— más las reglas de
layout de `public/pdp-pages.css` y `public/checkout-pages.css`, que Storybook
no carga.

## Cómo regenerarlo

```bash
python3 tools/build-oky-prototype-standalone.py
```

Toma `stories/mars.css` y los módulos de `stories/_shared/`, y escribe:

- `images/oky-cash-prototype-demo.html` — el archivo suelto (el que se copia
  aquí como `index.html`)
- `tools/oky-cash-prototype-artifact.html` — la variante para publicar

Cada módulo va en su propio scope, las imágenes se vuelven data URIs y las
tipografías de Font Awesome se reapuntan a los `woff2` del paquete Free,
porque las rutas `/public/...` y `/flagpack/...` solo existen detrás de
Storybook.

## Pendiente

Las fotos de Nike, Lyft y Krispy Kreme que se pidieron por chat no están en
el repo. Hoy usa las de `images/promo-image*`. Para cambiarlas basta con
dejar los archivos en `images/` y apuntarlos en `PRODUCTS` y `TODAY_CARDS`.
