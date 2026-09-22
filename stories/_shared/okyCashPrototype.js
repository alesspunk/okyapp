/* ─────────────────────────────────────────────────────────
   OKY Cash — Prototipo clickable end-to-end
   Pages/OKY Cash/Prototype

   Fuente de verdad: Figma "7600 - UX Exploration",
   canvas "Cash Back" (99101:20345). Frames leídos con el MCP:

     Home                   99105:31149
     PDP Lyft               99105:32284
     PDP Nike tier naranja  99105:37017   ($200 → 20%)
     PDP Nike tier aqua     99140:13571   ($201 → 5%)
     Carrito (drawer)       99105:38191
     Checkout               99105:31768
     Métodos de pago        99105:41588
     Progress Bar           99140:56017
     Success (Lottie)       99140:56018
     Tus compras            99140:56031
     Mi wallet              99105:43773
     OKY Cash (dashboard)   99135:103474
     Onboarding Contactos   99140:47037

   Reglas del diseño que se respetan aquí:
   · El monto se escribe en un input con label flotante
     "Desde 10 hasta 1,000"; arranca en 0.
   · El cashback vive SOLO en el ribbon y el Saving Bar; nunca
     se suma al summary de precio (regla del frame 99105:32415).
   · Tier: ≤$50 y >$200 → aqua #a8faf5/#00524d al 5%.
     $50–$200 → naranja al 20%. En el CARRITO el chip siempre va
     aqua, sin importar el tier (verificado en 99105:38191).
   · El carrito NO es una pantalla: es un drawer que entra desde
     la derecha con backdrop, y deja fuera saving bar y navbar.
   · La navbar va fija abajo en TODAS las pantallas.
   · El ícono de wallet del header abre "Mi wallet"; el coin de la
     navbar abre "OKY Cash", que es otra página (99135:103474).

   Iconografía: se usa solo fa-solid / fa-regular. Las clases
   fa-light dependen de las webfonts Pro servidas desde /public,
   que no existen fuera de Storybook y dejaban los iconos en
   blanco (back arrow y navbar incluidos).

   Reutiliza sin reimplementar: .homecard-* (mockup de homepage),
   .middle-card-*, .brand-item-atom, .summary-box, .discount-ribbon,
   .saving-bar, .payment-method-*, .dual-molecule, .plateu-*,
   .input-dinamic, .bottom-nav, .btn, History Card y Payment Card.
───────────────────────────────────────────────────────── */

import { findPaymentCard, renderPaymentCard } from "./paymentCards";
import { renderHistoryCard } from "./historyCards";
import { renderDiscoveryHeader } from "./discoveryHeader";
import { renderCardOrganism } from "./cardOrganism";
import { renderClaritaPet } from "./primeCards";
import { GUA_HOME_MARKUP } from "./guaHome";
import { renderFlag } from "./flag";
import { lottie } from "./lottieLight";
import { OKY_CASH_WIN_ANIMATION } from "./okyCashWinAnimation";

/* ── Catálogo ────────────────────────────────────────────── */

const PRODUCTS = {
  nike: {
    key: "nike",
    label: "Nike",
    cardTitle: "Nike Gift Card",
    art: "oky-card-nike.png",
    bg: "#ef4c26",
    hero: "photo-nike-lossless.webp",
    min: 10,
    max: 1000,
    legal: true,
  },
  lyft: {
    key: "lyft",
    label: "Lyft",
    cardTitle: "Lyft Gift Card",
    art: "oky-card-lyft.png",
    bg: "#1d0c17",
    hero: "promo-image1-lossless.webp",
    min: 10,
    max: 1000,
    legal: false,
  },
};

/* Marcas del Home, con el arte de gift card que ya vive en images/.
   Todas abren el mismo PDP que Nike y Lyft —monto editable, ribbon de
   cashback y "Agregar"— arrancando en $5.00. */
const BRANDS = {
  googleplay: { label: "Google Play", art: "google.webp", bg: "#ffffff", rate: 5 },
  starbucks: { label: "Starbucks", art: "starbucks.webp", bg: "#ffffff", rate: 10 },
  /* CVS salía pixelado —su arte es un webp de 14 KB—; Home Depot viene
     a 1200px y aguanta cualquier tamaño. */
  homedepot: { label: "Home Depot", art: "homedepot.png", bg: "#f68b1f", rate: 5 },
  apple: { label: "Apple", art: "apple.webp", bg: "#f2f2f5", rate: 5 },
  /* Macy's y Ulta Beauty comparten la dinámica de Nike y Lyft: sin
     porcentaje propio, su cashback lo decide el monto mientras el
     reloj de Spooky Deals siga vivo. */
  macys: { label: "Macy's", art: "macys.webp", bg: "#ffffff", rate: 0 },
  ulta: { label: "Ulta Beauty", art: "ulta.png", bg: "#ffffff", rate: 0 },
  target: { label: "Target", art: "target.webp", bg: "#99464a", rate: 8 },
  seveneleven: { label: "7 Eleven", art: "7eleven.png", bg: "#ea572d", rate: 6 },
  burgerking: { label: "Burger King", art: "burguerking.webp", bg: "#f6ead5", rate: 9 },
  ihop: { label: "IHOP", art: "ihop.webp", bg: "#669482", rate: 7 },
  mcdonalds: { label: "McDonald's", art: "mcdonalds.webp", bg: "#fe0015", rate: 6 },
  dominos: { label: "Domino's", art: "dominos.png", bg: "#006aa6", rate: 8 },
  applebees: { label: "Applebee's", art: "applebees.webp", bg: "#eac7cb", rate: 8 },
  amazon: { label: "Amazon", art: "amazon.png", bg: "#141c26", rate: 7 },
  ebay: { label: "eBay", art: "ebay.png", bg: "#00186b", rate: 7 },
  xbox: { label: "Xbox", art: "xbox.png", bg: "#4d9d4c", rate: 7 },
  /* Marcas del strip de moda. Gap y Old Navy no tienen arte de gift
     card en el repo: van con una card de texto en images/ —fácil de
     reemplazar por la buena en cuanto exista. */
  /* Deportes & Apparel se anuncia como bloque: cada marca conserva su
     tasa y la card enseña la mejor de las tres. */
  adidas: { label: "Adidas", art: "adidas.png", bg: "#1c1919", rate: 9 },
  gap: { label: "Gap", art: "brand-gap.svg", bg: "#0b2a4a", rate: 8 },
  oldnavy: { label: "Old Navy", art: "brand-oldnavy.svg", bg: "#12284c", rate: 10 },
};

/* Diseños de la tarjeta de OKY Cash (Figma 99135:103902). La molécula
   Payment Card ya acepta fondo sólido o degradado por `buildStyle`, así
   que cada diseño es solo eso más su arte. */
const CARD_DESIGNS = [
  {
    key: "black",
    label: "Lo que va, vuelve",
    note: "Cada regalo que envíes a tu familia volverá a ti como un ripple effect.",
    /* La card negra del frame va entera: el remolino sangra hasta los
       bordes y no cabe como arte suelto encima del fondo. */
    art: null,
    style: {
      backgroundMode: "solid",
      /* El color va debajo del arte: si por el recorte o el redondeo
         asoma un píxel, es del color de la tarjeta y no del fondo. */
      backgroundColor: "url(oky-card-design-black.png) center/85% no-repeat #000000",
      showBorder: false,
      pattern: null,
    },
  },
  {
    key: "bubbles",
    label: "Burbujas",
    note: "Las monedas suben solas, como lo que ganas sin darte cuenta.",
    /* Diseño completo del frame: va de fondo a sangre. Sin arte encima
       y sin el patrón de arcos ni el borde de la molécula, que sobre
       una ilustración a sangre se leían como un marco pálido. */
    art: null,
    style: {
      backgroundMode: "solid",
      backgroundColor: "url(oky-card-design-bubbles.png) center/cover no-repeat #7034ab",
      showBorder: false,
      pattern: null,
    },
  },
  {
    key: "teal",
    label: "Turquesa",
    note: "El verde agua del cashback, para que se note lo que ganas.",
    /* El patrón va lavado sobre el turquesa —sin color propio y a media
       opacidad— para que se lea como textura del fondo y no como una
       foto pegada encima, que es como está en el frame. */
    art: "oky-card-coins-pattern.png",
    artClass: "is-washed",
    style: {
      backgroundMode: "gradient",
      gradientFrom: "#0ab5b1",
      gradientTo: "#109794",
      gradientAngle: 92,
      borderColor: "#0ab5b1",
    },
  },
  {
    key: "purple",
    label: "Morado OKY",
    note: "El lazo de monedas que no se acaba: lo que ganas vuelve a ti.",
    /* 95277:35388. El lazo va en su sitio del frame (0/36 de 243x162
       sobre 328x214), pegado al borde izquierdo y por debajo del
       saldo. */
    art: "oky-card-coins-loop.png",
    artClass: "is-loop",
    style: { backgroundMode: "solid", backgroundColor: "#5a289b", borderColor: "#5a289b" },
  },
  {
    key: "coins",
    label: "Ola de monedas",
    note: "Una ola de monedas cruzando el negro: lo que se va juntando.",
    /* La cinta va en su sitio del frame (95300:3952): a media altura,
       de lado a lado, sin tocar el saldo ni el CTA. */
    art: "oky-card-coins-band.png",
    artClass: "is-band",
    style: {
      backgroundMode: "solid",
      backgroundColor: "#000000",
      showBorder: false,
      pattern: null,
    },
  },
];

const findCardDesign = (key) => CARD_DESIGNS.find((d) => d.key === key) || CARD_DESIGNS[0];

/* Monto con el que abre el PDP de una marca nueva. */
const BRAND_DEFAULT_AMOUNT = 5;

/* Tigo es la única marca comprable de la home de Guatemala. No entra
   por BRANDS porque no vive en ninguna parrilla del home de USA: su
   PDP es la página propia que ya existe en Pages/PDP Pages, y ahí el
   monto se elige con slider. */
const TIGO_DEFAULT_AMOUNT = 50;

/* En el flujo de Guatemala la compra va a un contacto ya conocido, así
   que el checkout no pregunta para quién es: lo dice. */
const GUA_RECIPIENT = { name: "Daniel Paz", phone: "+502 6578-8744" };
const USA_RECIPIENT = { name: "Para mí", phone: "+1 407 287-8787" };

/* Quién recibe lo sale del carrito, no del país en el que se esté: una
   compra de Guatemala va a un contacto y una de USA es para uno mismo,
   y el orden en que se hagan no puede cambiarlo. */
function orderCountry(state) {
  const items = state.cart.length
    ? state.cart.map((item) => item.productKey)
    : state.lastOrder.map((p) => p.productKey);
  /* Sin nada de donde deducirlo manda dónde se está: dar por hecho
     USA mandaba a la tienda equivocada a quien estaba en Guatemala. */
  if (!items.length) return state.country === "gua" ? "gua" : "usa";
  return items.some((key) => (PRODUCTS[key] || {}).country === "gua") ? "gua" : "usa";
}

/* Las dos marcas que arrancan dentro de la banda del descuento
   especial, y el monto con el que abren mientras la promo vive. */
const PROMO_PRODUCTS = ["nike", "lyft", "macys", "ulta"];
const PROMO_DEFAULT_AMOUNT = 51;

/* La promo de "Spooky Deals" dura tres minutos: mientras corre, el
   rango de $50 a $200 paga 20%; al vencer, todo vuelve al 5% base.
   Sigue siendo corta a propósito —la prueba de usabilidad quiere ver
   qué hace la persona con el reloj encima— pero con dos no alcanzaba
   a recorrer la compra antes de que venciera. */
const PROMO_MS = 3 * 60 * 1000;

/* El reloj se detiene mientras la persona está en el carrito o
   ajustando el checkout: que se le venza a media compra sería una
   trampa, no la ansiedad que busca la prueba. */
function promoPaused(state) {
  return state.cartOpen || state.screen === "checkout" || state.screen === "methods";
}

/* mm:ss para el Super Ribbon "Por tiempo". */
function countdownLabel(msLeft) {
  const total = Math.max(0, Math.ceil(msLeft / 1000));
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/* Toda marca es también un producto: así el PDP, el carrito y el
   checkout funcionan igual venga de donde venga. */
Object.entries(BRANDS).forEach(([key, brand]) => {
  PRODUCTS[key] = {
    key,
    label: brand.label,
    cardTitle: `${brand.label} Gift Card`,
    art: brand.art,
    hero: brand.art,
    min: 5,
    max: 1000,
    /* Porcentaje propio de la marca: no depende del monto como en
       Nike y Lyft, que son los que enseñan la regla de tiers. */
    rate: brand.rate,
    /* Color de fondo del arte, para que la card no deje blanco
       asomando por las esquinas. */
    bg: brand.bg,
    legal: true,
  };
});

/* Las marcas de la promo arrancan en 10 como Nike y Lyft: su banda de
   descuento empieza en 50 y un mínimo de 5 no dice nada ahí. */
["macys", "ulta"].forEach((key) => {
  PRODUCTS[key].min = 10;
});

/* Tigo, la marca de la home de Guatemala. No da cashback —no lleva
   ribbon ni saving bar en ningún paso—, pero sí se puede pagar con el
   OKY Cash acumulado. Su PDP es la página propia, con slider y costo
   por servicio. */
PRODUCTS.tigo = {
  key: "tigo",
  label: "Tigo",
  cardTitle: "Recargas Tiempo Aire",
  art: "tigo.webp",
  hero: "tigo.webp",
  min: 5,
  max: 100,
  rate: 0,
  /* Sin descuento: ni ribbon ni saving bar, y no suma OKY Cash. */
  noCashback: true,
  country: "gua",
  bg: "#00377b",
  legal: false,
  /* Comprado, se guarda con los vales y no con las gift cards. */
  wallet: "vales",
};

/* Secciones de marcas del Home (Figma "Theme 1", 99135:106016). */
const HOME_SECTIONS = [
  { title: "Novedades", keys: ["googleplay", "starbucks", "homedepot", "apple", "macys", "target"] },
  {
    title: "Comida Rápida",
    keys: ["seveneleven", "burgerking", "ihop", "mcdonalds", "dominos", "applebees"],
  },
];

/* Fila de marcas con su chip de cashback, bajo un título con CTA. */
const GEEKY_DEALS = [
  { key: "amazon", rate: 7 },
  { key: "ebay", rate: 7 },
  { key: "xbox", rate: 7 },
];

/* Accesos por categoría (Molecules/Tiles · Macro/Tile). */
const HOME_CATEGORIES = [
  { label: "Comida", icon: "tile-comida.png" },
  { label: "Diversión", icon: "tile-diversion.png" },
  { label: "Experiencias", icon: "tile-experiencias.png" },
  { label: "Hogar", icon: "tile-hogar.png" },
  { label: "Regalos", icon: "tile-regalos.png" },
  { label: "Tecnología", icon: "tile-tecnologia.png" },
];

/* Tarjetas de "Solo por hoy" (MARS 7295:52037). */
/* Strip de moda, debajo de Geeky Deals: mismo patrón que Spooky Deals
   —foto, logo encima y ribbon— pero sin cronómetro. */
/* "Deportes & Apparel" usa el Home Card With Photo (Figma
   101239:26172): foto a la derecha y el logo de la marca encima, a la
   izquierda, con su nombre debajo. */
const STYLE_CARDS = [
  { key: "adidas", photo: "photo-adidas.png" },
  { key: "gap", photo: "photo-gap.png" },
  { key: "oldnavy", photo: "photo-oldnavy.png" },
];

const TODAY_CARDS = [
  { key: "macys", photo: "promo-image2-lossless.webp" },
  { key: "ulta", photo: "promo-image-ulta.jpg" },
];

/* Tier del cashback. Verificado contra los dos frames de Nike:
   $200 → "Ganas 20%" naranja · $201 → "Ganas 5%" aqua.

   Solo Nike y Lyft se mueven con el monto; el resto de las marcas
   trae su propio porcentaje fijo y el tier se arma con él. */
function getTier(amount, product, promoLive = true) {
  if (product && product.noCashback) {
    return { rate: 0, ribbon: "", bar: "" };
  }
  if (product && product.rate) {
    const promo = product.rate >= 20;
    return {
      rate: product.rate / 100,
      ribbon: promo ? "is-tier-promo" : "is-tier-base",
      bar: promo ? "is-tier-promo" : "",
    };
  }
  /* El 20% solo existe mientras la promo esté viva. */
  if (promoLive && amount > 50 && amount <= 200) {
    return { rate: 0.2, ribbon: "is-tier-promo", bar: "is-tier-promo" };
  }
  return { rate: 0.05, ribbon: "is-tier-base", bar: "" };
}

/* Lo que guarda el wallet además de gift cards. Cada sección tiene su
   propio mazo: el carrusel del detalle recorre lo de esa sección, no
   todo lo que haya en la billetera. */
const WALLET_EXTRAS = {
  /* Las recargas viven con los vales: son lo mismo para quien las
     guarda —algo canjeable que no es una gift card de marca— y dos
     secciones de un elemento cada una no le servían a nadie. */
  /* Tigo no va de muestra: aparece aquí solo cuando se compra, como
     tarjeta nueva. */
  vales: [
    { key: "pollogranjero", label: "Pollo Granjero", art: "pollo-granjero.webp", bg: "#f5c518", count: 2, amounts: [12, 20] },
    { key: "dominosgt", label: "Domino's", art: "dominos.png", bg: "#006aa6", count: 1, amounts: [20] },
    { key: "pollocampero", label: "Pollo Campero", art: "pollo-campero.webp", bg: "#ed761c", count: 1, amounts: [15] },
    /* Clave propia: "burgerking" ya es la gift card de USA, y son dos
       cosas distintas —un vale salvadoreño y una gift card
       estadounidense de la misma marca—. */
    { key: "burgerkingsv", label: "Burger King", art: "burguerking.webp", bg: "#f6ead5", count: 1, amounts: [18] },
  ],
  servicios: [
    { key: "eegsa", label: "EEGSA", art: "eggsa.webp", bg: "#ffffff", count: 1, amounts: [32] },
    { key: "tigohogar", label: "Tigo Internet Residencial", art: "tigo.webp", bg: "#00377b", count: 1, amounts: [45] },
  ],
};

/* Un wallet vacío no se puede probar: el mazo arranca como el de
   alguien que lleva meses usando la app. Los vales de una misma marca
   no se apilan uno encima de otro —eso sería la misma card repetida—
   sino que se acumulan en una sola con su contador; `amounts` guarda
   lo que vale cada uno, y el detalle los recorre de a uno. */
const WALLET_VOUCHERS = [
  { key: "krispy", label: "Krispy Kreme", art: "oky-card-krispy.png", bg: "#ffffff", live: false, amounts: [25, 10] },
  { key: "lyft", label: "Lyft", art: "oky-card-lyft.png", bg: "#1d0c17", live: true, amounts: [15, 25, 8] },
  { key: "underarmour", label: "Under Armour", art: "oky-card-underarmour.png", bg: "#ed1b24", live: false, amounts: [50] },
  { key: "nike", label: "Nike", art: "oky-card-nike.png", bg: "#ef4c26", live: true, amounts: [40] },
];

/* El mazo del detalle va de vale en vale, no de marca en marca: una
   card con contador 3 esconde tres vales, y deslizando se ven los
   tres con su propio monto. */
function expandUnits(list) {
  return list.flatMap((v) => {
    const amounts = v.amounts && v.amounts.length ? v.amounts : [v.amount];
    const units = v.units && v.units.length ? v.units : amounts.map((_, i) => i);
    return amounts.map((amount, i) => ({ ...v, amount, unit: units[i] }));
  });
}

/* Compartir y archivar son decisiones sobre un vale concreto, no sobre
   la marca: tener una Nike archivada no puede mandar al archivo la
   siguiente Nike que se compre. De ahí que el estado se guarde por
   vale —"nike#0"— y no por marca. */
const unitId = (key, unit = 0) => `${key}#${unit}`;

/* Un vale recién comprado y el mismo vale visto en el wallet son la
   misma cosa: esto dice qué número de vale de su marca le toca, para
   que compartirlo desde "Tus compras" y compartirlo desde el wallet
   acaben marcando exactamente el mismo. Los montos de una marca van
   primero los de muestra y después los comprados, del más reciente al
   más antiguo, que es como los arma walletVouchers. */
function unitOfPurchase(state, purchase) {
  const key = purchase.productKey;
  const section = (PRODUCTS[key] || {}).wallet || "gift";
  const demo =
    section === "gift" ? ((WALLET_VOUCHERS.find((v) => v.key === key) || {}).amounts || []).length : 0;
  /* Por orden de compra, no al revés: las compras solo se añaden al
     final, así que contando desde la primera el índice de un vale ya
     comprado no se mueve cuando se compra otro de la misma marca.
     Contando desde la última se corrían todos, y con ellos lo
     compartido, lo archivado y lo visto, que se guardan por ese
     índice. */
  const mine = state.purchases.filter((p) => p.productKey === key);
  const at = mine.findIndex((p) => p.id === purchase.id);
  return demo + Math.max(at, 0);
}

function unitGroup(state, key, unit = 0) {
  const id = unitId(key, unit);
  if (state.archivedVouchers.includes(id)) return "archivados";
  return state.sharedVouchers.includes(id) ? "compartidos" : "activos";
}

/* Tarjetas tokenizadas. La seleccionada es la que se combina con
   OKY Cash; la otra baja como fila suelta (Figma 99105:41895). */
const CARDS = [
  { key: "visa", label: "**2111", mark: "fa-cc-visa", variant: "Molecule/Payment Card/Visa" },
  { key: "mastercard", label: "**4566", mark: "fa-cc-mastercard", variant: "Molecule/Payment Card/Mastercard" },
];

const money = (v) => `$${(Number(v) || 0).toFixed(2)}`;
/* El monto grande de la card va sin decimales cuando es redondo
   ("$ 200"), como en Figma, y con dos cuando no ("$ 12.50"). */
const bigAmount = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2));
const moneyField = (v) => (Number(v) || 0).toFixed(2);
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
/* Índice circular para los carruseles. */
const wrap = (i, n) => (n <= 0 ? 0 : ((i % n) + n) % n);

const MONTHS_SHORT = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
const MONTHS_LONG = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
];

function stamp(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return `${String(d.getDate()).padStart(2, "0")} / ${MONTHS_SHORT[d.getMonth()]} / ${d.getFullYear()}`;
}

/* Título del grupo del historial: el mes en curso es "ESTE MES" y el
   resto se nombra "JULIO 2026", como en 99135:103474. */
function monthGroup(offsetDays = 0) {
  const now = new Date();
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
    return "ESTE MES";
  }
  return `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

/* ── Estado ──────────────────────────────────────────────── */

/* Enlace directo a una de las dos homes: #usa / #gua, o ?home=usa.
   Sirve para mandar a cada persona de la prueba a la que toque sin
   explicarle cómo cambiar de país. */
const USA_ALIASES = ["usa", "eeuu", "estados"];
const GUA_ALIASES = ["gua", "guate", "guatemala", "latam"];

function initialScreen() {
  /* Vale el último tramo de la ruta —/prototypes/oky-cash/usa, /latam—
     y también el hash o la query, que es lo que se puede usar dentro de
     un Artifact. El tramo se compara entero: así ninguna carpeta que
     lleve esas letras dentro decide el país por accidente. */
  const loc = typeof location === "undefined" ? null : location;
  if (!loc) return "homegua";

  const segment = loc.pathname.replace(/\/+$/, "").split("/").pop().toLowerCase();
  if (USA_ALIASES.includes(segment)) return "home";
  if (GUA_ALIASES.includes(segment)) return "homegua";

  const raw = `${loc.hash}${loc.search}`.toLowerCase();
  if (USA_ALIASES.some((a) => raw.includes(a))) return "home";
  if (GUA_ALIASES.some((a) => raw.includes(a))) return "homegua";
  return "homegua";
}

/* Y al cambiar de país el enlace se actualiza, para poder copiarlo tal
   como está en pantalla. */
function markCountryInUrl(country) {
  if (typeof history === "undefined" || !history.replaceState) return;
  try {
    /* Donde el prototipo vive en su propia ruta, el enlace que queda en
       la barra es esa misma ruta; en un Artifact, el hash. */
    const trimmed = location.pathname.replace(/\/+$/, "");
    const segment = trimmed.split("/").pop().toLowerCase();
    const known = USA_ALIASES.includes(segment) || GUA_ALIASES.includes(segment);
    const base = known ? trimmed.slice(0, trimmed.lastIndexOf("/")) : trimmed;
    if (/\/prototypes\/oky-cash$/.test(base)) {
      history.replaceState(null, "", `${base}/${country === "usa" ? "usa" : "latam"}`);
      return;
    }
    history.replaceState(null, "", `#${country}`);
  } catch (error) {
    /* Algunos hosts no dejan tocar la URL; no es crítico. */
  }
}

function createInitialState(userType) {
  const returning = userType === "returning";
  const startingCash = returning ? 56 : 5;

  return {
    userType,
    okyCashBalance: startingCash,
    /* El prototipo abre en Guatemala; USA se descubre por el folder. La
       prueba puede empezar en cualquiera de las dos con un enlace. */
    screen: initialScreen(),
    /* País del flujo en curso: cambia con el folder y decide las dos
       cosas que no se comparten —el modal de para quién es y los datos
       de quien recibe—. */
    country: initialScreen() === "home" ? "usa" : "gua",
    params: {},
    history: [],
    /* Arranca en 51, dentro del rango de descuento especial (20%);
       al vencer la promo vuelve a los 5 del resto de marcas. */
    amounts: PROMO_PRODUCTS.reduce((acc, key) => ({ ...acc, [key]: PROMO_DEFAULT_AMOUNT }), {}),
    cart: [],
    cartOpen: false,
    checkoutIndex: 0,
    okyCashEnabled: false,
    okyCashApplied: 0,
    /* Código promocional aplicado a la orden (solo Guatemala), lo que
       se está tecleando en el modal y si el último intento falló. */
    promo: null,
    promoOpen: false,
    promoDraft: "",
    promoError: false,
    selectedCard: "visa",
    /* Repositorio acumulado de gift cards: alimenta Mi wallet. */
    purchases: returning
      ? [{ id: "seed", productKey: "lyft", amount: 20, cashback: 1, used: 5, date: stamp(6) }]
      : [],
    /* Solo las gift cards de la última orden: es lo que se ve en
       "Tus compras" al terminar de pagar. No acumula. */
    lastOrder: [],
    lastEarned: 0,
    /* Historial de ejemplo. Las entradas de una misma orden van juntas y
       en orden, que es como las agrupa la pantalla: las órdenes con más
       de un movimiento traen su desglose por marca detrás del toque. */
    activity: [
      /* Agosto */
      { date: stamp(18), group: monthGroup(18), amount: "+ $2.80", order: "Orden #01112442", kind: "credit", label: "Amazon", value: 2.8 },
      { date: stamp(18), group: monthGroup(18), amount: "+ $1.27", order: "Orden #01112442", kind: "credit", label: "Starbucks", value: 1.27 },
      { date: stamp(24), group: monthGroup(24), amount: "+ $2.10", order: "Orden #01112441", kind: "credit", label: "Target", value: 2.1 },
      { date: stamp(33), group: monthGroup(33), amount: "+ $1.50", order: "Orden #01112439", kind: "credit", label: "Apple", value: 1.5 },
      { date: stamp(33), group: monthGroup(33), amount: "+ $0.95", order: "Orden #01112439", kind: "credit", label: "CVS", value: 0.95 },
      { date: stamp(33), group: monthGroup(33), amount: "- $8.00", order: "Orden #01112439", kind: "debit", label: "Pagado con OKY Cash", value: -8,
        detail: [
          { label: "Apple", amount: "- $5.00" },
          { label: "CVS", amount: "- $3.00" },
        ] },
      { date: stamp(41), group: monthGroup(41), amount: "+ $2.24", order: "Orden #01112438", kind: "credit", label: "Google Play", value: 2.24 },
      /* Julio */
      { date: stamp(48), group: monthGroup(48), amount: "+ $1.35", order: "Orden #01112434", kind: "credit", label: "Burger King", value: 1.35 },
      { date: stamp(48), group: monthGroup(48), amount: "+ $0.90", order: "Orden #01112434", kind: "credit", label: "McDonald's", value: 0.9 },
      { date: stamp(52), group: monthGroup(52), amount: "+ $1.85", order: "Orden #01112430", kind: "credit", label: "eBay", value: 1.85 },
      { date: stamp(60), group: monthGroup(60), amount: "- $12.00", order: "Orden #01112427", kind: "debit", label: "Pagado con OKY Cash", value: -12,
        detail: [{ label: "eBay", amount: "- $12.00" }] },
    ],
    decisionSeen: false,
    /* El folder del Discovery Header se colapsa al scrollear el home. */
    headerCollapsed: false,
    /* Pestaña abierta del wallet y secciones de estado desplegadas
       dentro de ella. Las dos las decide la entrada al wallet; esto es
       solo el arranque para quien lo abra sin pasar por su botón. */
    /* El aviso de "Agrega más, paga menos" sale una sola vez, con el
       primer producto de comida que entra al carrito. */
    savingsSheet: false,
    savingsSeen: false,
    savingsFromPdp: false,
    walletTab: "gift",
    openGroups: ["activos"],
    /* Aviso de cambio de marketplace; guarda a dónde se iba. */
    countrySheet: null,
    /* Qué línea del carrito tiene la caja de cantidad abierta. */
    qtyOpen: null,
    /* Qué país enseña cada lado del folder. Cambia la bandera y el
       código de la pestaña; el catálogo es el del lado, compartido
       entre los países de esa región. */
    market: { left: "US", right: "GT" },
    /* Qué lado abrió la hoja de marketplaces, o null si está cerrada. */
    marketSheet: null,
    /* Aviso de "agregado al carrito", que se apaga solo. */
    addedToast: false,
    /* Lo que estaba abierto antes de filtrar, para devolverlo al
       quitar el filtro. */
    openBeforeFilter: null,
    /* Presentación de USA: la lluvia de banderas y el recorrido guiado.
       Se ven una sola vez, la primera que se entra al marketplace. */
    usaIntro: false,
    tourStep: null,
    /* Qué recorrido está abierto: el de la home o el de la card. */
    tourDeck: null,
    /* Clarita se calla en el vale que estás mirando; al abrir otro
       vuelve a ofrecerse. Ella no se va nunca. */
    claritaMuted: false,
    /* Clarita en la home de USA: se asoma al acabar las banderas y
       ofrece el recorrido. guideAsk dice si está preguntando; sin él
       sigue ahí, callada. */
    guideOn: false,
    guideAsk: false,
    guideAway: false,
    tourCount: false,
    tourReady: false,
    tourFlag: false,
    tourConfetti: false,
    tourSeen: false,
    /* Cuántas cards se han pedido ya en cada pestaña y estado del
       wallet, con la clave "pestaña:estado". */
    walletShown: {},
    /* Vales que ya se compartieron y vales archivados (por key). Los dos
       primeros arrancan compartidos para que el filtro de compartidas y
       el sello del vale se vean sin tener que compartir algo antes. */
    sharedVouchers: ["underarmour#0", "pollocampero#0"],
    archivedVouchers: ["nike#0"],
    /* Hoja de confirmación abierta, si hay: {type, key}. */
    sheet: null,
    /* Categoría por la que se filtra la pestaña abierta del wallet;
       vacío es "todas". Servicios no se filtra, se ordena. */
    walletFilter: "",
    serviceOrder: "fecha",
    /* Aviso efímero al pie: {text, action, label, key}. */

    /* Correlativo de órdenes para el historial de OKY Cash. */
    orderSeq: 0,
    /* Marcas cuyo vale ya se abrió: las demás llevan el punto rojo. */
    seenVouchers: [],
    /* Cashback que aún no se ha mirado: hace saltar la moneda de la
       navbar. El saldo con el que se arranca cuenta igual que el
       recién ganado —nadie lo ha visto todavía—, así que la moneda
       avisa desde el primer momento en los dos mercados y se calla al
       entrar, con las mismas reglas que después de una compra. */
    cashUnseen: startingCash > 0,
    /* Órdenes con el desglose abierto en la actividad. */
    openOrders: [],
    /* Diseño de la tarjeta de OKY Cash y el que se está hojeando. */
    cardDesign: "black",
    cardDesignIndex: 0,
    /* La promo no arranca con el prototipo: empieza cuando termina la
       presentación de USA, para que se vea el momento en que el reloj
       se pone en marcha. Hasta entonces el strip es un Super Deals
       normal al 5%. */
    promoEndsAt: Date.now() + PROMO_MS,
    promoLive: false,
    /* Ventana corta para animar el arranque del cronómetro. */
    promoStarting: false,
    /* Ventana corta tras el vencimiento, para el aviso del strip. */
    promoEnded: false,
    /* La promo es de una sola vez: una vez vencida no vuelve, aunque se
       repita la presentación de USA. */
    promoSpent: false,
    promoSettling: false,
    /* El chip "Nuevo" sobre USA es solo aviso: en cuanto se entra una
       vez, no vuelve a aparecer. */
    usaSeen: false,
    recipient: "",
  };
}

/* ── Comida de Guatemala ─────────────────────────────────
   Productos de precio fijo que se compran por unidades, no gift cards
   de monto libre: ni slider, ni cashback. Lo que sí tienen es un costo
   por servicio que baja cuanto más se lleva, y ahí está el gancho.
   (94757:61696, 94758:72010) */
const FOOD_PRODUCTS = [
  {
    key: "mcd-pollo",
    brand: "mcdonalds",
    label: "Hamburguesa de Pollo",
    art: "mcd-hamburguesa-pollo.png",
    price: 5.69,
    /* Precio de lista: la diferencia con el de venta es ahorro y se
       suma al total ahorrado de la orden. */
    was: 8.69,
  },
  {
    key: "mcd-cajita",
    brand: "mcdonalds",
    label: "Cajita Feliz de Nuggets de Pollo",
    art: "mcd-cajita-feliz.png",
    price: 5.2,
  },
  {
    key: "mcd-combo",
    brand: "mcdonalds",
    label: "4 Hamburguesas de Pollo y 4 Sodas",
    art: "mcd-combo-4.png",
    price: 12.69,
  },
  {
    key: "mcd-cuarto",
    brand: "mcdonalds",
    label: "Hamburguesa Cuarto de Libra",
    art: "mcd-cuarto-libra.png",
    price: 6.69,
  },
  /* La lista tiene que dar para hacer scroll: con cuatro filas cabía
     entera y no se probaba el desplazamiento. */
  {
    key: "mcd-mcnuggets",
    brand: "mcdonalds",
    label: "McNuggets de 10 piezas y Papas Medianas",
    art: "mcd-cajita-feliz.png",
    price: 7.45,
    was: 9.95,
  },
  {
    key: "mcd-familiar",
    brand: "mcdonalds",
    label: "Combo Familiar de 6 Hamburguesas",
    art: "mcd-combo-4.png",
    price: 18.9,
  },
  {
    key: "mcd-doble",
    brand: "mcdonalds",
    label: "Doble Cuarto de Libra con Queso",
    art: "mcd-cuarto-libra.png",
    price: 8.25,
  },
];

/* Cada producto de comida costaría $2.99 de servicio por su cuenta.
   Llevando más, el costo se reparte: el primero sale a $0.99, dos a
   $2.98 y de tres en adelante hay tope. Cuanto más lleva el carrito,
   más se ahorra — que es justo lo que la promesa dice. */
const SERVICE_FEE_UNIT = 2.99;
const SERVICE_FEE_STEPS = [0, 0.99, 2.78];
const serviceFeeOf = (n) =>
  n <= 0 ? 0 : n < SERVICE_FEE_STEPS.length ? SERVICE_FEE_STEPS[n] : SERVICE_FEE_UNIT;
const serviceFeeList = (n) => n * SERVICE_FEE_UNIT;

