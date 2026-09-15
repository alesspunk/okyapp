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
    hero: "promo-image8.png",
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
    hero: "promo-image1.png",
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
  macys: { label: "Macy's", art: "macys.webp", bg: "#ffffff", rate: 12 },
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
    art: "oky-saldo-card-art.png",
    style: { backgroundMode: "solid", backgroundColor: "#000000", borderColor: "#000000" },
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
      backgroundColor: "url(oky-card-design-bubbles.png) center/cover no-repeat",
      showBorder: false,
      pattern: null,
    },
  },
  {
    key: "teal",
    label: "Turquesa",
    note: "El verde agua del cashback, para que se note lo que ganas.",
    art: "oky-card-art-scatter.png",
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
    note: "El morado de siempre, el de la marca que ya conoces.",
    art: "oky-card-art-wave.png",
    style: { backgroundMode: "solid", backgroundColor: "#410d86", borderColor: "#410d86" },
  },
];

const findCardDesign = (key) => CARD_DESIGNS.find((d) => d.key === key) || CARD_DESIGNS[0];

/* Monto con el que abre el PDP de una marca nueva. */
const BRAND_DEFAULT_AMOUNT = 5;

/* Las dos marcas que arrancan dentro de la banda del descuento
   especial, y el monto con el que abren mientras la promo vive. */
const PROMO_PRODUCTS = ["nike", "lyft"];
const PROMO_DEFAULT_AMOUNT = 51;

/* La promo de "Spooky Deals" dura dos minutos: mientras corre, el rango
   de $50 a $200 paga 20%; al vencer, todo vuelve al 5% base. Es a
   propósito corta — la prueba de usabilidad quiere ver qué hace la
   persona con el reloj encima. */
const PROMO_MS = 2 * 60 * 1000;

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
const STYLE_CARDS = [
  { key: "adidas", photo: "promo-image3.png" },
  { key: "gap", photo: "promo-image6.png" },
  { key: "oldnavy", photo: "promo-image7.png" },
];

const TODAY_CARDS = [
  { key: "macys", photo: "promo-image2.png" },
  { key: "starbucks", photo: "promo-image4.png" },
];

/* Tier del cashback. Verificado contra los dos frames de Nike:
   $200 → "Ganas 20%" naranja · $201 → "Ganas 5%" aqua.

   Solo Nike y Lyft se mueven con el monto; el resto de las marcas
   trae su propio porcentaje fijo y el tier se arma con él. */
function getTier(amount, product, promoLive = true) {
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
  vales: [
    { key: "pollocampero", label: "Pollo Campero", art: "pollo-campero.webp", bg: "#ed761c", count: 1 },
    { key: "tigo", label: "Tigo", art: "tigo.webp", bg: "#00377b", count: 1 },
  ],
  servicios: [{ key: "eegsa", label: "EEGSA", art: "eggsa.webp", bg: "#ffffff", count: 1 }],
};

const WALLET_VOUCHERS = [
  { key: "krispy", label: "Krispy Kreme", art: "oky-card-krispy.png", bg: "#ffffff", live: false },
  { key: "underarmour", label: "Under Armour", art: "oky-card-underarmour.png", bg: "#ed1b24", live: false },
  { key: "lyft", label: "Lyft", art: "oky-card-lyft.png", bg: "#1d0c17", live: true },
  { key: "nike", label: "Nike", art: "oky-card-nike.png", bg: "#ef4c26", live: true },
];

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

function createInitialState(userType) {
  const returning = userType === "returning";

  return {
    userType,
    okyCashBalance: returning ? 56 : 5,
    screen: "home",
    params: {},
    history: [],
    /* Arranca en 51, dentro del rango de descuento especial (20%);
       al vencer la promo vuelve a los 5 del resto de marcas. */
    amounts: { nike: PROMO_DEFAULT_AMOUNT, lyft: PROMO_DEFAULT_AMOUNT },
    cart: [],
    cartOpen: false,
    checkoutIndex: 0,
    okyCashEnabled: false,
    okyCashApplied: 0,
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
      { date: stamp(33), group: monthGroup(33), amount: "- $8.00", order: "Orden #01112439", kind: "debit", label: "Pagado con OKY Cash", value: -8 },
      { date: stamp(41), group: monthGroup(41), amount: "+ $2.24", order: "Orden #01112438", kind: "credit", label: "Google Play", value: 2.24 },
      /* Julio */
      { date: stamp(48), group: monthGroup(48), amount: "+ $1.35", order: "Orden #01112434", kind: "credit", label: "Burger King", value: 1.35 },
      { date: stamp(48), group: monthGroup(48), amount: "+ $0.90", order: "Orden #01112434", kind: "credit", label: "McDonald's", value: 0.9 },
      { date: stamp(52), group: monthGroup(52), amount: "+ $1.85", order: "Orden #01112430", kind: "credit", label: "eBay", value: 1.85 },
      { date: stamp(60), group: monthGroup(60), amount: "- $12.00", order: "Orden #01112427", kind: "debit", label: "Pagado con OKY Cash", value: -12 },
    ],
    decisionSeen: false,
    /* El folder del Discovery Header se colapsa al scrollear el home. */
    headerCollapsed: false,
    /* Secciones abiertas de Mi wallet. */
    openSections: ["cash", "gift"],
    /* Cuántas cards se han pedido ya en cada sección del wallet. */
    walletShown: { gift: WALLET_PAGE, vales: WALLET_PAGE, servicios: WALLET_PAGE },

    /* Correlativo de órdenes para el historial de OKY Cash. */
    orderSeq: 0,
    /* Marcas cuyo vale ya se abrió: las demás llevan el punto rojo. */
    seenVouchers: [],
    /* Cashback recién ganado que aún no se ha mirado: hace saltar la
       moneda de la navbar. */
    cashUnseen: false,
    /* Órdenes con el desglose abierto en la actividad. */
    openOrders: [],
    /* Diseño de la tarjeta de OKY Cash y el que se está hojeando. */
    cardDesign: "black",
    cardDesignIndex: 0,
    /* Fin de la promo; se fija al montar el prototipo. */
    promoEndsAt: Date.now() + PROMO_MS,
    promoLive: true,
    /* Ventana corta tras el vencimiento, para el aviso del strip. */
    promoEnded: false,
    recipient: "",
  };
}

