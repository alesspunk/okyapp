# OKY Cash — prototipo clickable

Flujo completo de OKY Cash / Cashback, de punta a punta y navegable.

## Cómo abrirlo

Doble clic en **`index.html`**. No necesita servidor, ni `npm install`, ni el
resto del repo: CSS, imágenes y tipografías van embebidas en el archivo.

También está publicado en
<https://claude.ai/code/artifact/a787a0ce-29c8-4466-9fbb-e0f846136104>.

## Qué se puede recorrer

Home → PDP → carrito → paso de contacto → checkout → métodos de pago →
compra → Tus compras → detalle de la orden → Mi wallet → OKY Cash.

Lo que responde de verdad, no es maqueta:

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

El cashback vive solo en el ribbon y el saving bar: nunca se suma al summary
de precio.

## De dónde sale el diseño

Figma **7600 - UX Exploration**, canvas "Cash Back" (`99101:20345`). Cada
pantalla lleva anotado su frame en la cabecera de
`stories/_shared/okyCashPrototype.js`.

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