FOOD_PRODUCTS.forEach((food) => {
  PRODUCTS[food.key] = {
    ...food,
    bg: "#ffffff",
    cardTitle: food.label,
    country: "gua",
    wallet: "vales",
    /* Como Tigo: en Guatemala todavía no se gana OKY Cash, pero sí se
       puede pagar con el que ya se tiene. */
    noCashback: true,
    rate: 0,
    food: true,
    /* Paga costo por servicio, como todo lo que se entrega. */
    service: true,
  };
});

/* ── Marcas de Guatemala que se compran por monto ──────────
   Un vale en quetzales que se paga en dólares: mismo PDP, mismo rango
   y mismo costo por servicio para todas, y lo único suyo es el logo.
   Las claves llevan prefijo porque varias de estas marcas ya existen
   en el catálogo de USA con otra ficha. */
const GUA_RATE = 7.55;
const GUA_VALE_MIN = 10;
const GUA_VALE_MAX = 1000;
const GUA_VALE_DEFAULT = 50;

/* Se teclea en quetzales y se cobra en dólares: el carrito y el
   checkout hablan en dólares, así que la conversión pasa una sola vez,
   al entrar al carrito. */
const toUsd = (q) => Math.round(((Number(q) || 0) / GUA_RATE) * 100) / 100;
/* Mil quetzales se leen "1,000", no "1000". */
const bigQuetzal = (v) => (Number.isInteger(v) ? Number(v).toLocaleString("en-US") : v.toFixed(2));

const GUA_BRANDS = [
  { key: "gua-pollocampero", label: "Pollo Campero", art: "pollo-campero.webp" },
  { key: "gua-burgerking", label: "Burger King", art: "burguerking.webp" },
  { key: "gua-pollogranjero", label: "Pollo Granjero", art: "pollo-granjero.webp" },
  { key: "gua-ihop", label: "IHOP", art: "ihop.webp" },
  { key: "gua-dominos", label: "Domino's", art: "dominos.png" },
  { key: "gua-claro", label: "Claro", art: "claro.webp" },
];

GUA_BRANDS.forEach((brand) => {
  PRODUCTS[brand.key] = {
    ...brand,
    /* La card enseña qué es; el carrito, de quién es. */
    cardTitle: "OKYVale",
    cartTitle: `OKYVale ${brand.label}`,
    hero: brand.art,
    bg: "#ffffff",
    min: GUA_VALE_MIN,
    max: GUA_VALE_MAX,
    rate: 0,
    /* Precio regular: no llevan descuento, así que no hay ribbon ni
       tachado en ningún paso. Como Tigo, tampoco dan OKY Cash, pero
       se pueden pagar con el que ya se tiene. */
    noCashback: true,
    country: "gua",
    wallet: "vales",
    quetzal: true,
    service: true,
    legal: false,
  };
});

/* Cuántas unidades del carrito pagan costo por servicio: la comida y
   los vales de monto de Guatemala. Las recargas de Tigo no, ni nada de
   USA, así que tampoco cuentan para el tope. */
const cartServiceCount = (state) =>
  state.cart.reduce((n, item) => n + ((PRODUCTS[item.productKey] || {}).service ? item.qty || 1 : 0), 0);

const cartServiceFee = (state) => serviceFeeOf(cartServiceCount(state));

/* Lo ahorrado en esta orden: lo que se deja de pagar en costo por
   servicio más los descuentos de precio de cada producto. */
function cartSavings(state) {
  const n = cartServiceCount(state);
  const onFee = serviceFeeList(n) - serviceFeeOf(n);
  const onPrice = state.cart.reduce((sum, item) => {
    const product = PRODUCTS[item.productKey] || {};
    return sum + (product.was ? (product.was - product.price) * (item.qty || 1) : 0);
  }, 0);
  return onFee + onPrice + appliedPromo(state);
}

const cartSubtotal = (state) =>
  state.cart.reduce((sum, item) => sum + item.amount * (item.qty || 1), 0);

/* Cuántas cosas lleva el carrito de verdad: dos hamburguesas iguales
   son una línea pero dos productos, y el contador del resumen habla
   de lo que se lleva, no de cómo está agrupado. */
const cartCount = (state) => state.cart.reduce((n, item) => n + (item.qty || 1), 0);

/* Lo que sumaria el carrito a precio de lista. Si es mas que el
   subtotal real es que algo lleva descuento, y el resumen lo ensena
   igual que el costo por servicio: el de lista tachado delante. */
const cartSubtotalList = (state) =>
  state.cart.reduce((sum, item) => {
    const product = PRODUCTS[item.productKey] || {};
    return sum + (product.was || item.amount) * (item.qty || 1);
  }, 0);

/* El par "antes / ahora" con el que se pintan subtotal y servicio:
   mismo esquema en los dos, para que la rebaja se lea igual. */
function dealAmount(now, was) {
  return was > now + 0.001
    ? `<span class="oky-flow-fee-was">${money(was)}</span><span class="oky-flow-fee-now">${money(now)}</span>`
    : money(now);
}

/* Códigos promocionales de Guatemala. Hoy solo vive uno; el objeto
   deja sitio para más sin tocar el flujo, y el valor es lo que rebaja
   en dólares. Se comparan en minúsculas: en el campo se teclea como
   se quiera. */
const PROMO_CODES = { verano26: 10 };
const promoValue = (code) => PROMO_CODES[String(code || "").trim().toLowerCase()] || 0;

/* Lo que pide el carrito antes de cualquier descuento de pago. */
const cartGross = (state) => cartSubtotal(state) + cartServiceFee(state);

/* Lo que rebaja el código. Nunca deja el total en negativo, y no
   convive con OKY Cash: el descuento que se aplica de último apaga
   al otro. */
function appliedPromo(state) {
  if (!state.promo) return 0;
  return Math.min(promoValue(state.promo), cartGross(state));
}

const cartTotal = (state) => Math.max(cartGross(state) - appliedPromo(state), 0);
const cartCashback = (state) =>
  state.cart.reduce((sum, item) => sum + item.cashback * (item.qty || 1), 0);

/* Saldo que se va a aplicar a esta orden. */
function appliedOkyCash(state) {
  if (!state.okyCashEnabled) return 0;
  return clamp(state.okyCashApplied, 0, Math.min(state.okyCashBalance, cartTotal(state)));
}

/* Lo que esta orden le quita al saldo de OKY Cash y lo que acaba
   pagando la tarjeta. El carrito y el checkout enseñan el mismo
   resumen, así que sacan la cifra del mismo sitio: si cada uno la
   calculara por su cuenta, acabarían discrepando. */
function orderCash(state) {
  if (!state.okyCashEnabled) return 0;
  return Math.min(state.okyCashApplied || state.okyCashBalance, cartTotal(state), state.okyCashBalance);
}

const orderDue = (state) => Math.max(cartTotal(state) - orderCash(state), 0);

/* Lo que se anuncia como ahorro de la orden. Lo que el carrito rebaja
   por sí solo —costo por servicio repartido, productos con descuento y
   el código promocional— más lo que el saldo quita de la cuenta:
   marcar OKY Cash también es pagar menos, y la barra de abajo tiene que
   decirlo. Las barras de "Llena el carrito" se quedan con cartSavings:
   ahí todavía no hay saldo elegido y lo que se anuncia es lo que se
   gana llenando. */
const orderSavings = (state) => cartSavings(state) + orderCash(state);

/* El cashback se gana sobre dinero real: la parte que sale del saldo de
   OKY Cash no genera más OKY Cash. Se reparte en proporción a lo que
   acaba pagando la tarjeta. */
function earnedCashback(state) {
  const total = cartTotal(state);
  if (total <= 0) return 0;
  const byCard = total - appliedOkyCash(state);
  return cartCashback(state) * (byCard / total);
}

/* ── Piezas compartidas ─────────────────────────────────── */

function statusBar() {
  return `
    <div class="status-bar">
      <div>9:41</div>
      <div style="display:flex;gap:8px">
        <i class="fa-solid fa-signal" aria-hidden="true"></i>
        <i class="fa-solid fa-wifi" aria-hidden="true"></i>
        <i class="fa-solid fa-battery-full" aria-hidden="true"></i>
      </div>
    </div>
  `;
}

/* Píldora de saldo de OKY Cash. Vive en el home y se repite al pie
   de "Tus compras", donde el saldo acaba de cambiar por la compra. */
function cashStrip(state) {
  return `
    <button class="oky-flow-cash-strip" data-action="nav:okycash" type="button">
      <img src="oky-cash-coin.png" alt="" />
      <span class="oky-flow-cash-strip-copy">
        <span class="oky-flow-cash-strip-amount"><span>$</span><strong>${state.okyCashBalance.toFixed(2)}</strong></span>
        <span class="oky-flow-cash-strip-label">OKY Cash</span>
      </span>
      <span class="btn btn-primary btn-small" style="pointer-events:none">Explora</span>
    </button>
  `;
}

/* Un solo botón de atrás para todas las pantallas. Por defecto
   deshace el historial; el PDP lo apunta directo al home. */
function backButton(action = "back") {
  return `
    <button class="oky-flow-header-icon" data-action="${action}" type="button" aria-label="Atrás">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
    </button>
  `;
}

function titledHeader(title, { trailing = "", trailingAction = "" } = {}) {
  /* El icono de la derecha es decorativo salvo que se le pase una
     acción; entonces pasa a ser botón (el carrito de la PLP). */
  const attrs = trailingAction
    ? `class="oky-flow-header-icon" data-action="${trailingAction}" role="button" tabindex="0"`
    : `class="oky-flow-header-icon" aria-hidden="true"`;
  return `
    <header class="oky-flow-header">
      ${backButton()}
      <h1 class="oky-flow-title">${title}</h1>
      <span ${attrs}>${trailing ? `<i class="fa-solid ${trailing}"></i>` : ""}</span>
    </header>
  `;
}

/* Header del PDP/Checkout: atrás + carrito con su contador. */
function productHeader(state, { backAction = "back", title = "", small = false } = {}) {
  const count = state.cart.length;
  return `
    <header class="oky-flow-header">
      ${backButton(backAction)}
      <span class="oky-flow-title${small ? " is-small" : ""}"${title ? "" : ' aria-hidden="true"'}>${title}</span>
      <button class="header-icon header-icon-bitmap header-icon-bitmap-cart" data-action="open-cart"
        type="button" aria-label="Carrito">
        <img class="header-icon-bitmap-image header-icon-bitmap-cart-image" src="Cart-3d-icon.png" alt="" />
        ${count ? `<span class="header-icon-indicator-dot"></span>` : ""}
      </button>
    </header>
  `;
}

/* Navbar: fija abajo en todas las pantallas. Solo Home y el coin
   de OKY Cash navegan; el resto queda atenuado. */
function navbar(active, state = {}) {
  const item = (key, label, icon, action) => `
    <div class="nav-item ${key === active ? "active" : ""} ${action ? "" : "is-dim"}"
      ${action ? `data-action="${action}" role="button" tabindex="0"` : ""}>
      ${
        /* El item activo va en Solid y el resto en Light; OKY Cash es
           siempre la moneda, que es una imagen. */
        key === "okycash"
          ? `<span class="oky-flow-coin-3d ${state.cashUnseen ? "is-spinning" : ""}">
              <img class="oky-flow-coin" src="oky-cash-coin.png" alt="" />
              <span class="oky-flow-coin-back" aria-hidden="true">$</span>
            </span>`
          : `<i class="fa-${key === active ? "solid" : "light"} fa-${icon}${
              /* Font Awesome Free no trae la casita en contorno —es
                 exclusiva de Pro— y caía a la sólida: el Home se veía
                 relleno aun sin estar activo. Se dibuja el contorno
                 del propio glifo, que es lo que haría la cara Light. */
              key === "home" && key !== active ? " oky-flow-nav-hollow" : ""
            }" style="font-size:20px" aria-hidden="true"></i>`
      }
      <span class="nav-label">${label}</span>
    </div>
  `;

  return `
    <nav class="oky-flow-navbar">
      <div class="bottom-nav">
        ${item("home", "Home", "house", "nav:country-home")}
        ${item("notif", "Notificaciones", "bell", null)}
        ${item("okycash", "OKY Cash", null, "nav:okycash")}
        ${item("ayuda", "Ayuda", "messages", null)}
        ${item("menu", "Menú", "bars", null)}
      </div>
    </nav>
  `;
}

/* `ending` pinta el aviso de promo vencida: la barra se pone en rojo y
   lo dice, y al momento vuelve a su color de siempre. */
function savingBar(cashback, tier, copy, { ending = false, settled = false, timer = null, info = false } = {}) {
  if (ending) {
    return `
      <div class="oky-flow-savingbar">
        <div class="saving-bar is-oky-cash is-ending">
          <div class="saving-bar-copy">
            <span><i class="fa-solid fa-hourglass-end" aria-hidden="true"></i>&nbsp;Promo terminada</span>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="oky-flow-savingbar">
      <div class="saving-bar is-oky-cash ${tier.bar} ${settled ? "is-settled" : ""}">
        ${
          /* La (i) va enfrente del reloj, en la esquina contraria, y
             toma el color del tier igual que el texto: no se toca, solo
             dice que el número de la barra tiene letra pequeña detrás.
             La explicación está a un paso, en el checkout. */
          info ? `<span class="saving-bar-info" aria-hidden="true"><i class="fa-solid fa-circle-info"></i></span>` : ""
        }
        ${
          timer
            ? `<span class="saving-bar-timer">
                <i class="fa-solid fa-clock" aria-hidden="true"></i>
                <span data-role="promo-countdown" data-format="short">${timer}</span>
              </span>`
            : ""
        }
        <div class="saving-bar-copy"><span>${copy(money(cashback))}</span></div>
      </div>
    </div>
  `;
}

/* Las cuatro paradas del recorrido de bienvenida a USA. Cada una
   apunta a algo que ya está en pantalla; el texto dice para qué sirve,
   no qué es. */
/* Dos paradas y numeradas: el recorrido ya no lo abre un punto suelto
   sino Clarita, así que aquí solo queda contar la historia —dónde
   aparece lo que compras y dónde ver lo que ganas. */
const TOUR_STEPS = [
  { target: ".header-icon-bitmap-wallet-wrap", label: "Compra Gift Cards y encuéntralas aquí" },
  { target: ".oky-flow-navbar [data-action='nav:okycash']", label: "Mira cuánto OKY Cash ganas" },
];

/* El recorrido de la gift card de USA: lo abre Clarita desde la propia
   card y enseña en qué orden se usa lo que hay ahí. Cada variante tiene
   el suyo porque cada una se canjea distinto —una se pega en una URL y
   la otra se muestra en caja con su PIN—, y señalar algo que esa card
   no tiene sería mandar a buscar lo que no está. */
const VOUCHER_TOURS = {
  /* Un vale de marca se canjea en el local: primero cómo, después qué
     enseñar y al final el código que te van a pedir. */
  vale: [
    { target: ".middle-card-footer-end", label: "Mira cómo se canjea" },
    { target: ".middle-card-footer-start", label: "Enséñalo en caja" },
    { target: ".prime-card-bottom-line", nth: 0, label: "Y dicta este código" },
  ],
  /* La recarga ya se aplicó: no hay nada que canjear, hay que enseñar
     cuánto se fue y a qué número. */
  tigo: [
    { target: ".middle-card-amount", label: "Esto fue lo que recargaste" },
    { target: ".prime-card-bottom-line", nth: 0, label: "Y este es el número que lo recibió" },
  ],
  /* Un servicio pagado tampoco se canjea: lo que queda son los dos
     números con los que se reclama si algo sale mal. */
  servicio: [
    { target: ".middle-card-amount", label: "Tu pago ya está aplicado" },
    { target: ".middle-card-footer-single", label: "Este es el número de la orden" },
    { target: ".prime-card-bottom-line", nth: 0, label: "Y este el ID que pide la boleta" },
  ],
  url: [
    { target: ".middle-card-footer-single", label: "Mira cómo funciona" },
    { target: ".prime-card-bottom-line", nth: 0, label: "Copia el código" },
    { target: ".prime-card-bottom-line.is-action", label: "Pégalo aquí" },
  ],
  pin: [
    { target: ".middle-card-footer-single", label: "Mira cómo funciona" },
    { target: ".prime-card-bottom-line", nth: 0, label: "Copia el código" },
    { target: ".prime-card-bottom-line", nth: 1, label: "Y el PIN, si te lo piden" },
  ],
};

const TOUR_DECKS = { home: TOUR_STEPS, ...VOUCHER_TOURS };

function tourStepsOf(state) {
  return TOUR_DECKS[state.tourDeck] || TOUR_STEPS;
}

/* Cerrado el recorrido, la home sube al inicio y ahí se celebra: la
   bandera entra cuando ya se ve la portada, no sobre media página. */
/* La vuelta al inicio se anima a mano. El scroll suave del navegador
   no sirve aquí: pedido en el mismo cuadro en el que se restaura la
   posición sale de golpe, y diferido tardaba más de un segundo en
   recorrer 475px. Con duración propia la subida se ve igual en
   escritorio y en móvil, y la cuenta atrás puede encadenarse a su
   final exacto en vez de a un número adivinado. */
const TOUR_SCROLL_MS = 420;
/* El silencio entre que la home se posa arriba y entra el "3". */
const TOUR_FINISH_BEAT_MS = 380;
/* Lo que se queda "¿Estás listo?" después de llegar arriba. */
const TOUR_READY_MS = 900;
/* Cada número de la cuenta atrás dura lo que su animación, así que el
   siguiente entra justo cuando el anterior acaba de irse. */
const TOUR_COUNT_MS = 520;
const TOUR_COUNT_LIGHTS = { 3: "is-red", 2: "is-amber", 1: "is-green" };
const TOUR_FLAG_MS = 1600;
/* Lo que dura el estallido del final. Es un golpe, no una lluvia. */
const TOUR_CONFETTI_MS = 1200;

/* Lluvia de banderas al entrar a USA por primera vez: un guiño corto,
   que se quita solo. */
function usaIntro() {
  /* El "Inferno" del botón de fuego de DuckDuckGo: no son partículas
     sueltas cruzando la pantalla, es una pared que sube desde el borde
     de abajo, se traga la vista y se va. Aquí la pared es de banderas:
     muchas, grandes, encimadas y a distinto ritmo. */
  const rnd = (seed) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const COUNT = 64;
  const flags = Array.from({ length: COUNT }, (_, i) => {
    /* Repartidas por columnas con jitter: cubren todo el ancho sin
       dejar huecos ni alinearse como una reja. */
    const left = (i / COUNT) * 108 - 4 + (rnd(i + 1) - 0.5) * 12;
    const size = 36 + rnd(i + 31) * 76;
    const delay = rnd(i + 61) * 432;
    const dur = 1035 + rnd(i + 91) * 630;
    const drift = (rnd(i + 121) - 0.5) * 140;
    const spin = (rnd(i + 151) - 0.5) * 60;
    const start = rnd(i + 181) * 90;
    return `<span class="oky-flow-flagrise-item" style="left:${left.toFixed(
      2,
    )}%;width:${size.toFixed(0)}px;bottom:${-90 - start.toFixed(0)}px;animation-delay:${delay.toFixed(
      0,
    )}ms;animation-duration:${dur.toFixed(0)}ms;--drift:${drift.toFixed(0)}px;--spin:${spin.toFixed(
      0,
    )}deg">${renderFlag({ code: "US", size: "Large" })}</span>`;
  }).join("");
  return `<div class="oky-flow-flagrise" aria-hidden="true">${flags}</div>`;
}

/* Recorrido guiado: el fondo se atenúa con cuatro paneles que dejan un
   hueco sobre lo que se está señalando —así el elemento se ve tal cual,
   sin recortes ni copias— y el globo cuenta para qué sirve. */
function tourOverlay(state) {
  const step = tourStepsOf(state)[state.tourStep];
  if (!step) return "";

  /* El hueco deja ver lo que se señala —el elemento es el de verdad, no
     una copia— y encima solo van la flecha y la línea. Se toca donde
     sea para pasar. */
  return `
    <div class="oky-flow-tour" data-action="tour-next" role="dialog" aria-modal="true" aria-label="${step.label}">
      <span class="oky-flow-tour-hole" aria-hidden="true"></span>
      <div class="oky-flow-tour-call">
        <i class="fa-solid fa-arrow-up oky-flow-tour-arrow" aria-hidden="true"></i>
        <p class="oky-flow-tour-label">${step.label}</p>
      </div>
    </div>
  `;
}

/* Clarita en la home de USA. Vive donde vivía la pista de scroll y
   ofrece el recorrido; tocarla lo abre. Si ya no está preguntando, el
   primer toque devuelve la pregunta y el segundo abre el recorrido:
   así no se entra sin querer. Se esconde al bajar y vuelve al llegar
   arriba, callada. */
function guideBubble() {
  return `
    <p class="prime-card-clarita-bubble oky-flow-guide-bubble">
      <span class="prime-card-clarita-say is-idle">Gana OKY Cash,<br />¿Quieres saber cómo?</span>
      <button class="prime-card-clarita-close" data-action="guide-hush" type="button"
        aria-label="Cerrar el aviso de Clarita">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </p>
  `;
}

function homeGuide(state) {
  return `
    <div class="oky-flow-guide${state.guideAway ? " is-away" : ""}" data-action="guide-tap"
      role="button" tabindex="0" aria-label="Clarita: Gana OKY Cash, ¿Quieres saber cómo?">
      ${state.guideAsk ? guideBubble() : ""}
      ${renderClaritaPet("oky-flow-guide-pet")}
    </div>
  `;
}

/* "¿Estás listo?" cierra el recorrido y abre la salida de carrera. */
function tourReady() {
  return `
    <div class="oky-flow-ready" aria-hidden="true">
      <p class="oky-flow-ready-card" role="status">¿Estás listo?</p>
    </div>
  `;
}

/* Meta del recorrido: una pancarta de línea de llegada sobre la home
   ya devuelta al inicio. No pide nada ni tapa nada —se deja atravesar
   con el dedo— y se va sola. */
function tourCountNumber(n) {
  return `<span class="oky-flow-tourcount-num ${TOUR_COUNT_LIGHTS[n]}">${n}</span>`;
}

/* La cuenta atrás de una salida de carrera: 3 en rojo, 2 en ámbar, 1
   en verde. La capa se pinta una sola vez y lo único que se releva es
   el número, para que el fondo no parpadee entre uno y otro. */
function tourCountdown() {
  return `
    <div class="oky-flow-tourcount" aria-hidden="true">
      ${tourCountNumber(3)}
    </div>
  `;
}

function tourFlag() {
  return `
    <div class="oky-flow-tourflag" aria-hidden="true">
      <span class="oky-flow-tourflag-backdrop"></span>
      <p class="oky-flow-tourflag-card" role="status">
        <span>¡Compra y gana! <span class="oky-flow-tourflag-wave">🏁</span></span>
      </p>
    </div>
  `;
}

/* Confirmación de que el vale entró al carrito (Figma 99105:32149):
   la pantalla se atenúa un instante y el toast lo dice en el centro. */
function addedToast() {
  return `
    <div class="oky-flow-added" aria-hidden="true">
      <div class="oky-flow-added-backdrop"></div>
      <article class="toast-banner toast-banner-success oky-flow-added-toast" role="status">
        <span class="fa-icon toast-banner-icon icon-main-success" aria-hidden="true">
          <i class="fa-solid fa-circle-check"></i>
        </span>
        <p class="token-body1 toast-banner-message">Agregado al carrito 🎉</p>
      </article>
    </div>
  `;
}

/* Cada marketplace tiene su propio carrito —marcas, monedas y reglas
   distintas—, así que cambiar de país lo vacía. Antes de hacerlo se
   avisa, con la salida de completar la compra a mano. */
function countrySheet(state) {
  return `
    <div class="oky-flow-country-backdrop" aria-hidden="true"></div>
    <section class="oky-flow-country" role="dialog" aria-modal="true" aria-labelledby="oky-country-title">
      <button class="oky-flow-country-close" data-action="country-stay" type="button" aria-label="Cerrar">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
      <h2 class="oky-flow-country-title" id="oky-country-title">¿Deseas cambiar el país destino?</h2>
      <p class="oky-flow-country-note">El cambio de país borra tu carrito.</p>
      <div class="oky-flow-country-art" aria-hidden="true">
        <img src="oky-globe-warning.png" alt="" />
      </div>
      <div class="oky-flow-country-actions">
        <button class="btn btn-large oky-flow-country-primary" data-action="country-checkout" type="button">
          Completar Compra
        </button>
        <button class="oky-flow-country-link" data-action="country-switch" type="button">Cambiar país</button>
      </div>
    </section>
  `;
}

/* Los marketplaces que ofrece cada lado del folder. La izquierda es
   Norteamérica y la derecha Latinoamérica: son dos catálogos, dos
   monedas y dos carritos, así que un país no puede salir en los dos.
   La lista va de norte a sur, que es como se busca un país en un mapa.
   El código de tres letras es el que cabe en la pestaña. */
const MARKETS = {
  left: [
    { iso: "US", code: "USA", label: "Estados Unidos", alt: "USA flag" },
    { iso: "CA", code: "CAN", label: "Canadá", alt: "Canada flag" },
  ],
  right: [
    { iso: "MX", code: "MEX", label: "México", alt: "México flag" },
    { iso: "GT", code: "GUA", label: "Guatemala", alt: "Guatemala flag" },
    { iso: "SV", code: "ESA", label: "El Salvador", alt: "El Salvador flag" },
    { iso: "HN", code: "HON", label: "Honduras", alt: "Honduras flag" },
    { iso: "NI", code: "NIC", label: "Nicaragua", alt: "Nicaragua flag" },
    { iso: "CR", code: "CRC", label: "Costa Rica", alt: "Costa Rica flag" },
    { iso: "PA", code: "PAN", label: "Panamá", alt: "Panamá flag" },
    { iso: "CO", code: "COL", label: "Colombia", alt: "Colombia flag" },
    { iso: "EC", code: "ECU", label: "Ecuador", alt: "Ecuador flag" },
    { iso: "PE", code: "PER", label: "Perú", alt: "Perú flag" },
    { iso: "AR", code: "ARG", label: "Argentina", alt: "Argentina flag" },
  ],
};

const SIDE_LABEL = { left: "Norteamérica", right: "Latinoamérica" };

/* El de arranque de cada lado, que ya no es el primero de la lista:
   la lista va por mapa y el marketplace en pie es Guatemala. */
const MARKET_HOME = { left: "US", right: "GT" };

function marketOf(state, side) {
  const iso = (state.market || {})[side];
  return (
    MARKETS[side].find((m) => m.iso === iso) ||
    MARKETS[side].find((m) => m.iso === MARKET_HOME[side]) ||
    MARKETS[side][0]
  );
}

/* La hoja de elegir marketplace. Sale solo desde la doble flecha de la
   pestaña que está delante, así que lo que ofrece es siempre el lado
   que se está mirando: nunca se puede saltar de Guatemala a Canadá sin
   pasar por la pestaña de USA. */
function marketSheet(state) {
  const side = state.marketSheet;
  const current = marketOf(state, side);
  return `
    <button class="oky-flow-sheet-backdrop" data-action="close-market" type="button" aria-label="Cerrar"></button>
    <section class="oky-flow-market" role="dialog" aria-modal="true" aria-labelledby="oky-market-title">
      <span class="oky-flow-market-grip" aria-hidden="true"></span>
      <header class="oky-flow-market-head">
        <h2 class="oky-flow-market-title" id="oky-market-title">Elige tu marketplace</h2>
        <p class="oky-flow-market-note">${SIDE_LABEL[side]}</p>
      </header>
      <ul class="oky-flow-market-list">
        ${MARKETS[side]
          .map(
            (m) => `
          <li>
            <button class="oky-flow-market-item${m.iso === current.iso ? " is-current" : ""}"
              data-action="pick-market" data-side="${side}" data-iso="${m.iso}" type="button">
              <span class="oky-flow-market-flag">${renderFlag({ code: m.iso, size: "Large" })}</span>
              <span class="oky-flow-market-label">${m.label}</span>
              <span class="oky-flow-market-code">${m.code}</span>
              <span class="oky-flow-market-check" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
            </button>
          </li>
        `,
          )
          .join("")}
      </ul>
    </section>
  `;
}

/* ── Home (99105:31149) ─────────────────────────────────── */
/* El Discovery Header del home, en el estado que toque: State 1 con el
   folder desplegado y State 2 con el folder colapsado, que es el que
   el organismo trae para cuando la página ya está scrolleada. */
function homeHeader(state, headerState) {
  return renderDiscoveryHeader({
    /* El átomo Folder tiene dos variantes y la que manda es qué país
       está delante: Left con USA al frente, Right con GUA. Es el mismo
       comportamiento que la story del componente. */
    side: state.screen === "homegua" ? "Right" : "Left",
    /* El aviso va sobre la pestaña que todavía no se ha visitado. */
    showNewItemChip: !state.usaSeen,
    newItemSide: "left",
    state: headerState,
    walletAction: "nav:wallet",
    cartAction: "open-cart",
    cartIndicated: state.cart.length > 0,
    /* Mismo indicador que el carrito: hay vales comprados sin abrir. */
    walletIndicated: hasNewVouchers(state),
    /* El State 3 del organismo trae el carrusel de categorías; aquí no
       se usa, y el punto de colapsar es justamente ganar alto. */
    showPlateu: false,
    markets: { left: marketOf(state, "left"), right: marketOf(state, "right") },
  });
}

/* Super Ribbon "Por tiempo" con la cuenta atrás real de la promo; al
   vencer cambia a la variante "Finito". */
function promoRibbon(state) {
  /* Al vencer hay un momento de aviso —el ribbon se pone en rojo y lo
     dice— y después el strip vuelve a su ribbon de siempre. */
  if (state.promoEnded) {
    return `
      <div class="super-ribbon super-ribbon-type-finito is-ending">
        <span class="super-ribbon-icon"><i class="fa-solid fa-hourglass-end" aria-hidden="true"></i></span>
        <span class="super-ribbon-text">Promo terminada</span>
      </div>
    `;
  }

  if (!state.promoLive) {
    return `
      <div class="super-ribbon super-ribbon-type-normal${state.promoSettling ? " is-settling" : ""}">
        <span class="super-ribbon-icon"><i class="fa-solid fa-percent" aria-hidden="true"></i></span>
        <span class="super-ribbon-text">Super Deals</span>
      </div>
    `;
  }
  const elapsed = promoStartElapsed(state);
  const cronometro = `
    <div class="super-ribbon super-ribbon-type-por-tiempo${elapsed >= 0 ? " is-starting" : ""}"${
      elapsed > 0 ? ` style="animation-delay:-${elapsed}ms"` : ""
    }>
      <span class="super-ribbon-icon"><i class="fa-solid fa-clock" aria-hidden="true"></i></span>
      <span class="super-ribbon-text" data-role="promo-countdown">Termina en ${countdownLabel(state.promoEndsAt - Date.now())}</span>
    </div>
  `;

  /* Al arrancar, los dos ribbons conviven un instante y se cruzan: el
     aqua se va mientras el mostaza entra por encima. Cambiándolo de
     golpe solo se notaba la sacudida, y lo que hay que entender es que
     el 5% pasó a 20%. */
  if (elapsed < 0 || elapsed >= PROMO_CROSS_MS) return cronometro;
  return `
    <span class="super-ribbon-swap">
      <span class="super-ribbon super-ribbon-type-normal is-leaving" aria-hidden="true" style="animation-delay:-${elapsed}ms">
        <span class="super-ribbon-icon"><i class="fa-solid fa-percent" aria-hidden="true"></i></span>
        <span class="super-ribbon-text">Super Deals</span>
      </span>
      ${cronometro}
    </span>
  `;
}

/* Milisegundos desde que arrancó la promo, o -1 si no está
   arrancando. Se usa como desfase negativo en las animaciones del
   cruce: un render a media transición la retoma donde iba en vez de
   rebobinarla. */
const PROMO_CROSS_MS = 360;
const PROMO_BUMP_DELAY_MS = 340;
const PROMO_BUMP_MS = 640;

function promoStartElapsed(state) {
  if (!state.promoStarting) return -1;
  return Math.max(Date.now() - (state.promoStartedAt || 0), 0);
}

function screenHome(state) {
  /* Una oferta del strip táctico: foto, logo de marca colgado a la
     izquierda y el ribbon con el cashback (MARS 7295:52037). */
  const promoStart = promoStartElapsed(state);
  const offer = ({ key, photo, rate, action }) => {
    const product = PRODUCTS[key];
    return `
      <button class="tactic-offer tactic-offer-left" data-action="${action}" data-product="${key}" data-brand="${key}" type="button">
        <div class="tactic-offer-hero-wrap">
          <img class="tactic-offer-hero" src="${photo}" alt="${product.label}" />
          <div class="tactic-logo-wrap tactic-logo-wrap-left">
            <img class="tactic-logo" src="${product.art}" alt="${product.label}" />
          </div>
          <div class="tactic-discount-wrap tactic-discount-wrap-left">
            ${/* Al arrancar la promo, el ribbon viejo se queda encima un
                 instante y se disuelve: así se ve el aqua del 5% dar
                 paso al mostaza del 20%, en vez de cambiar de golpe. */ ""}
            ${
              promoStart >= 0 && promoStart < PROMO_CROSS_MS
                ? `<div class="discount-ribbon discount-ribbon-wrap is-tier-base is-leaving" aria-hidden="true" style="animation-delay:-${promoStart}ms">
                     <span class="discount-ribbon-text token-price-percent">Gana 5%</span>
                   </div>`
                : ""
            }
            <div class="discount-ribbon discount-ribbon-wrap ${rate >= 20 ? "is-tier-promo" : "is-tier-base"}${
              promoStart >= 0 && promoStart < PROMO_BUMP_DELAY_MS + PROMO_BUMP_MS ? " is-bumped" : ""
            }"${
              promoStart > 0 && promoStart < PROMO_BUMP_DELAY_MS + PROMO_BUMP_MS
                ? ` style="animation-delay:${PROMO_BUMP_DELAY_MS - promoStart}ms"`
                : ""
            }>
              <span class="discount-ribbon-text token-price-percent">Gana ${rate}%</span>
            </div>
          </div>
        </div>
        <div class="tactic-brand-row">
          <p class="token-brand tactic-brand">${product.label}</p>
        </div>
      </button>
    `;
  };

  /* Las cuatro marcas de Spooky Deals anuncian el tier de la promo;
     cuando vence, el 5% base. */
  const promoRate = state.promoLive ? 20 : 5;

  /* Card de marca del organismo Promo Strip: arte de la gift card,
     nombre debajo y, si trae rate, el chip de cashback. */
  const brandCard = (key, rate) => {
    const product = PRODUCTS[key];
    return `
      <button class="promo-strip-item oky-flow-brand-card" data-action="open-pdp" data-product="${key}" type="button">
        <span class="promo-strip-image-box">
          <img src="${product.art}" alt="${product.label}" />
        </span>
        <span class="token-brand promo-strip-brand">${product.label}</span>
        ${rate ? `<span class="oky-flow-brand-rate">Gana ${rate}%</span>` : ""}
      </button>
    `;
  };

  return `
    <div class="oky-flow-home">
      ${homeHeader(state, state.headerCollapsed ? "State 3" : "State 1")}

      <div class="oky-flow-theme-band">
        <div class="carousel-container oky-flow-banner-track">
          <div class="carousel-banner"><img fetchpriority="high" loading="eager" decoding="async" src="oky-banner-spooky-1-lossless.webp" alt="Spooky Deals · 20% 30% 40% OFF" /></div>
          <div class="carousel-banner"><img src="oky-banner-spooky-2-lossless.webp" alt="Spooky Deals · hasta 40% OFF en experiencias" /></div>
        </div>
      </div>

    <div class="oky-flow-section">
      <section class="tactic-strip">
        <header class="tactic-strip-header">
          <h3 class="token-h6 tactic-strip-title">🎃 Spooky Deals</h3>
          ${promoRibbon(state)}
        </header>

        <div class="tactic-strip-carousel-window">
          <div class="tactic-strip-carousel-track">
            ${offer({ key: "nike", photo: PRODUCTS.nike.hero, rate: promoRate, action: "open-pdp" })}
            ${offer({ key: "lyft", photo: PRODUCTS.lyft.hero, rate: promoRate, action: "open-pdp" })}
            ${TODAY_CARDS.map((card) => offer({ ...card, rate: promoRate, action: "open-pdp" })).join("")}
            ${/* Un respiro al final: sin él la última card queda pegada
                 al borde y no se sabe si el carrusel terminó. */ ""}
            <span class="tactic-strip-end" aria-hidden="true"></span>
          </div>
        </div>
      </section>

      ${cashStrip(state)}

      <section class="promo-strip-organism oky-flow-deals">
        <div class="promo-strip-heading-wrap oky-flow-deals-head">
          <h3 class="token-h6 promo-strip-heading">
            <i class="fa-solid fa-bolt" aria-hidden="true"></i>Geeky Deals
          </h3>
          <span class="btn btn-outlined btn-small">Ver más</span>
        </div>
        <div class="promo-strip-divider"></div>
        <div class="promo-strip-row oky-flow-deals-row">
          ${GEEKY_DEALS.map((deal) => brandCard(deal.key, deal.rate)).join("")}
        </div>
      </section>

      <section class="homecard-organism homecard-organism-photo oky-flow-apparel">
        <header class="homecard-header">
          <h3 class="token-h6 homecard-title">Deportes &amp; Apparel</h3>
          <div class="discount-ribbon discount-ribbon-wrap is-tier-base oky-flow-apparel-ribbon">
            <span class="discount-ribbon-text token-price-percent">Gana hasta ${Math.max(
              ...STYLE_CARDS.map((c) => BRANDS[c.key].rate),
            )}%</span>
          </div>
        </header>

        <div class="homecard-content homecard-content-photo">
          <div class="homecard-photo-track">
            ${STYLE_CARDS.map((card) => {
              const brand = BRANDS[card.key];
              return `
                <article class="homecard-photo-item" data-action="open-pdp" data-product="${card.key}"
                  role="button" tabindex="0" aria-label="${brand.label}">
                  <div class="homecard-photo-media-wrap">
                    <img class="homecard-photo-hero" src="${card.photo}" alt="" />
                  </div>
                  <div class="homecard-photo-logo-stack">
                    <div class="homecard-photo-logo-wrap" style="background:${brand.bg}">
                      <img class="homecard-photo-logo" src="${brand.art}" alt="${brand.label}" />
                    </div>
                    <p class="token-brand homecard-photo-name">${brand.label}</p>
                  </div>
                </article>
              `;
            }).join("")}
          </div>
        </div>

        <footer class="homecard-footer">
          <button class="btn btn-primary btn-small" type="button">Ver más</button>
        </footer>
      </section>

      <div class="oky-flow-tile-grid">
        ${HOME_CATEGORIES.map(
          (cat) => `
          <div class="service-tile is-label-top">
            <div class="tile-label">${cat.label}</div>
            <div class="tile-icon"><img src="${cat.icon}" alt="" /></div>
          </div>
        `,
        ).join("")}
      </div>

      ${HOME_SECTIONS.map(
        (section) => `
        <section class="homecard-organism">
          <header class="homecard-header">
            <h3 class="token-h6 homecard-title">${section.title}</h3>
          </header>
          <div class="homecard-content oky-flow-brand-grid">
            ${section.keys.map((key) => brandCard(key)).join("")}
          </div>
          <footer class="homecard-footer">
            <span class="btn btn-primary btn-small">Ver más</span>
          </footer>
        </section>
      `,
      ).join("")}

      <p class="oky-flow-legal">
        The merchants represented are not sponsors of the rewards or otherwise affiliated with
        Merkado Services LLC. The logos and other identifying marks attached are trademarks of and
        owned by each represented company and/or its affiliates. Please visit each company's
        website for additional terms and conditions.
      </p>
    </div>
    </div>

    <button class="oky-flow-scroll-hint" data-action="scroll-more" type="button"
      aria-label="Ver más contenido">
      <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
    </button>

    ${navbar("home", state)}
  `;
}