const cartTotal = (state) => state.cart.reduce((sum, item) => sum + item.amount, 0);
const cartCashback = (state) => state.cart.reduce((sum, item) => sum + item.cashback, 0);

/* Saldo que se va a aplicar a esta orden. */
function appliedOkyCash(state) {
  if (!state.okyCashEnabled) return 0;
  return clamp(state.okyCashApplied, 0, Math.min(state.okyCashBalance, cartTotal(state)));
}

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
function productHeader(state, { backAction = "back" } = {}) {
  const count = state.cart.length;
  return `
    <header class="oky-flow-header">
      ${backButton(backAction)}
      <span class="oky-flow-title" aria-hidden="true"></span>
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
          : `<i class="fa-${key === active ? "solid" : "light"} fa-${icon}" style="font-size:20px" aria-hidden="true"></i>`
      }
      <span class="nav-label">${label}</span>
    </div>
  `;

  return `
    <nav class="oky-flow-navbar">
      <div class="bottom-nav">
        ${item("home", "Home", "house", "nav:home")}
        ${item("notif", "Notificaciones", "bell", null)}
        ${item("okycash", "OKY Cash", null, "nav:okycash")}
        ${item("ayuda", "Ayuda", "messages", null)}
        ${item("menu", "Menú", "bars", null)}
      </div>
    </nav>
  `;
}

function savingBar(cashback, tier, copy) {
  return `
    <div class="oky-flow-savingbar">
      <div class="saving-bar is-oky-cash ${tier.bar}">
        <div class="saving-bar-copy"><span>${copy(money(cashback))}</span></div>
      </div>
    </div>
  `;
}

/* ── Home (99105:31149) ─────────────────────────────────── */
/* El Discovery Header del home, en el estado que toque: State 1 con el
   folder desplegado y State 2 con el folder colapsado, que es el que
   el organismo trae para cuando la página ya está scrolleada. */