/* ── PDP (99105:32284 / 99105:37017 / 99140:13571) ──────── */
function screenPdp(state) {
  const product = PRODUCTS[state.params.product];
  const amount = state.amounts[product.key];
  const tier = getTier(amount, product, state.promoLive);
  const cashback = amount * tier.rate;
  const cartItem = state.cart.find((item) => item.productKey === product.key);
  /* Ya está en el carrito, pero con otro monto: hay algo que guardar. */
  const changed = cartItem && cartItem.amount !== amount;

  return `
    ${statusBar()}
    ${productHeader(state, { backAction: "nav:country-home" })}

    <div class="oky-flow-stack-center">
      <div class="oky-flow-brand-slot">
        <section class="brand-item-atom is-with-label" aria-label="${product.label}">
          <p class="brand-item-label token-product-text">${product.label}</p>
          <div class="brand-item-frame">
            <div class="brand-item-base"><img src="${product.art}" alt="${product.label}" /></div>
          </div>
        </section>
      </div>
      <div><p class="oky-flow-brand-online">Online</p></div>

      <div>
        <section class="middle-card-shell is-pdp" aria-label="${product.cardTitle}">
          <article class="middle-card-molecule is-amount">
            <div class="middle-card-content">
              <div class="middle-card-main">
                <p class="middle-card-title">${product.cardTitle}</p>
                <div class="middle-card-center">
                  <div class="middle-card-value">
                    <span class="middle-card-currency">$</span>
                    <p class="middle-card-amount">${bigAmount(amount)}</p>
                  </div>
                </div>
              </div>
              <div class="middle-card-footer">
                <span class="middle-card-footer-start">Redemption Instructions</span>
                <span class="middle-card-footer-end">Terms &amp; Conditions</span>
              </div>
            </div>
            <div class="oky-flow-ribbon-slot">
              <div class="discount-ribbon discount-ribbon-wrap ${tier.ribbon}">
                <span class="discount-ribbon-text token-price-percent">Gana ${Math.round(tier.rate * 100)}%</span>
              </div>
            </div>
          </article>
        </section>
      </div>

      <div>
        <div class="input-wrapper" style="width:100%">
          <label id="oky-amount-label" class="input-label input-label-dinamic" for="oky-amount">
            Desde ${product.min} hasta ${product.max.toLocaleString("en-US")}
          </label>
          <span class="input-dinamic-prefix" aria-hidden="true">$</span>
          <input id="oky-amount" class="input-field input-dinamic input-dinamic-hasvalue" type="text"
            inputmode="decimal" value="${moneyField(amount)}" data-action="input-amount" data-product="${product.key}"
            aria-labelledby="oky-amount-label" />
        </div>
      </div>

      ${
        product.legal
          ? `<div><p class="oky-flow-legal"><strong>Disponibilidad limitada</strong> Las Gift Cards con descuento especial estarán disponibles por tiempo limitado o hasta que se agote el inventario.</p></div>`
          : ""
      }
    </div>

    <div class="oky-flow-dock">
      <div class="summary-box summary-box-compact">
        <div class="summary-card">
          <div class="summary-card-body">
            <div class="summary-row">
              <span class="summary-label-strong">Subtotal</span>
              <span class="summary-label-strong" data-role="pdp-subtotal">${money(amount)}</span>
            </div>
          </div>
          <div class="summary-cta-row">
            ${
              cartItem && !changed
                ? `<button class="btn btn-primary summary-btn" data-action="open-cart" type="button">Ver carrito</button>`
                : `<button class="btn btn-primary summary-btn" data-action="add-to-cart" data-product="${product.key}"
                     type="button" ${amount > 0 ? "" : "disabled"}>
                     ${changed ? "" : `<i class="fa-solid fa-plus" aria-hidden="true"></i>`}${changed ? "Actualizar" : "Agregar"}
                   </button>`
            }
          </div>
        </div>
      </div>
    </div>

    ${savingBar(cashback, tier, (v) => `Gana <strong>${v}</strong> de <strong>OKY Cash</strong>`, {
      /* El ribbon de arriba solo cambia de mostaza a aqua; el aviso de
         que la promo venció lo da la barra, que es donde el ojo está
         cuando se mira el monto. */
      ending: state.promoEnded,
      /* Vencida la promo, la primera vez que la barra vuelve al aqua lo
         hace saliendo del rojo, no apareciendo de golpe. */
      settled: !state.promoLive && !state.promoEnded && state.promoSettling,
      /* Solo donde el reloj significa algo: el 20% es el único tier que
         se cae cuando se acaba el tiempo. */
      timer:
        state.promoLive && tier.bar === "is-tier-promo"
          ? countdownLabel(state.promoEndsAt - Date.now())
          : null,
      /* Solo aquí: en Guatemala la barra de la PDP es la del ahorro del
         carrito, otra cosa, y en el checkout la (i) ya está donde tiene
         que estar, junto al subtotal. */
      info: true,
    })}
    ${navbar("", state)}
  `;
}

/* ── Carrito: drawer desde la derecha (99105:38191) ─────── */
function cartDrawer(state) {
  const total = cartTotal(state);
  const cashback = cartCashback(state);

  /* La barra de abajo puede venir de dos sitios: el cashback de USA
     —que la pinta la pantalla de debajo— o el ahorro de la orden en
     Guatemala. En los dos casos el carrito se acorta para dejarle
     sitio; sin ninguna, llena hasta la navbar. */
  const savings = orderSavings(state);
  const hasBar = cashback > 0 || savings > 0;

  /* Cada fila replica el list-item de Figma (275x140): arriba el
     brand item y el botón de borrar, abajo título, precio y ribbon. */
  const rows = state.cart.length
    ? state.cart
        .map((item) => {
          const product = PRODUCTS[item.productKey];
          const tier = getTier(item.amount, product, state.promoLive);
          /* Con chip de cantidad la fila se parte en dos columnas: a
             la izquierda todo lo que se lee y a la derecha el chip de
             pie, en la misma banda que ocupan el lápiz y el tacho de
             los vales de monto. */
          return `
            <div class="oky-flow-cart-row">
              <div class="oky-flow-cart-head">
                <span class="brand-item-atom is-no-label">
                  <span class="brand-item-frame">
                    <span class="brand-item-base">
                      ${
                        /* En el carrito manda la marca, no el producto:
                           es lo que se reconoce de un vistazo en una
                           lista de cosas distintas. */
                        product.food && FOOD_BRANDS[product.brand]
                          ? `<img src="${FOOD_BRANDS[product.brand].art}" alt="${FOOD_BRANDS[product.brand].label}" />`
                          : `<img src="${product.art}" alt="${product.label}" />`
                      }
                    </span>
                  </span>
                </span>
                ${
                  /* Donde USA enseña lo que gana, Guatemala enseña lo
                     que rebaja: el mismo sitio y el mismo cintillo. */
                  product.was
                    ? `<span class="discount-ribbon discount-ribbon-list is-tier-base">
                        <span class="discount-ribbon-text token-price-percent">${Math.round((1 - product.price / product.was) * 100)}% OFF</span>
                      </span>`
                    : tier.rate
                      ? `<span class="discount-ribbon discount-ribbon-list ${tier.ribbon}">
                          <span class="discount-ribbon-text token-price-percent">Gana ${Math.round(tier.rate * 100)}%</span>
                        </span>`
                      : ""
                }
                ${
                  /* La comida no se edita con lápiz: su precio lo pone
                     la marca y lo que se cambia es cuántas llevas. En su
                     sitio va la cantidad, del mismo tamaño. */
                  product.food
                    ? cartQty(product, item.qty || 1, state.qtyOpen === item.productKey)
                    : `<button class="oky-flow-cart-edit" data-action="edit-item" data-product="${item.productKey}"
                        type="button" aria-label="Cambiar el monto de ${product.label}">
                        <i class="fa-solid fa-pencil" aria-hidden="true"></i>
                      </button>`
                }
              </div>
              <div class="oky-flow-cart-body">
                <span class="oky-flow-cart-copy">
                  <p class="oky-flow-cart-title">${product.cartTitle || product.cardTitle}</p>
                  <p class="oky-flow-cart-price${product.was ? " is-deal" : ""}">
                    ${money(item.amount * (item.qty || 1))}
                    ${
                      product.was
                        ? `<span class="oky-flow-cart-was">${money(product.was * (item.qty || 1))}</span>`
                        : ""
                    }
                  </p>
                </span>
                <button class="oky-flow-cart-trash" data-action="remove-item" data-product="${item.productKey}"
                  type="button" aria-label="Quitar ${product.label}">
                  <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          `;
        })
        .join("")
    : "";

  return `
    <button class="oky-flow-drawer-backdrop${hasBar ? "" : " is-no-bar"}" data-action="close-cart" type="button" aria-label="Cerrar carrito"></button>
    ${
      savings > 0
        ? `<div class="oky-flow-savingbar is-drawer-bar oky-flow-drawer-bar">
            <div class="oky-flow-savebar is-bar"><i class="fa-solid fa-tag" aria-hidden="true"></i>&nbsp;¡Ahorro total! ${money(savings)}</div>
          </div>`
        : ""
    }
    <aside class="oky-flow-drawer${hasBar ? "" : " is-no-bar"}" aria-label="Carrito">
      <div class="oky-flow-drawer-head">
        <button class="oky-flow-header-icon" data-action="close-cart" type="button" aria-label="Ir atrás">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
        </button>
        <h2 class="oky-flow-drawer-title">Ir atrás</h2>
      </div>

      <div class="oky-flow-drawer-body">
        ${state.cart.length ? promoPill(state) : ""}
        ${
          state.cart.length
            ? `<div class="oky-flow-cart-card">${rows}</div>`
            : `<div class="oky-flow-cart-empty">
                <img class="oky-flow-cart-empty-art" src="Cart-3d-icon.png" alt="" />
                <h3 class="oky-flow-cart-empty-title">Tu carrito está vacío</h3>
                <p class="oky-flow-cart-empty-note">
                  ${/* Cada marketplace vende lo suyo y promete lo suyo: en
                       USA las gift cards devuelven OKY Cash, y en
                       Latinoamérica los vales no —todos van con
                       noCashback—, así que lo que se ofrece ahí es el
                       descuento, que es lo que de verdad dan. */ ""}
                  ${
                    state.country === "gua"
                      ? "Agrega un OKY Vale y empieza a ahorrar en tus marcas favoritas."
                      : "Agrega una Gift Card y empieza a ganar OKY Cash en cada compra."
                  }
                </p>
                <button class="btn btn-primary btn-large" data-action="nav:country-home" type="button">
                  Explorar marcas
                </button>
              </div>`
        }
      </div>

      <div class="oky-flow-drawer-foot${state.cart.length ? "" : " is-hidden"}">
        ${
          /* En Guatemala se compra en quetzales y se paga en dólares:
             la solapa del tipo de cambio acompaña al resumen, como en
             el PDP. En USA no hay conversión que explicar. */
          orderCountry(state) === "gua"
            ? `<div class="summary-box summary-box-compact with-overlap">
                <div class="summary-type-overlay">
                  <span class="token-exchange">TIPO DE CAMBIO: Q 7.55</span>
                </div>
                <div class="summary-card">`
            : `<div class="summary-box summary-box-compact">
                <div class="summary-card">`
        }
            <div class="summary-card-body">
              <div class="summary-row summary-row-total">
                <span class="summary-label-strong">(${cartCount(state)}) Subtotal</span>
                <span class="summary-label-strong">${dealAmount(cartSubtotal(state), cartSubtotalList(state))}</span>
              </div>
              ${
                cartServiceCount(state)
                  ? `<div class="summary-row oky-flow-feerow">
                      <span>Costo por servicio</span>
                      <span>${dealAmount(cartServiceFee(state), serviceFeeList(cartServiceCount(state)))}</span>
                    </div>`
                  : ""
              }
              ${promoRow(state)}
              ${cashRow(state)}
              ${
                /* El TOTAL aparece en cuanto hay algo que restar o que
                   sumar al subtotal; si no, repetiría la misma cifra. */
                cartServiceCount(state) || appliedPromo(state) > 0 || state.okyCashEnabled
                  ? `<div class="summary-row summary-row-total">
                      <span class="summary-label-strong">TOTAL</span>
                      <span class="summary-label-strong">${money(orderDue(state))}</span>
                    </div>`
                  : ""
              }
            </div>
            <div class="summary-cta-row double">
              <button class="btn btn-outlined btn-large" data-action="keep-shopping" type="button">Seguir comprando</button>
              <button class="btn btn-primary btn-large" data-action="go:decision" type="button"
                ${state.cart.length ? "" : "disabled"}>Ir a pagar</button>
            </div>
          </div>
        </div>
      </div>
    </aside>

    ${
      state.cart.length && cashback > 0
        ? `<div class="oky-flow-savingbar is-drawer-bar">
            <div class="saving-bar is-oky-cash">
              <div class="saving-bar-copy">
                ${/* Sin el "+": lo que se gana es esa cantidad y nada
                      más, y el signo prometía un extra que no existe. */ ""}
                <span>Compra y gana <strong>${money(cashback)}</strong> en <strong>OKY Cash</strong></span>
              </div>
            </div>
          </div>`
        : ""
    }
  `;
}

/* ── Checkout (99105:31768) ─────────────────────────────── */
function screenCheckout(state) {
  const total = cartTotal(state);
  const cashback = cartCashback(state);
  const used = appliedOkyCash(state);
  const earned = earnedCashback(state);
  const tier = getTier(total);
  const active = clamp(state.checkoutIndex, 0, Math.max(state.cart.length - 1, 0));
  /* Con el saldo en cero la mitad de OKY Cash no pinta nada. */
  const hasCash = state.okyCashBalance > 0;
  const recipient =
    orderCountry(state) === "gua"
      ? GUA_RECIPIENT
      : { name: state.recipient || USA_RECIPIENT.name, phone: USA_RECIPIENT.phone };
  /* Cada vale lleva su propio porcentaje en el wrap ribbon, igual que
     en el PDP: con el reloj en pausa aquí dentro, el 20% de Nike no se
     convierte en 5% mientras se ajusta el pago. */
  const giftCard = (item) => {
    const product = PRODUCTS[item.productKey];
    const itemTier = getTier(item.amount, product, state.promoLive);
    /* Lo que no es una gift card dice lo que es: un paquete de internet
       no se anuncia como gift card. */
    const itemTitle = product.wallet ? product.cardTitle : "Gift Card";
    return `
    <section class="middle-card-shell is-checkout">
      <article class="middle-card-molecule is-egift">
        <div class="middle-card-content">
          <div class="middle-card-main">
            <p class="middle-card-title">${itemTitle}</p>
            <div class="middle-card-center">
              ${
                /* Un producto de comida no se resume con su precio: se
                   reconoce por la foto, que es como se eligió. Es la
                   variante "Vale de Producto" del sistema. */
                product.food
                  ? `<figure class="middle-card-product-figure"><img src="${product.art}" alt="${product.label}" /></figure>`
                  : product.quetzal
                    ? `<div class="middle-card-value">
                        <span class="middle-card-currency">Q</span>
                        <p class="middle-card-amount">${bigQuetzal(item.quetzales || 0)}</p>
                      </div>`
                    : `<div class="middle-card-value">
                        <span class="middle-card-currency">$</span>
                        <p class="middle-card-amount">${bigAmount(item.amount * (item.qty || 1))}</p>
                      </div>`
              }
            </div>
          </div>
          <div class="middle-card-footer">
            <span class="middle-card-footer-start">Que debo saber</span>
            <span class="middle-card-footer-end" aria-hidden="true"></span>
          </div>
        </div>
        ${
          product.was
            ? `<div class="middle-card-ribbon-slot">
                <div class="discount-ribbon discount-ribbon-wrap is-tier-base">
                  <span class="discount-ribbon-text token-price-percent">${Math.round((1 - product.price / product.was) * 100)}% OFF</span>
                </div>
              </div>`
            : itemTier.rate
              ? `<div class="middle-card-ribbon-slot">
                  <div class="discount-ribbon discount-ribbon-wrap ${itemTier.ribbon}">
                    <span class="discount-ribbon-text token-price-percent">Gana ${Math.round(itemTier.rate * 100)}%</span>
                  </div>
                </div>`
              : ""
        }
      </article>
    </section>
  `;
  };

  const first = PRODUCTS[state.cart[active].productKey];
  const applied = orderCash(state);
  const toCard = orderDue(state);
  const checkoutCard = CARDS.find((c) => c.key === state.selectedCard) || CARDS[0];

  return `
    <div class="oky-flow-page">
    ${statusBar()}
    ${productHeader(state)}

    <div class="oky-flow-section">
      ${
        /* Arriba manda la marca: de un producto de comida se reconoce
           el logo, no la foto —que ya está en la card de abajo—. */
        (() => {
          const brand = first.food && FOOD_BRANDS[first.brand] ? FOOD_BRANDS[first.brand] : null;
          const label = brand ? brand.label : first.label;
          const art = brand ? brand.art : first.art;
          return `
            <section class="brand-item-atom is-with-label oky-flow-brand-slot">
              <p class="brand-item-label token-product-text">${label}</p>
              <div class="brand-item-frame">
                <div class="brand-item-base"><img src="${art}" alt="${label}" /></div>
              </div>
            </section>
          `;
        })()
      }

      <div class="checkout-brand-carrousel-shell">
        <section class="brand-carrousel-organism checkout-brand-carrousel" aria-label="Vales">
          <div class="brand-carrousel-track">
            <div class="brand-carrousel-side brand-carrousel-side-left">
              ${state.cart.length > 1 ? giftCard(state.cart[wrap(active - 1, state.cart.length)]) : ""}
            </div>
            <div class="brand-carrousel-center">
              <div class="brand-carrousel-center-card">${giftCard(state.cart[active])}</div>
            </div>
            <div class="brand-carrousel-side brand-carrousel-side-right">
              ${state.cart.length > 1 ? giftCard(state.cart[wrap(active + 1, state.cart.length)]) : ""}
            </div>
          </div>
          ${
            state.cart.length > 1
              ? `
            <button class="oky-flow-carousel-nav is-prev" data-action="carousel-prev" type="button" aria-label="Anterior">
              <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
            </button>
            <button class="oky-flow-carousel-nav is-next" data-action="carousel-next" type="button" aria-label="Siguiente">
              <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
            </button>
          `
              : ""
          }
        </section>
      </div>

      <article class="dual-molecule is-default" style="width:100%">
        <span class="dual-floating-label">¿Para quién es?</span>
        <div class="dual-card">
          <span class="dual-avatar" aria-hidden="true"><i class="fa-solid fa-user"></i></span>
          <div class="dual-copy">
            <p class="dual-title">${recipient.name}</p>
            <p class="dual-subtitle">${recipient.phone}</p>
          </div>
          <span class="dual-action" aria-hidden="true"><i class="fa-solid fa-ellipsis-vertical"></i></span>
        </div>
      </article>

      <div class="payment-method-input oky-flow-paygroup" style="width:100%">
        <span class="payment-method-label">Método de pago</span>
        <div class="oky-flow-payrow ${hasCash ? "is-first" : "is-only"}" data-action="open-methods" role="button" tabindex="0">
          <img class="oky-flow-method-mark" src="oky-card-3d.png" alt="" />
          <p class="oky-flow-payrow-copy">${checkoutCard.label}</p>
          <span class="oky-flow-chip-cell"><span class="oky-flow-chip is-card">${money(toCard)}</span></span>
          <span class="oky-flow-payrow-more" aria-hidden="true">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </span>
        </div>
        ${
          /* Sin saldo no hay nada que activar: la fila de OKY Cash sobra
             y el método de pago se queda solo, con las cuatro esquinas
             redondeadas. */
          !hasCash
            ? ""
            : `
        <div class="oky-flow-payrow is-last${state.okyCashEnabled ? " is-checked" : ""}">
          <button class="oky-flow-check${state.okyCashEnabled ? " is-checked" : ""}"
            data-action="toggle-okycash" type="button"
            aria-pressed="${state.okyCashEnabled}" aria-label="Usar OKY Cash">
            <i class="fa-solid fa-check" aria-hidden="true"></i>
          </button>
          <p class="oky-flow-payrow-copy" data-action="toggle-okycash" role="button" tabindex="0">OKY Cash</p>
          <span class="oky-flow-chip-cell"><span class="oky-flow-chip is-cash">${money(state.okyCashEnabled ? applied : state.okyCashBalance)}</span></span>
          <button class="oky-flow-payrow-more" data-action="open-methods" type="button" aria-label="Editar monto">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>
        `
        }
      </div>

      <div class="summary-box summary-box-compact oky-flow-push" style="width:100%">
        <div class="summary-card">
          <div class="summary-card-body">
            ${
              /* Con OKY Cash marcado se abre el desglose aunque el saldo
                 sea cero: si no, la casilla parece no hacer nada. Sin
                 marcar, Subtotal y TOTAL son el mismo número y basta el
                 TOTAL (Figma 99105:31768). */
              state.okyCashEnabled
                ? `<div class="summary-row">
                     <span class="summary-label-strong">(${cartCount(state)}) Subtotal
                       <button class="oky-flow-info" data-action="open-cart" type="button"
                         aria-label="Ver el carrito">
                         <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
                       </button>
                     </span>
                     <span class="summary-label-strong">${dealAmount(cartSubtotal(state), cartSubtotalList(state))}</span>
                   </div>
                   ${
                     cartServiceCount(state)
                       ? `<div class="summary-row oky-flow-feerow">
                           <span>Costo por servicio</span>
                           <span>${dealAmount(cartServiceFee(state), serviceFeeList(cartServiceCount(state)))}</span>
                         </div>`
                       : ""
                   }
                   ${cashRow(state)}`
                : cartServiceCount(state) || appliedPromo(state) > 0
                  ? `<div class="summary-row">
                       <span class="summary-label-strong">(${cartCount(state)}) Subtotal</span>
                       <span class="summary-label-strong">${dealAmount(cartSubtotal(state), cartSubtotalList(state))}</span>
                     </div>
                     ${
                       cartServiceCount(state)
                         ? `<div class="summary-row oky-flow-feerow">
                             <span>Costo por servicio</span>
                             <span>${dealAmount(cartServiceFee(state), serviceFeeList(cartServiceCount(state)))}</span>
                           </div>`
                         : ""
                     }
                     ${promoRow(state)}`
                  : ""
            }
            <div class="summary-row summary-row-total">
              <span class="summary-label-strong">TOTAL</span>
              <span class="summary-label-strong">${money(toCard)}</span>
            </div>
          </div>
          <div class="summary-cta-row">
            <button class="btn btn-primary summary-btn" data-action="pay" type="button">Comprar</button>
          </div>
        </div>
      </div>
    </div>
    </div>

    ${
      /* Con comida en el carrito lo que se anuncia abajo es el ahorro
         de la orden; el cashback de OKY Cash es otra barra y en
         Guatemala todavía no aplica. */
      orderSavings(state) > 0
        ? `<div class="oky-flow-savingbar"><div class="oky-flow-savebar is-bar"><i class="fa-solid fa-tag" aria-hidden="true"></i>&nbsp;¡Ahorro total! ${money(orderSavings(state))}</div></div>`
        : ""
    }
    ${
      cashback > 0
        ? savingBar(earned, { bar: "" }, (v) => {
            /* Sin el "+", igual que en el carrito: la cifra es la que
               es y el signo prometía un extra que no existe. */
            if (used <= 0) return `Compra y gana <strong>${v}</strong> en <strong>OKY Cash</strong>`;
            if (earned <= 0) return `No acumulas <strong>OKY Cash</strong> en esta compra`;
            return `Ganas <strong>${v}</strong> por lo que pagas con tarjeta`;
          })
        : ""
    }
    ${/* El resumen entero se queda donde está y scrollea; lo que se
         ancla es este cintillo con el total y el botón. En pantallas
         donde el de verdad se ve, no se dibuja. */ ""}
    <div class="oky-flow-checkoutdock">
      <div class="oky-flow-checkoutdock-card">
        <div class="summary-row summary-row-total">
          <span class="summary-label-strong">TOTAL</span>
          <span class="summary-label-strong">${money(toCard)}</span>
        </div>
        <button class="btn btn-primary summary-btn" data-action="pay" type="button">Comprar</button>
      </div>
    </div>
    ${navbar("", state)}
  `;
}

/* ── Métodos de pago (99105:41588) ──────────────────────── */
function screenMethods(state) {
  const total = cartTotal(state);
  const max = Math.min(state.okyCashBalance, total);
  /* Sin marcar no hay nada aplicado, y el saldo entero sigue ahí. Es lo
     mismo que enseña el checkout: marcado, lo que se va en esta compra;
     sin marcar, lo que hay disponible. */
  const applied = state.okyCashEnabled ? clamp(state.okyCashApplied, 0, max) : 0;
  const toCard = Math.max(total - applied, 0);
  const keep = Math.max(state.okyCashBalance - applied, 0);

  const selected = CARDS.find((c) => c.key === state.selectedCard) || CARDS[0];

  const top = { ...findPaymentCard(selected.variant) };
  const cash = okyCashCard(state, { balance: keep, edit: false });
  /* Sin saldo no hay nada que casar con la tarjeta: fuera la card de
     OKY Cash y fuera su fila, y la del método queda sola y redondeada
     por sus cuatro esquinas. */
  const hasCash = state.okyCashBalance > 0;

  return `
    ${statusBar()}
    ${titledHeader("Métodos de pago")}

    <div class="oky-flow-section" style="gap:8px">
      <button class="oky-flow-addcard" type="button">
        <i class="fa-solid fa-plus" aria-hidden="true"></i>Agregar tarjeta crédito/débito
      </button>

      <div class="payment-card-stack" style="--payment-card-stack-offset:-144px">
        ${renderPaymentCard(top)}
        ${hasCash ? renderPaymentCard(cash) : ""}
      </div>

      <div class="oky-flow-method-list" style="width:100%">
        ${CARDS.map((card) => {
          const isSelected = card.key === selected.key;
          /* La lista no se reordena al elegir: cada tarjeta se queda en
             su sitio y lo que se mueve es el radio. La fila de OKY Cash
             acompaña a la que esté seleccionada. */
          const row = `
            <div class="oky-flow-method-row${isSelected ? ` is-selected${hasCash ? "" : " is-only"}` : ""}"
              ${isSelected ? "" : `data-action="select-card" data-card="${card.key}" role="button" tabindex="0"`}>
              <span class="oky-flow-radio${isSelected ? " is-on" : ""}" aria-hidden="true"></span>
              <img class="oky-flow-method-mark" src="oky-card-3d.png" alt="" />
              <p class="oky-flow-method-name${isSelected ? "" : " is-regular"}">${card.label}</p>
              ${isSelected ? `<span class="oky-flow-chip is-card">${money(toCard)}</span>` : ""}
            </div>
          `;

          const cashRow = `
            <div class="oky-flow-method-row is-cash${state.okyCashEnabled ? " is-checked" : ""}">
              <div class="oky-flow-method-head">
                <button class="oky-flow-check${state.okyCashEnabled ? " is-checked" : ""}"
                  data-action="toggle-okycash" type="button"
                  aria-pressed="${state.okyCashEnabled}" aria-label="Usar OKY Cash">
                  <i class="fa-solid fa-check" aria-hidden="true"></i>
                </button>
                <img class="oky-flow-coin" src="oky-cash-coin.png" alt="" style="width:24px;height:26px" />
                <p class="oky-flow-method-label">OKY Cash</p>
                <span class="oky-flow-chip is-cash">${money(state.okyCashEnabled ? applied : state.okyCashBalance)}</span>
              </div>
            </div>
          `;

          return `<div class="oky-flow-method-group">${row}${isSelected && hasCash ? cashRow : ""}</div>`;
        }).join("")}
      </div>
    </div>

    <div class="oky-flow-cta-bar">
      <button class="btn btn-primary btn-large" data-action="confirm-methods" type="button">
        Siguiente - ${money(total)}
      </button>
    </div>
    ${navbar("", state)}
  `;
}

/* ── Processing (99140:56017) ───────────────────────────── */
function screenProcessing(state) {
  const rows = state.cart.map((item, i) => ({
    name: PRODUCTS[item.productKey].label,
    time: `7:1${8 + i} PM`,
  }));

  return `
    ${statusBar()}
    ${titledHeader("")}
    <div class="modal-molecule-backdrop" style="position:absolute;inset:0;z-index:15"></div>

    <section class="oky-flow-wait">
      <h2 class="oky-flow-wait-title">No cerrar app</h2>
      <div class="oky-flow-timeline">
        ${rows
          .map(
            (row) => `
          <div class="oky-flow-timeline-row">
            <img class="oky-flow-timeline-icon" src="oky-check-3d.png" alt="" />
            <p class="oky-flow-timeline-name">${row.name}</p>
            <p class="oky-flow-timeline-time">${row.time}</p>
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="oky-flow-wait-footer">
        <img class="oky-flow-spinner" src="oky-spinner.svg" alt="" />
        <span>Redireccionando…</span>
      </div>
    </section>
  `;
}

/* El pie del acuse: volver al wallet y, si la compra dejó algo, la
   píldora con el saldo nuevo. Va fijo abajo en las dos versiones de la
   pantalla —la pila y la card suelta—. */
function purchaseFoot(state) {
  const earnedHere = state.lastEarned > 0;
  return `
    <div class="oky-flow-cta-bar${earnedHere ? " has-cash-strip" : ""}">
      <button class="btn btn-outlined btn-large oky-flow-wallet-btn" data-action="nav:wallet" type="button">
        <img src="Wallet-icon.png" alt="" />Ver mi Wallet
      </button>
      ${
        /* La píldora celebra lo que esta compra dejó; si no dejó nada
           —Tigo no da cashback— no hay nada que celebrar y el botón se
           queda solo sobre la navbar. */
        earnedHere ? cashStrip(state) : ""
      }
    </div>
  `;
}

/* El sello de compra exitosa y la animación del cashback, que se pintan
   encima de lo que haya debajo. */
function purchaseOverlays(state, { celebrate = false, cashWin = false } = {}) {
  return `
    ${
      celebrate
        ? `<div class="oky-flow-celebration" data-action="dismiss-celebration" role="button" tabindex="0">
            <div class="oky-flow-celebration-confetti" data-role="celebration-confetti"></div>
            <div class="oky-flow-stamp-group">
              <img class="oky-flow-stamp" src="oky-stamp-exitosa.png" alt="" />
              <p class="oky-flow-stamp-label">Compra exitosa</p>
              ${
                /* Microinteracción: el sello no solo confirma el pago,
                   también adelanta que esa compra generó OKY Cash. */
                state.lastEarned
                  ? `<span class="oky-flow-stamp-earned">
                      <img src="oky-cash-coin.png" alt="" />
                      <span>+${money(state.lastEarned)} en OKY Cash</span>
                    </span>`
                  : ""
              }
            </div>
          </div>`
        : ""
    }

    ${
      cashWin
        ? `<div class="oky-flow-cashwin" data-action="dismiss-cashwin" role="button" tabindex="0">
            <div class="oky-flow-cashwin-stage" data-role="cashwin-lottie"></div>
            <div class="oky-flow-cashwin-copy">
              <p class="oky-flow-cashwin-kicker">Ganaste</p>
              <p class="oky-flow-cashwin-amount"><span>$</span>${state.lastEarned.toFixed(2)}</p>
              <p class="oky-flow-cashwin-label">en OKY Cash</p>
              <span class="oky-flow-cashwin-hint">Toca para continuar</span>
            </div>
          </div>`
        : ""
    }
  `;
}

/* ── Tus compras (99140:56031) + Success (99140:56018) ─── */
function screenPurchases(state, { celebrate = false, cashWin = false } = {}) {
  /* Comprando uno solo no hay pila que abrir: se enseña el vale ya
     abierto, que es a lo que se venía. La pila es para elegir entre
     varios, y con una sola era un paso de más. */
  /* Esta pantalla es el acuse de la compra que se acaba de hacer, no
     un histórico: sale de state.lastOrder. Lo que acumula todas las
     gift cards es Mi wallet, que lee state.purchases. */
  const byBrand = [];
  state.lastOrder
    .slice()
    .reverse()
    .forEach((p) => {
      const brand = brandKeyOf(p.productKey);
      const found = byBrand.find((b) => b.brandKey === brand);
      if (found) found.count += 1;
      else byBrand.push({ key: p.productKey, id: p.id, count: 1, ...PRODUCTS[p.productKey], brandKey: brand });
    });

  /* La pila es para elegir entre varias, así que empieza en dos. Con
     una sola card se enseña el vale, lleve las unidades que lleve: tres
     hamburguesas de la misma marca son una card en la pila, y tocarla
     abría lo único que había. Desde el vale se pasan las tres con el
     carrusel. */
  if (byBrand.length === 1) {
    return screenVoucher(
      { ...state, params: { id: byBrand[0].id } },
      { asPurchase: true, celebrate, cashWin },
    );
  }

  const list = byBrand;
  const earnedHere = state.lastEarned > 0;

  return `
    ${statusBar()}
    ${titledHeader("Tus compras", { trailing: "fa-receipt" })}

    <div class="oky-flow-section">
      ${
        list.length
          ? `<div class="oky-flow-stack">
              ${list
                .map(
                  (v) => {
                  const mark = stackMark(v);
                  return `
                <button class="oky-flow-voucher" style="background:${mark.bg};border-color:${mark.bg}"
                  data-action="open-purchase" data-id="${v.id}" type="button">
                  <img src="${mark.art}" alt="${v.label}" />
                  <span class="oky-flow-voucher-badge">${v.count}<i class="fa-solid fa-circle-check" aria-hidden="true"></i></span>
                </button>
              `;
                })
                .join("")}
            </div>`
          : `<p class="oky-flow-empty">Todavía no tienes compras.</p>`
      }
    </div>

    ${purchaseFoot(state)}
    ${navbar("", state)}
    ${purchaseOverlays(state, { celebrate, cashWin })}
  `;
}

/* La tarjeta de OKY Cash, con el saldo al día y el diseño elegido.
   Las tres pantallas que la pintan pasan por aquí. */
/* cta: acción del botón. null lo quita; false lo deja sin enlace, solo
   como rótulo. label pisa el texto por defecto. */
function okyCashCard(state, { balance, cta, label, edit = true } = {}) {
  const card = { ...findPaymentCard("Molecule/Payment Card/OKY Cash Black") };
  card.balance = { ...card.balance, value: (balance ?? state.okyCashBalance).toFixed(2) };

  /* Con el saldo en cero no hay actividad que ver: el CTA pasa a
     explicar qué es OKY Cash en vez de llevar a una lista vacía. */
  const amount = balance ?? state.okyCashBalance;
  card.cta =
    cta === null
      ? null
      : {
          ...card.cta,
          label: label || (amount > 0 ? card.cta.label : "Conoce más"),
          action: cta === false ? "" : cta || "nav:okycash",
        };
  /* El lápiz abre el selector de diseño, y solo vive en la pestaña de
     OKY Cash del wallet. En métodos de pago se está eligiendo con qué
     pagar, no cambiando el aspecto de la tarjeta; el lápiz ahí era una
     salida a otra cosa en mitad de la compra. */
  if (edit) {
    card.editAction = "nav:carddesign";
  } else {
    card.editIcon = null;
    card.editAction = null;
  }
  const design = findCardDesign(state.cardDesign);
  return { ...card, ...design.style, art: design.art, artClass: design.artClass };
}

/* Categorías del wallet. Cada marca cae en una y el filtro se arma
   solo con las que tienen algo dentro: ofrecer una categoría vacía es
   ofrecer un callejón. */
const WALLET_CATEGORIES = [
  { key: "comida", label: "Comida y restaurantes" },
  { key: "moda", label: "Moda" },
  { key: "tecnologia", label: "Tecnología y entretenimiento" },
  { key: "hogar", label: "Hogar" },
  { key: "transporte", label: "Transporte" },
  { key: "servicios", label: "Servicios y recargas" },
];

const CATEGORY_OF = {
  starbucks: "comida",
  seveneleven: "comida",
  burgerking: "comida",
  burgerkingsv: "comida",
  ihop: "comida",
  mcdonalds: "comida",
  dominos: "comida",
  applebees: "comida",
  krispy: "comida",
  pollocampero: "comida",
  pollogranjero: "comida",
  dominosgt: "comida",
  nike: "moda",
  adidas: "moda",
  gap: "moda",
  oldnavy: "moda",
  underarmour: "moda",
  macys: "moda",
  ulta: "moda",
  apple: "tecnologia",
  xbox: "tecnologia",
  googleplay: "tecnologia",
  amazon: "tecnologia",
  ebay: "tecnologia",
  homedepot: "hogar",
  target: "hogar",
  lyft: "transporte",
  eegsa: "servicios",
  tigohogar: "servicios",
  tigo: "servicios",
};

/* El wallet se navega por tipo y se ordena por estado. El plateu de
   arriba elige el tipo —OKY Cash, gift cards, vales, servicios— y
   dentro, las secciones plegables separan los tres estados en que
   puede estar un vale. Un vale cae en uno solo, nunca en dos. */
const WALLET_TABS = [
  { key: "cash", label: "OKY Cash", title: "OKY Cash", icon: "oky-cash-coin.png" },
  { key: "gift", label: "Gift Cards", title: "Gift Cards", icon: "plateu-giftcards.png" },
  { key: "vales", label: "OKY Vales", title: "OKY Vales", icon: "plateu-vales.png" },
  { key: "servicios", label: "Servicios", title: "Servicios", icon: "plateu-servicios.png" },
];

/* La cabecera dice en qué pestaña estás. El wallet es un solo sitio,
   pero se entra a él desde cuatro puertas distintas —la moneda de la
   barra, las píldoras de saldo, el icono del home, el final de una
   compra— y cada una apunta a una pestaña: el título confirma al
   aterrizar que llegaste a donde ibas. */
function walletTitle(state) {
  const tab = WALLET_TABS.find((t) => t.key === state.walletTab);
  return tab ? tab.title : "Mi wallet";
}

const WALLET_GROUPS = [
  { key: "activos", label: "Activos", icon: "fa-ticket", empty: "Nada activo por aquí." },
  { key: "compartidos", label: "Compartidos", icon: "fa-paper-plane", empty: "Todavía no has compartido nada." },
  { key: "archivados", label: "Archivados", icon: "fa-box-archive", empty: "Nada archivado." },
];

/* Todo lo de una sección, pasado por el filtro de la pestaña. Archivar
   no borra —el vale sigue existiendo— solo lo manda a su sección. */
function walletDeck(state, section, { filtered = true } = {}) {
  const all =
    section === "gift"
      ? walletVouchers(state)
      : mergeWalletSection(walletVouchers(state, section), WALLET_EXTRAS[section]);
  const mode = filtered ? state.walletFilter : "";
  if (!mode) return all;
  return all.filter((v) => CATEGORY_OF[v.key] === mode);
}

/* Los vales sueltos de un estado concreto. Compartido y sin compartir
   solo hablan de lo que sigue en uso: archivado gana a los dos, porque
   es la decisión más reciente que tomó la persona. */
function walletGroupUnits(state, section, group, opts) {
  return expandUnits(walletDeck(state, section, opts))
    .filter((v) => unitGroup(state, v.key, v.unit) === group)
    .map((v) => ({
      /* Lo archivado no puede estrenarse: se guardó a propósito, y un
         punto de "nuevo" ahí pediría atención para algo que la persona
         acaba de quitar de en medio. */
      ...v,
      isNew: group === "archivados" ? false : unitIsNew(state, v.key, v.unit),
    }));
}

/* Y cómo se ven en la lista: los de una misma marca se acumulan en una
   card con su contador. Son pilas distintas por estado —dos Nike
   activas y una archivada son dos cards, no una— porque lo que las
   junta es la marca *y* dónde están. */
function walletGroupDeck(state, section, group, opts) {
  const cards = [];
  walletGroupUnits(state, section, group, opts).forEach((v) => {
    const brand = brandKeyOf(v.key);
    const found = cards.find((c) => c.brandKey === brand);
    if (found) {
      found.count += 1;
      found.units.push(v.unit);
      found.amounts.push(v.amount);
      /* La pila se estrena si cualquiera de los suyos está sin ver:
         el punto habla de la card, y la card son todos. */
      if (v.isNew && group !== "archivados") {
        found.isNew = true;
        if (found.openUnit == null) found.openUnit = v.unit;
      }
      return;
    }
    cards.push({
      ...v,
      brandKey: brand,
      isNew: v.isNew,
      /* Tocar la pila abre el primero sin abrir, no el de más abajo:
         el punto dice que ahí dentro hay algo nuevo, y llevarte a un
         vale ya visto dejaría el punto encendido sin explicación. */
      openUnit: v.isNew ? v.unit : null,
      count: 1,
      units: [v.unit],
      amounts: [v.amount],
    });
  });
  return cards;
}

/* Solo las categorías con marcas en la pestaña abierta, y cuántas hay
   en cada una: el contador evita abrir para descubrir que no hay nada,
   y ofrecer categorías de otra pestaña sería ofrecer un callejón. */
function walletCategories(state, section = state.walletTab) {
  const items = walletDeck(state, section, { filtered: false });
  return WALLET_CATEGORIES.map((cat) => ({
    ...cat,
    count: items.filter((v) => CATEGORY_OF[v.key] === cat.key).length,
  })).filter((cat) => cat.count > 0);
}

/* El mazo del carrusel del vale: lo que está en uso de esa sección, en
   cualquiera de ellas. Lo archivado sale del carrusel y se abre solo
   —desde el filtro—; para volver al mazo hay que desarchivarlo. */
function voucherCarousel(state, section, key, unit = 0) {
  /* Mismo mazo que la lista de la que se entró: el carrusel recorre el
     estado del vale abierto y nada más, así que deslizando no aparece
     una compartida entre las activas ni una archivada entre las vivas. */
  const group = unitGroup(state, key, unit);
  const units = walletGroupUnits(state, section, group);
  if (units.some((v) => v.key === key && v.unit === unit)) return units;
  const all = expandUnits(
    section === "gift"
      ? walletVouchers(state)
      : mergeWalletSection(walletVouchers(state, section), WALLET_EXTRAS[section]),
  );
  return all.filter((v) => v.key === key && v.unit === unit);
}

function sectionOfVoucher(key) {
  if (PRODUCTS[key] && PRODUCTS[key].wallet) return PRODUCTS[key].wallet;
  if (WALLET_EXTRAS.vales.some((v) => v.key === key)) return "vales";
  if (WALLET_EXTRAS.servicios.some((v) => v.key === key)) return "servicios";
  return "gift";
}

/* Cuántas cards se apilan de una vez en cada sección del wallet. Más
   allá de eso la pila deja de leerse y hay que dibujar de más, así que
   el resto entra por tandas con "Ver más". */
const WALLET_PAGE = 5;

/* La bandera dice de qué marketplace salió la tarjeta. Por defecto, el
   de su sección: las gift cards vienen del catálogo de Norteamérica y
   los vales y servicios del de Centroamérica. */
function countryOfSection(section) {
  return section === "gift" ? "US" : "GT";
}

/* Pero cada marca es de donde es: el folder ofrece la región entera y
   el wallet lo enseña —un vale de Pollo Granjero salvadoreño, uno de
   Domino's hondureño, una gift card canadiense—. Lo que no está aquí
   se queda con el país de su sección. */
const VOUCHER_COUNTRY = {
  /* Pollo Granjero y Pollo Campero son de Guatemala y de ahí no salen,
     así que las otras banderas van a marcas que sí operan en esos
     países. */
  burgerkingsv: "SV",
  dominosgt: "HN",
  underarmour: "CA",
};

function countryOfVoucher(key, section) {
  return VOUCHER_COUNTRY[brandKeyOf(key)] || countryOfSection(section);
}

function walletVoucherButton(v, deck, group = "activos") {
  const country = countryOfVoucher(v.key, deck);
  const mark = stackMark(v);
  return `
    <button class="oky-flow-voucher${group === "archivados" ? " is-archived" : ""}"
      style="background:${mark.bg};border-color:${mark.bg}"
      data-action="open-voucher" data-key="${v.key}" data-unit="${v.openUnit ?? (v.units || [0])[0]}"
      data-deck="${deck}" data-group="${group}"
      type="button" aria-label="${v.label}">
      <img src="${mark.art}" alt="${v.label}" />
      ${v.isNew ? `<span class="oky-flow-voucher-dot" aria-label="Nuevo"></span>` : ""}
      <span class="oky-flow-voucher-badge">
        ${v.count}
        <span class="oky-flow-voucher-badge-flag">${renderFlag({ code: country, size: "Small" })}</span>
      </span>
    </button>
  `;
}

/* El sello de archivado. La familia de sellos del sistema es la misma
   —medallón festoneado, icono dentro y banda con la palabra—, pero este
   no existe como asset, así que se dibuja aquí para poder darle los
   grises: archivado no es un logro, es algo guardado. */
function archivedSeal() {
  return `
    <svg class="oky-flow-seal-archived" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="#9EA4AD">
        <circle cx="100.00" cy="18.00" r="12.50"/>
        <circle cx="125.31" cy="22.46" r="12.50"/>
        <circle cx="147.57" cy="35.31" r="12.50"/>
        <circle cx="164.09" cy="55.00" r="12.50"/>
        <circle cx="172.88" cy="79.15" r="12.50"/>
        <circle cx="172.88" cy="104.85" r="12.50"/>
        <circle cx="164.09" cy="129.00" r="12.50"/>
        <circle cx="147.57" cy="148.69" r="12.50"/>
        <circle cx="125.31" cy="161.54" r="12.50"/>
        <circle cx="100.00" cy="166.00" r="12.50"/>
        <circle cx="74.69" cy="161.54" r="12.50"/>
        <circle cx="52.43" cy="148.69" r="12.50"/>
        <circle cx="35.91" cy="129.00" r="12.50"/>
        <circle cx="27.12" cy="104.85" r="12.50"/>
        <circle cx="27.12" cy="79.15" r="12.50"/>
        <circle cx="35.91" cy="55.00" r="12.50"/>
        <circle cx="52.43" cy="35.31" r="12.50"/>
        <circle cx="74.69" cy="22.46" r="12.50"/>
        <circle cx="100" cy="92" r="74"/>
      </g>
      <circle cx="100" cy="92" r="62" fill="#8A9099"/>
      <circle cx="100" cy="92" r="55" fill="#FFFFFF"/>
      <g fill="#9EA4AD">
        <rect x="65" y="52" width="70" height="19" rx="6"/>
        <path d="M72 77h56a3.5 3.5 0 0 1 3.5 3.7l-3.7 44a7 7 0 0 1-7 6.3H79.2a7 7 0 0 1-7-6.3l-3.7-44A3.5 3.5 0 0 1 72 77Z"/>
      </g>
      <rect x="87" y="90" width="26" height="8" rx="4" fill="#FFFFFF"/>
      <rect x="26" y="150" width="148" height="40" rx="8" fill="#8A9099"/>
      <text x="100" y="179" text-anchor="middle" fill="#FFFFFF"
        font-family="Nunito Sans, Lato, sans-serif" font-size="25" font-weight="700">Archivado</text>
    </svg>
  `;
}

/* ¿Este vale suelto está sin abrir? Lo está si se compró y todavía no
   se ha abierto. Se pregunta por las compras y no por el índice porque
   cada sección coloca sus muestras distinto —las gift cards las ponen
   delante y los vales las quitan cuando ya compraste esa marca—, y lo
   que se estrena es lo comprado, nunca una muestra. */
function unitIsNew(state, key, unit = 0) {
  const id = unitId(key, unit);
  if (state.seenVouchers.includes(id)) return false;
  return state.purchases.some(
    (p) => p.productKey === key && unitId(p.productKey, unitOfPurchase(state, p)) === id,
  );
}

/* ¿Queda alguna gift card comprada que todavía no se haya abierto? */
function hasNewVouchers(state) {
  /* Lo archivado ya no estrena nada: si se compró, se compartió y se
     archivó desde el final de la compra, el icono del home no tiene
     de qué avisar. Con varios comprados y alguno todavía sin archivar,
     el punto se queda por esos. */
  return state.purchases.some((p) => {
    const id = unitId(p.productKey, unitOfPurchase(state, p));
    if (state.archivedVouchers.includes(id)) return false;
    return !state.seenVouchers.includes(id);
  });
}

const WALLET_SECTIONS = ["gift", "vales", "servicios"];

/* Con qué pestaña abre el wallet: la del tipo que trae algo recién
   comprado y sin abrir —lo mismo que enciende el punto del icono— y,
   si no hay novedades, las gift cards, que es lo que más se guarda. */
function walletEntryTab(state) {
  return (
    WALLET_SECTIONS.find((section) =>
      walletDeck(state, section, { filtered: false }).some((v) => v.isNew),
    ) || "gift"
  );
}

/* Y con qué secciones abiertas: la que trae novedades si la hay y, si
   no, Activos, que es lo que queda por hacer. Archivados nunca se abre
   solo: ahí va lo que la persona decidió quitar de en medio. */
function walletOpenGroups(state, section = state.walletTab) {
  const withNews = WALLET_GROUPS.find(
    (g) => g.key !== "archivados" && walletGroupDeck(state, section, g.key, { filtered: false }).some((v) => v.isNew),
  );
  return [withNews ? withNews.key : "activos"];
}

/* Los vales del wallet: primero lo que la persona compró de verdad,
   agrupado por marca y con su cantidad, y detrás las marcas de muestra
   que todavía no ha comprado. Aquí sí se acumula — este es el
   repositorio de gift cards. */
/* Lo comprado manda sobre la muestra: si Tigo ya se compró, el vale de
   ejemplo de esa misma marca no se repite debajo. */
function mergeWalletSection(owned, demo = []) {
  return [...owned, ...demo.filter((v) => !owned.some((o) => o.key === v.key))];
}

/* section: "gift" o "vales" — dónde guarda cada producto lo comprado. */
function walletVouchers(state, section = "gift") {
  const owned = [];
  state.purchases
    .slice()
    .reverse()
    .forEach((purchase) => {
      const found = owned.find((v) => v.key === purchase.productKey);
      if (found) {
        found.count += 1;
        found.amounts.push(purchase.amount);
        found.units.push(unitOfPurchase(state, purchase));
        return;
      }

      const product = PRODUCTS[purchase.productKey];
      if ((product.wallet || "gift") !== section) return;
      owned.push({
        key: product.key,
        label: product.label,
        art: product.art,
        bg: product.bg,
        count: 1,
        amounts: [purchase.amount],
        /* La pila se dibuja con la compra más reciente delante, pero el
           índice de cada unidad es el suyo de siempre: sin esta lista
           el índice salía de la posición en la pila y se movía cada vez
           que se compraba otro igual. */
        units: [unitOfPurchase(state, purchase)],
        live: true,
      });
    });

  /* Las gift cards traen además las marcas de muestra; los vales no,
     que esos vienen de WALLET_EXTRAS. Si de una marca hay muestra y
     compra, los montos de la muestra van delante: así el vale que ya
     estaba conserva su índice —y con él su estado— cuando se compra
     otro de la misma marca. */
  const demo = section === "gift" ? WALLET_VOUCHERS : [];
  const extra = [];
  demo.forEach((v) => {
    const amounts = (v.amounts || [v.amount]).filter((a) => a != null);
    const found = owned.find((o) => o.key === v.key);
    if (found) {
      found.amounts = [...amounts, ...found.amounts];
      found.units = [...amounts.map((_, i) => i), ...found.units];
      found.count = found.amounts.length;
      return;
    }
    extra.push({ ...v, amounts, units: amounts.map((_, i) => i), count: amounts.length });
  });

  /* La pila se estrena si cualquiera de los suyos está sin abrir: el
     punto habla de la card, y la card son todos. */
  return [...owned, ...extra].map((v) => ({
    ...v,
    isNew: (v.units || []).some((u) => unitIsNew(state, v.key, u)),
  }));
}

/* ── Mi wallet (99105:43773) ────────────────────────────── */
function screenWallet(state) {
  const tab = state.walletTab;
  const isCash = tab === "cash";

  /* Cuántas hay en cada estado de la pestaña abierta, y cuántas de
     ellas están sin abrir. La lista dibuja una card por marca, pero la
     cabecera cuenta vales: dos Krispy y tres Lyft son cinco cosas
     guardadas, no dos. De ahí que el total salga de las unidades y no
     del mazo ya agrupado.

     El aviso de novedades cuenta igual: "visto" se guarda por vale
     —seenVouchers lleva claves de unidad—, así que tres Lyft comprados
     y sin abrir avisan tres, y abrir uno deja dos. */
  const decks = Object.fromEntries(
    WALLET_GROUPS.map((g) => [g.key, isCash ? [] : walletGroupDeck(state, tab, g.key)]),
  );
  const units = Object.fromEntries(
    WALLET_GROUPS.map((g) => [g.key, isCash ? [] : walletGroupUnits(state, tab, g.key)]),
  );
  const newsIn = (group) => units[group].filter((v) => v.isNew).length;
  const totalIn = (group) => units[group].length;

  /* Cabecera de sección: pliega, dice cuántas guarda —a la derecha,
     junto al chevron— y, si trae novedades, las avisa con un punto en
     la esquina. Archivados no avisa: ahí no hay nada que estrenar. */
  const sectionHead = (group, count, news) => {
    const open = state.openGroups.includes(group.key);
    return `
      <button class="oky-flow-section-head is-tappable" data-action="toggle-section" data-section="${group.key}"
        type="button" aria-expanded="${open}">
        ${
          news && group.key !== "archivados"
            ? `<span class="oky-flow-section-news" aria-label="${news} sin abrir">${news}</span>`
            : ""
        }
        <span class="oky-flow-section-head-label">
          <i class="fa-solid ${group.icon}" aria-hidden="true"></i>${group.label}
        </span>
        <span class="oky-flow-section-head-meta">
          <span class="oky-flow-section-count">(${count})</span>
          <i class="fa-solid fa-chevron-down oky-flow-section-caret" aria-hidden="true"></i>
        </span>
      </button>
    `;
  };

  const body = (key, content) => `
    <div class="oky-flow-section-body ${state.openGroups.includes(key) ? "" : "is-collapsed"}">
      <div>${content}</div>
    </div>
  `;

  /* De la pila solo se dibujan las primeras; el resto llega por tandas
     del mismo tamaño cuando se pide. */
  const stack = (items, group, empty) => {
    if (!items.length) return `<p class="oky-flow-empty">${empty}</p>`;
    const slot = `${tab}:${group}`;
    const shown = state.walletShown[slot] || WALLET_PAGE;
    const visible = items.slice(0, shown);
    return `
      <div class="oky-flow-stack" data-stack="${slot}">
        ${visible.map((v) => walletVoucherButton(v, tab, group)).join("")}
      </div>
      ${
        items.length > visible.length
          ? `<div class="oky-flow-stack-more">
              <button class="btn btn-primary btn-small" data-action="wallet-more" data-section="${slot}" type="button">
                Ver más
              </button>
            </div>`
          : ""
      }
    `;
  };

  return `
    ${statusBar()}
    ${titledHeader(walletTitle(state))}

    <section class="plateu-molecule is-static is-default oky-flow-wallet-nav" role="tablist" aria-label="Tipo de vale">
      <div class="plateu-track is-static">
        ${WALLET_TABS.map(
          (t) => `
          <button class="plateu-item${t.key === tab ? " is-on" : ""}" type="button" role="tab"
            data-action="wallet-tab" data-section="${t.key}" aria-selected="${t.key === tab}">
            <div class="plateu-icon-wrap"><img class="plateu-icon" src="${t.icon}" alt="" /></div>
            ${
              t.key === tab
                ? `<span class="plateu-chip is-outlined">${t.label}</span>`
                : `<span class="plateu-label">${t.label}</span>`
            }
          </button>
        `,
        ).join("")}
      </div>
    </section>

    ${
      /* OKY Cash no es un repositorio de vales: su pestaña enseña la
         tarjeta y nada más, haya saldo o no. Sin estados que separar,
         tampoco hay filtro que ofrecer. */
      isCash
        ? okyCashActivity(state)
        : `
      <div class="oky-flow-wallet-filter">
        <span class="oky-flow-wallet-filter-label">${walletFilterLabel(state)}</span>
        ${
          state.walletFilter
            ? `<button class="btn btn-primary btn-small oky-flow-filter-btn is-on" data-action="clear-filter" type="button">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>&nbsp;Quitar filtro
              </button>`
            : `<button class="btn btn-outlined btn-small oky-flow-filter-btn" data-action="open-filter" type="button">
                <i class="fa-solid fa-sliders" aria-hidden="true"></i>&nbsp;${tab === "servicios" ? "Ordenar" : "Filtrar"}
              </button>`
        }
      </div>

      <div class="oky-flow-section" style="gap:12px">
        ${WALLET_GROUPS.map(
          (g) => `
          ${sectionHead(g, totalIn(g.key), newsIn(g.key))}
          ${body(g.key, stack(decks[g.key], g.key, g.empty))}
        `,
        ).join("")}
      </div>
    `
    }

    ${navbar(isCash ? "okycash" : "", state)}
  `;
}

/* ── OKY Cash: la pestaña de saldo de Mi wallet (99135:103474) ─
   Era una pantalla aparte y enseñaba la misma tarjeta que la pestaña
   de OKY Cash del wallet, con la actividad debajo. Dos sitios para lo
   mismo, y el bueno escondido: ahora es el cuerpo de esa pestaña. */
function okyCashActivity(state) {
  /* Aquí ya estás en la actividad, así que el CTA no lleva a ninguna
     parte: se queda como rótulo, invitando a conocer el programa. */
  const cash = okyCashCard(state, { cta: false, label: "Conoce más" });

  /* Los movimientos se agrupan por mes conservando el orden. */
  const groups = [];
  state.activity.forEach((entry) => {
    const label = entry.group || monthGroup(0);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(entry);
    else groups.push({ label, items: [entry] });
  });

  /* Los dos chips son la misma pareja vista al derecho y al revés:
     flecha arriba lo que entra, flecha abajo lo que sale. El check de
     antes decía "correcto", no "subió", y no se leía contra su opuesto. */
  const chipFor = (positive) =>
    positive
      ? { label: "Ganado", tone: "success", icon: "fa-circle-arrow-up" }
      : { label: "Usado", tone: "neutral", icon: "fa-circle-arrow-down" };

  const historyRow = ({ date, amount, order, positive }) =>
    renderHistoryCard({
      key: "oky-cash",
      id: "99135:104411",
      layout: "row",
      /* Montón de monedas lo que entra, una sola lo que sale. El
         fa-coin suelto es exclusivo de Font Awesome Pro y el archivo
         standalone carga las caras Free —saldría como caja—, así que
         para el débito va el signo de dólar dentro del círculo, que a
         este tamaño se lee como una moneda. */
      icon: { glyph: positive ? "fa-coins" : "fa-dollar-sign", weight: "fa-solid" },
      date,
      amount,
      /* El signo manda el color: verde oscuro lo que entra, rojo lo que
         sale. La molécula ya acepta el tono por argumento. */
      amountTone: positive ? "credit" : "debit",
      meta: { type: "order", note: order },
      chip: chipFor(positive),
    });

  /* La lista arranca por orden, no por vale: una fila por compra con lo
     que movió en total. El desglose por marca —que es lo bueno— queda
     detrás de un toque, así que la primera pantalla no abruma. */
  const orderRow = (order) => {
    /* Lo que salió y lo que entró son dos hechos distintos y cada uno
       lleva su card. Arriba lo acreditado y debajo lo debitado: leer
       primero lo que ganaste deja mejor sabor que abrir la compra con un
       número en rojo. La línea del pago ya no está en el desglose, vive
       en su propia card. */
    const debits = order.items.filter((i) => i.kind === "debit");
    const credits = order.items.filter((i) => i.kind !== "debit");

    const spent = debits.reduce((sum, i) => sum + (i.value || 0), 0);
    const earned = credits.reduce((sum, i) => sum + (i.value || 0), 0);

    /* Lo usado también se abre: saber cuánto bajó el saldo sirve de
       poco si no se ve en qué marcas se fue. Mismo panel que el de lo
       ganado, con su propia clave para que los dos no se abran a la
       vez. */
    const usedDetail = debits.flatMap((i) => i.detail || []);
    const debitId = `${order.id}#usado`;
    const debitOpen = state.openOrders.includes(debitId);
    const debitRow = debits.length
      ? historyRow({
          date: order.date,
          amount: `- ${money(Math.abs(spent))}`,
          order: order.id,
          positive: false,
        })
      : "";
    const debitCard =
      debits.length && usedDetail.length
        ? `
        <div class="oky-flow-order has-panel ${debitOpen ? "is-open" : ""}" data-action="toggle-order"
          data-order="${debitId}" role="button" tabindex="0" aria-expanded="${debitOpen}">
          ${debitRow}
          <div class="oky-flow-order-panel">
            <span class="oky-flow-order-toggle">
              ${usedDetail.length} marca${usedDetail.length > 1 ? "s" : ""}
              <i class="fa-solid fa-chevron-${debitOpen ? "up" : "down"}" aria-hidden="true"></i>
            </span>
            ${
              debitOpen
                ? `<ul class="oky-flow-order-detail">
                    ${usedDetail
                      .map(
                        (i) => `
                      <li class="oky-flow-order-line">
                        <span>${i.label}</span>
                        <span class="is-debit">${i.amount}</span>
                      </li>
                    `,
                      )
                      .join("")}
                  </ul>`
                : ""
            }
          </div>
        </div>
      `
        : debitRow;

    if (!credits.length) return debitCard;

    /* También con un solo movimiento se despliega: que unas órdenes
       abran y otras no obliga a adivinar cuáles esconden algo. Abrir y
       encontrar la marca con el mismo monto confirma de dónde salió. */
    const open = state.openOrders.includes(order.id);

    return `
      <div class="oky-flow-order has-panel ${open ? "is-open" : ""}" data-action="toggle-order"
        data-order="${order.id}" role="button" tabindex="0" aria-expanded="${open}">
        ${historyRow({
          date: order.date,
          amount: `+ ${money(earned)}`,
          order: order.id,
          positive: true,
        })}
        <div class="oky-flow-order-panel">
          <span class="oky-flow-order-toggle">
            ${credits.length} movimiento${credits.length > 1 ? "s" : ""}
            <i class="fa-solid fa-chevron-${open ? "up" : "down"}" aria-hidden="true"></i>
          </span>
          ${
            open
              ? `<ul class="oky-flow-order-detail">
                  ${credits
                    .map(
                      (i) => `
                    <li class="oky-flow-order-line">
                      <span>${i.label || i.order}</span>
                      <span class="is-credit">${i.amount}</span>
                    </li>
                  `,
                    )
                    .join("")}
                </ul>`
              : ""
          }
        </div>
      </div>
      ${debitCard}
    `;
  };

  const rows = groups.length
    ? groups
        .map((group) => {
          /* Dentro del mes, los movimientos se juntan por orden. */
          const orders = [];
          group.items.forEach((entry) => {
            const found = orders.find((o) => o.id === entry.order);
            if (found) found.items.push(entry);
            else orders.push({ id: entry.order, date: entry.date, items: [entry] });
          });

          return `
          <div class="oky-flow-history-group">
            <h2 class="oky-flow-history-label">${group.label}</h2>
            ${orders.map(orderRow).join("")}
          </div>
        `;
        })
        .join("")
    : `<p class="oky-flow-empty">Todavía no tienes movimientos de OKY Cash.</p>`;

  return `
    <div class="oky-flow-section" style="gap:16px">
      <div style="display:flex;justify-content:center;width:100%">${renderPaymentCard(cash)}</div>

      <div class="oky-flow-home-head">
        <span class="oky-flow-section-head" style="padding:0">ACTIVIDAD</span>
        <button class="btn btn-outlined btn-small" type="button">
          <i class="fa-solid fa-sliders" aria-hidden="true"></i>&nbsp;Filtrar
        </button>
      </div>

      <div class="input-wrapper" style="width:100%">
        <i class="fa-solid fa-magnifying-glass search-icon" aria-hidden="true"></i>
        <input class="input-field search-input search-input-empty" value="" placeholder="Buscar" readonly />
      </div>

      <div class="oky-flow-history">${rows}</div>
    </div>
  `;
}

/* ── Category Page (Pages/Category Page) ─────────────────
   El otro camino a Tigo. Desde el home de Guatemala, "Recargar el
   Móvil" abre el catálogo de la categoría en vez de saltar directo al
   producto: quien va a recargar no siempre sabe con qué operador, y
   elegir marca es parte de la compra. Misma anatomía que el mockup
   —cabecera, buscador y HomeCard con la parrilla de marcas— sin el
   plateu, porque recargas no tiene subcategorías que ofrecer. */
const CATEGORY_PAGES = {
  comida: {
    title: "Invitar a comer",
    section: "Comida rápida",
    brands: [
      { key: "mcdonalds", label: "McDonald's", art: "mcdonalds.webp", action: "open-plp", brand: "mcdonalds" },
      { key: "pollogranjero", label: "Pollo Granjero", art: "pollo-granjero.webp", action: "open-guapdp", product: "gua-pollogranjero" },
      { key: "burgerking", label: "Burger King", art: "burguerking.webp", action: "open-guapdp", product: "gua-burgerking" },
      { key: "pollocampero", label: "Pollo Campero", art: "pollo-campero.webp", action: "open-guapdp", product: "gua-pollocampero" },
      { key: "ihop", label: "IHOP", art: "ihop.webp", action: "open-guapdp", product: "gua-ihop" },
      { key: "dominos", label: "Domino's", art: "dominos.png", action: "open-guapdp", product: "gua-dominos" },
    ],
  },
  recargas: {
    title: "Recargar el Móvil",
    section: "Operadores",
    brands: [
      { key: "tigo", label: "Tigo", art: "tigo.webp", action: "open-tigo" },
      { key: "claro", label: "Claro", art: "claro.webp", action: "open-guapdp", product: "gua-claro" },
    ],
  },
};

function screenCategory(state) {
  const page = CATEGORY_PAGES[state.params.category] || CATEGORY_PAGES.recargas;

  const tile = (brand) => {
    /* Solo las marcas que llevan a alguna parte se comportan como
       botón; las demás están de acompañamiento, como en el resto del
       prototipo. */
    const live = brand.action
      ? ` is-live" data-action="${brand.action}"${
          brand.brand ? ` data-brand="${brand.brand}"` : ""
        }${brand.product ? ` data-product="${brand.product}"` : ""} role="button" tabindex="0`
      : "";
    return `
      <article class="homecard-tile${live}">
        <div class="homecard-tile-logo-wrap">
          <img class="homecard-tile-logo" src="${brand.art}" alt="${brand.label}" />
        </div>
        <p class="token-brand homecard-tile-name">${brand.label}</p>
      </article>
    `;
  };

  return `
    ${statusBar()}
    ${productHeader(state, { title: page.title })}

    <div class="oky-flow-section oky-flow-category">
      <div class="input-wrapper" style="width:100%">
        <i class="fa-solid fa-magnifying-glass search-icon" aria-hidden="true"></i>
        <input class="input-field search-input search-input-empty" value="" placeholder="Buscar marcas" readonly />
      </div>

      <section class="homecard-organism">
        <header class="homecard-header">
          <h2 class="token-h6 homecard-title">${page.section}</h2>
        </header>
        <div class="homecard-content homecard-content-default">
          <div class="homecard-grid">${page.brands.map(tile).join("")}</div>
        </div>
      </section>
    </div>

    ${navbar("", state)}
  `;
}

/* ── PLP de marca (94757:61696) ──────────────────────────
   La lista de lo que vende una marca de comida. Se arma con el List /
   PLP del sistema: foto, nombre, precio —tachado el de lista si hay
   descuento— y el chip de cantidad, que es el mismo Quantity Input
   que luego aparece en el carrito. */
const FOOD_BRANDS = {
  mcdonalds: { label: "McDonald's", art: "mcdonalds.webp", bg: "#c8102e" },
};