function homeHeader(state, headerState) {
  return renderDiscoveryHeader({
    side: "Left",
    state: headerState,
    walletAction: "nav:wallet",
    cartAction: "open-cart",
    cartIndicated: state.cart.length > 0,
    /* Mismo indicador que el carrito: hay vales comprados sin abrir. */
    walletIndicated: hasNewVouchers(state),
    /* El State 3 del organismo trae el carrusel de categorías; aquí no
       se usa, y el punto de colapsar es justamente ganar alto. */
    showPlateu: false,
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
      <div class="super-ribbon super-ribbon-type-normal is-settling">
        <span class="super-ribbon-icon"><i class="fa-solid fa-percent" aria-hidden="true"></i></span>
        <span class="super-ribbon-text">Super Deals</span>
      </div>
    `;
  }
  return `
    <div class="super-ribbon super-ribbon-type-por-tiempo">
      <span class="super-ribbon-icon"><i class="fa-solid fa-clock" aria-hidden="true"></i></span>
      <span class="super-ribbon-text" data-role="promo-countdown">Termina en ${countdownLabel(state.promoEndsAt - Date.now())}</span>
    </div>
  `;
}

function screenHome(state) {
  /* Una oferta del strip táctico: foto, logo de marca colgado a la
     izquierda y el ribbon con el cashback (MARS 7295:52037). */
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
            <div class="discount-ribbon discount-ribbon-wrap ${rate >= 20 ? "is-tier-promo" : "is-tier-base"}">
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

  /* Nike y Lyft anuncian el tier de la promo; cuando vence, el 5% base. */
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
          <div class="carousel-banner"><img src="oky-banner-spooky-1.png" alt="Spooky Deals · 20% 30% 40% OFF" /></div>
          <div class="carousel-banner"><img src="oky-banner-spooky-2.png" alt="Spooky Deals · hasta 40% OFF en experiencias" /></div>
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
            ${TODAY_CARDS.map((card) =>
              offer({ ...card, rate: BRANDS[card.key].rate, action: "open-pdp" }),
            ).join("")}
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

      <section class="tactic-strip oky-flow-style-strip">
        <header class="tactic-strip-header">
          <h3 class="token-h6 tactic-strip-title">
            <i class="fa-solid fa-tag" aria-hidden="true"></i>&nbsp;Moda
          </h3>
          <span class="btn btn-outlined btn-small">Ver más</span>
        </header>

        <div class="tactic-strip-carousel-window">
          <div class="tactic-strip-carousel-track">
            ${STYLE_CARDS.map((card) =>
              offer({ ...card, rate: BRANDS[card.key].rate, action: "open-pdp" }),
            ).join("")}
          </div>
        </div>
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
    ${productHeader(state, { backAction: "nav:home" })}

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
          ? `<div><p class="oky-flow-legal"><strong>Disponibilidad limitada</strong> Las gift cards con descuento especial estarán disponibles por tiempo limitado o hasta que se agote el inventario.</p></div>`
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

    ${savingBar(cashback, tier, (v) => `Gana <strong>${v}</strong> de <strong>OKY Cash</strong>`)}
    ${navbar("", state)}
  `;
}

/* ── Carrito: drawer desde la derecha (99105:38191) ─────── */
function cartDrawer(state) {
  const total = cartTotal(state);
  const cashback = cartCashback(state);

  /* Cada fila replica el list-item de Figma (275x140): arriba el
     brand item y el botón de borrar, abajo título, precio y ribbon. */
  const rows = state.cart.length
    ? state.cart
        .map((item) => {
          const product = PRODUCTS[item.productKey];
          const tier = getTier(item.amount, product, state.promoLive);
          return `
            <div class="oky-flow-cart-row">
              <div class="oky-flow-cart-head">
                <span class="brand-item-atom is-no-label">
                  <span class="brand-item-frame">
                    <span class="brand-item-base"><img src="${product.art}" alt="${product.label}" /></span>
                  </span>
                </span>
                <span class="discount-ribbon discount-ribbon-list ${tier.ribbon}">
                  <span class="discount-ribbon-text token-price-percent">Gana ${Math.round(tier.rate * 100)}%</span>
                </span>
                <span class="oky-flow-cart-actions">
                  <button class="oky-flow-cart-edit" data-action="edit-item" data-product="${item.productKey}"
                    type="button" aria-label="Cambiar el monto de ${product.label}">
                    <i class="fa-solid fa-pencil" aria-hidden="true"></i>
                  </button>
                  <button class="oky-flow-cart-trash" data-action="remove-item" data-product="${item.productKey}"
                    type="button" aria-label="Quitar ${product.label}">
                    <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                  </button>
                </span>
              </div>
              <div class="oky-flow-cart-body">
                <p class="oky-flow-cart-title">${product.cardTitle}</p>
                <p class="oky-flow-cart-price">${money(item.amount)}</p>
              </div>
            </div>
          `;
        })
        .join("")
    : "";

  return `
    <button class="oky-flow-drawer-backdrop" data-action="close-cart" type="button" aria-label="Cerrar carrito"></button>
    <aside class="oky-flow-drawer" aria-label="Carrito">
      <div class="oky-flow-drawer-head">
        <button class="oky-flow-header-icon" data-action="close-cart" type="button" aria-label="Ir atrás">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
        </button>
        <h2 class="oky-flow-drawer-title">Ir atrás</h2>
      </div>

      <div class="oky-flow-drawer-body">
        ${
          state.cart.length
            ? `<div class="oky-flow-cart-card">${rows}</div>`
            : `<div class="oky-flow-cart-empty">
                <img class="oky-flow-cart-empty-art" src="Cart-3d-icon.png" alt="" />
                <h3 class="oky-flow-cart-empty-title">Tu carrito está vacío</h3>
                <p class="oky-flow-cart-empty-note">
                  Agrega una gift card y empieza a ganar OKY Cash en cada compra.
                </p>
                <button class="btn btn-primary btn-large" data-action="nav:home" type="button">
                  Explorar marcas
                </button>
              </div>`
        }
      </div>

      <div class="oky-flow-drawer-foot${state.cart.length ? "" : " is-hidden"}">
        <div class="summary-box summary-box-compact">
          <div class="summary-card">
            <div class="summary-card-body">
              <div class="summary-row summary-row-total">
                <span class="summary-label-strong">TOTAL</span>
                <span class="summary-label-strong">${money(total)}</span>
              </div>
            </div>
            <div class="summary-cta-row double">
              <button class="btn btn-outlined btn-large" data-action="nav:home" type="button">Seguir comprando</button>
              <button class="btn btn-primary btn-large" data-action="go:decision" type="button"
                ${state.cart.length ? "" : "disabled"}>Ir a pagar</button>
            </div>
          </div>
        </div>
      </div>
    </aside>

    ${
      state.cart.length
        ? `<div class="oky-flow-savingbar is-drawer-bar">
            <div class="saving-bar is-oky-cash">
              <div class="saving-bar-copy">
                <span>Compra y gana <strong>${money(cashback)}+</strong> en <strong>OKY Cash</strong></span>
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
  /* Cada vale lleva su propio porcentaje en el wrap ribbon, igual que
     en el PDP: con el reloj en pausa aquí dentro, el 20% de Nike no se
     convierte en 5% mientras se ajusta el pago. */
  const giftCard = (item) => {
    const itemTier = getTier(item.amount, PRODUCTS[item.productKey], state.promoLive);
    return `
    <section class="middle-card-shell is-checkout">
      <article class="middle-card-molecule is-egift">
        <div class="middle-card-content">
          <div class="middle-card-main">
            <p class="middle-card-title">Gift Card</p>
            <div class="middle-card-center">
              <div class="middle-card-value">
                <span class="middle-card-currency">$</span>
                <p class="middle-card-amount">${bigAmount(item.amount)}</p>
              </div>
            </div>
          </div>
          <div class="middle-card-footer">
            <span class="middle-card-footer-start">Que debo saber</span>
            <span class="middle-card-footer-end" aria-hidden="true"></span>
          </div>
        </div>
        <div class="middle-card-ribbon-slot">
          <div class="discount-ribbon discount-ribbon-wrap ${itemTier.ribbon}">
            <span class="discount-ribbon-text token-price-percent">Gana ${Math.round(itemTier.rate * 100)}%</span>
          </div>
        </div>
      </article>
    </section>
  `;
  };

  const first = PRODUCTS[state.cart[active].productKey];
  const applied = state.okyCashEnabled
    ? Math.min(state.okyCashApplied || state.okyCashBalance, total, state.okyCashBalance)
    : 0;
  const toCard = Math.max(total - applied, 0);
  const checkoutCard = CARDS.find((c) => c.key === state.selectedCard) || CARDS[0];

  return `
    <div class="oky-flow-page">
    ${statusBar()}
    ${productHeader(state)}

    <div class="oky-flow-section">
      <section class="brand-item-atom is-with-label oky-flow-brand-slot">
        <p class="brand-item-label token-product-text">${first.label}</p>
        <div class="brand-item-frame">
          <div class="brand-item-base"><img src="${first.art}" alt="${first.label}" /></div>
        </div>
      </section>

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
            <p class="dual-title">${state.recipient || "Para mí"}</p>
            <p class="dual-subtitle">+1 407 284-8092</p>
          </div>
          <span class="dual-action" aria-hidden="true"><i class="fa-solid fa-ellipsis-vertical"></i></span>
        </div>
      </article>

      <div class="payment-method-input oky-flow-paygroup" style="width:100%">
        <span class="payment-method-label">Método de pago</span>
        <div class="oky-flow-payrow is-first" data-action="open-methods" role="button" tabindex="0">
          <i class="fa-brands ${checkoutCard.mark} oky-flow-method-mark is-${checkoutCard.key}" aria-hidden="true"></i>
          <p class="oky-flow-payrow-copy">${checkoutCard.label}</p>
          <span class="oky-flow-chip-cell"><span class="oky-flow-chip is-card">${money(toCard)}</span></span>
          <span class="oky-flow-payrow-more" aria-hidden="true">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </span>
        </div>
        <div class="oky-flow-payrow is-last">
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
      </div>

      <div class="summary-box summary-box-compact oky-flow-push" style="width:100%">
        <div class="summary-card">
          <div class="summary-card-body">
            ${
              /* Sin OKY Cash aplicado, Subtotal y TOTAL son el mismo
                 número: se muestra solo TOTAL (Figma 99105:31768). */
              applied > 0
                ? `<div class="summary-row">
                     <span class="summary-label-strong">Subtotal
                       <button class="oky-flow-info" data-action="open-cart" type="button"
                         aria-label="Ver el carrito">
                         <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
                       </button>
                     </span>
                     <span class="summary-label-strong">${money(total)}</span>
                   </div>
                   <div class="summary-row">
                     <span class="summary-value-success">OKY Cash</span>
                     <span class="summary-value-success">-${money(applied)}</span>
                   </div>`
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

    ${savingBar(earned, { bar: "" }, (v) => {
      if (used <= 0) return `Compra y gana <strong>${v}+</strong> en <strong>OKY Cash</strong>`;
      if (earned <= 0) return `No acumulas <strong>OKY Cash</strong> en esta compra`;
      return `Ganas <strong>${v}</strong> por lo que pagas con tarjeta`;
    })}
    ${navbar("", state)}
  `;
}

/* ── Métodos de pago (99105:41588) ──────────────────────── */
function screenMethods(state) {
  const total = cartTotal(state);
  const max = Math.min(state.okyCashBalance, total);
  const applied = clamp(state.okyCashApplied, 0, max);
  const toCard = Math.max(total - applied, 0);
  const keep = Math.max(state.okyCashBalance - applied, 0);

  const selected = CARDS.find((c) => c.key === state.selectedCard) || CARDS[0];
  const others = CARDS.filter((c) => c.key !== selected.key);

  const top = { ...findPaymentCard(selected.variant) };
  const cash = okyCashCard(state, { balance: keep });

  return `
    ${statusBar()}
    ${titledHeader("Métodos de pago")}

    <div class="oky-flow-section" style="gap:8px">
      <button class="oky-flow-addcard" type="button">
        <i class="fa-solid fa-plus" aria-hidden="true"></i>Agregar tarjeta crédito/débito
      </button>

      <div class="payment-card-stack" style="--payment-card-stack-offset:-144px">
        ${renderPaymentCard(top)}
        ${renderPaymentCard(cash)}
      </div>

      <div class="oky-flow-method-group" style="width:100%;padding-top:8px">
        <div class="oky-flow-method-row is-selected">
          <span class="oky-flow-radio" aria-hidden="true"><i class="fa-solid fa-circle-dot"></i></span>
          <i class="fa-brands ${selected.mark} oky-flow-method-mark is-${selected.key}" aria-hidden="true"></i>
          <p class="oky-flow-method-name">${selected.label}</p>
          <span class="oky-flow-chip is-card">${money(toCard)}</span>
        </div>

        <div class="oky-flow-method-row is-cash">
          <div class="oky-flow-method-head">
            <button class="oky-flow-check${state.okyCashEnabled ? " is-checked" : ""}"
              data-action="toggle-okycash" type="button"
              aria-pressed="${state.okyCashEnabled}" aria-label="Usar OKY Cash">
              <i class="fa-solid fa-check" aria-hidden="true"></i>
            </button>
            <img class="oky-flow-coin" src="oky-cash-coin.png" alt="" style="width:24px;height:26px" />
            <p class="oky-flow-method-label">OKY Cash</p>
            <span class="oky-flow-chip is-cash">${money(applied)}</span>
          </div>
        </div>
      </div>

      ${others
        .map(
          (card) => `
        <div class="oky-flow-method-row" style="width:100%;margin-top:8px"
          data-action="select-card" data-card="${card.key}" role="button" tabindex="0">
          <span class="oky-flow-radio" aria-hidden="true"><i class="fa-regular fa-circle"></i></span>
          <i class="fa-brands ${card.mark} oky-flow-method-mark is-${card.key}" aria-hidden="true"></i>
          <p class="oky-flow-method-name is-regular">${card.label}</p>
        </div>
      `,
        )
        .join("")}
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

    <section class="oky-flow-sheet">
      <h2 class="oky-flow-sheet-title">No cerrar app</h2>
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
      <div class="oky-flow-sheet-footer">
        <img class="oky-flow-spinner" src="oky-spinner.svg" alt="" />
        <span>Redireccionando…</span>
      </div>
    </section>
    ${navbar("", state)}
  `;
}

/* ── Tus compras (99140:56031) + Success (99140:56018) ─── */
function screenPurchases(state, { celebrate = false, cashWin = false } = {}) {
  /* Esta pantalla es el acuse de la compra que se acaba de hacer, no
     un histórico: sale de state.lastOrder. Lo que acumula todas las
     gift cards es Mi wallet, que lee state.purchases. */
  const byBrand = [];
  state.lastOrder
    .slice()
    .reverse()
    .forEach((p) => {
      const found = byBrand.find((b) => b.key === p.productKey);
      if (found) found.count += 1;
      else byBrand.push({ key: p.productKey, id: p.id, count: 1, ...PRODUCTS[p.productKey] });
    });

  const list = byBrand;

  return `
    ${statusBar()}
    ${titledHeader("Tus compras", { trailing: "fa-receipt" })}

    <div class="oky-flow-section">
      ${
        list.length
          ? `<div class="oky-flow-stack">
              ${list
                .map(
                  (v) => `
                <button class="oky-flow-voucher" style="background:${v.bg};border-color:${v.bg}"
                  data-action="open-purchase" data-id="${v.id}" type="button">
                  <img src="${v.art}" alt="${v.label}" />
                  <span class="oky-flow-voucher-badge">${v.count}<i class="fa-solid fa-circle-check" aria-hidden="true"></i></span>
                </button>
              `,
                )
                .join("")}
            </div>`
          : `<p class="oky-flow-empty">Todavía no tienes compras.</p>`
      }
    </div>

    <div class="oky-flow-cta-bar has-cash-strip">
      <button class="btn btn-outlined btn-large oky-flow-wallet-btn" data-action="nav:wallet" type="button">
        <img src="Wallet-icon.png" alt="" />Mi Wallet
      </button>
      ${cashStrip(state)}
    </div>
    ${navbar("", state)}

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

/* La tarjeta de OKY Cash, con el saldo al día y el diseño elegido.
   Las tres pantallas que la pintan pasan por aquí. */
/* cta: acción del botón. null lo quita; false lo deja sin enlace, solo
   como rótulo. label pisa el texto por defecto. */
function okyCashCard(state, { balance, cta, label } = {}) {
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
  /* El lápiz abre el selector de diseño. */
  card.editAction = "nav:carddesign";
  const design = findCardDesign(state.cardDesign);
  return { ...card, ...design.style, art: design.art };
}

/* Cuántas cards se apilan de una vez en cada sección del wallet. Más
   allá de eso la pila deja de leerse y hay que dibujar de más, así que
   el resto entra por tandas con "Ver más". */
const WALLET_PAGE = 5;

function walletVoucherButton(v, deck) {
  return `
    <button class="oky-flow-voucher" style="background:${v.bg};border-color:${v.bg}"
      data-action="open-voucher" data-key="${v.key}" data-deck="${deck}" type="button" aria-label="${v.label}">
      <img src="${v.art}" alt="${v.label}" />
      ${v.isNew ? `<span class="oky-flow-voucher-dot" aria-label="Nuevo"></span>` : ""}
      <span class="oky-flow-voucher-badge">${v.count}<i class="fa-solid fa-circle-check" aria-hidden="true"></i></span>
    </button>
  `;
}

/* ¿Queda alguna gift card comprada que todavía no se haya abierto? */
function hasNewVouchers(state) {
  return state.purchases.some((p) => !state.seenVouchers.includes(p.productKey));
}

/* Los vales del wallet: primero lo que la persona compró de verdad,
   agrupado por marca y con su cantidad, y detrás las marcas de muestra
   que todavía no ha comprado. Aquí sí se acumula — este es el
   repositorio de gift cards. */
function walletVouchers(state) {
  const owned = [];
  state.purchases
    .slice()
    .reverse()
    .forEach((purchase) => {
      const found = owned.find((v) => v.key === purchase.productKey);
      if (found) {
        found.count += 1;
        return;
      }
      const product = PRODUCTS[purchase.productKey];
      owned.push({
        key: product.key,
        label: product.label,
        art: product.art,
        bg: product.bg,
        count: 1,
        live: true,
        /* Recién comprado y todavía sin abrir. */
        isNew: !state.seenVouchers.includes(product.key),
      });
    });

  const demo = WALLET_VOUCHERS.filter((v) => !owned.some((o) => o.key === v.key)).map((v) => ({
    ...v,
    count: 1,
  }));

  return [...owned, ...demo];
}

/* ── Mi wallet (99105:43773) ────────────────────────────── */
function screenWallet(state) {
  const cash = okyCashCard(state);
  const vouchers = walletVouchers(state);
  const news = vouchers.filter((v) => v.isNew).length;

  /* La barra es un navegador, no un adorno: cada icono lleva a su
     sección. Va en scroll horizontal para que quepan más categorías sin
     apretujar las que ya hay. */
  const filters = [
    { key: "cash", label: "OKY Cash", icon: "oky-cash-coin.png" },
    { key: "gift", label: "Gift cards", icon: "plateu-giftcards.png" },
    { key: "vales", label: "OKY Vales", icon: "plateu-vales.png" },
    { key: "servicios", label: "Servicios", icon: "plateu-servicios.png" },
  ];

  /* Cabecera de sección: además de plegar, dice de un vistazo lo que
     hay dentro —el saldo, cuántas gift cards— para que valga la pena
     cuando está cerrada. */
  const sectionHead = (key, icon, label, meta) => {
    const open = state.openSections.includes(key);
    return `
      <button class="oky-flow-section-head" data-action="toggle-section" data-section="${key}"
        type="button" aria-expanded="${open}">
        <span class="oky-flow-section-head-label">
          <i class="fa-solid ${icon}" aria-hidden="true"></i>${label}
        </span>
        <span class="oky-flow-section-head-meta">
          ${meta ? `<span class="oky-flow-section-head-value">${meta}</span>` : ""}
          <i class="fa-solid fa-chevron-down oky-flow-section-caret" aria-hidden="true"></i>
        </span>
      </button>
    `;
  };

  const body = (key, content) => `
    <div class="oky-flow-section-body ${state.openSections.includes(key) ? "" : "is-collapsed"}">
      <div>${content}</div>
    </div>
  `;

  /* De la pila solo se dibujan las primeras; el resto llega por tandas
     del mismo tamaño cuando se pide. */
  const stack = (items, deck, empty) => {
    if (!items.length) return `<p class="oky-flow-empty">${empty}</p>`;
    const shown = state.walletShown[deck] || WALLET_PAGE;
    const visible = items.slice(0, shown);
    return `
      <div class="oky-flow-stack" data-stack="${deck}">
        ${visible.map((v) => walletVoucherButton(v, deck)).join("")}
      </div>
      ${
        items.length > visible.length
          ? `<div class="oky-flow-stack-more">
              <button class="btn btn-primary btn-small" data-action="wallet-more" data-section="${deck}" type="button">
                Ver más
              </button>
            </div>`
          : ""
      }
    `;
  };

  return `
    ${statusBar()}
    ${titledHeader("Mi wallet")}

    <section class="plateu-molecule is-static is-default oky-flow-wallet-nav" aria-label="Categorías">
      <div class="plateu-track is-static">
        ${filters
          .map(
            (f, i) => `
          <button class="plateu-item" type="button" data-action="wallet-jump" data-section="${f.key}"
            aria-label="Ir a ${f.label}">
            <div class="plateu-icon-wrap"><img class="plateu-icon" src="${f.icon}" alt="" /></div>
            ${i === 0 ? `<span class="plateu-chip is-outlined">${f.label}</span>` : `<span class="plateu-label">${f.label}</span>`}
          </button>
        `,
          )
          .join("")}
      </div>
    </section>

    <div class="oky-flow-section" style="gap:12px">
      ${sectionHead("cash", "fa-wallet", "OKY Cash", money(state.okyCashBalance))}
      ${body("cash", `<div class="oky-flow-card-slot">${renderPaymentCard(cash)}</div>`)}

      ${sectionHead(
        "gift",
        "fa-gift",
        "Gift Cards",
        `${vouchers.length}${news ? ` · ${news} nueva${news > 1 ? "s" : ""}` : ""}`,
      )}
      ${body("gift", stack(vouchers, "gift", "Todavía no tienes gift cards."))}

      ${sectionHead("vales", "fa-ticket", "OKY Vales", String(WALLET_EXTRAS.vales.length))}
      ${body("vales", stack(WALLET_EXTRAS.vales, "vales", "Todavía no tienes vales."))}

      ${sectionHead("servicios", "fa-file-invoice-dollar", "Servicios", String(WALLET_EXTRAS.servicios.length))}
      ${body("servicios", stack(WALLET_EXTRAS.servicios, "servicios", "Todavía no tienes servicios."))}
    </div>

    ${navbar("", state)}
  `;
}

/* ── OKY Cash: destino del coin de la navbar (99135:103474) ─ */
function screenOkyCash(state) {
  /* Aquí ya estás en la actividad, así que el CTA no lleva a ninguna
     parte: se queda como rótulo, invitando a conocer el programa. */
  const cash = okyCashCard(state, { cta: false, label: "Gana OKY Cash" });

  /* Los movimientos se agrupan por mes conservando el orden. */
  const groups = [];
  state.activity.forEach((entry) => {
    const label = entry.group || monthGroup(0);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(entry);
    else groups.push({ label, items: [entry] });
  });

  const chipFor = (positive) =>
    positive
      ? { label: "Ganado", tone: "success", icon: "fa-circle-check" }
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

    const debitCard = debits.length
      ? historyRow({
          date: order.date,
          amount: `- ${money(Math.abs(spent))}`,
          order: order.id,
          positive: false,
        })
      : "";

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
    ${statusBar()}
    ${titledHeader("OKY Cash")}

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

    ${navbar("okycash", state)}
  `;
}

/* ── Detalle de vale ──────────────────────────────────────
   Misma pantalla desde "Tus compras" (por id de compra) y desde
   Mi wallet (por marca): en ambos casos el organismo Card. */
function screenVoucher(state) {
  const purchase = state.params.id
    ? state.purchases.find((p) => p.id === state.params.id)
    : state.purchases.filter((p) => p.productKey === state.params.key).slice(-1)[0];

  /* Dos mazos según de dónde se entre: con id, los vales de la orden
     recién pagada; con key, todas las gift cards del wallet. Los dos
     dan la vuelta, así que de la última se pasa a la primera.
     El mazo del wallet lleva sus propios datos de marca: hay tarjetas
     ahí —Krispy Kreme, Under Armour— que no son productos comprables
     y no están en PRODUCTS. */
  const section = state.params.deck || "gift";
  const wallet = section === "gift" ? walletVouchers(state) : WALLET_EXTRAS[section] || [];
  /* Un vale de Pollo Campero no es una gift card: la card lo dice. */
  const kind = { vales: "OKY Vale", servicios: "Servicio" }[section] || "Gift Card";
  const deck = state.params.id
    ? state.lastOrder.map((p) => ({ id: p.id, key: p.productKey }))
    : wallet;
  const at = deck.findIndex((v) => (state.params.id ? v.id === state.params.id : v.key === state.params.key));
  const many = deck.length > 1;

  const card = PRODUCTS[purchase ? purchase.productKey : state.params.key] ||
    wallet.find((v) => v.key === state.params.key) || { key: state.params.key, label: "", art: "" };
  const amount = purchase ? purchase.amount : state.amounts[card.key] || BRAND_DEFAULT_AMOUNT;

  /* Desde "Tus compras" la pantalla es el detalle de la orden; desde
     Mi wallet, el vale de la marca. */
  const title = state.params.id ? "Detalle de la orden" : card.label;

  return `
    ${statusBar()}
    ${titledHeader(title)}
    <div class="oky-flow-section is-voucher">
      <div class="oky-flow-card-carousel">
      ${renderCardOrganism({
        topVariantPath: "Molecule/Top Card/Gift Card",
        topBrandLabel: card.label,
        topHeroImage: card.art,
        topHeroAlt: card.label,
        topFooterLeftLabel: "Terms & Conditions",
        topFooterRightLabel: "Brand Disclaimer",
        middleCardPath: "Molecule/Middle Card/Amount",
        middleTitle: kind,
        middleCurrency: "$",
        middleAmount: String(amount),
        bottomVariantPath: "Molecule/Bottom Card/Gift Card",
        bottomButtonLabel: "Help",
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

      <button class="btn btn-outlined btn-large" style="width:100%" type="button"
        data-action="share" data-label="${card.label}" data-amount="${amount}">
        <i class="fa-solid fa-arrow-up-from-bracket" aria-hidden="true"></i>&nbsp;Compartir
      </button>
    </div>
    ${navbar("", state)}
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

    <div class="oky-flow-section oky-flow-design">
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
            (d, i) => `<span class="promo-dot${i === at ? " promo-dot-active" : ""}"></span>`,
          ).join("")}
        </div>
      </div>
    </div>

    <div class="oky-flow-cta-bar">
      <button class="btn btn-primary btn-large" data-action="choose-design" type="button">Elegir</button>
    </div>
    ${navbar("okycash", state)}
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
  checkout: "has-bar",
  methods: "has-cta",
  carddesign: "has-cta",
  /* "Tus compras" lleva CTA + píldora de saldo, de ahí el hueco mayor. */
  purchases: "has-cta-strip",
  success: "has-cta-strip",
  cashwin: "has-cta-strip",
};

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
    case "okycash": return screenOkyCash(state);
    case "carddesign": return screenCardDesign(state);
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

  function render() {
    /* El player de Lottie deja listeners y un rAF vivos; si el overlay
       desaparece del DOM sin destruirlo, se acumulan por compra. */
    if (winAnimation) {
      winAnimation.destroy();
      winAnimation = null;
    }

    root.innerHTML = `
      <div class="oky-flow-frame">
        <div class="oky-flow-scroll ${SCROLL_CLASS[state.screen] || ""}">
          ${renderScreen(state)}
        </div>
        ${state.cartOpen ? cartDrawer(state) : ""}
      </div>
    `;

    /* Las barras se escriben dentro de la plantilla de cada pantalla
       por comodidad, pero .oky-flow-scroll está posicionado, así que
       ahí dentro un position:absolute se ancla al box que scrollea y
       las barras se movían con el contenido. Se re-parentan al frame,
       que es el contenedor fijo real. */
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
        ".oky-flow-navbar, .oky-flow-savingbar, .oky-flow-cta-bar, .oky-flow-dock, .oky-flow-cashwin, .oky-flow-scroll-hint",
      )
      .forEach((bar) => frame.appendChild(bar));

    bindHeaderScroll(scroll);
    bindSwipes();

    /* El drawer trae su propia saving bar; la de la pantalla de abajo
       se quita para que no quede pintada encima. */
    if (state.cartOpen) {
      frame
        .querySelectorAll(".oky-flow-savingbar:not(.is-drawer-bar), .oky-flow-dock, .oky-flow-cta-bar")
        .forEach((bar) => bar.remove());
    }

    root.appendChild(resetButton);
    fitToViewport();
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
  function bindHeaderScroll(scroll) {
    if (state.screen !== "home") return;

    scroll.addEventListener(
      "scroll",
      () => {
        const y = scroll.scrollTop;

        /* La pista de scroll cumplió su trabajo en cuanto la persona
           se mueve; no hay razón para seguir insistiendo. */
        const hint = root.querySelector(".oky-flow-scroll-hint");
        if (hint) hint.classList.toggle("is-hidden", y > 24);

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

  /* Pantallas de después de pagar. Salir de ellas cierra la compra: la
     flecha de atrás vuelve al home y no al recibo, que ya se vio y al
     que nadie quiere volver. */
  const POST_PURCHASE = ["success", "cashwin", "purchases"];

  function leavePurchase(screen) {
    if (!POST_PURCHASE.includes(state.screen)) return go(screen);
    state.history = [{ screen: "home", params: {} }];
    return go(screen, {}, { push: false });
  }

  function go(screen, params = {}, { push = true } = {}) {
    if (push) state.history.push({ screen: state.screen, params: state.params });
    state.screen = screen;
    state.params = params;
    state.cartOpen = false;
    state.headerCollapsed = false;
    render();
  }

  function goBack() {
    const prev = state.history.pop();
    if (!prev) return go("home", {}, { push: false });
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
      state.activity.unshift({
        date: stamp(0),
        group: monthGroup(0),
        amount: `- ${money(used)}`,
        order,
        kind: "debit",
        label: "Pagado con OKY Cash",
        value: -used,
      });
    }

    state.cart.forEach((item, i) => {
      const purchase = {
        id: `p-${Date.now()}-${i}`,
        productKey: item.productKey,
        amount: item.amount,
        cashback: item.cashback,
        used: i === 0 ? used : 0,
        date: stamp(0),
      };
      state.purchases.push(purchase);
      state.lastOrder.push(purchase);

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
    state.history = [];
    go("success", {}, { push: false });
  }

  /* Lluvia de confeti de la compra exitosa: piezas de colores que
     caen girando, generadas en el DOM en vez de un PNG plano. */
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
  function burstConfetti() {
    const row = root.querySelector(".oky-flow-payrow.is-last");
    if (!row) return;
    row.classList.add("is-checked");

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
      return render();
    }

    if (action === "scroll-more") {
      const scroll = root.querySelector(".oky-flow-scroll");
      return scroll.scrollBy({ top: scroll.clientHeight * 0.8, behavior: "smooth" });
    }

    if (action === "back") return goBack();
    if (action === "nav:home") return go("home");
    if (action === "nav:wallet") return leavePurchase("wallet");
    if (action === "nav:okycash") {
      state.cashUnseen = false;
      return leavePurchase("okycash");
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
      if (state.decisionSeen || phone.matches) {
        state.decisionSeen = true;
        state.recipient = "Para mí";
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
      const amount = state.amounts[product.key];
      if (!amount) return;
      const tier = getTier(amount, product, state.promoLive);
      state.cart = state.cart
        .filter((item) => item.productKey !== product.key)
        .concat({ productKey: product.key, amount, cashback: amount * tier.rate });
      state.cartOpen = true;
      return render();
    }

    if (action === "edit-item") {
      /* Vuelve al PDP con el monto que tiene en el carrito; al agregar
         otra vez, esa marca se reemplaza en vez de duplicarse. */
      const key = el.dataset.product;
      const inCart = state.cart.find((item) => item.productKey === key);
      if (inCart) state.amounts[key] = inCart.amount;
      return go("pdp", { product: key });
    }

    if (action === "remove-item") {
      state.cart = state.cart.filter((item) => item.productKey !== el.dataset.product);
      return render();
    }

    if (action === "open-methods") {
      if (!state.okyCashEnabled) {
        state.okyCashEnabled = true;
        state.okyCashApplied = Math.min(state.okyCashBalance, cartTotal(state));
      }
      return go("methods");
    }

    if (action === "toggle-okycash") {
      const turningOn = !state.okyCashEnabled;
      state.okyCashEnabled = turningOn;
      state.okyCashApplied = turningOn ? Math.min(state.okyCashBalance, cartTotal(state)) : 0;
      render();
      if (turningOn) burstConfetti();
      return;
    }

    /* Los carruseles dan la vuelta: del último se pasa al primero. */
    if (action === "carousel-prev" || action === "carousel-next") {
      const step = action === "carousel-next" ? 1 : -1;
      state.checkoutIndex = wrap(state.checkoutIndex + step, state.cart.length);
      return render();
    }

    if (action === "wallet-more") {
      /* Se añade la siguiente tanda al final de la pila en vez de
         re-renderizar: así no se pierde el scroll ni parpadea lo que ya
         estaba dibujado. */
      const deck = el.dataset.section;
      const items = deck === "gift" ? walletVouchers(state) : WALLET_EXTRAS[deck] || [];
      const from = state.walletShown[deck] || WALLET_PAGE;
      const to = from + WALLET_PAGE;
      state.walletShown[deck] = to;

      const list = root.querySelector(`[data-stack="${deck}"]`);
      if (list) list.insertAdjacentHTML("beforeend", items.slice(from, to).map((v) => walletVoucherButton(v, deck)).join(""));
      if (items.length <= to) el.parentElement.remove();
      return;
    }

    if (action === "wallet-jump") {
      /* La barra navega: abre la sección si estaba plegada y la sube a
         la vista. Todo en sitio, sin re-renderizar, para no perder el
         scroll ni cortar la animación. */
      const key = el.dataset.section;
      root.querySelectorAll(".oky-flow-wallet-nav .plateu-item").forEach((item) => {
        const on = item === el;
        const chip = item.querySelector(".plateu-chip, .plateu-label");
        if (chip) chip.className = on ? "plateu-chip is-outlined" : "plateu-label";
      });

      const head = root.querySelector(`[data-action="toggle-section"][data-section="${key}"]`);
      if (!head) return;
      if (!state.openSections.includes(key)) {
        state.openSections = [...state.openSections, key];
        head.setAttribute("aria-expanded", "true");
        const panel = head.nextElementSibling;
        if (panel) panel.classList.remove("is-collapsed");
      }
      /* Un instante para que el panel empiece a abrirse: si se pide el
         scroll en el mismo frame, se calcula contra el alto de antes. */
      setTimeout(() => head.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return;
    }

    if (action === "toggle-section") {
      /* Se pliega en sitio, sin re-renderizar: así la animación corre y
         no se pierde el scroll. */
      const key = el.dataset.section;
      const open = state.openSections.includes(key);
      state.openSections = open
        ? state.openSections.filter((k) => k !== key)
        : [...state.openSections, key];
      el.setAttribute("aria-expanded", String(!open));
      const panel = el.nextElementSibling;
      if (panel) panel.classList.toggle("is-collapsed", open);
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

    if (action === "share") {
      /* Hoja de compartir nativa: en iOS y Android abre la del sistema
         —WhatsApp, Mensajes, AirDrop— que es lo que la prueba necesita
         ver. Donde no existe (escritorio sin soporte) se copia al
         portapapeles y el botón lo dice un momento. */
      const label = el.dataset.label || "gift card";
      const amount = Number(el.dataset.amount) || 0;
      const payload = {
        title: `Gift Card de ${label}`,
        text: `Te comparto una gift card de ${label} por ${money(amount)} — OKY`,
        url: location.href,
      };

      if (navigator.share) {
        /* El rechazo del usuario llega como AbortError: no es un fallo
           que haya que contar. */
        navigator.share(payload).catch(() => {});
        return;
      }

      const say = (text) => {
        const before = el.innerHTML;
        el.innerHTML = `<i class="fa-solid fa-check" aria-hidden="true"></i>&nbsp;${text}`;
        setTimeout(() => {
          el.innerHTML = before;
        }, 1600);
      };

      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(`${payload.text} ${payload.url}`)
          .then(() => say("Copiado"))
          .catch(() => say("No se pudo copiar"));
        return;
      }
      say("No disponible aquí");
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
      const list = section === "gift" ? walletVouchers(state) : WALLET_EXTRAS[section] || [];
      const at = list.findIndex((v) => v.key === state.params.key);
      const next = list[wrap((at < 0 ? 0 : at) + step, list.length)];
      /* Abrirlo por el carrusel también lo da por visto. */
      if (!state.seenVouchers.includes(next.key)) state.seenVouchers.push(next.key);
      return go("voucher", { key: next.key, deck: section }, { push: false });
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
      return render();
    }

    if (action === "open-purchase") return go("voucher", { id: el.dataset.id });
    if (action === "open-voucher") {
      const key = el.dataset.key;
      if (!state.seenVouchers.includes(key)) state.seenVouchers.push(key);
      return go("voucher", { key, deck: el.dataset.deck || "gift" });
    }

    if (action === "decision-self") {
      state.decisionSeen = true;
      state.recipient = "Para mí";
      /* push:false deja el modal fuera del historial: "atrás" desde el
         checkout vuelve al PDP, no al modal. */
      return go("checkout", {}, { push: false });
    }
  });

  /* Monto del PDP: se parchean solo los nodos afectados para no
     perder el foco del input en cada tecla. */
  root.addEventListener("input", (event) => {
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
      if (bigEl) bigEl.textContent = bigAmount(amount);

      const ribbon = root.querySelector(".oky-flow-ribbon-slot .discount-ribbon-wrap");
      if (ribbon) {
        ribbon.classList.remove("is-tier-base", "is-tier-promo");
        ribbon.classList.add(tier.ribbon);
        ribbon.querySelector(".discount-ribbon-text").textContent = `Gana ${Math.round(tier.rate * 100)}%`;
      }

      const bar = root.querySelector(".saving-bar");
      if (bar) {
        bar.classList.toggle("is-tier-promo", tier.bar === "is-tier-promo");
        bar.querySelector(".saving-bar-copy span").innerHTML =
          `Gana <strong>${money(cashback)}</strong> de <strong>OKY Cash</strong>`;
      }

      const subtotal = root.querySelector("[data-role='pdp-subtotal']");
      if (subtotal) subtotal.textContent = money(amount);

      /* El CTA se reescribe solo: si el vale ya está en el carrito y el
         monto cambió, pasa de "Ver carrito" a "Actualizar". Se toca
         nada más esa fila para no perder el foco del campo. */
      const ctaRow = root.querySelector(".summary-cta-row");
      const inCartNow = state.cart.find((item) => item.productKey === product.key);
      if (ctaRow && inCartNow) {
        ctaRow.innerHTML =
          inCartNow.amount === amount
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
      const label = root.querySelector("[data-role='promo-countdown']");
      if (label) label.textContent = `Termina en ${countdownLabel(left)}`;
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
       en su ribbon normal. */
    state.promoEnded = true;
    render();
    setTimeout(() => {
      state.promoEnded = false;
      render();
    }, 2400);
  }, 1000);

  render();
}