/* Lo que enseña una card dentro de un stack. Apiladas solo se ve la
   esquina de cada una, así que lo que tiene que reconocerse es la
   marca: los vales de comida guardan la foto del producto para su
   ficha, pero en el mazo van con el logo, como todos los demás. */
/* Lo que junta dos vales en una misma card del mazo es la marca. Dos
   productos distintos de McDonald's son dos vales pero una sola card
   con el contador en dos; al tocarla se ven los dos. Para lo que no es
   comida la marca ya es la clave del producto. */
function brandKeyOf(key) {
  const product = PRODUCTS[key] || {};
  return product.food && product.brand ? `marca:${product.brand}` : key;
}

/* Dos de cada tres gift cards de USA se canjean con un código corto;
   la otra llega con barcode y PIN, que es como las mandan algunas
   marcas. Cuál le toca a cada vale no se sortea en cada pintado: sale
   de su propia identidad, para que abrir y cerrar la ficha no le
   cambie las credenciales. */
function hashOf(text) {
  let h = 0;
  for (let i = 0; i < String(text).length; i += 1) h = (h * 31 + String(text).charCodeAt(i)) | 0;
  return Math.abs(h);
}

/* Un código de 23 caracteres en grupos de cinco: así se lee y se
   teclea sin perder la cuenta. */
const GIFT_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
/* Identificador solo de dígitos, para los servicios: el ID de pago que
   pide la boleta de la luz o del internet no es un código de canje, es
   un número largo que se teclea. */
function digitsOf(seed, length = 15) {
  let out = "";
  let h = hashOf(seed) || 7;
  for (let i = 0; i < length; i += 1) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    out += String(h % 10);
  }
  return out;
}

function giftCode(seed, length = 23) {
  let out = "";
  let h = hashOf(seed) || 7;
  for (let i = 0; i < length; i += 1) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    out += GIFT_CODE_ALPHABET[h % GIFT_CODE_ALPHABET.length];
    if ((i + 1) % 5 === 0 && i + 1 < length) out += " ";
  }
  return out;
}

function stackMark(v) {
  const product = PRODUCTS[v.key] || v;
  const brand = product.food && FOOD_BRANDS[product.brand];
  return brand ? { art: brand.art, bg: brand.bg } : { art: v.art || product.art, bg: v.bg || product.bg };
}

/* La cantidad en el carrito, en la misma banda donde los vales de monto
   ponen el lápiz: un botón redondo de 40 igual que aquéllos. Con uno
   dice "+"; a partir de dos dice el número, y tocar el número abre la
   caja hacia la izquierda con los dos pasos, quitar y poner. Se cierra
   sola a los pocos segundos: la caja abierta es un estado de paso, no
   algo que haya que recoger. */
function cartQty(product, qty, open) {
  /* Abierta es el paso de siempre: menos, cuántos y más, con el número
     en medio. Cerrada es un botón y ya. Bajando a uno no hay nada que
     pasar, así que vuelve al "+". */
  if (open && qty > 1) {
    return `
      <span class="oky-flow-cart-qty is-open" data-role="cart-qty">
        <button class="oky-flow-cart-qty-btn is-less" data-action="food-less" data-product="${product.key}"
          type="button" aria-label="Quitar uno de ${product.label}">
          <i class="fa-solid fa-minus" aria-hidden="true"></i>
        </button>
        <span class="oky-flow-cart-qty-btn is-count is-plain">${qty}</span>
        <button class="oky-flow-cart-qty-btn is-more" data-action="food-more" data-product="${product.key}"
          type="button" aria-label="Agregar otro ${product.label}">
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
        </button>
      </span>`;
  }

  const label = qty > 1 ? String(qty) : `<i class="fa-solid fa-plus" aria-hidden="true"></i>`;
  return `
    <span class="oky-flow-cart-qty" data-role="cart-qty">
      ${/* El primer "+" deja la caja abierta: la segunda unidad casi
            nunca es la última, y así el paso queda a mano sin tener que
            tocar el número para pedirlo. */ ""}
      <button class="oky-flow-cart-qty-btn is-count" data-action="${qty > 1 ? "open-qty" : "food-more"}"
        data-product="${product.key}" type="button" ${qty > 1 ? "" : 'data-open="1"'}
        aria-label="${qty > 1 ? `Cambiar la cantidad de ${product.label}` : `Agregar ${product.label}`}">
        ${label}
      </button>
    </span>`;
}

function foodQtyChip(product, qty) {
  /* Add0 mientras no hay nada; en cuanto entra uno, el chip crece y
     deja quitar: menos en cuanto hay dos, papelera cuando queda uno. */
  if (!qty) {
    return `
      <button class="chip-ds chip-ds-add0 chip-ds-shadow list-plp-action" type="button"
        data-action="food-more" data-product="${product.key}" aria-label="Agregar ${product.label}">
        <i class="fa-solid fa-plus" aria-hidden="true"></i>
      </button>`;
  }
  const less = `
    <button class="chip-ds-step" type="button" data-action="food-less" data-product="${product.key}"
      aria-label="Quitar uno de ${product.label}">
      <i class="fa-solid ${qty > 1 ? "fa-minus" : "fa-trash-can"} chip-ds-pill-icon${qty > 1 ? "" : " chip-ds-trash"}" aria-hidden="true"></i>
    </button>`;
  const more = `
    <button class="chip-ds-step" type="button" data-action="food-more" data-product="${product.key}"
      aria-label="Agregar otro ${product.label}">
      <i class="fa-solid fa-plus chip-ds-pill-icon" aria-hidden="true"></i>
    </button>`;
  return `
    <span class="chip-ds ${qty > 1 ? "chip-ds-add2" : "chip-ds-add1"} chip-ds-shadow list-plp-action">
      ${less}
      <span class="chip-ds-number">${qty}</span>
      ${more}
    </span>`;
}

function foodBrandHeader(state, brand, { active = "productos" } = {}) {
  const tabs = [
    { key: "productos", label: "Productos", icon: "plateu5.png" },
    { key: "vales", label: "Vales", icon: "plateu-vales.png" },
    { key: "ofertas", label: "Ofertas", icon: "plateu-ofertas.png" },
  ];
  return `
    ${productHeader(state, { title: brand.label, small: true })}
    <div class="oky-flow-foodbrand">
      <div class="oky-flow-foodbrand-logo">
        <img src="${brand.art}" alt="${brand.label}" />
      </div>
      <section class="plateu-molecule is-static is-default oky-flow-foodbrand-plateu" aria-label="Secciones de la marca">
        <div class="plateu-track is-static">
          ${tabs
            .map(
              (t) => `
            <div class="plateu-item">
              <div class="plateu-icon-wrap"><img class="plateu-icon" src="${t.icon}" alt="" /></div>
              ${t.key === active ? `<span class="plateu-chip is-outlined">${t.label}</span>` : `<span class="plateu-label">${t.label}</span>`}
            </div>
          `,
            )
            .join("")}
        </div>
      </section>
    </div>
  `;
}

function screenPlp(state) {
  const key = state.params.brand || "mcdonalds";
  const brand = FOOD_BRANDS[key] || FOOD_BRANDS.mcdonalds;
  const items = FOOD_PRODUCTS.filter((f) => f.brand === key);
  const qtyOf = (product) => (state.cart.find((i) => i.productKey === product.key) || {}).qty || 0;

  const row = (product) => {
    const off = product.was ? Math.round((1 - product.price / product.was) * 100) : 0;
    return `
      <div class="list-plp-row is-live" data-action="open-food" data-product="${product.key}" role="button" tabindex="0">
        <div class="list-plp-image"><img src="${product.art}" alt="${product.label}" /></div>
        <div class="list-plp-copy">
          <div class="token-product-text-plp">${product.label}</div>
          <div class="list-plp-prices">
            <span class="token-price-tag token-price-tag-plp${product.was ? "" : " is-plain"}">${money(product.price)}</span>
            ${product.was ? `<span class="token-price token-price-plp">${money(product.was)}</span>` : ""}
          </div>
          ${
            off
              ? `<div class="discount-ribbon discount-ribbon-list is-tier-base">
                  <span class="discount-ribbon-text token-price-percent">${off}% OFF</span>
                </div>`
              : ""
          }
        </div>
        ${foodQtyChip(product, qtyOf(product))}
      </div>
    `;
  };

  return `
    ${statusBar()}
    ${foodBrandHeader(state, brand)}
    <div class="oky-flow-section oky-flow-plp${cartServiceCount(state) ? " has-foodbar" : ""}">
      ${items.map(row).join("")}
    </div>
    ${cartServiceCount(state) ? foodCartBar(state) : ""}
    ${navbar("", state)}
  `;
}

/* La barra de la PLP: mientras haya algo en el carrito, seguir viendo
   o ir a pagar sin volver atrás. Encima, lo que se lleva ahorrado —que
   es el argumento para seguir llenando— (94757:61737). */
function foodCartBar(state) {
  const savings = cartSavings(state);
  return `
    <div class="oky-flow-foodbar" data-role="foodbar">
      ${
        savings > 0
          ? `<div class="oky-flow-foodbar-save"><i class="fa-solid fa-tag" aria-hidden="true"></i>&nbsp;Llena el carrito. Vas ahorrando ${money(savings)}</div>`
          : ""
      }
      <div class="oky-flow-foodbar-ctas">
        <button class="btn btn-outlined btn-large" data-action="open-category" data-category="comida"
          type="button">Seguir comprando</button>
        <button class="btn btn-primary btn-large" data-action="open-cart" type="button">Ver carrito</button>
      </div>
    </div>
  `;
}

/* ── PDP de producto de comida (94758:72010) ──────────────
   Sin slider ni campo: el precio lo pone la marca. Solo la foto, lo
   que incluye y el botón de agregar. */
function screenFoodPdp(state) {
  const product = PRODUCTS[state.params.product] || PRODUCTS[FOOD_PRODUCTS[0].key];
  const brand = FOOD_BRANDS[product.brand] || FOOD_BRANDS.mcdonalds;
  const qty = (state.cart.find((i) => i.productKey === product.key) || {}).qty || 0;

  return `
    ${statusBar()}
    ${foodBrandHeader(state, brand)}

    <div class="oky-flow-section oky-flow-foodpdp">
      <section class="middle-card-shell is-pdp" aria-label="${product.label}">
        <article class="middle-card-molecule is-product">
          <div class="middle-card-content">
            <div class="middle-card-main">
              <p class="middle-card-title">${product.label}</p>
              <div class="middle-card-center">
                <figure class="middle-card-product-figure"><img src="${product.art}" alt="${product.label}" /></figure>
              </div>
            </div>
            <div class="middle-card-footer">
              <span class="middle-card-footer-start">¿Qué Incluye?</span>
              <span class="middle-card-footer-end">Como Canjear</span>
            </div>
          </div>
        </article>
      </section>
    </div>

    <section class="pdp-page-summary-wrap oky-flow-dock" aria-label="Resumen de compra">
      <div class="summary-box with-overlap summary-box-compact" data-flow="products" data-step="pdp">
        <div class="summary-type-overlay">
          <span class="token-exchange">TIPO DE CAMBIO: Q 7.55</span>
        </div>
        <div class="summary-card">
          <div class="summary-card-body">
            <div class="summary-row summary-row-total">
              <span class="summary-label-strong">Subtotal</span>
              <span class="summary-label-strong">${money(product.price * (qty || 1))}</span>
            </div>
          </div>
          <div class="summary-cta-row">
            ${
              qty
                ? `<button class="btn btn-primary summary-btn" data-action="open-cart" type="button">Ver carrito</button>`
                : `<button class="btn btn-primary summary-btn" data-action="food-more" data-product="${product.key}" type="button">
                    <i class="fa-solid fa-plus" aria-hidden="true"></i>Agregar
                  </button>`
            }
          </div>
        </div>
      </div>
    </section>

    ${navbar("", state)}
  `;
}

/* Aviso de la primera vez que entra un producto al carrito
   (96814:14460): el ahorro no se explica solo, y es justo el momento
   en que empieza a valer. */
/* ── Código promocional (Figma 82510:85319) ───────────────
   Solo en Guatemala. La píldora vive arriba del carrito y tiene dos
   caras: la invitación a teclear el código y, ya aplicado, cuál es,
   con la X para quitarlo. */
function promoPill(state) {
  if (orderCountry(state) !== "gua") return "";
  const tag = `<img class="oky-flow-promo-art" src="oky-promo-tag.png" alt="" />`;
  return state.promo
    ? `<div class="oky-flow-promo is-applied">
        ${tag}
        <span class="oky-flow-promo-copy token-body1">Código Promo: <strong>${state.promo}</strong></span>
        <button class="oky-flow-promo-clear" data-action="clear-promo" type="button"
          aria-label="Quitar el código ${state.promo}">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </div>`
    : `<button class="oky-flow-promo" data-action="open-promo" type="button">
        ${tag}
        <span class="oky-flow-promo-copy token-body1">Ingresa el código promocional</span>
        <span class="oky-flow-promo-go" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
      </button>`;
}

/* La rebaja del código se lee igual que la de OKY Cash: en aqua y en
   negativo, justo encima del total. */
function promoRow(state) {
  const off = appliedPromo(state);
  return off > 0
    ? `<div class="summary-row">
        <span class="summary-value-success">Código promo</span>
        <span class="summary-value-success">-${money(off)}</span>
      </div>`
    : "";
}

/* La fila del saldo: se enseña en cuanto la casilla está marcada,
   aunque el saldo sea cero, para que marcarla siempre haga algo
   visible. */
function cashRow(state) {
  return state.okyCashEnabled
    ? `<div class="summary-row">
        <span class="summary-value-success">OKY Cash</span>
        <span class="summary-value-success">-${money(orderCash(state))}</span>
      </div>`
    : "";
}

/* El modal del código: campo y un solo botón. "Aplicar" nace apagado
   porque sin nada tecleado no hay nada que aplicar. */
function promoDialog(state) {
  const draft = state.promoDraft || "";
  const has = draft.trim().length > 0;
  return `
    <button class="oky-flow-sheet-backdrop" data-action="close-promo" type="button" aria-label="Cerrar"></button>
    <section class="oky-flow-promosheet" role="dialog" aria-modal="true" aria-label="Ingresa tu código">
      <h2 class="oky-flow-promosheet-title">Ingresa tu código</h2>
      <div class="input-wrapper oky-flow-promosheet-field">
        <label id="oky-promo-label" class="input-label input-label-dinamic oky-flow-promo-label${has ? " is-floating" : ""}"
          for="oky-promo">Código promo</label>
        <input id="oky-promo" class="input-field input-dinamic oky-flow-promo-input ${has ? "input-dinamic-hasvalue" : "input-dinamic-empty"}"
          type="text" value="${draft}" placeholder="Código promo" autocomplete="off" autocapitalize="off"
          spellcheck="false" data-action="input-promo" aria-labelledby="oky-promo-label" />
      </div>
      <p class="oky-flow-promosheet-error${state.promoError ? "" : " is-hidden"}">Ese código no es válido o ya venció.</p>
      <div class="oky-flow-promosheet-divider" aria-hidden="true"></div>
      <button class="btn btn-primary btn-large oky-flow-promosheet-cta" data-action="apply-promo" type="button"
        ${has ? "" : "disabled"}>Aplicar</button>
    </section>
  `;
}

function savingsSheet() {
  return `
    <button class="oky-flow-sheet-backdrop" data-action="close-savings" type="button" aria-label="Cerrar"></button>
    <section class="oky-flow-savings" role="dialog" aria-modal="true" aria-label="Agrega más, paga menos">
      <h2 class="oky-flow-savings-title">Agrega más,<br />paga menos</h2>
      <p class="oky-flow-savings-note">
        Al agregar más productos al carrito paga un máximo <strong>${money(SERVICE_FEE_UNIT)}</strong> de costo de servicio
      </p>
      <div class="oky-flow-savings-art"><img src="oky-cart-savings.png" alt="" /></div>
      <button class="btn btn-primary btn-large oky-flow-savings-cta" data-action="close-savings" type="button">Entendido</button>
    </section>
  `;
}

/* ── Detalle de vale ──────────────────────────────────────
   Misma pantalla desde "Tus compras" (por id de compra) y desde
   Mi wallet (por marca): en ambos casos el organismo Card. */
function screenVoucher(state, { asPurchase = false, celebrate = false, cashWin = false } = {}) {
  const purchase = state.params.id
    ? state.purchases.find((p) => p.id === state.params.id)
    : state.purchases.filter((p) => p.productKey === state.params.key).slice(-1)[0];

  /* Dos mazos según de dónde se entre: con id, los vales de la orden
     recién pagada; con key, todas las gift cards del wallet. Los dos
     dan la vuelta, así que de la última se pasa a la primera.
     El mazo del wallet lleva sus propios datos de marca: hay tarjetas
     ahí —Krispy Kreme, Under Armour— que no son productos comprables
     y no están en PRODUCTS. */
  /* Entrando por el detalle de una compra no hay sección de la que se
     venga, así que la pone el producto: un paquete de internet no es
     una gift card y la card tiene que decirlo también aquí. */
  const section = state.params.deck || (purchase ? sectionOfVoucher(purchase.productKey) : "gift");
  const unit = state.params.unit || 0;
  const wallet = voucherCarousel(state, section, state.params.key, unit);
  /* Un vale de Pollo Campero no es una gift card: la card lo dice. */
  const kind = { vales: "OKY Vale", servicios: "Servicio" }[section] || "Gift Card";
  const deck = state.params.id
    ? state.lastOrder.map((p) => ({ id: p.id, key: p.productKey }))
    : wallet;
  const at = deck.findIndex((v) =>
    state.params.id ? v.id === state.params.id : v.key === state.params.key && v.unit === unit,
  );
  const many = deck.length > 1;

  const card = PRODUCTS[purchase ? purchase.productKey : state.params.key] ||
    wallet.find((v) => v.key === state.params.key) || { key: state.params.key, label: "", art: "" };
  /* Cada vale del wallet lleva su monto: dos gift cards de la misma
     marca pueden valer distinto, y la del wallet manda sobre el último
     monto que se haya tecleado en el PDP de esa marca. */
  const entry = wallet.find((v) => v.key === state.params.key && v.unit === unit) || wallet[0];
  /* Desde el wallet manda el monto del vale abierto, no el de la última
     compra de esa marca: con dos vales de Nike, el archivado seguía
     enseñando lo que costó el recién comprado. */
  const amount =
    state.params.id && purchase
      ? purchase.amount
      : entry && entry.amount != null
        ? entry.amount
        : state.amounts[card.key] || BRAND_DEFAULT_AMOUNT;
  /* En quetzales manda lo que se compró; si el vale es de relleno de
     la demo, el monto de arranque. */
  /* Compartir y archivar valen también recién comprado: es justo
     cuando se manda el regalo. El vale es el mismo que luego se ve en
     el wallet, así que marcarlo aquí o allá da igual. */
  const slot = state.params.id && purchase ? unitOfPurchase(state, purchase) : unit;
  const id = unitId(card.key, slot);
  const shared = state.sharedVouchers.includes(id);
  const archived = state.archivedVouchers.includes(id);

  /* La parte de abajo de una gift card de USA: código corto en dos de
     cada tres, y barcode con PIN en la restante.

     La semilla es la unidad y no la orden: el mismo vale se abre desde
     "Tus compras" y desde el wallet, y con dos semillas enseñaba dos
     códigos distintos para la misma cosa. */
  const bottomSeed = id;
  const section0 = sectionOfVoucher(card.key);
  const bottomOfVoucher =
    section0 === "gift"
      ? hashOf(bottomSeed) % 10 < 3
        ? {
            bottomVariantPath: "Molecule/Bottom Card/Code + BAR CODE + PIN",
            bottomLines: [
              { label: "Copia el código", value: giftCode(bottomSeed), copyable: true },
              { label: "PIN", value: String(1000 + (hashOf(bottomSeed) % 9000)), copyable: true },
            ],
            /* Las gift cards de USA no vencen: la fecha sobra en las
               dos variantes. */
            bottomExpiry: "",
            bottomButtonLabel: "Ayuda",
          }
        : {
            bottomVariantPath: "Molecule/Bottom Card/Gift Card USA",
            bottomLines: [
              { label: "Copia el código", value: giftCode(bottomSeed, 10), copyable: true },
            ],
            bottomButtonLabel: "Ayuda",
          }
      : /* Un servicio no reparte un código de canje: lo que queda del
           pago es el identificador que sale en la boleta. */
        section0 === "servicios"
        ? {
            bottomVariantPath: "Molecule/Bottom Card/OKY Vales",
            bottomLines: [{ label: "ID de pago", value: digitsOf(bottomSeed, 15), copyable: true }],
            bottomExpiry: "",
            bottomButtonLabel: "Ayuda",
          }
        : /* Una recarga tampoco: se fue al teléfono de alguien, y lo
             que hay que poder mirar después es a quién. */
          card.key === "tigo"
          ? {
              bottomVariantPath: "Molecule/Bottom Card/Telco",
              bottomLines: [{ label: "Quien recibe", value: GUA_RECIPIENT.phone, copyable: false }],
              bottomExpiry: "",
              bottomButtonLabel: "Ayuda",
            }
          : /* Y el vale de una marca sí lleva código, pero uno solo: las
               tres credenciales eran las de una gift card
               internacional. */
            {
              bottomVariantPath: "Molecule/Bottom Card/OKY Vales",
              bottomLines: [{ label: "Copia el código", value: giftCode(bottomSeed, 10), copyable: true }],
              bottomButtonLabel: "Ayuda",
            };

  const quetzalAmount =
    (purchase && purchase.quetzales) ||
    (entry && entry.quetzales) ||
    state.amounts[card.key] ||
    GUA_VALE_DEFAULT;

  /* Desde "Tus compras" la pantalla es el detalle de la orden; desde
     Mi wallet, el vale de la marca. */
  /* En el header va la marca, no el producto: el nombre largo ya lo
     dice la card de abajo y arriba solo cabía recortado. */
  const valeBrand = card.food ? FOOD_BRANDS[card.brand] : null;
  const productVale = !!valeBrand;
  const headerBrand = valeBrand ? valeBrand.label : card.label;
  /* De acuse de compra la pantalla sigue siendo "Tus compras": es el
     mismo sitio al que se llega al pagar, solo que con el vale abierto
     en vez de la pila. */
  const title = asPurchase ? "Tus compras" : state.params.id ? "Detalle de la orden" : headerBrand;

  const sharedOn = new Date()
    .toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/\./g, "")
    .toUpperCase()
    .replace(/ /g, " / ");

  return `
    ${statusBar()}
    ${titledHeader(title, asPurchase ? { trailing: "fa-receipt" } : {})}
    <div class="oky-flow-section is-voucher${asPurchase ? " is-purchase" : ""}">
      <div class="oky-flow-card-carousel${archived ? " is-redeemed is-archived" : shared ? " is-redeemed" : ""}">
      ${renderCardOrganism({
        /* Un vale de producto no es una gift card y el sistema ya
           tiene su anatomía (82513:86915): arriba el logo de la marca
           con "Qué incluye", en medio el producto —su nombre y su
           foto, sin monto, porque lo que se canjea es la cosa, no un
           saldo— y abajo un solo código con su vencimiento. */
        ...(productVale
          ? {
              topVariantPath: "Molecule/Top Card/OKY Vales",
              topShowBrandLabel: true,
              topBrandLabel: valeBrand.label,
              topHeroImage: valeBrand.art,
              topHeroAlt: valeBrand.label,
              topFlagCode: countryOfVoucher(card.key, sectionOfVoucher(card.key)),
              topFooterLeftLabel: "Qué incluye",
              topFooterRightLabel: "",
              middleCardPath: "Molecule/Middle Card/Vale de Producto",
              middleTitle: card.label,
              middleImage: card.art,
              middleLeftLabel: "Mostrar al cajero",
              middleRightLabel: "Como canjear",
              bottomVariantPath: "Molecule/Bottom Card/OKY Vales",
              /* Sin esto todas enseñaban el código de muestra de la
                 variante, el mismo en todas las cards. */
              bottomLines: [{ label: "Copia el código", value: giftCode(bottomSeed, 10), copyable: true }],
              bottomButtonLabel: "Ayuda",
              bottomClaritaAction: "card-tour",
            }
          : {
              topVariantPath: "Molecule/Top Card/Gift Card",
              topFlagCode: countryOfVoucher(card.key, sectionOfVoucher(card.key)),
              topBrandLabel: card.label,
              topHeroImage: card.art,
              topHeroAlt: card.label,
              topFooterLeftLabel: "Terms & Conditions",
              /* El brand disclaimer es de la gift card de marca
                 estadounidense; el vale de Latinoamérica lleva un solo
                 enlace arriba y va centrado. */
              topFooterRightLabel: section0 === "gift" ? "Brand Disclaimer" : "",
              middleCardPath: "Molecule/Middle Card/Amount",
              middleTitle: kind,
              /* Y el pie del medio dice lo que toca en cada uno: la gift
                 card de USA no se muestra en caja —lo único que hay que
                 abrir son las instrucciones de canje, que es además la
                 primera parada del recorrido de Clarita—, un servicio
                 pagado deja su correlativo, y el vale de marca sí se
                 enseña en caja y se canjea ahí. */
              bottomClaritaAction: "card-tour",
              ...(section0 === "gift"
                ? { middleSingleLabel: "Redemption Instructions" }
                : section0 === "servicios"
                  ? { middleSingleLabel: `#${digitsOf(`${bottomSeed}-orden`, 12)}` }
                  : {}),
              /* El vale de Guatemala se canjea en quetzales, así que
                 es lo que lleva escrito; los dólares se quedaron en el
                 checkout. */
              middleCurrency: card.quetzal ? "Q" : "$",
              middleAmount: card.quetzal ? bigQuetzal(quetzalAmount) : String(amount),
              ...bottomOfVoucher,
            }),
        /* Compartido, la parte de abajo de la card deja de mostrar
           credenciales —ya salieron de aquí— y pasa a ser el sello con
           la fecha, que es la anatomía del frame "Canjeado". */
        /* Archivado se lee igual que compartido —el vale ya no está en
           uso— pero en gris y con su propio sello: compartido es algo
           que se dio, archivado es algo que se guardó. Archivado manda
           sobre compartido, que es la decisión más reciente. */
        ...(archived
          ? {
              bottomLines: [],
              bottomShowButton: false,
              bottomMedia: {
                type: "stamp",
                svg: archivedSeal(),
                alt: "Archivado",
                caption: sharedOn,
              },
            }
          : shared
            ? {
                bottomLines: [],
                bottomShowButton: false,
                bottomMedia: {
                  type: "stamp",
                  src: "oky-seal-shared.png",
                  alt: "Compartido",
                  caption: sharedOn,
                },
              }
            : {}),
      })}
      ${
        many
          ? `
        <button class="oky-flow-carousel-nav is-prev" data-action="voucher-prev" type="button" aria-label="Vale anterior">
          <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>
        <button class="oky-flow-carousel-nav is-next" data-action="voucher-next" type="button" aria-label="Vale siguiente">
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      `
          : ""
      }
      </div>

      ${
        /* La misma fila en los tres estados: el interruptor dice si está
           guardado —apagado "Archivar", encendido "Archivado"— y al lado
           el botón de compartir. Archivar ya no pide haberlo compartido
           antes, y desarchivar es apagar el interruptor en vez de un
           botón que solo aparecía ahí. */ ""
      }
      <div class="oky-flow-voucher-actions">
        <button class="oky-flow-switch${archived ? " is-on" : ""}" data-action="toggle-archived"
          data-key="${card.key}" data-unit="${slot}"
          type="button" role="switch" aria-checked="${archived}">
          ${/* El rótulo delante: se lee la palabra y después se ve en
               qué estado está, que es el orden en que se mira. */ ""}
          <span class="oky-flow-switch-label">${archived ? "Archivado" : "Archivar"}</span>
          <span class="oky-flow-switch-track"><span class="oky-flow-switch-knob"></span></span>
        </button>
        ${/* Compartir es el mismo trato que archivar, así que es el
             mismo control: apagado se comparte y encendido se pregunta
             si no llegó a mandarse. Guardado no se comparte —primero
             hay que sacarlo del archivo— y el interruptor se apaga. */ ""}
        <button class="oky-flow-switch${shared ? " is-on" : ""}" data-action="toggle-shared"
          data-key="${card.key}" data-unit="${slot}" data-label="${card.label}" data-amount="${amount}"
          type="button" role="switch" aria-checked="${shared}" ${archived ? "disabled" : ""}>
          <span class="oky-flow-switch-label">${shared ? "Compartido" : "Compartir"}</span>
          <span class="oky-flow-switch-track"><span class="oky-flow-switch-knob"></span></span>
        </button>
      </div>
    </div>
    ${asPurchase ? purchaseFoot(state) : ""}
    ${navbar("", state)}
    ${asPurchase ? purchaseOverlays(state, { celebrate, cashWin }) : ""}
  `;
}


/* ── Personaliza tu billetera (99135:103902) ──────────────
   Carrusel de diseños con los vecinos asomando, radio en la esquina
   de cada tarjeta, dots y "Elegir" al pie. */
function screenCardDesign(state) {
  const at = wrap(state.cardDesignIndex, CARD_DESIGNS.length);
  const current = CARD_DESIGNS[at];

  const preview = (design, i) => {
    /* La vista previa es solo el diseño: sin marca, sin saldo y sin
       footer, como en el frame. */
    const card = {
      ...findPaymentCard("Molecule/Payment Card/OKY Cash Black"),
      ...design.style,
      art: design.art,
      artClass: design.artClass,
      showHeader: false,
      showFooter: false,
      cta: null,
      editIcon: null,
    };
    return `
      <button class="oky-flow-design-slide ${i === at ? "is-active" : ""}"
        data-action="pick-design" data-index="${i}" type="button" aria-pressed="${i === at}">
        <span class="oky-flow-design-radio" aria-hidden="true"></span>
        ${renderPaymentCard(card)}
      </button>
    `;
  };

  return `
    ${statusBar()}
    ${titledHeader("Personaliza tu billetera")}

    <div class="oky-flow-section oky-flow-design is-centered">
      <div class="oky-flow-design-copy">
        <h2 class="oky-flow-design-title">${current.label}</h2>
        <p class="oky-flow-design-note">${current.note}</p>
      </div>

      <div class="oky-flow-design-window">
        <div class="oky-flow-design-track" style="--design-at:${at}">
          ${CARD_DESIGNS.map(preview).join("")}
        </div>
      </div>

      <div class="carrusel-dots-wrap" style="width:100%">
        <div class="carrusel-dots">
          ${CARD_DESIGNS.map(
            (d, i) => `
            <button class="promo-dot${i === at ? " promo-dot-active" : ""}" data-action="pick-design"
              data-index="${i}" type="button" aria-label="Ver ${d.label}"></button>
          `,
          ).join("")}
        </div>
      </div>

      <button class="btn btn-primary btn-large oky-flow-design-cta" data-action="choose-design" type="button">
        Elegir
      </button>
    </div>
    ${navbar("okycash", state)}
  `;
}

/* ── Hojas de confirmación (99105:39840 y 99105:39676) ────
   Las dos del flujo de archivar, en el mismo componente: ilustración
   3D sobre morado, título, explicación y acciones. Frente al diseño
   original cambian dos cosas, las dos por lo mismo —que la decisión se
   entienda sin releer—:

   · El texto de "no compartido" iba en doble negación ("¿Estás seguro
     que no compartiste ya este vale?" + "Sí estoy seguro"), donde el
     sí confirma una negación. Ahora la pregunta es afirmativa y el
     botón dice qué va a pasar.
   · Cada hoja gana una salida explícita. La X de la esquina existe,
     pero en móvil es un blanco de 24px arriba del todo: el par de
     botones deja las dos decisiones al alcance del pulgar. */
const CONFIRM_SHEETS = {
  unshare: {
    art: "oky-share-hands.png",
    title: "¿No llegaste a compartirlo?",
    note: "Lo devolveremos a la sección de activos. El vale y su código siguen intactos.",
    confirm: "Activarla nuevamente",
    dismiss: "Cancelar",
    action: "confirm-unshare",
  },
  archive: {
    art: "oky-archive-hands.png",
    title: "¿Deseas archivarla?",
    note: "Te sugerimos archivar. Puedes verlas nuevamente al tocar la sección de archivados.",
    confirm: "Archivar",
    dismiss: "Ahora no",
    action: "confirm-archive",
  },
};

/* Hoja de filtros: blanca, con radios y una sola decisión por vez.
   Cada opción trae su cuenta —no hay que abrir para ver si hay algo— y
   "Todas" vive arriba como salida rápida. */
/* Lo que dice la cabecera del wallet: la categoría, el estado o que no
   hay filtro puesto. */
function walletFilterLabel(state) {
  /* Servicios no se filtra por categoría —son todos pagos— sino que se
     ordena: por fecha, que es como se buscan, o por número de servicio
     cuando se busca uno concreto. */
  if (state.walletTab === "servicios") {
    return state.serviceOrder === "id" ? "Por ID de pago" : "Por fecha de pago";
  }
  if (!state.walletFilter) return "Todas las categorías";
  return (WALLET_CATEGORIES.find((c) => c.key === state.walletFilter) || {}).label || "Todas las categorías";
}

const SERVICE_ORDERS = [
  { key: "fecha", label: "Por fecha de pago" },
  { key: "id", label: "Por ID de pago" },
];

function filterSheet(state) {
  const servicios = state.walletTab === "servicios";
  const cats = servicios ? [] : walletCategories(state);
  const option = (key, label, count, on) => `
      <button class="oky-flow-filter-option${on ? " is-on" : ""}" data-action="pick-filter"
        data-cat="${key}" type="button" role="radio" aria-checked="${on}">
        <span class="oky-flow-radio" aria-hidden="true"></span>
        <span class="oky-flow-filter-option-label">${label}</span>
        ${count == null ? "" : `<span class="oky-flow-filter-option-count">${count}</span>`}
      </button>
    `;

  return `
    <button class="oky-flow-sheet-backdrop" data-action="close-sheet" type="button" aria-label="Cerrar"></button>
    <section class="oky-flow-sheet is-filter" role="dialog" aria-modal="true"
      aria-label="${servicios ? "Ordenar pagos" : "Filtrar por categoría"}">
      <div class="oky-flow-sheet-grab" aria-hidden="true"></div>
      <header class="oky-flow-filter-head">
        <h2 class="oky-flow-filter-title">${servicios ? "Ordenar" : "Filtrar"}</h2>
        <button class="oky-flow-sheet-close is-dark" data-action="close-sheet" type="button" aria-label="Cerrar">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </header>
      <div class="oky-flow-filter-list" role="radiogroup">
        ${
          servicios
            ? SERVICE_ORDERS.map((o) => option(`@${o.key}`, o.label, null, state.serviceOrder === o.key)).join("")
            : option("", "Todas las categorías", null, !state.walletFilter) +
              cats.map((cat) => option(cat.key, cat.label, cat.count, state.walletFilter === cat.key)).join("")
        }
      </div>
    </section>
  `;
}

function confirmSheet(state) {
  const sheet = CONFIRM_SHEETS[state.sheet.type];
  if (!sheet) return "";
  return `
    <button class="oky-flow-sheet-backdrop" data-action="close-sheet" type="button" aria-label="Cerrar"></button>
    <section class="oky-flow-sheet" role="dialog" aria-modal="true" aria-label="${sheet.title}">
      <button class="oky-flow-sheet-close" data-action="close-sheet" type="button" aria-label="Cerrar">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
      <h2 class="oky-flow-sheet-title">${sheet.title}</h2>
      <p class="oky-flow-sheet-note">${sheet.note}</p>
      <div class="oky-flow-sheet-art">
        <img src="${sheet.art}" alt="" />
      </div>
      <div class="oky-flow-sheet-actions">
        <button class="oky-flow-sheet-confirm" data-action="${sheet.action}" data-key="${state.sheet.key}"
          data-unit="${state.sheet.unit || 0}" type="button">
          ${sheet.confirm}
        </button>
        <button class="oky-flow-sheet-dismiss" data-action="close-sheet" type="button">${sheet.dismiss}</button>
      </div>
    </section>
  `;
}

/* ── Home de Guatemala ──────────────────────────────────── */
/* El mockup "Homepage 1" tal cual, con nuestro Discovery Header encima
   para que el folder siga en el orden de siempre —USA a la izquierda,
   GUA a la derecha— y se pueda volver. */
/* Donde arrancan las macrocategorías del home de Guatemala: la pastilla
   de saldo se cuela justo antes, después del carrusel. */
const GUA_TILES_ANCHOR = `<section class="mockup-block mockup-left-tiles-block"`;

function screenHomeGua(state) {
  const body = GUA_HOME_MARKUP.replace(
    GUA_TILES_ANCHOR,
    `<div class="oky-flow-gua-cash">${cashStrip(state)}</div>${GUA_TILES_ANCHOR}`,
  );

  return `
    <div class="oky-flow-guahome">
      ${homeHeader(state, state.headerCollapsed ? "State 3" : "State 1")}
      <div class="oky-flow-gua">${body}</div>
    </div>

    <button class="oky-flow-scroll-hint" data-action="scroll-more" type="button"
      aria-label="Ver más contenido">
      <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
    </button>

    ${navbar("home", state)}
  `;
}

/* ── PDP de Tigo (Pages/PDP Pages · PDP Page 1) ───────────
   La misma página, conectada al carrito: el slider mueve el monto, el
   resumen recalcula y "Agregar" entra al flujo de siempre. */
function screenTigoPdp(state) {
  const amount = state.amounts.tigo ?? TIGO_DEFAULT_AMOUNT;
  const product = PRODUCTS.tigo;
  const progress = ((amount - product.min) / (product.max - product.min)) * 100;
  const cartItem = state.cart.find((item) => item.productKey === "tigo");
  const changed = cartItem && cartItem.amount !== amount;

  return `
    ${statusBar()}
    ${/* Ahora al PDP de Tigo se llega por dos caminos —el tile de
          Recargas y la Category Page— así que atrás desanda el que se
          tomó en vez de apuntar siempre al home. */ ""}
    ${productHeader(state, { backAction: "back" })}
    <div class="oky-flow-gua-pdp has-plateu">
      
      <section class="pdp-page-section">
        

        <div class="pdp-page-stack">
          <div class="pdp-page-brand-slot">
            <section class="brand-item-atom is-with-label" aria-label="Marca seleccionada">
              <p class="brand-item-label token-product-text">Tigo</p>
              <div class="brand-item-frame">
                <div class="brand-item-base">
                  <img src="tigo.webp" alt="Tigo" />
                </div>
              </div>
            </section>
          </div>

          <div class="pdp-page-plateu-slot">
            <section class="plateu-molecule is-static is-default pdp-page-plateu" aria-label="Categorías telco" data-pen-id="6985:152223">
              <div class="plateu-track is-static">
                <div class="plateu-item">
                  <div class="plateu-icon-wrap"><img class="plateu-icon" src="tigo-plateu-paquetes.png" alt="Paquetes" /></div>
                  <span class="plateu-label">Paquetes</span>
                </div>
                <div class="plateu-item">
                  <div class="plateu-icon-wrap"><img class="plateu-icon" src="tigo-plateu-internet.png" alt="Internet" /></div>
                  <span class="plateu-label">Internet</span>
                </div>
                <div class="plateu-item">
                  <div class="plateu-icon-wrap"><img class="plateu-icon" src="tigo-plateu-recargas.png" alt="Recargas" /></div>
                  <span class="plateu-chip">Recargas</span>
                </div>
                <div class="plateu-item">
                  <div class="plateu-icon-wrap"><img class="plateu-icon" src="tigo-plateu-antenita.png" alt="Antenita" /></div>
                  <span class="plateu-label">Antenita</span>
                </div>
              </div>
            </section>
          </div>

          <div class="pdp-page-card-slot">
            <section class="middle-card-shell is-pdp" aria-label="Detalle principal del producto" data-pen-id="6991:146235">
              <article class="middle-card-molecule is-amount">
                <div class="middle-card-content">
                  <div class="middle-card-main">
                    <p class="middle-card-title">Recargas Tiempo Aire</p>
                    <div class="middle-card-center">
                      <div class="middle-card-value">
                        <span class="middle-card-currency">$</span>
                        <p class="middle-card-amount">${amount}</p>
                      </div>
                    </div>
                  </div>
                  <div class="middle-card-footer">
                    <span class="middle-card-footer-start">Mostrar al cajero</span>
                    <span class="middle-card-footer-end">Como canjear</span>
                  </div>
                </div>
              </article>
            </section>
          </div>

          <div class="pdp-page-slider-slot">
            <section class="slider-atom" style="--slider-progress:${progress}%;--slider-frac:${progress / 100}" aria-label="Selector de monto">
              <div class="slider-track-shell">
                <span class="slider-halo" aria-hidden="true"></span>
                <span class="slider-bubble" aria-hidden="true" data-role="tigo-bubble">$ ${amount}</span>
                <div class="slider-track"></div>
                <div class="slider-ticks">
                  <span class="slider-tick" style="left:0%"></span>
                  <span class="slider-tick" style="left:10%"></span>
                  <span class="slider-tick" style="left:20%"></span>
                  <span class="slider-tick" style="left:30%"></span>
                  <span class="slider-tick" style="left:40%"></span>
                  <span class="slider-tick" style="left:50%"></span>
                  <span class="slider-tick" style="left:60%"></span>
                  <span class="slider-tick" style="left:70%"></span>
                  <span class="slider-tick" style="left:80%"></span>
                  <span class="slider-tick" style="left:90%"></span>
                  <span class="slider-tick" style="left:100%"></span>
                </div>
              </div>
              <input
                class="slider-range"
                type="range"
                min="5"
                max="100"
                step="5"
                value="${amount}"
                data-action="tigo-amount"
                aria-label="Slider en dólares"
              />
              <div class="slider-values token-body1">
                <span>$ 5</span>
                <span>$ 100</span>
              </div>
              <div class="slider-labels token-caption">
                <span>Mínimo</span>
                <span>Máximo</span>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section class="pdp-page-summary-wrap oky-flow-dock" aria-label="Resumen de compra">
        <div class="summary-box with-overlap summary-box-compact" data-flow="products" data-step="pdp">
          <div class="summary-type-overlay">
            <span class="token-exchange">TIPO DE CAMBIO: Q 7.55</span>
          </div>
          <div class="summary-card">
            <div class="summary-card-body">
              <div class="summary-row">
                <span class="summary-label-strong">Subtotal</span>
                <span class="summary-label-strong" data-role="tigo-subtotal">${money(amount)}</span>
              </div>
            </div>
            <div class="summary-cta-row">
              ${
                cartItem && !changed
                  ? `<button class="btn btn-primary summary-btn" data-action="open-cart" type="button">Ver carrito</button>`
                  : `<button class="btn btn-primary summary-btn" data-action="add-to-cart" data-product="tigo"
                       type="button">${changed ? "" : `<i class="fa-solid fa-plus" aria-hidden="true"></i>`}${changed ? "Actualizar" : "Agregar"}</button>`
              }
            </div>
          </div>
        </div>
      </section>
      <div class="pdp-page-footer-spacer"></div>
    
    </div>
    ${navbar("", state)}
  `;
}

/* ── PDP de marca de Guatemala (94839:37191) ──────────────
   Misma anatomía que el de USA —marca, card de monto, campo y resumen
   acoplado abajo— con cuatro diferencias: el monto se teclea en
   quetzales, el resumen los convierte a dólares y declara el tipo de
   cambio en su solapa, no hay ribbon porque son de precio regular, y
   la barra de abajo cuenta el ahorro acumulado del carrito en vez del
   cashback, que en Guatemala todavía no se gana. */
function screenGuaPdp(state) {
  const product = PRODUCTS[state.params.product] || PRODUCTS[GUA_BRANDS[0].key];
  const q = state.amounts[product.key] ?? GUA_VALE_DEFAULT;
  const cartItem = state.cart.find((item) => item.productKey === product.key);
  /* Ya está en el carrito, pero con otro monto: hay algo que guardar. */
  const changed = cartItem && cartItem.quetzales !== q;
  const savings = cartSavings(state);

  return `
    ${statusBar()}
    ${/* Se llega desde la home y desde la Category Page: atrás desanda
          el camino que se tomó. */ ""}
    ${productHeader(state, { backAction: "back" })}

    <div class="oky-flow-stack-center">
      <div class="oky-flow-brand-slot">
        <section class="brand-item-atom is-with-label" aria-label="${product.label}">
          <p class="brand-item-label token-product-text">${product.label}</p>
          <div class="brand-item-frame">
            <div class="brand-item-base"><img src="${product.art}" alt="${product.label}" /></div>
          </div>
        </section>
      </div>

      <div>
        <section class="middle-card-shell is-pdp" aria-label="${product.cardTitle}">
          <article class="middle-card-molecule is-amount">
            <div class="middle-card-content">
              <div class="middle-card-main">
                <p class="middle-card-title">${product.cardTitle}</p>
                <div class="middle-card-center">
                  <div class="middle-card-value">
                    <span class="middle-card-currency">Q</span>
                    <p class="middle-card-amount">${bigQuetzal(q)}</p>
                  </div>
                </div>
              </div>
              <div class="middle-card-footer">
                <span class="middle-card-footer-start">Mostrar al cajero</span>
                <span class="middle-card-footer-end">Como canjear</span>
              </div>
            </div>
          </article>
        </section>
      </div>

      <div>
        <div class="input-wrapper" style="width:100%">
          <label id="oky-amount-label" class="input-label input-label-dinamic" for="oky-amount">
            Desde ${product.min} hasta ${product.max.toLocaleString("en-US")}
          </label>
          <span class="input-dinamic-prefix" aria-hidden="true">Q</span>
          <input id="oky-amount" class="input-field input-dinamic input-dinamic-hasvalue" type="text"
            inputmode="decimal" value="${bigAmount(q)}" data-action="input-amount" data-product="${product.key}"
            aria-labelledby="oky-amount-label" />
        </div>
      </div>
    </div>

    <div class="oky-flow-dock${savings > 0 ? "" : " is-no-bar"}">
      <div class="summary-box with-overlap summary-box-compact" data-flow="products" data-step="pdp">
        <div class="summary-type-overlay">
          <span class="token-exchange">TIPO DE CAMBIO: Q ${GUA_RATE.toFixed(2)}</span>
        </div>
        <div class="summary-card">
          <div class="summary-card-body">
            <div class="summary-row">
              <span class="summary-label-strong">Subtotal</span>
              <span class="summary-label-strong" data-role="pdp-subtotal">${money(toUsd(q))}</span>
            </div>
          </div>
          <div class="summary-cta-row">
            ${
              cartItem && !changed
                ? `<button class="btn btn-primary summary-btn" data-action="open-cart" type="button">Ver carrito</button>`
                : `<button class="btn btn-primary summary-btn" data-action="add-to-cart" data-product="${product.key}"
                     type="button" ${q > 0 ? "" : "disabled"}>
                     ${changed ? "" : `<i class="fa-solid fa-plus" aria-hidden="true"></i>`}${changed ? "Actualizar" : "Agregar"}
                   </button>`
            }
          </div>
        </div>
      </div>
    </div>

    ${
      /* Mismo modelo que la barra de la PLP: lo que se lleva ahorrado
         es el argumento para seguir llenando el carrito. */
      savings > 0
        ? `<div class="oky-flow-savingbar">
            <div class="oky-flow-savebar is-bar"><i class="fa-solid fa-tag" aria-hidden="true"></i>&nbsp;Llena el carrito. Vas ahorrando ${money(savings)}</div>
          </div>`
        : ""
    }
    ${navbar("", state)}
  `;
}

/* ── Onboarding Contactos (99140:47037) ─────────────────── */
function screenDecision() {
  return `
    <div class="oky-flow-decision">
      <h2 class="oky-flow-decision-title">¿Es para ti o para alguien más?</h2>
      <div class="oky-flow-decision-art">
        <img src="oky-returning-illustration.png" alt="" />
      </div>
      <div class="oky-flow-decision-actions">
        <button class="oky-flow-btn-inverted" data-action="decision-self" type="button">Para mi</button>
        <button class="oky-flow-btn-ghost" type="button" disabled>Para alguien más</button>
      </div>
    </div>
  `;
}

/* ── Router ─────────────────────────────────────────────── */

/* Hueco inferior por pantalla. La navbar (56px) ya está contada
   en .oky-flow-scroll, aquí solo se suma lo que va encima. */
const SCROLL_CLASS = {
  pdp: "has-dock",
  tigopdp: "has-tigo-dock",
  checkout: "has-bar",
  methods: "has-cta",

  /* "Tus compras" lleva CTA + píldora de saldo, de ahí el hueco mayor. */
  purchases: "has-cta-strip",
  success: "has-cta-strip",
  cashwin: "has-cta-strip",
};

/* El checkout pierde la saving bar cuando nada del carrito gana
   OKY Cash —Tigo, por ejemplo—, y con ella su hueco. */
function scrollClass(state) {
  /* El hueco de abajo del checkout lo pide cualquiera de las dos
     barras: la de cashback o la de ahorro de la orden. */
  if (state.screen === "checkout" && cartCashback(state) <= 0 && orderSavings(state) <= 0) return "";
  /* Sin píldora de saldo, la barra de "Tus compras" es solo el botón. */
  /* El PDP de Guatemala solo tiene barra de ahorro cuando hay algo
     ahorrado; sin ella el resumen baja a ras de la navbar y el hueco
     de abajo es menor. */
  if (state.screen === "guapdp") return cartSavings(state) > 0 ? "has-dock" : "has-dock-no-bar";
  if (["purchases", "success", "cashwin"].includes(state.screen) && state.lastEarned <= 0) {
    return "has-cta";
  }
  return SCROLL_CLASS[state.screen] || "";
}

function renderScreen(state) {
  switch (state.screen) {
    case "home": return screenHome(state);
    case "pdp": return screenPdp(state);
    case "checkout": return screenCheckout(state);
    case "methods": return screenMethods(state);
    case "processing": return screenProcessing(state);
    case "success": return screenPurchases(state, { celebrate: true });
    case "cashwin": return screenPurchases(state, { cashWin: true });
    case "purchases": return screenPurchases(state);
    case "wallet": return screenWallet(state);
    case "carddesign": return screenCardDesign(state);
    case "homegua": return screenHomeGua(state);
    case "tigopdp": return screenTigoPdp(state);
    case "guapdp": return screenGuaPdp(state);
    case "category": return screenCategory(state);
    case "plp": return screenPlp(state);
    case "foodpdp": return screenFoodPdp(state);
    case "voucher": return screenVoucher(state);
    case "decision": return screenDecision();
    default: return screenHome(state);
  }
}

export function mountOkyCashPrototype(root, { userType = "first-time" } = {}) {
  let state = createInitialState(userType);
  let celebrationTimer = 0;
  let winAnimation = null;

  /* Control de la prueba, no de la app: vive fuera del teléfono para
     que no se confunda con la UI. render() reescribe el root, así que
     el botón es un nodo propio que se vuelve a colgar en cada pasada. */
  root.style.display = "flex";
  root.style.flexDirection = "column";
  root.style.alignItems = "center";
  root.style.gap = "16px";

  /* En una pantalla de móvil el prototipo se abre a pantalla completa,
     sin carcasa ni botón de reinicio, para que se lea como la app y no
     como una maqueta. El frame conserva sus 360x800 de diseño y se
     escala para encajar: así ninguna de las medidas que llevamos
     ajustadas cambia, que es justo lo que pasaría si lo volviéramos
     fluido (hay una veintena de componentes clavados a 360px). */
  const phone = window.matchMedia("(max-width: 640px)");

  function fitToViewport() {
    if (!phone.matches) {
      root.style.removeProperty("--oky-fit");
      root.style.removeProperty("--oky-frame-h");
      root.style.alignItems = "center";
      root.style.gap = "16px";
      return;
    }

    /* El frame se escala desde su esquina superior izquierda, así que
       la pila tiene que dejarlo ahí: centrado, su caja de 360px queda
       descolgada dentro de un viewport más ancho y el dibujo aparece
       corrido respecto a donde se toca. */
    root.style.alignItems = "flex-start";
    root.style.gap = "0";

    /* Escala uniforme por el ancho —así el diseño no se deforma— y el
       lienzo se estira en alto lo que haga falta para que, una vez
       escalado, cubra justo el viewport. El frame es el único que sabe
       su ancho de diseño (360 sin borde en móvil). */
    const frame = root.querySelector(".oky-flow-frame");
    if (!frame) return;
    const vv = window.visualViewport;

    /* El teclado de iOS encoge el visual viewport, no el layout. Si se
       re-mide con él abierto, el lienzo se recorta a lo que queda por
       encima del teclado: la interfaz se sube, deja una franja blanca
       debajo y —lo peor— lo que se ve y lo que se toca dejan de
       coincidir, que es por lo que había botones que no respondían.
       Con foco en un campo, o con el visual viewport claramente más
       corto que el layout, se conserva la medida anterior. */
    const fitted = root.style.getPropertyValue("--oky-fit");
    const shrunk = vv && vv.height < window.innerHeight * 0.85;
    if (fitted && (shrunk || isEditing())) return;

    const design = frame.offsetWidth || 360;
    const scale = (vv ? vv.width : window.innerWidth) / design;
    if (!scale) return;
    root.style.setProperty("--oky-fit", String(scale));
    root.style.setProperty("--oky-frame-h", (vv ? vv.height : window.innerHeight) / scale + "px");
  }

  function isEditing() {
    const el = document.activeElement;
    return !!el && (el.matches("input, textarea, select") || el.isContentEditable);
  }

  /* Cambiar el hash con la pestaña ya abierta también lleva al país
     que pide el enlace: si no, pegar #usa sobre una sesión en curso no
     haría nada, porque el documento no se recarga. */
  window.addEventListener("hashchange", () => {
    const target = initialScreen();
    if (state.screen === target) return;
    if (target === "home") state.usaSeen = true;
    state.country = target === "home" ? "usa" : "gua";
    state.history = [];
    go(target, {}, { push: false });
  });

  window.addEventListener("resize", fitToViewport);
  window.addEventListener("orientationchange", fitToViewport);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", fitToViewport);
  /* Al cerrarse el teclado el visual viewport vuelve a su sitio, pero
     iOS no siempre avisa: se re-mide al soltar el campo. */
  root.addEventListener("focusout", () => setTimeout(fitToViewport, 120));

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "oky-flow-reset";
  resetButton.dataset.action = "reset";
  resetButton.innerHTML =
    '<i class="fa-solid fa-rotate-left" aria-hidden="true"></i>Reiniciar prototipo';

  /* Si el carrito ya estaba abierto en la pasada anterior. */
  let cartWasOpen = false;
  let addedTimer = null;
  /* La bandera del final del recorrido se quita sola. */
  let tourFlagTimer = null;
  let introTimer = null;

  function render() {
    /* El player de Lottie deja listeners y un rAF vivos; si el overlay
       desaparece del DOM sin destruirlo, se acumulan por compra. */
    if (winAnimation) {
      winAnimation.destroy();
      winAnimation = null;
    }

    root.innerHTML = `
      <div class="oky-flow-frame${state.claritaMuted ? " is-clarita-muted" : ""}">
        <div class="oky-flow-scroll ${scrollClass(state)}">
          ${renderScreen(state)}
        </div>
        ${state.cartOpen ? cartDrawer(state) : ""}
        ${state.sheet ? (state.sheet.type === "filter" ? filterSheet(state) : confirmSheet(state)) : ""}
        ${state.countrySheet ? countrySheet(state) : ""}
        ${state.marketSheet ? marketSheet(state) : ""}
        ${state.savingsSheet ? savingsSheet() : ""}
        ${state.promoOpen ? promoDialog(state) : ""}
        ${state.addedToast ? addedToast() : ""}
        ${state.usaIntro ? usaIntro() : ""}
        ${state.guideOn && state.screen === "home" && state.tourStep == null && !state.tourSeen ? homeGuide(state) : ""}
        ${state.tourStep != null ? tourOverlay(state) : ""}
        ${state.tourReady ? tourReady() : ""}
        ${state.tourCount ? tourCountdown() : ""}
        ${state.tourFlag ? tourFlag() : ""}
        ${state.tourConfetti ? `<div class="oky-flow-burst" data-role="tour-confetti"></div>` : ""}
      </div>
    `;

    /* Las barras se escriben dentro de la plantilla de cada pantalla
       por comodidad, pero .oky-flow-scroll está posicionado, así que
       ahí dentro un position:absolute se ancla al box que scrollea y
       las barras se movían con el contenido. Se re-parentan al frame,
       que es el contenedor fijo real. */
    /* El confeti del final del recorrido cae sobre la home; no arrastra
       el temporizador del sello de la compra, que es otra cosa. */
    const tourConfettiHost = root.querySelector("[data-role='tour-confetti']");
    if (tourConfettiHost) seedTourBurst(tourConfettiHost);

    const confettiHost = root.querySelector("[data-role='celebration-confetti']");
    if (confettiHost) {
      seedCelebration(confettiHost);
      /* El sello es una celebración, no una pantalla: se retira solo y
         da paso a la animación de "Ganaste OKY Cash". */
      clearTimeout(celebrationTimer);
      celebrationTimer = setTimeout(() => {
        if (state.screen === "success") go(nextAfterStamp(), {}, { push: false });
      }, 2600);
    }

    /* Animación "Ganaste OKY Cash" (dotLottie del equipo de diseño).
       Se reproduce una vez y al terminar deja la pantalla de la
       compra; un toque la salta. */
    const winHost = root.querySelector("[data-role='cashwin-lottie']");
    if (winHost) {
      winAnimation = lottie.loadAnimation({
        container: winHost,
        renderer: "svg",
        loop: false,
        autoplay: true,
        animationData: OKY_CASH_WIN_ANIMATION,
        rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
      });
      winAnimation.addEventListener("complete", () => {
        if (state.screen === "cashwin") go("purchases", {}, { push: false });
      });
    }

    const frame = root.querySelector(".oky-flow-frame");
    const scroll = frame.querySelector(".oky-flow-scroll");
    scroll
      .querySelectorAll(
        ".oky-flow-navbar, .oky-flow-savingbar, .oky-flow-cta-bar, .oky-flow-checkoutdock, .oky-flow-dock, .oky-flow-foodbar, .oky-flow-cashwin, .oky-flow-scroll-hint",
      )
      .forEach((bar) => frame.appendChild(bar));

    bindHeaderScroll(scroll);
    bindClaritaInView(scroll);
    bindCheckoutDock(scroll);
    bindSwipes();

    /* El drawer trae su propia saving bar; la de la pantalla de abajo
       se quita para que no quede pintada encima. */
    if (state.cartOpen) {
      frame
        .querySelectorAll(".oky-flow-savingbar:not(.is-drawer-bar), .oky-flow-dock, .oky-flow-cta-bar, .oky-flow-foodbar")
        .forEach((bar) => bar.remove());

      /* Cambiar la cantidad repinta el carrito, y con él volvía a
         correr la entrada desde el lado: parecía que se cerraba y se
         abría en cada toque. La animación es solo para abrirlo. */
      if (cartWasOpen) {
        const drawer = frame.querySelector(".oky-flow-drawer");
        if (drawer) drawer.style.animation = "none";
      }
    }
    cartWasOpen = state.cartOpen;

    placeTour();
    root.appendChild(resetButton);
    fitToViewport();
  }

  /* El recorrido no dibuja una copia del elemento: recorta el fondo
     alrededor de donde está, así lo que se señala es el de verdad. Se
     mide después de pintar, y si hace falta se sube a la vista. */
  function placeTour() {
    const tour = root.querySelector(".oky-flow-tour");
    if (!tour) return;
    const step = tourStepsOf(state)[state.tourStep];
    if (!step || step.finish) return;
    const frame = root.querySelector(".oky-flow-frame");
    /* Con nth se señala uno de varios iguales —el código y el PIN son
       la misma clase de línea— sin inventarles un selector propio. */
    const target =
      step.nth == null
        ? root.querySelector(step.target)
        : root.querySelectorAll(step.target)[step.nth];
    if (!target || !frame) return;

    const scroll = root.querySelector(".oky-flow-scroll");
    const call = tour.querySelector(".oky-flow-tour-call");
    const arrow = tour.querySelector(".oky-flow-tour-arrow");

    const put = () => {
      /* Se mide contra la propia capa del recorrido, no contra el
         frame: en desktop el frame lleva el bisel del teléfono y su
         caja arranca 12px antes que la del contenido, que es donde
         vive el agujero. Medir con el frame corría todo ese bisel. */
      const box = tour.getBoundingClientRect();
      const zoom = box.height / tour.offsetHeight || 1;
      const t = target.getBoundingClientRect();
      /* Justo lo que ocupa el elemento, con un respiro de 6px: el hueco
         tiene que leerse como ese elemento y no como una mancha. */
      const pad = 6;
      const top = (t.top - box.top) / zoom - pad;
      const left = (t.left - box.left) / zoom - pad;
      const w = t.width / zoom + pad * 2;
      const h = t.height / zoom + pad * 2;
      tour.style.setProperty("--hole-top", `${top}px`);
      tour.style.setProperty("--hole-left", `${left}px`);
      tour.style.setProperty("--hole-w", `${w}px`);
      tour.style.setProperty("--hole-h", `${h}px`);

      if (!call) return;
      /* La llamada va debajo de lo señalado si cabe, y si no encima; la
         flecha apunta siempre hacia el elemento. */
      const frameH = tour.offsetHeight;
      const frameW = tour.offsetWidth;
      const below = top + h + 150 < frameH;
      call.classList.toggle("is-below", below);
      if (arrow) arrow.className = `fa-solid ${below ? "fa-arrow-up" : "fa-arrow-down"} oky-flow-tour-arrow`;
      /* La llamada arranca donde arranca lo señalado, no centrada en
         ello: así el texto cae debajo de la flecha y se lee como una
         instrucción que empieza ahí. */
      const cw = call.offsetWidth;
      const callLeft = clamp(left, 12, Math.max(12, frameW - cw - 12));
      call.style.left = `${callLeft}px`;
      call.style.top = below ? `${top + h + 16}px` : "";
      call.style.bottom = below ? "" : `${frameH - top + 16}px`;
      /* Y la flecha se corre lo justo para quedar sobre el agujero,
         que es lo que señala. */
      if (arrow) {
        const aw = arrow.offsetWidth || 34;
        arrow.style.transform = `translateX(${left + w / 2 - (callLeft + aw / 2)}px)`;
      }
    };

    /* Lo que queda fuera de pantalla se sube antes de medir, y lo que
       vive en el contenido se acerca a una altura cómoda aunque ya se
       vea: así la parada queda a la vista y, al cerrar, hay camino de
       vuelta que recorrer. Lo que no scrollea —la navbar, que va fija—
       se deja donde está. */
    const box = tour.getBoundingClientRect();
    const zoom = box.height / tour.offsetHeight || 1;
    const t = target.getBoundingClientRect();
    const inFlow = scroll ? scroll.contains(target) : false;
    const fromTop = (t.top - box.top) / zoom;
    if (inFlow && (t.top < box.top || t.bottom > box.bottom - 40 || fromTop > 200)) {
      scroll.scrollTo({ top: scroll.scrollTop + fromTop - 170, behavior: "auto" });
    }

    /* El scroll dispara el colapso de la cabecera, que cambia alturas
       después de medir: por eso se repasa en los cuadros siguientes y se
       vuelve a medir mientras el recorrido esté abierto. */
    put();
    requestAnimationFrame(put);
    requestAnimationFrame(() => requestAnimationFrame(put));
    setTimeout(put, 320);
    if (scroll) scroll.addEventListener("scroll", put, { passive: true });
  }

  /* El último punto deja la home a media altura. Al cerrar el recorrido
     vuelve arriba, pero acompañando: render() la devolvería al tope de
     un salto, así que se restaura dónde quedó y se sube con scroll
     suave, que es como se mueve la app. */
  /* Si nadie toca a Clarita, el reloj arranca solo a los 7 segundos:
     da tiempo a mirar la home antes de que el cintillo cambie, y así
     el cambio de aqua a mostaza cae cuando ya se está mirando. Tocarla
     lo cancela, porque entonces manda el recorrido y el reloj arranca
     con el confeti del final. */
  const PROMO_IDLE_MS = 7000;
  /* Y cuando arranca al final del recorrido, se espera a que el
     cintillo de la bandera se vaya y se deja un respiro para leer el
     5% antes de que cambie. */
  const PROMO_AFTER_FLAG_MS = 2000;
  let promoIdleTimer = null;

  function cancelPromoIdle() {
    clearTimeout(promoIdleTimer);
    promoIdleTimer = null;
  }

  /* Arranca la cuenta si hace falta. No la reinicia si ya está en
     marcha —ir y volver de pestaña la alargaría sin fin— ni la pone si
     la promo ya corrió. */
  function armPromoIdle(delay = PROMO_IDLE_MS) {
    if (state.promoLive || state.promoSpent || promoIdleTimer) return;
    promoIdleTimer = setTimeout(startPromo, delay);
  }

  /* Pone el reloj en marcha: se fija el vencimiento en ese momento
     —no al cargar— y el ribbon entra animado una sola vez. */
  function startPromo() {
    /* Una sola vez. Vencida la promo se queda vencida: volver a la home
       de USA rearma la cuenta de los 7 segundos —la presentación se
       repite mientras nadie haga el recorrido— y el reloj arrancaba de
       nuevo. Quedaba el cintillo en mostaza al 20% con los montos ya
       devueltos a $5, así que la PDP abría en aqua al 5% y se
       contradecían. Y el sentido del reloj es justamente que se acaba:
       devolverlo sería quitarle lo único que dice. No sirve promoEnded,
       que es el aviso de "Promo terminada" y dura dos segundos. */
    if (state.promoLive || state.promoSpent) return;
    cancelPromoIdle();
    state.promoLive = true;
    state.promoEndsAt = Date.now() + PROMO_MS;
    state.promoStarting = true;
    /* El cruce de aqua a mostaza se mide contra este sello, no contra
       el render: durante el arranque hay más de un render (el confeti
       se retira a mitad de camino) y sin esto la animación volvía a
       empezar, así que se veía aqua, mostaza, aqua y mostaza. */
    state.promoStartedAt = Date.now();
    /* El reloj arranca en un múltiplo de 30 y el aviso de cada medio
       minuto se disparaba en el primer tic, justo detrás de la sacudida
       del arranque: dos temblores seguidos. Se da por avisado ese
       segundo, así que el siguiente llega media vuelta después. */
    promoShakeAt = Math.round(PROMO_MS / 1000);
    /* El confeti cae justo aquí, con el cambio de color: lo que hay
       que celebrar es que empezó la cuenta atrás, no la bandera a
       cuadros que ya pasó. Saliendo antes se llevaba la atención y el
       cintillo cambiaba sin que nadie lo mirara. */
    state.tourConfetti = true;
    setTimeout(() => {
      state.tourConfetti = false;
      render();
    }, TOUR_CONFETTI_MS);
    /* Pinta ya: arrancando por el temporizador no hay nadie más que
       vuelva a dibujar, y el cruce se quedaba sin verse —el aqua se
       estaba 1400ms quieto y luego saltaba al mostaza de golpe. */
    render();
    setTimeout(() => {
      state.promoStarting = false;
      render();
    }, 1400);
  }

  function closeTour() {
    /* El de la card se cierra y ya: la bandera a cuadros y el confeti
       son el final de la presentación de USA, no de una explicación de
       cómo se canjea un vale. */
    if (state.tourDeck && state.tourDeck !== "home") {
      state.tourStep = null;
      state.tourDeck = null;
      return render();
    }

    clearTimeout(tourFlagTimer);
    state.tourConfetti = false;
    state.tourStep = null;
    state.tourSeen = true;
    state.guideOn = false;
    state.guideAsk = false;
    state.tourReady = false;
    const before = root.querySelector(".oky-flow-scroll");
    const y = before ? before.scrollTop : 0;
    render();
    const after = root.querySelector(".oky-flow-scroll");
    if (after && y > 0) after.scrollTop = y;

    /* Primero la home vuelve arriba —que se vea el camino— y ya en la
       portada pregunta, que es lo que da pie a la cuenta atrás. */
    scrollToTop(after, () => {
      state.tourReady = true;
      render();
      tourFlagTimer = setTimeout(() => {
        state.tourReady = false;
        render();
        tourFlagTimer = setTimeout(startFinish, TOUR_FINISH_BEAT_MS);
      }, TOUR_READY_MS);
    });
  }

  /* Sube al inicio en el tiempo que decimos y avisa al terminar. El
     avance se calcula con el reloj y no contando cuadros, así que un
     tirón no alarga la subida; y se mueve con setTimeout en vez de
     requestAnimationFrame porque este prototipo también corre en
     paneles que dejan de pedir cuadros cuando no se ven, y ahí la
     secuencia no puede quedarse a medias. */
  function scrollToTop(el, done) {
    if (!el || el.scrollTop <= 0) return done();
    const from = el.scrollTop;
    const started = Date.now();
    const step = () => {
      if (!el.isConnected) return done();
      const t = Math.min((Date.now() - started) / TOUR_SCROLL_MS, 1);
      /* Ease-out cúbico contado hacia el tope: arranca rápido y se
         posa. Lo que queda por recorrer es (1-t)³ de la distancia. */
      el.scrollTop = from * (1 - t) ** 3;
      if (t < 1) {
        tourFlagTimer = setTimeout(step, 16);
        return;
      }
      el.scrollTop = 0;
      done();
    };
    tourFlagTimer = setTimeout(step, 16);
  }

  /* Salida de carrera: 3, 2, 1 y la banderola. La cuenta va sola —el
     recorrido ya se avanzaba a toques y una cuenta que espera un click
     no cuenta nada— y el número se releva dentro de la misma capa, sin
     re-render, para que el fondo atenuado no parpadee. El de la
     banderola arranca ya encendido y toma el relevo sin corte. */
  function startFinish() {
    state.tourCount = true;
    render();

    const relay = (n) => {
      if (n > 0) {
        const layer = root.querySelector(".oky-flow-tourcount");
        if (layer) {
          layer.innerHTML = tourCountNumber(n);
        }
        tourFlagTimer = setTimeout(() => relay(n - 1), TOUR_COUNT_MS);
        return;
      }
      state.tourCount = false;
      state.tourFlag = true;
      render();
      tourFlagTimer = setTimeout(() => {
        /* El cintillo se va y la home queda a la vista un par de
           segundos con el 5% en aqua. El confeti ya no sale aquí: se
           lo lleva el arranque del reloj, que es lo que celebra. */
        state.tourFlag = false;
        cancelPromoIdle();
        armPromoIdle(PROMO_AFTER_FLAG_MS);
        render();
      }, TOUR_FLAG_MS);
    };

    tourFlagTimer = setTimeout(() => relay(2), TOUR_COUNT_MS);
  }

  /* Gestos: los carruseles se pasan con el dedo, no solo con las
     flechas. Se escucha pointer —vale para dedo, lápiz y ratón— y el
     gesto acaba disparando el mismo botón que ya existía, así que no
     hay dos caminos que mantener.

     Un swipe termina en click sobre lo que haya debajo; ese click se
     traga en captura para que arrastrar sobre una card no la abra. */
  function bindSwipe(el, onSwipe) {
    if (!el) return;
    let id = null;
    let x0 = 0;
    let y0 = 0;
    let swipedAt = 0;

    /* El click que el navegador manda después de un arrastre se traga
       durante un instante, para que pasar de card no abra la card de
       debajo. Por ventana de tiempo y no con un listener de un solo uso:
       si el gesto no acaba en click —un arrastre largo no siempre lo
       produce— el de un solo uso se quedaría armado y se comería el
       siguiente toque de verdad. */
    el.addEventListener(
      "click",
      (event) => {
        if (Date.now() - swipedAt > 350) return;
        event.preventDefault();
        event.stopPropagation();
      },
      true,
    );

    el.addEventListener(
      "pointerdown",
      (event) => {
        id = event.pointerId;
        x0 = event.clientX;
        y0 = event.clientY;
      },
      { passive: true },
    );

    const end = (event) => {
      if (id !== event.pointerId) return;
      id = null;
      const dx = event.clientX - x0;
      const dy = event.clientY - y0;
      /* 40px de recorrido y claramente más horizontal que vertical:
         así un scroll de la pantalla no cuenta como pase. */
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      /* El pase va primero y la ventana se abre después: las flechas
         viven dentro del propio carrusel, así que al revés el filtro se
         comería el click que dispara el gesto. */
      onSwipe(dx < 0 ? 1 : -1);
      swipedAt = Date.now();
    };

    el.addEventListener("pointerup", end, { passive: true });
    el.addEventListener(
      "pointercancel",
      () => {
        id = null;
      },
      { passive: true },
    );
  }

  function bindSwipes() {
    const tap = (action) => {
      const button = root.querySelector(`[data-action="${action}"]`);
      if (button) button.click();
    };

    /* Vale del wallet y detalle de la orden. */
    bindSwipe(root.querySelector(".oky-flow-card-carousel"), (dir) =>
      tap(dir > 0 ? "voucher-next" : "voucher-prev"),
    );

    /* Marcas del checkout. */
    bindSwipe(root.querySelector(".checkout-brand-carrousel-shell"), (dir) =>
      tap(dir > 0 ? "carousel-next" : "carousel-prev"),
    );

    /* Diseños de la tarjeta: aquí no hay flechas, así que el gesto va
       directo al slide vecino, que es el mismo control que los dots. */
    bindSwipe(root.querySelector(".oky-flow-design-window"), (dir) => {
      const next = wrap(state.cardDesignIndex + dir, CARD_DESIGNS.length);
      const slide = root.querySelector(`[data-action="pick-design"][data-index="${next}"]`);
      if (slide) slide.click();
    });
  }

  /* Transición de scroll del Discovery Header: al bajar se va el header
     de wallet/logo/carrito y quedan folder colapsado y buscador; al
     volver arriba se despliega otra vez. Solo se reemplaza ese nodo, no
     se re-renderiza la pantalla.

     Antes se compensaba el scrollTop con la diferencia de alto para que
     el contenido no saltara, y con 100px de diferencia eso se volvió un
     bucle: colapsar en y=97 dejaba el scroll en -3 → 0, que es la
     condición de desplegar, que volvía a poner el scroll en 100, que
     vuelve a colapsar. El header se quedaba trabado en su versión corta
     y no volvía nunca. Ahora no se toca el scroll —los umbrales quedan
     estables, sin realimentación— y el salto se resuelve como toca:
     animando el alto del header. */
  /* Filtrando se abren todas las secciones: lo que se busca es ver los
     resultados, no contarlos. Al quitar el filtro vuelve a estar
     abierto lo que lo estaba antes. */
  function setWalletFilter(next) {
    /* Servicios no filtra, ordena: su hoja manda "@fecha" o "@id". */
    if (next.startsWith("@")) {
      state.serviceOrder = next.slice(1);
      state.sheet = null;
      return render();
    }
    const was = state.walletFilter;
    if (next && !was) state.openBeforeFilter = state.openGroups;
    state.walletFilter = next;
    /* Con filtro puesto se abre lo que tiene resultados y nada más:
       desplegar una sección para enseñar que está vacía es hacer
       trabajar a la persona para no darle nada. */
    const withHits = next && WALLET_GROUPS.find((g) => walletGroupDeck(state, state.walletTab, g.key).length);
    state.openGroups = next
      ? withHits
        ? [withHits.key]
        : []
      : state.openBeforeFilter || state.openGroups;
    if (!next) state.openBeforeFilter = null;
    state.sheet = null;
    return render();
  }

  function goCountry(country) {
    /* La pared de banderas es de la primera vez que se enseña USA. Se
       miraba tourSeen, que solo se marca al terminar el recorrido, así
       que quien no lo hacía volvía a ver las banderas cada vez que
       tocaba la pestaña. Clarita no depende de esto: vive en guideOn y
       sigue ahí al ir y volver. */
    const firstUsa = country === "usa" && !state.usaSeen;
    if (country === "usa") state.usaSeen = true;
    state.country = country;
    markCountryInUrl(country);
    /* La primera visita a USA se presenta: banderas y, al acabar, el
       recorrido por lo que hay que saber. */
    if (firstUsa) state.usaIntro = true;
    /* Sin presentación no hay quien ponga el reloj en marcha, así que
       lo hace la visita: quien pasó por USA antes de los 7 segundos y
       se fue, al volver sigue teniendo su promo. */
    if (country === "usa") armPromoIdle();
    go(country === "usa" ? "home" : "homegua", {}, { market: false });
    if (firstUsa) {
      clearTimeout(introTimer);
      /* El recorrido entra en cuanto la pared cruza, sin esperar a las
         rezagadas. Va por DOM y no por render: una pasada de render
         reconstruiría la capa de banderas y la haría arrancar otra vez
         —la segunda pared que salía detrás del primer punto—. El
         estado ya dice que la intro terminó, así que cualquier render
         posterior se lleva las banderas por delante; las que siguen en
         el aire terminan su viaje detrás del recorrido y se quitan
         solas al final. */
      introTimer = setTimeout(() => {
        state.usaIntro = false;
        state.guideOn = true;
        state.guideAsk = true;
        /* Clarita ya está ofreciendo el recorrido. Si nadie la toca, a
           los 7 segundos el reloj arranca solo: antes se quedaba en
           Super Deals para siempre, porque el único que lo ponía en
           marcha era el final del recorrido. Tocarla lo cancela. */
        armPromoIdle();
        const frame = root.querySelector(".oky-flow-frame");
        if (!frame) return render();
        /* Se inserta escondida y se destapa al cuadro siguiente: sin
           ese paso no hay dos valores que interpolar y entraría de
           golpe. */
        state.guideAway = true;
        frame.insertAdjacentHTML("beforeend", homeGuide(state));
        state.guideAway = false;
        const guide = root.querySelector(".oky-flow-guide");
        if (guide) setTimeout(() => guide.classList.remove("is-away"), 24);
        introTimer = setTimeout(() => {
          const wall = root.querySelector(".oky-flow-flagrise");
          if (wall) wall.remove();
        }, 1170);
      }, 1035);
    }
  }

  /* En un teléfono bajo el resumen del checkout se queda debajo del
     pliegue y "Comprar" hay que ir a buscarlo. Si no cabe, el resumen
     se ancla al fondo y deja solo el TOTAL y el botón: el desglose se
     puede leer scrolleando, pero pagar tiene que estar siempre a un
     toque.

     Se mide una vez por dibujo y no se vuelve a mirar: plegar las
     líneas achica el contenido, así que volver a medir diría que ya
     cabe y se pondría a parpadear entre los dos estados. */
  function bindCheckoutDock(scroll) {
    const box = root.querySelector(".oky-flow-checkoutdock");
    if (!box || !scroll) return;

    const frame = root.querySelector(".oky-flow-frame");
    if (!frame) return;

    /* El botón de verdad, el que vive dentro del resumen. */
    const real = scroll.querySelector(".summary-cta-row .summary-btn");
    if (!real) return;

    const put = () => {
      /* Las barras se pisan entre ellas —el ahorro y el cashback ocupan
         la misma franja—, así que sumar altos contaría de más: el borde
         útil es donde empieza la de más arriba. */
      const bars = [...frame.querySelectorAll(".oky-flow-navbar, .oky-flow-savingbar")];
      const limit = Math.min(
        frame.getBoundingClientRect().bottom,
        ...bars.map((b) => b.getBoundingClientRect().top),
      );
      /* Con doce píxeles de margen: rozar la barra de abajo por cuatro
         no se ve, y sacar un cintillo por eso sería cobrar caro un
         problema que no existe. */
      const fuera = real.getBoundingClientRect().bottom > limit + 12;
      box.classList.toggle("is-on", fuera);
      /* Con el cintillo puesto, el final del contenido tiene que poder
         subir por encima de él. */
      scroll.style.paddingBottom = fuera
        ? `calc(var(--oky-nav-h) + ${Math.round(box.getBoundingClientRect().height)}px)`
        : "";
    };

    put();
    /* Las imágenes de las cards llegan tarde y cambian el alto, y al
       scrollear el botón de verdad entra y sale de la pantalla: el
       cintillo se enciende y se apaga con él. */
    setTimeout(put, 60);
    setTimeout(put, 300);
    setTimeout(put, 900);
    scroll.addEventListener("scroll", put, { passive: true });

    /* Y en un teléfono el lienzo se ajusta al alto de la pantalla
       después de dibujar: midiendo solo al principio se medía contra
       los 800px de diseño, salía que cabía, y el cintillo solo aparecía
       al scrollear. El observador lo vuelve a medir en cuanto el marco
       cambia de tamaño; se va con el nodo en el siguiente dibujo. */
    if (typeof ResizeObserver !== "undefined") new ResizeObserver(put).observe(frame);
  }

  /* En pantallas cortas la ficha del vale no cabe entera y Clarita se
     quedaba debajo del pliegue, medio tapada por la navbar. Aquí sube
     lo justo para seguir viéndose en la esquina; nunca baja de donde
     vive, así que en pantallas altas no se mueve nada. */
  function bindClaritaInView(scroll) {
    const clarita = root.querySelector(".prime-card-clarita");
    if (!clarita || !scroll) return;

    const place = () => {
      /* Se mide sin el desplazamiento anterior, o cada pasada lo
         arrastraría. */
      clarita.style.transform = "";
      /* El tope no es solo la navbar: en el acuse de compra encima van
         el botón de wallet y la píldora del saldo, y contra la navbar
         Clarita se les metía debajo. Manda la barra de más arriba. */
      const bars = [...root.querySelectorAll(".oky-flow-navbar, .oky-flow-cta-bar, .oky-flow-savingbar")];
      const limit =
        (bars.length
          ? Math.min(...bars.map((b) => b.getBoundingClientRect().top))
          : scroll.getBoundingClientRect().bottom) - 10;
      const over = clarita.getBoundingClientRect().bottom - limit;
      if (over > 0) clarita.style.transform = `translateY(${-Math.round(over)}px)`;
    };

    /* Se repasa varias veces: el arte de la card llega por imagen y
       cada una que entra mueve el alto, así que medir una sola vez
       daba una posición que dejaba de valer al instante siguiente. */
    place();
    [60, 300, 800, 1600].forEach((ms) => setTimeout(place, ms));
    root.querySelectorAll(".card-organism img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", place, { once: true });
    });
    scroll.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place, { passive: true });

    /* Las barras de abajo también crecen tarde: la píldora del saldo del
       acuse de compra trae su moneda por imagen y, al entrar, la barra
       sube y se come el sitio que Clarita creía tener. Se vuelve a medir
       en cuanto cambian de alto; el observador se va con los nodos en el
       siguiente dibujo. */
    if (typeof ResizeObserver !== "undefined") {
      const watch = new ResizeObserver(place);
      root
        .querySelectorAll(
          ".oky-flow-navbar, .oky-flow-cta-bar, .oky-flow-savingbar, .oky-flow-section, .card-organism",
        )
        .forEach((box) => watch.observe(box));
    }
  }

  function bindHeaderScroll(scroll) {
    /* Las dos homes llevan el mismo Discovery Header, así que las dos
       colapsan al bajar y las dos esconden la pista de scroll. */
    if (state.screen !== "home" && state.screen !== "homegua") return;

    scroll.addEventListener(
      "scroll",
      () => {
        const y = scroll.scrollTop;

        /* La pista de scroll cumplió su trabajo en cuanto la persona
           se mueve; no hay razón para seguir insistiendo. */
        const hint = root.querySelector(".oky-flow-scroll-hint");
        if (hint) hint.classList.toggle("is-hidden", y > 24);

        /* Clarita vive arriba: bajando se va y al volver se asoma
           preguntando otra vez. Esconderse es estado y no solo una
           clase, porque cualquier repintado la devolvía a la vista
           aunque siguieras abajo. Bajando basta con la clase, que es
           la que lo anima; subiendo se rehace si volvió sin globo.
           Se va al primer empujón —no a los 24px como la pista—:
           quedarse un momento con la home ya en movimiento la hacía
           parecer pegada a la pantalla. */
        const away = y > 4;
        if (state.guideOn && away !== state.guideAway) {
          state.guideAway = away;
          if (!away) state.guideAsk = true;
          const guide = root.querySelector(".oky-flow-guide");
          if (guide) {
            /* Vuelve el globo antes de destaparla, y sin rehacer al
               personaje: reemplazar el nodo entero mataría la
               transición de vuelta. */
            if (!away && !guide.querySelector(".oky-flow-guide-bubble")) {
              guide.insertAdjacentHTML("afterbegin", guideBubble());
            }
            guide.classList.toggle("is-away", away);
          }
        }

        const next = state.headerCollapsed ? y > 40 : y > 96;
        if (next === state.headerCollapsed) return;

        const host = scroll.querySelector(".discovery-header-organism");
        if (!host) return;

        const before = host.offsetHeight;
        /* Colapsado se va al State 3: fuera wallet, logo y carrito, y
           quedan solo el folder minimizado y el buscador compacto. Eso
           devuelve ~100px de alto al contenido mientras se scrollea. */
        host.insertAdjacentHTML("beforebegin", homeHeader(state, next ? "State 3" : "State 1"));
        host.remove();
        const fresh = scroll.querySelector(".discovery-header-organism");
        state.headerCollapsed = next;

        /* El cambio de alto se anima en vez de darse de golpe: se parte
           del alto viejo y se deja correr la transición hasta el nuevo.
           Al desplegar, además, el header entra desvanecido desde
           arriba, que es de donde vuelve. */
        const after = fresh.offsetHeight;
        if (after !== before) {
          fresh.classList.add("is-swapping");
          fresh.style.height = before + "px";
          /* Forzar reflow para que el navegador tenga dos valores que
             interpolar y no colapse las dos asignaciones en una. */
          void fresh.offsetHeight;
          fresh.style.height = after + "px";
          const settle = (event) => {
            if (event && event.target !== fresh) return;
            fresh.classList.remove("is-swapping");
            fresh.style.height = "";
            fresh.removeEventListener("transitionend", settle);
          };
          fresh.addEventListener("transitionend", settle);
          /* Si la transición no llega a dispararse (prefers-reduced-motion,
             pestaña en segundo plano) el header no puede quedarse con un
             alto fijo encima. */
          setTimeout(settle, 400);
        }
        /* Despegado del top, el buscador ya no tiene detrás el
           degradado del home y necesita su propio fondo. */
        root.querySelector(".oky-flow-frame").classList.toggle("is-header-collapsed", next);
      },
      { passive: true },
    );
  }

  /* La caja de cantidad se recoge sola. Se cierra por el DOM y no por
     render para que la animación de cierre llegue a verse: un render
     cambiaría el nodo de golpe y la caja desaparecería sin encogerse. */
  const QTY_OPEN_MS = 2600;
  const QTY_CLOSE_MS = 200;
  let qtyTimer = null;

  function armQtyClose() {
    clearTimeout(qtyTimer);
    qtyTimer = setTimeout(() => {
      const box = root.querySelector(".oky-flow-cart-qty.is-open");
      if (!box) {
        state.qtyOpen = null;
        return render();
      }
      box.classList.add("is-closing");
      qtyTimer = setTimeout(() => {
        state.qtyOpen = null;
        render();
      }, QTY_CLOSE_MS);
    }, QTY_OPEN_MS);
  }

  /* Abrir un vale lo da por visto a él solo. Antes se guardaba la
     marca, así que comprar un segundo Nike llegaba ya visto —sin punto
     y sin contar— por haber abierto el primero. */
  function seeVoucher(key, unit = 0) {
    const id = unitId(key, unit);
    if (!state.seenVouchers.includes(id)) state.seenVouchers.push(id);
  }

  /* Archivar saca el vale del wallet y devuelve a la lista, que es
     donde se ve el resultado. No hace falta avisar al pie: la hoja de
     confirmación ya explicó a dónde va el vale, y de vuelta en el
     wallet se ve que ya no está. Para recuperarlo está el filtro de
     archivados, con su "Desarchivar". */
  function archiveVoucher(id) {
    if (!state.archivedVouchers.includes(id)) state.archivedVouchers.push(id);

    /* Archivando desde el detalle de la compra recién pagada, la
       pantalla se queda con el siguiente vale de esa orden: guardar uno
       no cierra la revisión de los demás. Cuando ya no queda ninguno
       sin archivar, no hay orden que enseñar y se sale al wallet, que
       es donde acabaron. */
    if (state.screen === "voucher" && state.params.id) {
      const left = state.lastOrder.filter((p) => {
        const purchase = state.purchases.find((x) => x.id === p.id);
        return purchase && !state.archivedVouchers.includes(unitId(p.productKey, unitOfPurchase(state, purchase)));
      });
      if (left.length) return go("voucher", { id: left[0].id }, { push: false });
    }

    /* Y el wallet abre donde acaba de caer: su pestaña, con Archivados
       desplegado. La hoja prometió que se podría volver a ver; esto lo
       enseña en vez de contarlo. */
    state.walletTab = sectionOfVoucher(String(id).split("#")[0]);
    state.walletFilter = "";
    state.openBeforeFilter = null;
    state.openGroups = ["archivados"];
    state.history = [{ screen: homeOfCountry(), params: {} }];
    return go("wallet", {}, { push: false });
  }

  /* Pantallas de después de pagar. Salir de ellas cierra la compra: la
     flecha de atrás vuelve al home y no al recibo, que ya se vio y al
     que nadie quiere volver. */
  const POST_PURCHASE = ["success", "cashwin", "purchases"];

  function leavePurchase(screen) {
    if (!POST_PURCHASE.includes(state.screen)) return go(screen);
    state.history = [{ screen: homeOfCountry(), params: {} }];
    return go(screen, {}, { push: false });
  }

  /* Portero de marketplace. Cualquier camino que acabe en la tienda
     del otro país —el botón Home, "Seguir comprando", el atrás que
     desanda hasta una home anterior— pasa por aquí: con el carrito
     lleno se pregunta antes, y vacío se cambia de país de verdad. Sin
     esto se podía acabar en la tienda de Guatemala con una gift card
     de USA dentro del carrito, que es un estado que no existe. */
  const HOME_COUNTRY = { home: "usa", homegua: "gua" };
  const homeOfCountry = () => (state.country === "gua" ? "homegua" : "home");

  /* Lo que decide si se cruza de mercado es el carrito, no la bandera
     que lleve marcada el estado: con una gift card de USA dentro, ir a
     la tienda de Guatemala es cruzar, punto. Así ninguna desincronía
     entre lo que se ve y lo que se cree que se está viendo abre la
     puerta de atrás. */
  function crossesMarket(screen) {
    const target = HOME_COUNTRY[screen];
    if (!target) return false;
    return state.cart.length ? orderCountry(state) !== target : target !== state.country;
  }

  function guardMarket(screen) {
    const target = HOME_COUNTRY[screen];
    if (!target) return false;
    if (state.cart.length && orderCountry(state) !== target) {
      state.countrySheet = { to: target };
      render();
      return true;
    }
    if (target !== state.country) {
      goCountry(target);
      return true;
    }
    return false;
  }

  function go(screen, params = {}, { push = true, market = true } = {}) {
    if (market && guardMarket(screen)) return;
    if (push) state.history.push({ screen: state.screen, params: state.params });
    state.screen = screen;
    state.params = params;
    state.cartOpen = false;
    state.headerCollapsed = false;
    render();
  }

  function goBack() {
    const prev = state.history.pop();
    if (!prev) return go(homeOfCountry(), {}, { push: false });
    /* Atrás tampoco cruza de mercado en silencio: si el carrito está
       lleno se pregunta y el paso queda deshecho, no a medias. */
    if (crossesMarket(prev.screen)) {
      state.history.push(prev);
      guardMarket(prev.screen);
      return;
    }
    state.screen = prev.screen;
    state.params = prev.params;
    state.cartOpen = false;
    state.headerCollapsed = false;
    render();
  }

  /* Mueve el carrusel de diseños sin rehacer la pantalla: desplaza el
     track, pasa el estado activo y cambia el copy con un fundido. */
  function paintDesignCarousel() {
    const at = wrap(state.cardDesignIndex, CARD_DESIGNS.length);
    const design = CARD_DESIGNS[at];

    const track = root.querySelector(".oky-flow-design-track");
    if (track) track.style.setProperty("--design-at", at);

    root.querySelectorAll(".oky-flow-design-slide").forEach((slide, i) => {
      slide.classList.toggle("is-active", i === at);
      slide.setAttribute("aria-pressed", String(i === at));
    });

    root.querySelectorAll(".oky-flow-design .promo-dot").forEach((dot, i) => {
      dot.classList.toggle("promo-dot-active", i === at);
    });

    const copy = root.querySelector(".oky-flow-design-copy");
    if (!copy) return;
    copy.classList.remove("is-swapping");
    /* Reflow para poder relanzar la animación en el mismo frame. */
    void copy.offsetWidth;
    copy.classList.add("is-swapping");
    copy.querySelector(".oky-flow-design-title").textContent = design.label;
    copy.querySelector(".oky-flow-design-note").textContent = design.note;
  }

  /* Tras el sello de "Compra exitosa" va la animación de cashback;
     si la compra no generó OKY Cash se salta. */
  const nextAfterStamp = () => (state.lastEarned > 0 ? "cashwin" : "purchases");

  function completePurchase() {
    const total = cartTotal(state);
    const used = appliedOkyCash(state);
    /* Solo lo pagado con tarjeta genera cashback. */
    const byCardShare = total > 0 ? (total - used) / total : 0;
    let earned = 0;
    /* La orden se guarda aparte de purchases: "Tus compras" enseña solo
       esto y Mi wallet sigue acumulando. */
    state.lastOrder = [];

    /* Un número por orden, no por vale. */
    state.orderSeq += 1;
    const order = `Orden #${11112440 + state.orderSeq}`;

    /* Lo que se pagó con saldo también es un movimiento: sin esta
       línea el saldo bajaba y el historial no lo explicaba. */
    if (used > 0) {
      /* El saldo se aplica a la orden entera, pero quien lo mira quiere
         saber en qué se fue: se reparte a prorrata de lo que costó cada
         marca y el redondeo sobrante va a la última, para que el
         desglose sume exactamente lo que bajó del saldo. */
      const base = cartSubtotal(state) || 1;
      let repartido = 0;
      const detail = state.cart.map((item, i) => {
        const last = i === state.cart.length - 1;
        const parte = last
          ? used - repartido
          : Math.round(((item.amount * (item.qty || 1)) / base) * used * 100) / 100;
        repartido += parte;
        return { label: (PRODUCTS[item.productKey] || {}).label || "", amount: `- ${money(parte)}` };
      });

      state.activity.unshift({
        date: stamp(0),
        group: monthGroup(0),
        amount: `- ${money(used)}`,
        order,
        kind: "debit",
        label: "Pagado con OKY Cash",
        value: -used,
        detail,
      });
    }

    state.cart.forEach((item, i) => {
      /* Una línea con tres hamburguesas son tres vales, no uno: cada
         unidad lleva su propio código y se canjea por su cuenta. Se
         guardaba una sola por línea, así que al final de la compra
         aparecía un vale donde tenían que estar los tres. */
      const units = Math.max(item.qty || 1, 1);
      for (let u = 0; u < units; u += 1) {
        const purchase = {
          id: `p-${Date.now()}-${i}-${u}`,
          productKey: item.productKey,
          /* El monto de la línea es el de una: lo que se multiplica
             para enseñar el total del carrito, aquí se reparte. */
          amount: item.amount,
          /* El vale de una marca de Guatemala vale quetzales: los
             dólares son solo lo que costó pagarlo. */
          ...(item.quetzales != null ? { quetzales: item.quetzales } : {}),
          cashback: item.cashback / units,
          /* El saldo se aplicó a la orden entera; cuelga de un vale
             solo para no contarlo tantas veces como vales haya. */
          used: i === 0 && u === 0 ? used : 0,
          date: stamp(0),
        };
        state.purchases.push(purchase);
        state.lastOrder.push(purchase);
      }

      /* El movimiento del historial sigue siendo uno por marca y orden:
         lo que se ganó con las tres hamburguesas es una sola línea. */
      const itemEarned = item.cashback * byCardShare;
      earned += itemEarned;
      if (itemEarned > 0) {
        state.activity.unshift({
          date: stamp(0),
          group: monthGroup(0),
          amount: `+ ${money(itemEarned)}`,
          order,
          kind: "credit",
          /* Para el desglose por marca dentro de la orden. */
          label: PRODUCTS[item.productKey].label,
          value: itemEarned,
        });
      }
    });

    state.okyCashBalance = state.okyCashBalance - used + earned;
    state.lastEarned = earned;
    state.cashUnseen = earned > 0;
    state.cart = [];
    state.okyCashEnabled = false;
    state.okyCashApplied = 0;
    state.promo = null;
    state.history = [];
    go("success", {}, { push: false });
  }

  /* Lluvia de confeti de la compra exitosa: piezas de colores que
     caen girando, generadas en el DOM en vez de un PNG plano. */
  /* El estallido del final del recorrido: las piezas salen del centro
     hacia afuera en todas direcciones, no caen desde arriba. El ángulo
     se reparte en círculo con un poco de desorden, para que no se lea
     como una rueda dentada. */
  function seedTourBurst(host) {
    const colors = ["#09b4b0", "#a8faf5", "#552588", "#ffb400", "#ff6b9d", "#7cf4ef"];
    const COUNT = 34;
    for (let i = 0; i < COUNT; i += 1) {
      const angle = (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const dist = 96 + Math.random() * 130;
      const piece = document.createElement("span");
      piece.className = "oky-flow-burst-piece";
      piece.style.setProperty("--piece-dx", `${Math.cos(angle) * dist}px`);
      piece.style.setProperty("--piece-dy", `${Math.sin(angle) * dist}px`);
      piece.style.setProperty("--piece-color", colors[i % colors.length]);
      piece.style.setProperty("--piece-rot", `${Math.random() * 360}deg`);
      piece.style.setProperty("--piece-spin", `${180 + Math.random() * 540}deg`);
      piece.style.setProperty("--piece-delay", `${Math.random() * 90}ms`);
      piece.style.setProperty("--piece-dur", `${760 + Math.random() * 320}ms`);
      piece.style.setProperty("--piece-w", `${5 + Math.random() * 5}px`);
      piece.style.setProperty("--piece-h", `${9 + Math.random() * 7}px`);
      host.appendChild(piece);
    }
  }

  function seedCelebration(host) {
    const colors = ["#09b4b0", "#a8faf5", "#552588", "#ffb400", "#ff6b9d", "#7cf4ef"];
    for (let i = 0; i < 46; i += 1) {
      const piece = document.createElement("span");
      piece.className = "oky-flow-celebration-piece";
      piece.style.setProperty("--piece-x", `${Math.random() * 100}%`);
      piece.style.setProperty("--piece-color", colors[i % colors.length]);
      piece.style.setProperty("--piece-rot", `${Math.random() * 360}deg`);
      piece.style.setProperty("--piece-spin", `${360 + Math.random() * 720}deg`);
      piece.style.setProperty("--piece-delay", `${Math.random() * 900}ms`);
      piece.style.setProperty("--piece-dur", `${1800 + Math.random() * 1400}ms`);
      piece.style.setProperty("--piece-w", `${5 + Math.random() * 6}px`);
      piece.style.setProperty("--piece-h", `${9 + Math.random() * 8}px`);
      piece.style.setProperty("--piece-drift", `${-40 + Math.random() * 80}px`);
      host.appendChild(piece);
    }
  }

  /* Ráfaga corta de confeti sobre la fila de OKY Cash al activarla.
     Se limpia sola cuando termina la animación. */
  /* El confeti cae dentro de la fila de OKY Cash, la haya dibujado el
     checkout o la pantalla de métodos de pago: es la misma casilla en
     dos sitios y marcarla se celebra igual en los dos. El aqua ya no se
     pega aquí —lo pone el estado al dibujar— para que no se pierda en
     el siguiente render. */
  function burstConfetti(selector) {
    const row = selector
      ? root.querySelector(selector)
      : root.querySelector(".oky-flow-payrow.is-last") || root.querySelector(".oky-flow-method-row.is-cash");
    if (!row) return;

    const colors = ["#09b4b0", "#a8faf5", "#552588", "#ffb400"];
    for (let i = 0; i < 14; i += 1) {
      const piece = document.createElement("span");
      piece.className = "oky-flow-confetti-piece";
      piece.style.setProperty("--piece-x", `${8 + Math.random() * 84}%`);
      piece.style.setProperty("--piece-color", colors[i % colors.length]);
      piece.style.setProperty("--piece-rot", `${Math.random() * 360}deg`);
      piece.style.setProperty("--piece-delay", `${Math.random() * 120}ms`);
      piece.style.setProperty("--piece-w", `${4 + Math.random() * 4}px`);
      piece.style.setProperty("--piece-h", `${8 + Math.random() * 6}px`);
      row.appendChild(piece);
    }
    setTimeout(() => row.querySelectorAll(".oky-flow-confetti-piece").forEach((p) => p.remove()), 1100);
  }

  root.addEventListener("click", (event) => {
    const el = event.target.closest("[data-action]");
    if (!el || el.disabled) return;
    const action = el.dataset.action;

    if (action === "reset") {
      /* Vuelve a cero: saldo, carrito, compras, historial y el reloj
         de la promo, que arranca de nuevo con sus dos minutos. */
      clearTimeout(celebrationTimer);
      state = createInitialState(userType);
      /* El estado nuevo dice que la promo no ha empezado, pero el
         temporizador que la arranca ya se gastó al montar. Sin
         rearmarlo, "Reiniciar" dejaba el prototipo sin reloj para
         siempre. */
      cancelPromoIdle();
      if (state.screen === "home") {
        state.usaSeen = true;
        armPromoIdle();
      }
      return render();
    }

    if (action === "scroll-more") {
      const scroll = root.querySelector(".oky-flow-scroll");
      return scroll.scrollBy({ top: scroll.clientHeight * 0.8, behavior: "smooth" });
    }

    if (action === "back") return goBack();
    if (action === "nav:country-home") {
      /* Home vuelve a la home del país en el que se está, no siempre a
         la de USA: el folder es el único que cambia de país. */
      return go(state.country === "gua" ? "homegua" : "home");
    }

    if (action === "nav:home" || action === "nav:homegua") {
      const target = action === "nav:home" ? "usa" : "gua";
      /* Con el carrito lleno no se cambia de marketplace en silencio, y
         lo que manda es de dónde salió lo que llevo dentro. */
      if (state.cart.length && orderCountry(state) !== target) {
        state.countrySheet = { to: target };
        return render();
      }
      return goCountry(target);
    }

    if (action === "card-tour") {
      /* Callada, lo primero que hace es volver a ofrecerse: el
         recorrido sale del blurb, no del muñeco a secas. Es el mismo
         trato que en la home. */
      if (state.claritaMuted) {
        state.claritaMuted = false;
        return render();
      }

      /* Qué se está mirando decide qué se explica. Dentro de las gift
         cards de USA lo dice además la variante dibujada: la que lleva
         URL y la de código de barras con PIN no se canjean igual. Se
         puede pedir las veces que haga falta. */
      const shown = state.params.id
        ? (state.purchases.find((p) => p.id === state.params.id) || {}).productKey
        : state.params.key;
      const sec = sectionOfVoucher(shown);
      const bottom = root.querySelector(".card-bottom-molecule");
      state.tourDeck =
        sec === "gift"
          ? bottom && bottom.classList.contains("is-gift-card-usa")
            ? "url"
            : "pin"
          : sec === "servicios"
            ? "servicio"
            : shown === "tigo"
              ? "tigo"
              : "vale";
      state.tourStep = 0;
      render();
      placeTour();
      return;
    }

    if (action === "guide-tap") {
      /* Preguntando, el toque acepta y abre el recorrido. Callada, lo
         primero que hace es volver a preguntar. */
      if (!state.guideAsk) {
        state.guideAsk = true;
        return render();
      }
      /* Enseñado el recorrido, Clarita se retira: ya hizo su trabajo y
         volver a ofrecerlo sería insistir. */
      state.guideAsk = false;
      state.guideOn = false;
      state.tourDeck = "home";
      state.tourStep = 0;
      /* Abierto el recorrido, el arranque solo sobra: el reloj tiene
         que empezar con el confeti del final, no a media explicación.
         Si ya arrancó, el recorrido termina sin transición, que es lo
         correcto: no se puede empezar dos veces. */
      cancelPromoIdle();
      render();
      placeTour();
      return;
    }

    if (action === "guide-hush") {
      state.guideAsk = false;
      return render();
    }

    if (action === "clarita-close") {
      state.claritaMuted = true;
      return render();
    }

    if (action === "tour-next") {
      const next = (state.tourStep ?? 0) + 1;
      if (next >= tourStepsOf(state).length) return closeTour();
      state.tourStep = next;
      return render();
    }

    if (action === "tour-end") return closeTour();

    if (action === "open-market") {
      state.marketSheet = el.dataset.side === "left" ? "left" : "right";
      return render();
    }

    if (action === "close-market") {
      state.marketSheet = null;
      return render();
    }

    if (action === "pick-market") {
      const side = el.dataset.side === "left" ? "left" : "right";
      state.market = { ...state.market, [side]: el.dataset.iso };
      state.marketSheet = null;
      return render();
    }

    if (action === "country-stay") {
      state.countrySheet = null;
      return render();
    }

    if (action === "country-checkout") {
      state.countrySheet = null;
      state.cartOpen = true;
      return render();
    }

    if (action === "country-switch") {
      const target = (state.countrySheet || {}).to === "usa" ? "usa" : "gua";
      state.countrySheet = null;
      state.cart = [];
      state.okyCashEnabled = false;
      state.okyCashApplied = 0;
      state.promo = null;
      return goCountry(target);
    }
    if (action === "nav:wallet") {
      /* De dónde se entra decide dónde te deja. Desde una tienda, el
         wallet abre en lo que esa tienda vende —OKY Vales en Guatemala,
         Gift cards en USA— con Activos desplegado: es la visita de
         "¿qué tengo?". Desde el final de una compra abre en lo que
         acabas de comprar, que es lo que vienes a ver. Lo que estuviera
         plegado o desplegado de la visita anterior ya no dice nada de
         lo que hay ahora. */
      const fromPurchase = POST_PURCHASE.includes(state.screen);
      state.walletFilter = "";
      state.openBeforeFilter = null;
      state.walletTab = fromPurchase ? walletEntryTab(state) : state.country === "gua" ? "vales" : "gift";
      state.openGroups = fromPurchase ? walletOpenGroups(state) : ["activos"];
      return leavePurchase("wallet");
    }
    if (action === "nav:okycash") {
      /* La moneda de la navbar, las píldoras de saldo de los dos homes
         y el CTA de la tarjeta llevan al mismo sitio: la pestaña de
         OKY Cash de Mi wallet, que es donde vive la actividad. */
      state.cashUnseen = false;
      state.walletTab = "cash";
      state.walletFilter = "";
      state.openBeforeFilter = null;
      state.openGroups = [];
      return leavePurchase("wallet");
    }

    if (action === "nav:carddesign") {
      /* El selector abre en el diseño que está puesto. */
      state.cardDesignIndex = CARD_DESIGNS.findIndex((d) => d.key === state.cardDesign);
      return go("carddesign");
    }

    if (action === "pick-design") {
      const next = Number(el.dataset.index);
      if (next === state.cardDesignIndex) return;
      state.cardDesignIndex = next;
      /* Se parchea en sitio en vez de re-renderizar: si se rehace el
         DOM, el track nace ya en su posición nueva y la transición no
         llega a correr — ese era el salto. */
      return paintDesignCarousel();
    }

    if (action === "choose-design") {
      state.cardDesign = CARD_DESIGNS[wrap(state.cardDesignIndex, CARD_DESIGNS.length)].key;
      return goBack();
    }
    if (action === "go:purchases") return go("purchases");

    if (action === "open-cart") {
      state.cartOpen = true;
      return render();
    }
    if (action === "close-cart") {
      state.cartOpen = false;
      return render();
    }
    /* "Seguir comprando" devuelve a donde estaba comprando, que casi
       siempre es el PDP del que acabo de agregar: cerrar el carrito ya
       lo deja ahí. Solo desde el checkout —donde ya no hay tienda
       detrás— hace falta llevar a la home de ese mercado. */
    if (action === "keep-shopping") {
      state.cartOpen = false;
      if (state.screen === "checkout" || state.screen === "methods") {
        /* Vuelve a donde se estaba comprando: la lista de la marca si
           se venía de una PLP, su PDP si se venía de uno. Solo cuando
           no hay nada que desandar se sale a la tienda del mercado. */
        const SHOPPING = ["plp", "foodpdp", "tigopdp", "pdp", "category", "home", "homegua"];
        for (let i = state.history.length - 1; i >= 0; i -= 1) {
          const step = state.history[i];
          if (!SHOPPING.includes(step.screen)) continue;
          state.history = state.history.slice(0, i);
          return go(step.screen, step.params, { push: false });
        }
        return go(orderCountry(state) === "gua" ? "homegua" : "home");
      }
      return render();
    }
    if (action === "go:checkout") {
      state.checkoutIndex = 0;
      return go("checkout");
    }
    if (action === "go:decision") {
      /* Solo se pregunta la primera vez: una vez elegido, "Ir a pagar"
         va derecho al checkout.

         En móvil no se pregunta nunca: el modal se quedaba trabado en
         el teléfono —el toque en "Para mi" no llegaba— y dejaba la
         prueba sin manera de llegar al pago. Se asume "Para mí", que es
         lo que la pantalla proponía por defecto. En escritorio sigue
         igual. */
      /* En Guatemala el destinatario ya viene puesto, así que no hay
         nada que preguntar. En USA sigue igual que siempre. */
      if (state.decisionSeen || phone.matches || orderCountry(state) === "gua") {
        /* Lo de Guatemala no pregunta ni deja rastro: el destinatario lo
           pone la propia orden, así que state.recipient sigue siendo lo
           que la persona eligió para sus compras de USA. */
        if (orderCountry(state) !== "gua") {
          state.decisionSeen = true;
          state.recipient = USA_RECIPIENT.name;
        }
        state.checkoutIndex = 0;
        return go("checkout");
      }
      return go("decision");
    }

    if (action === "open-pdp") {
      /* La PLP manda el monto de la denominación tocada; desde el
         home se entra con el que ya tenga la marca. */
      const key = el.dataset.product;
      if (el.dataset.amount) state.amounts[key] = Number(el.dataset.amount);
      else if (!state.amounts[key]) state.amounts[key] = BRAND_DEFAULT_AMOUNT;
      return go("pdp", { product: key });
    }

    if (action === "add-to-cart") {
      const product = PRODUCTS[el.dataset.product];
      const typed = state.amounts[product.key];
      if (!typed) return;
      /* Lo tecleado son quetzales en las marcas de Guatemala; el
         carrito guarda dólares y se queda con el monto original para
         poder volver a abrir el PDP donde estaba. */
      const amount = product.quetzal ? toUsd(typed) : typed;
      const tier = getTier(amount, product, state.promoLive);
      const updating = state.cart.some((item) => item.productKey === product.key);
      /* Con costo por servicio, la promesa del ahorro se cuenta una
         vez: cuando entra lo primero que lo paga. */
      const first = product.service && !cartServiceCount(state);
      state.cart = state.cart
        .filter((item) => item.productKey !== product.key)
        .concat({
          productKey: product.key,
          amount,
          cashback: amount * tier.rate,
          ...(product.quetzal ? { quetzales: typed } : {}),
        });

      /* Cambiar el monto de algo que ya estaba no es una novedad: abre
         el carrito y ya. Lo que entra por primera vez se confirma con
         el aviso y, al apagarse, el carrito entra desde el lado. */
      if (updating) {
        state.cartOpen = true;
        return render();
      }

      const showSavings = first && !state.savingsSeen;
      if (showSavings) state.savingsSeen = true;

      state.addedToast = true;
      render();
      clearTimeout(addedTimer);
      addedTimer = setTimeout(() => {
        state.addedToast = false;
        if (showSavings) {
          state.savingsSheet = true;
          state.savingsFromPdp = true;
        } else {
          state.cartOpen = true;
        }
        render();
      }, 1200);
      return;
    }

    if (action === "edit-item") {
      /* Vuelve al PDP con el monto que tiene en el carrito; al agregar
         otra vez, esa marca se reemplaza en vez de duplicarse. */
      const key = el.dataset.product;
      const inCart = state.cart.find((item) => item.productKey === key);
      if (inCart) state.amounts[key] = inCart.quetzales != null ? inCart.quetzales : inCart.amount;
      /* Tigo se edita desde su slider, no desde el campo de monto. */
      if (key === "tigo") return go("tigopdp");
      if ((PRODUCTS[key] || {}).quetzal) return go("guapdp", { product: key });
      return go("pdp", { product: key });
    }

    if (action === "remove-item") {
      /* El mercado se decide por lo que hay en el carrito, así que hay
         que preguntarlo antes de vaciarlo. */
      const market = orderCountry(state);
      state.cart = state.cart.filter((item) => item.productKey !== el.dataset.product);
      state.checkoutIndex = clamp(state.checkoutIndex, 0, Math.max(state.cart.length - 1, 0));
      if (!state.cart.length) {
        /* Sin nada que pagar el checkout no tiene de qué hablar: se
           cierra el carrito y se vuelve a la tienda de ese mercado. */
        state.cartOpen = false;
        state.okyCashEnabled = false;
        state.okyCashApplied = 0;
        state.promo = null;
        if (state.screen === "checkout" || state.screen === "methods") {
          return go(market === "gua" ? "homegua" : "home");
        }
      }
      return render();
    }

    if (action === "open-methods") {
      /* Abrir los métodos de pago era gastar el saldo: entraba con OKY
         Cash ya marcado y de paso borraba el código promocional. Mirar
         no es elegir, y al volver al checkout la persona se encontraba
         con una decisión que no había tomado. */
      return go("methods");
    }

    if (action === "toggle-okycash") {
      const turningOn = !state.okyCashEnabled;
      /* Un descuento a la vez: marcar OKY Cash borra el código. */
      if (turningOn) state.promo = null;
      state.okyCashEnabled = turningOn;
      state.okyCashApplied = turningOn ? Math.min(state.okyCashBalance, cartTotal(state)) : 0;
      render();
      if (turningOn) burstConfetti();
      return;
    }

    /* ── Código promocional ─────────────────────────────
       Se abre desde la píldora del carrito y se quita desde su X,
       que es el único camino que tiene el flujo. */
    if (action === "open-promo") {
      state.promoOpen = true;
      state.promoDraft = "";
      state.promoError = false;
      return render();
    }

    if (action === "close-promo") {
      state.promoOpen = false;
      state.promoError = false;
      return render();
    }

    if (action === "apply-promo") {
      const code = String(state.promoDraft || "").trim();
      if (!promoValue(code)) {
        state.promoError = true;
        return render();
      }
      state.promo = code.toLowerCase();
      state.promoOpen = false;
      state.promoDraft = "";
      state.promoError = false;
      /* El código desplaza al OKY Cash: no pueden convivir. */
      state.okyCashEnabled = false;
      state.okyCashApplied = 0;
      render();
      burstConfetti(".oky-flow-promo");
      return;
    }

    if (action === "clear-promo") {
      state.promo = null;
      return render();
    }

    /* Los carruseles dan la vuelta: del último se pasa al primero. */
    if (action === "carousel-prev" || action === "carousel-next") {
      const step = action === "carousel-next" ? 1 : -1;
      state.checkoutIndex = wrap(state.checkoutIndex + step, state.cart.length);
      return render();
    }

    if (action === "open-plp") {
      return go("plp", { brand: el.dataset.brand || "mcdonalds" });
    }

    if (action === "open-food") {
      return go("foodpdp", { product: el.dataset.product });
    }

    /* El chip de cantidad manda en la PLP, en el PDP y en el carrito:
       una sola acción para los tres, que es lo que lo hace fiable. */
    if (action === "open-qty") {
      state.qtyOpen = el.dataset.product;
      armQtyClose();
      return render();
    }

    if (action === "food-more" || action === "food-less") {
      const key = el.dataset.product;
      /* Sumando desde la caja abierta se queda abierta —se suele
         añadir de varias en varias— y se le da cuerda otra vez. El "+"
         del carrito con uno solo la abre: pasar a dos es justo cuando
         empieza a haber cantidad que ajustar. */
      if (state.qtyOpen === key || el.dataset.open) {
        state.qtyOpen = key;
        armQtyClose();
      }
      const product = PRODUCTS[key];
      if (!product) return;
      const step = action === "food-more" ? 1 : -1;
      const line = state.cart.find((i) => i.productKey === key);
      const first = !cartServiceCount(state);

      if (!line) {
        if (step < 0) return;
        state.cart = state.cart.concat({ productKey: key, amount: product.price, cashback: 0, qty: 1 });
      } else {
        const next = (line.qty || 1) + step;
        state.cart = next <= 0 ? state.cart.filter((i) => i !== line) : state.cart.map((i) => (i === line ? { ...i, qty: next } : i));
        /* Con uno solo la caja no tiene pasos que ofrecer y vuelve a
           ser el "+"; dejarla abierta enseñaría un menos que borraría
           la línea sin decirlo, que es lo que hace el tacho. */
        if (next <= 1 && state.qtyOpen === key) state.qtyOpen = null;
      }

      /* El saldo aplicado se recalcula: el total acaba de moverse. */
      if (state.okyCashEnabled) state.okyCashApplied = Math.min(state.okyCashBalance, cartTotal(state));

      /* La promesa del ahorro se cuenta una vez, cuando empieza a
         valer: al entrar el primer producto. */
      const showSavings = first && step > 0 && !state.savingsSeen;
      if (showSavings) state.savingsSeen = true;

      /* Desde el PDP del producto, agregar se confirma como en el
         resto del prototipo: el aviso centrado y, al apagarse, el
         carrito entra desde el lado. En la lista no, que ahí se sigue
         eligiendo y abrir el carrito en cada toque estorbaría. */
      if (state.screen === "foodpdp" && !state.cartOpen && step > 0) {
        state.addedToast = true;
        render();
        clearTimeout(addedTimer);
        addedTimer = setTimeout(() => {
          state.addedToast = false;
          if (showSavings) {
            state.savingsSheet = true;
            state.savingsFromPdp = true;
          } else {
            state.cartOpen = true;
          }
          render();
        }, 1200);
        return;
      }

      if (showSavings) state.savingsSheet = true;

      /* Agregar desde la lista no puede devolver al principio: se está
         eligiendo a media página y volver arriba obliga a buscar otra
         vez dónde se estaba. */
      const before = root.querySelector(".oky-flow-scroll");
      const y = before ? before.scrollTop : 0;
      render();
      const after = root.querySelector(".oky-flow-scroll");
      if (after && y) after.scrollTop = y;

      /* Sumar uno más sube el ahorro: la franja lo celebra, que es de
         lo que va la promesa de llenar el carrito. */
      if (step > 0 && cartSavings(state) > 0) burstConfetti(".oky-flow-foodbar-save");
      return;
    }

    if (action === "close-savings") {
      state.savingsSheet = false;
      /* Si el aviso vino de agregar desde el PDP, al cerrarlo sigue lo
         que tocaba: el carrito. */
      if (state.savingsFromPdp) {
        state.savingsFromPdp = false;
        state.cartOpen = true;
      }
      /* Cerrar el aviso tampoco devuelve al principio de la lista. */
      const before = root.querySelector(".oky-flow-scroll");
      const y = before ? before.scrollTop : 0;
      render();
      const after = root.querySelector(".oky-flow-scroll");
      if (after && y) after.scrollTop = y;
      return;
    }

    if (action === "open-category") {
      return go("category", { category: el.dataset.category || "recargas" });
    }

    if (action === "open-guapdp") {
      const key = el.dataset.product;
      if (!PRODUCTS[key]) return;
      /* La primera visita abre en el monto de arranque; después, en lo
         último que se tecleó. */
      if (state.amounts[key] == null) state.amounts[key] = GUA_VALE_DEFAULT;
      return go("guapdp", { product: key });
    }

    if (action === "open-tigo") {
      if (state.amounts.tigo == null) state.amounts.tigo = TIGO_DEFAULT_AMOUNT;
      return go("tigopdp");
    }

    if (action === "open-filter") {
      state.sheet = { type: "filter" };
      return render();
    }

    if (action === "pick-filter") {
      /* Elegir cierra: una sola decisión, sin botón de aplicar. */
      return setWalletFilter(el.dataset.cat || "");
    }

    if (action === "clear-filter") {
      return setWalletFilter("");
    }

    if (action === "toggle-shared") {
      /* Quitar la marca es lo único que puede confundir —el vale ya se
         mandó— así que eso sí se pregunta. Ponerla es compartirlo: se
         abre la hoja del sistema y la marca la pone el envío, no el
         interruptor, porque cancelar no comparte nada. */
      const id = unitId(el.dataset.key, Number(el.dataset.unit) || 0);
      if (!state.sharedVouchers.includes(id)) return shareFrom(el);
      state.sheet = { type: "unshare", key: el.dataset.key, unit: Number(el.dataset.unit) || 0 };
      return render();
    }

    if (action === "confirm-unshare") {
      const id = unitId(el.dataset.key, Number(el.dataset.unit) || 0);
      state.sharedVouchers = state.sharedVouchers.filter((k) => k !== id);
      state.sheet = null;
      return render();
    }

    if (action === "toggle-archived") {
      /* Encenderlo es archivar, y eso se pregunta: saca la tarjeta de su
         sección y conviene decir a dónde va. Apagarlo la devuelve sin
         preguntar, que es deshacer y no decidir. */
      const id = unitId(el.dataset.key, Number(el.dataset.unit) || 0);
      if (!state.archivedVouchers.includes(id)) {
        state.sheet = { type: "archive", key: el.dataset.key, unit: Number(el.dataset.unit) || 0 };
        return render();
      }
      state.archivedVouchers = state.archivedVouchers.filter((k) => k !== id);
      const scroll = root.querySelector(".oky-flow-scroll");
      const y = scroll ? scroll.scrollTop : 0;
      render();
      const fresh = root.querySelector(".oky-flow-scroll");
      if (fresh) fresh.scrollTop = y;
      return;
    }

    if (action === "ask-archive") {
      /* El aviso sale cada vez que se pulsa Archivar, sea el vale que
         sea: archivar saca la tarjeta de su sección y conviene decir a
         dónde va antes de hacerlo. */
      state.sheet = { type: "archive", key: el.dataset.key, unit: Number(el.dataset.unit) || 0 };
      return render();
    }

    if (action === "confirm-archive") {
      const id = unitId(el.dataset.key, Number(el.dataset.unit) || 0);
      state.sheet = null;
      return archiveVoucher(id);
    }

    if (action === "unarchive") {
      const id = unitId(el.dataset.key, Number(el.dataset.unit) || 0);
      state.archivedVouchers = state.archivedVouchers.filter((k) => k !== id);
      const scroll = root.querySelector(".oky-flow-scroll");
      const y = scroll ? scroll.scrollTop : 0;
      render();
      const fresh = root.querySelector(".oky-flow-scroll");
      if (fresh) fresh.scrollTop = y;
      return;
    }

    if (action === "close-sheet") {
      state.sheet = null;
      return render();
    }

    if (action === "wallet-more") {
      /* Se añade la siguiente tanda al final de la pila en vez de
         re-renderizar: así no se pierde el scroll ni parpadea lo que ya
         estaba dibujado. */
      const slot = el.dataset.section;
      const [section, group] = slot.split(":");
      const items = walletGroupDeck(state, section, group);
      const from = state.walletShown[slot] || WALLET_PAGE;
      const to = from + WALLET_PAGE;
      state.walletShown[slot] = to;

      const list = root.querySelector(`[data-stack="${slot}"]`);
      if (list)
        list.insertAdjacentHTML(
          "beforeend",
          items.slice(from, to).map((v) => walletVoucherButton(v, section, group)).join(""),
        );
      if (items.length <= to) el.parentElement.remove();
      return;
    }

    if (action === "wallet-tab") {
      /* El plateu es la navegación principal: cambia de tipo de vale,
         no salta dentro de una lista larga. El filtro se queda atrás
         porque las categorías son de la pestaña que se deja. */
      const key = el.dataset.section;
      if (key === state.walletTab) return;
      state.walletTab = key;
      state.walletFilter = "";
      state.openBeforeFilter = null;
      state.openGroups = key === "cash" ? [] : walletOpenGroups(state, key);
      render();
      const scroll = root.querySelector(".oky-flow-scroll");
      if (scroll) scroll.scrollTop = 0;
      return;
    }

    if (action === "toggle-section") {
      /* Solo una sección abierta a la vez: con dos abiertas hay que
         recorrer una lista entera para llegar a la siguiente cabecera,
         y las tres secciones son la navegación de la pestaña.
         Se pliega en sitio, sin re-renderizar: así la animación corre y
         no se pierde el scroll. */
      const key = el.dataset.section;
      const open = state.openGroups.includes(key);
      state.openGroups = open ? [] : [key];
      root.querySelectorAll('[data-action="toggle-section"]').forEach((head) => {
        const on = state.openGroups.includes(head.dataset.section);
        head.setAttribute("aria-expanded", String(on));
        const panel = head.nextElementSibling;
        if (panel) panel.classList.toggle("is-collapsed", !on);
      });
      return;
    }

    if (action === "copy-code") {
      /* El código no sirve de nada si hay que transcribirlo a mano. */
      const line = el.closest(".prime-card-bottom-line");
      const mark = () => {
        if (!line || line.classList.contains("is-copied")) return;
        line.classList.add("is-copied");
        /* El check suelto no existe en la cara que carga el archivo
           standalone y salía como caja; el circle-check sí, y además
           dice mejor "listo". */
        const glyph = el.querySelector("i");
        const had = glyph && glyph.className;
        if (glyph) glyph.className = "fa-solid fa-circle-check";
        el.style.color = "var(--success-main)";
        /* El verde del número va por estilo directo: la card hereda su
           morado de un contenedor y la hoja tiene varias reglas para
           este valor según la variante de la molécula. */
        const value = line.querySelector(".prime-card-bottom-line-value");
        if (value) value.style.color = "var(--success-main)";
        setTimeout(() => {
          line.classList.remove("is-copied");
          if (glyph && had) glyph.className = had;
          el.style.color = "";
          if (value) value.style.color = "";
        }, 1500);
      };

      const value = el.dataset.value || "";

      /* La API asíncrona falla en cuanto el documento no tiene el foco
         —pasa en WebViews y en pestañas embebidas—, así que hay un plan
         B con el textarea de toda la vida. */
      const legacy = () => {
        const pad = document.createElement("textarea");
        pad.value = value;
        pad.setAttribute("readonly", "");
        pad.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
        document.body.appendChild(pad);
        pad.select();
        pad.setSelectionRange(0, value.length);
        try {
          document.execCommand("copy");
        } catch (error) {
          /* Sin portapapeles no hay nada que confirmar. */
        }
        pad.remove();
        mark();
      };

      if (navigator.clipboard) navigator.clipboard.writeText(value).then(mark, legacy);
      else legacy();
      return;
    }

    if (action === "share") return shareFrom(el);

    /* Compartir: lo piden el interruptor de la card y cualquier botón
       de compartir. Hoja nativa: en iOS y Android abre la del sistema
       —WhatsApp, Mensajes, AirDrop— que es lo que la prueba necesita
       ver. */
    function shareFrom(el) {
      const label = el.dataset.label || "Gift Card";
      const amount = Number(el.dataset.amount) || 0;
      const payload = {
        title: `Gift Card de ${label}`,
        text: `Te comparto una Gift Card de ${label} por ${money(amount)} — OKY`,
        url: location.href,
      };

      /* Solo cuenta como compartido si la hoja llegó a abrirse o si el
         enlace acabó en el portapapeles. Cancelar no comparte nada. */
      const markShared = () => {
        if (!el.dataset.key) return;
        const id = unitId(el.dataset.key, Number(el.dataset.unit) || 0);
        if (state.sharedVouchers.includes(id)) return;
        state.sharedVouchers.push(id);
        const scroll = root.querySelector(".oky-flow-scroll");
        const y = scroll ? scroll.scrollTop : 0;
        render();
        const fresh = root.querySelector(".oky-flow-scroll");
        if (fresh) fresh.scrollTop = y;
      };

      /* El aviso se escribe dentro del botón, así que en el
         interruptor no cabe: ahí el propio interruptor encendiéndose
         ya dice que se compartió. */
      const say = (text, icon = "fa-circle-check") => {
        if (el.classList.contains("oky-flow-switch")) return;
        const before = el.innerHTML;
        el.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i>&nbsp;${text}`;
        setTimeout(() => {
          el.innerHTML = before;
        }, 1600);
      };

      /* Plan B cuando no hay hoja nativa: el enlace al portapapeles. */
      const copy = () => {
        const text = `${payload.text} ${payload.url}`;
        const legacy = () => {
          const pad = document.createElement("textarea");
          pad.value = text;
          pad.setAttribute("readonly", "");
          pad.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
          document.body.appendChild(pad);
          pad.select();
          pad.setSelectionRange(0, text.length);
          try {
            document.execCommand("copy");
            say("Copiado");
            pad.remove();
            markShared();
            return;
          } catch (error) {
            say("No se pudo compartir", "fa-circle-exclamation");
          }
          pad.remove();
        };
        if (navigator.clipboard)
          navigator.clipboard.writeText(text).then(() => {
            say("Copiado");
            markShared();
          }, legacy);
        else legacy();
      };

      if (navigator.share) {
        /* Dos fallos distintos: si la persona cierra la hoja no pasa
           nada —AbortError—, pero si el navegador la niega (dentro de un
           iframe sin permiso web-share, por ejemplo) hay que dar salida
           igual en vez de dejar el botón muerto, que es lo que se veía. */
        Promise.resolve()
          .then(() => navigator.share(payload))
          .then(markShared)
          .catch((error) => {
            if (error && error.name === "AbortError") return;
            copy();
          });
        return;
      }

      copy();
      return;
    }

    if (action === "voucher-prev" || action === "voucher-next") {
      const step = action === "voucher-next" ? 1 : -1;
      /* Mismo mazo que pinta la pantalla: la orden si se entró por id,
         el wallet entero si se entró por marca. */
      if (state.params.id) {
        const list = state.lastOrder;
        const at = list.findIndex((p) => p.id === state.params.id);
        const next = list[wrap((at < 0 ? 0 : at) + step, list.length)];
        return go("voucher", { id: next.id }, { push: false });
      }
      const section = state.params.deck || "gift";
      const unit = state.params.unit || 0;
      const list = voucherCarousel(state, section, state.params.key, unit);
      const at = list.findIndex((v) => v.key === state.params.key && v.unit === unit);
      const next = list[wrap((at < 0 ? 0 : at) + step, list.length)];
      /* Abrirlo por el carrusel también lo da por visto. */
      seeVoucher(next.key, next.unit);
      return go("voucher", { key: next.key, unit: next.unit, deck: section }, { push: false });
    }

    if (action === "select-card") {
      state.selectedCard = el.dataset.card;
      return render();
    }

    if (action === "confirm-methods") return goBack();

    if (action === "pay") {
      /* Un segundo toque mientras corre el procesamiento duplicaría
         la compra. */
      if (state.screen === "processing") return;
      go("processing", {}, { push: false });
      setTimeout(completePurchase, 1400);
      return;
    }

    if (action === "dismiss-celebration") {
      clearTimeout(celebrationTimer);
      return go(nextAfterStamp(), {}, { push: false });
    }
    if (action === "dismiss-cashwin") return go("purchases", {}, { push: false });
    if (action === "toggle-order") {
      const id = el.dataset.order;
      state.openOrders = state.openOrders.includes(id)
        ? state.openOrders.filter((o) => o !== id)
        : state.openOrders.concat(id);

      /* render() rehace el contenedor que scrollea, y con él el scroll
         se iba al principio: abrir una orden de agosto devolvía a la
         cabecera. Se guarda la posición y se restaura sobre el nodo
         nuevo, que es otro objeto. */
      const before = root.querySelector(".oky-flow-scroll");
      const y = before ? before.scrollTop : 0;
      render();
      const after = root.querySelector(".oky-flow-scroll");
      if (after) after.scrollTop = y;
      return;
    }

    if (action === "open-purchase") {
      /* Callarla vale para el vale que estabas mirando, no para el
         resto: en uno nuevo vuelve a ofrecerse. */
      state.claritaMuted = false;
      return go("voucher", { id: el.dataset.id });
    }
    if (action === "open-voucher") {
      const key = el.dataset.key;
      const unit = Number(el.dataset.unit) || 0;
      state.claritaMuted = false;
      seeVoucher(key, unit);
      return go("voucher", { key, unit, deck: el.dataset.deck || "gift" });
    }

    if (action === "decision-self") {
      state.decisionSeen = true;
      state.recipient = "Para mí";
      /* push:false deja el modal fuera del historial: "atrás" desde el
         checkout vuelve al PDP, no al modal. */
      return go("checkout", {}, { push: false });
    }
  });

  /* Mientras el dedo está sobre el slider se enciende la burbuja con el
     monto en vivo y la aureola del grip; al soltar, se apagan. */
  root.addEventListener("pointerdown", (event) => {
    const slider = event.target.closest(".slider-range");
    if (!slider) return;
    const atom = slider.closest(".slider-atom");
    if (atom) atom.classList.add("is-dragging");
  });

  ["pointerup", "pointercancel"].forEach((type) => {
    window.addEventListener(type, () => {
      root.querySelectorAll(".slider-atom.is-dragging").forEach((atom) => atom.classList.remove("is-dragging"));
    });
  });

  /* Monto del PDP: se parchean solo los nodos afectados para no
     perder el foco del input en cada tecla. */
  root.addEventListener("input", (event) => {
    /* El campo del código se repinta a mano: un render completo
       recrearía el input y se perdería el foco a la primera letra. */
    const promoInput = event.target.closest("[data-action='input-promo']");
    if (promoInput) {
      state.promoDraft = promoInput.value;
      state.promoError = false;
      const has = promoInput.value.trim().length > 0;
      promoInput.classList.toggle("input-dinamic-hasvalue", has);
      promoInput.classList.toggle("input-dinamic-empty", !has);
      const label = root.querySelector("#oky-promo-label");
      if (label) label.classList.toggle("is-floating", has);
      const error = root.querySelector(".oky-flow-promosheet-error");
      if (error) error.classList.add("is-hidden");
      const cta = root.querySelector("[data-action='apply-promo']");
      if (cta) cta.disabled = !has;
      return;
    }

    /* El slider de Tigo va por el listener de input, no por el de
       click: se arrastra. */
    const slider = event.target.closest("[data-action='tigo-amount']");
    if (slider) {
      const value = Number(slider.value) || TIGO_DEFAULT_AMOUNT;
      state.amounts.tigo = value;
      const atom = slider.closest(".slider-atom");
      if (atom) {
        const pct = ((value - PRODUCTS.tigo.min) / (PRODUCTS.tigo.max - PRODUCTS.tigo.min)) * 100;
        atom.style.setProperty("--slider-progress", `${pct}%`);
        atom.style.setProperty("--slider-frac", String(pct / 100));
        const bubble = atom.querySelector("[data-role='tigo-bubble']");
        if (bubble) bubble.textContent = `$ ${value}`;
      }
      const big = root.querySelector(".oky-flow-gua-pdp .middle-card-amount");
      if (big) big.textContent = String(value);
      const sub = root.querySelector("[data-role='tigo-subtotal']");
      if (sub) sub.textContent = money(value);

      /* Editando desde el carrito: en cuanto el monto deja de ser el
         guardado, "Ver carrito" pasa a "Actualizar". */
      const ctaRow = root.querySelector(".oky-flow-dock .summary-cta-row");
      const saved = state.cart.find((item) => item.productKey === "tigo");
      if (ctaRow && saved) {
        ctaRow.innerHTML =
          saved.amount === value
            ? `<button class="btn btn-primary summary-btn" data-action="open-cart" type="button">Ver carrito</button>`
            : `<button class="btn btn-primary summary-btn" data-action="add-to-cart" data-product="tigo"
                 type="button">Actualizar</button>`;
      }
      return;
    }

    const amountInput = event.target.closest("[data-action='input-amount']");
    if (amountInput) {
      const product = PRODUCTS[amountInput.dataset.product];

      /* Campo de moneda: solo dígitos y como mucho dos decimales.
         El valor se reescribe únicamente si el saneo cambió algo,
         para no mover el cursor mientras se teclea. */
      const clean = String(amountInput.value)
        .replace(/[^\d.]/g, "")
        .replace(/\.(?=.*\.)/g, "")
        .replace(/^(\d*\.\d{0,2}).*$/, "$1");
      if (clean !== amountInput.value) amountInput.value = clean;

      const amount = clamp(Number(clean) || 0, 0, product.max);
      state.amounts[product.key] = amount;

      const tier = getTier(amount, product, state.promoLive);
      const cashback = amount * tier.rate;

      const bigEl = root.querySelector(".middle-card-amount");
      if (bigEl) bigEl.textContent = product.quetzal ? bigQuetzal(amount) : bigAmount(amount);

      const ribbon = root.querySelector(".oky-flow-ribbon-slot .discount-ribbon-wrap");
      if (ribbon) {
        ribbon.classList.remove("is-tier-base", "is-tier-promo");
        ribbon.classList.add(tier.ribbon);
        ribbon.querySelector(".discount-ribbon-text").textContent = `Gana ${Math.round(tier.rate * 100)}%`;
      }

      const bar = root.querySelector(".saving-bar");
      if (bar) {
        const promoTier = tier.bar === "is-tier-promo";
        bar.classList.toggle("is-tier-promo", promoTier);
        bar.querySelector(".saving-bar-copy span").innerHTML =
          `Gana <strong>${money(cashback)}</strong> de <strong>OKY Cash</strong>`;
        /* El reloj solo vale para el 20%, que es el tier que se cae
           cuando se acaba el tiempo. Tecleando por encima del tramo la
           barra volvía al aqua pero el reloj se quedaba puesto: aquí no
           se vuelve a dibujar la pantalla, se parchea, y a nadie le
           tocaba quitarlo. */
        const chip = bar.querySelector(".saving-bar-timer");
        if (chip) chip.hidden = !promoTier;
      }

      const subtotal = root.querySelector("[data-role='pdp-subtotal']");
      if (subtotal) subtotal.textContent = money(product.quetzal ? toUsd(amount) : amount);

      /* El CTA se reescribe solo: si el vale ya está en el carrito y el
         monto cambió, pasa de "Ver carrito" a "Actualizar". Se toca
         nada más esa fila para no perder el foco del campo. */
      const ctaRow = root.querySelector(".summary-cta-row");
      const inCartNow = state.cart.find((item) => item.productKey === product.key);
      if (ctaRow && inCartNow) {
        /* En las marcas de Guatemala lo que se compara es lo tecleado,
           que son quetzales; el carrito guarda su equivalente en
           dólares. */
        const inCartValue = product.quetzal ? inCartNow.quetzales : inCartNow.amount;
        ctaRow.innerHTML =
          inCartValue === amount
            ? `<button class="btn btn-primary summary-btn" data-action="open-cart" type="button">Ver carrito</button>`
            : `<button class="btn btn-primary summary-btn" data-action="add-to-cart" data-product="${product.key}"
                 type="button" ${amount > 0 ? "" : "disabled"}>Actualizar</button>`;
      } else {
        const addBtn = root.querySelector("[data-action='add-to-cart']");
        if (addBtn) addBtn.disabled = amount <= 0;
      }
      return;
    }

  });

  /* Reloj de la promo. Cada segundo solo se reescribe el texto del
     ribbon —re-renderizar entero robaría el foco del campo de monto—
     y al llegar a cero se hace un render completo para que ribbons,
     saving bars y el carrito recalculen con el 5%. */
  let promoTick = Date.now();
  /* El último segundo en el que se sacudió, para no repetirlo si el
     intervalo cae dos veces dentro del mismo segundo. */
  let promoShakeAt = null;
  setInterval(() => {
    const now = Date.now();
    const elapsed = now - promoTick;
    promoTick = now;

    if (!state.promoLive) return;

    /* En pausa el vencimiento se corre hacia adelante lo mismo que
       avanzó el reloj, así que lo que queda no se mueve. */
    if (promoPaused(state)) {
      state.promoEndsAt += elapsed;
      return;
    }

    const left = state.promoEndsAt - now;
    if (left > 0) {
      /* El reloj ya no está solo en el home: el PDP lleva su versión
         mínima. Cada uno declara cómo quiere el texto. */
      /* Cada medio minuto el reloj se sacude: bajando en silencio no
         se hace notar, y la prueba quiere ver qué hace la persona con
         el tiempo encima. El aviso se salta el último tramo, que ya va
         a vencer de todas formas. */
      const secs = Math.ceil(left / 1000);
      const shake = secs > 0 && secs % 30 === 0 && secs !== promoShakeAt;
      if (shake) promoShakeAt = secs;

      root.querySelectorAll("[data-role='promo-countdown']").forEach((label) => {
        label.textContent =
          label.dataset.format === "short"
            ? countdownLabel(left)
            : `Termina en ${countdownLabel(left)}`;
        if (!shake) return;
        const ribbon = label.closest(".super-ribbon") || label;
        ribbon.classList.remove("is-shaking");
        /* Releer el layout reinicia la animación si ya estaba puesta. */
        void ribbon.offsetWidth;
        ribbon.classList.add("is-shaking");
        setTimeout(() => ribbon.classList.remove("is-shaking"), 720);
      });
      return;
    }

    state.promoLive = false;

    /* Nike y Lyft arrancan en $51 porque ese monto entra en la banda
       del 20%; sin promo esa banda ya no existe y el PDP tiene que
       abrir en los mismos $5 que el resto de marcas. Solo se cambia si
       el monto sigue siendo el de fábrica: si la persona escribió otro,
       es suyo y no se le toca. */
    PROMO_PRODUCTS.forEach((key) => {
      if (state.amounts[key] === PROMO_DEFAULT_AMOUNT) state.amounts[key] = BRAND_DEFAULT_AMOUNT;
    });

    /* Lo que ya está en el carrito también pierde el 20%: es
       justamente lo que la prueba quiere ver. */
    state.cart = state.cart.map((item) => ({
      ...item,
      cashback: item.amount * getTier(item.amount, PRODUCTS[item.productKey], false).rate,
    }));

    /* El aviso dura lo que tarda en leerse; después el strip se asienta
       en su ribbon normal. promoEnded es solo ese aviso y se apaga con
       él; que la promo ya se gastó lo recuerda promoSpent, que no se
       apaga nunca. */
    state.promoSpent = true;
    state.promoEnded = true;
    render();
    setTimeout(() => {
      state.promoEnded = false;
      /* Marca la pasada en la que el aqua entra desde el rojo; se apaga
         enseguida para que un render posterior no repita la animación. */
      state.promoSettling = true;
      render();
      setTimeout(() => {
        state.promoSettling = false;
      }, 600);
    }, 2400);
  }, 1000);

  /* Quien entra por el enlace directo de USA no pasa por la
     presentación, así que nadie pondría el reloj en marcha: se arranca
     al rato de montar. Entrando por el folder manda la presentación,
     que lo arranca al final. */
  if (state.screen === "home") {
    /* Abriendo directamente en USA, USA ya se enseñó: volver por el
       folder no vuelve a presentarla. */
    state.usaSeen = true;
    armPromoIdle();
  }

  render();
}
