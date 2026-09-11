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

/* ── Catálogo ────────────────────────────────────────────── */

const PRODUCTS = {
  nike: {
    key: "nike",
    label: "Nike",
    cardTitle: "Nike Gift Card",
    art: "oky-card-nike.png",
    hero: "promo-image1.png",
    min: 10,
    max: 1000,
    legal: true,
  },
  lyft: {
    key: "lyft",
    label: "Lyft",
    cardTitle: "Lyft Gift Card",
    art: "oky-card-lyft.png",
    hero: "promo-image3.png",
    min: 10,
    max: 1000,
    legal: false,
  },
};

/* Marcas decorativas del Home, tomadas del mockup de homepage. */
const HOME_TILES = [
  { label: "Krispy Kreme", art: "oky-card-krispy.png" },
  { label: "Under Armour", art: "oky-card-underarmour.png" },
  { label: "Google Play", art: "oky-card-googleplay.png" },
  { label: "Amazon", art: "amazon.png" },
];

/* Tarjetas decorativas de "Solo por hoy" (MARS 7295:52037). */
const TODAY_CARDS = [
  { label: "Nordstrom", art: "oky-brand-nordstrom.png", photo: "oky-hoy-1.png", rate: 17 },
  { label: "Macy's", art: "oky-brand-macys.png", photo: "oky-hoy-2.png", rate: 12 },
];

/* Tier del cashback. Verificado contra los dos frames de Nike:
   $200 → "Ganas 20%" naranja · $201 → "Ganas 5%" aqua. */
function getTier(amount) {
  if (amount > 50 && amount <= 200) {
    return { rate: 0.2, ribbon: "is-tier-promo", bar: "is-tier-promo" };
  }
  return { rate: 0.05, ribbon: "is-tier-base", bar: "" };
}

const WALLET_VOUCHERS = [
  { key: "krispy", label: "Krispy Kreme", art: "oky-card-krispy.png", live: false },
  { key: "underarmour", label: "Under Armour", art: "oky-card-underarmour.png", live: false },
  { key: "lyft", label: "Lyft", art: "oky-card-lyft.png", live: true },
  { key: "nike", label: "Nike", art: "oky-card-nike.png", live: true },
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
    okyCashBalance: returning ? 56 : 20,
    screen: "home",
    params: {},
    history: [],
    /* Arranca en 51, dentro del rango de descuento especial (20%). */
    amounts: { nike: 51, lyft: 51 },
    cart: [],
    cartOpen: false,
    checkoutIndex: 0,
    okyCashEnabled: false,
    okyCashApplied: 0,
    selectedCard: "visa",
    purchases: returning
      ? [{ id: "seed", productKey: "lyft", amount: 20, cashback: 1, used: 5, date: stamp(6) }]
      : [],
    activity: [
      { date: stamp(18), group: monthGroup(18), amount: "+ $4.07", order: "Orden #01112442" },
      { date: stamp(24), group: monthGroup(24), amount: "+ $2.10", order: "Orden #01112441" },
      { date: stamp(41), group: monthGroup(41), amount: "+ $2.24", order: "Orden #01112438" },
      { date: stamp(52), group: monthGroup(52), amount: "+ $1.85", order: "Orden #01112430" },
    ],
    decisionSeen: false,
    recipient: "",
  };
}

const cartTotal = (state) => state.cart.reduce((sum, item) => sum + item.amount, 0);
const cartCashback = (state) => state.cart.reduce((sum, item) => sum + item.cashback, 0);

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

/* Un solo botón de atrás para todas las pantallas. Por defecto
   deshace el historial; el PDP lo apunta directo al home. */
function backButton(action = "back") {
  return `
    <button class="oky-flow-header-icon" data-action="${action}" type="button" aria-label="Atrás">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
    </button>
  `;
}

function titledHeader(title, { trailing = "" } = {}) {
  return `
    <header class="oky-flow-header">
      ${backButton()}
      <h1 class="oky-flow-title">${title}</h1>
      ${
        trailing
          ? `<span class="oky-flow-header-icon" aria-hidden="true"><i class="fa-solid ${trailing}"></i></span>`
          : `<span class="oky-flow-header-icon" aria-hidden="true"></span>`
      }
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
function navbar(active) {
  const item = (key, label, icon, action) => `
    <div class="nav-item ${key === active ? "active" : ""} ${action ? "" : "is-dim"}"
      ${action ? `data-action="${action}" role="button" tabindex="0"` : ""}>
      ${
        key === "okycash"
          ? `<img class="oky-flow-coin" src="oky-cash-coin.png" alt="" />`
          : `<i class="fa-solid fa-${icon}" style="font-size:20px" aria-hidden="true"></i>`
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
        ${item("ayuda", "Ayuda", "comments", null)}
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
function screenHome(state) {
  /* Una marca del carrusel = homecard-photo-item del mockup de
     homepage, pero como <button> para que sea clickable. */
  const photoItem = (product) => `
      <button class="homecard-photo-item" data-action="open-pdp" data-product="${product.key}" type="button">
        <div class="homecard-photo-media-wrap">
          <img class="homecard-photo-hero" src="${product.hero}" alt="${product.label}" />
          <div class="homecard-photo-ribbon-wrap">
            <div class="discount-ribbon discount-ribbon-wrap is-tier-promo">
              <span class="discount-ribbon-text token-price-percent">Gana 20%</span>
            </div>
          </div>
        </div>
        <div class="homecard-photo-logo-stack">
          <div class="homecard-photo-logo-wrap">
            <img class="homecard-photo-logo" src="${product.art}" alt="${product.label}" />
          </div>
          <p class="token-brand homecard-photo-name">${product.label}</p>
        </div>
      </button>
    `;

  const tile = (brand) => `
    <article class="homecard-tile">
      <div class="homecard-tile-logo-wrap">
        <img class="homecard-tile-logo" src="${brand.art}" alt="${brand.label}" />
      </div>
      <p class="token-brand homecard-tile-name">${brand.label}</p>
    </article>
  `;

  return `
    ${renderDiscoveryHeader({
      side: "Left",
      state: "State 1",
      walletAction: "nav:wallet",
      cartAction: "open-cart",
      cartIndicated: state.cart.length > 0,
    })}

    <div class="oky-flow-section">
      <div style="width:100%">
        <div class="carousel-container">
          <div class="carousel-banner"><img src="oky-banner-1.png" alt="Promo Verano" /></div>
          <div class="carousel-banner"><img src="oky-banner-2.png" alt="Promo" /></div>
        </div>
        <div class="carrusel-dots-wrap" style="width:100%">
          <div class="carrusel-dots">
            ${[0, 1, 2, 3, 4]
              .map((i) => `<span class="promo-dot${i === 0 ? " promo-dot-active" : ""}"></span>`)
              .join("")}
          </div>
        </div>
      </div>

      <button class="oky-flow-cash-strip" data-action="nav:okycash" type="button">
        <img src="oky-cash-coin.png" alt="" />
        <span class="oky-flow-cash-strip-copy">
          <span class="oky-flow-cash-strip-amount"><span>$</span><strong>${state.okyCashBalance.toFixed(2)}</strong></span>
          <span class="oky-flow-cash-strip-label">OKY Cash</span>
        </span>
        <span class="btn btn-primary btn-small" style="pointer-events:none">Explora</span>
      </button>

      <div class="oky-flow-home-head">
        <h2 class="oky-flow-home-title">Labor Day</h2>
        <span class="oky-flow-countdown">
          <i class="fa-solid fa-clock" aria-hidden="true"></i>Termina en 20:43:32
        </span>
      </div>

      <section class="homecard-organism homecard-organism-photo">
        <div class="homecard-content homecard-content-photo">
          <div class="homecard-photo-track">
            ${photoItem(PRODUCTS.nike)}
            ${photoItem(PRODUCTS.lyft)}
          </div>
        </div>
      </section>

      <section class="tactic-strip">
        <header class="tactic-strip-header">
          <h3 class="token-h6 tactic-strip-title">Solo por hoy</h3>
          <div class="super-ribbon super-ribbon-type-normal">
            <span class="super-ribbon-icon"><i class="fa-solid fa-tags" aria-hidden="true"></i></span>
            <span class="super-ribbon-text">Descuentos de temporada</span>
          </div>
        </header>

        <div class="tactic-strip-carousel-window">
          <div class="tactic-strip-carousel-track">
            ${TODAY_CARDS.map(
              (card) => `
              <article class="tactic-offer tactic-offer-left">
                <div class="tactic-offer-hero-wrap">
                  <img class="tactic-offer-hero" src="${card.photo}" alt="${card.label}" />
                  <div class="tactic-logo-wrap tactic-logo-wrap-left">
                    <img class="tactic-logo" src="${card.art}" alt="${card.label}" />
                  </div>
                  <div class="tactic-discount-wrap tactic-discount-wrap-left">
                    <div class="discount-ribbon discount-ribbon-wrap is-tier-base">
                      <span class="discount-ribbon-text token-price-percent">Gana ${card.rate}%</span>
                    </div>
                  </div>
                </div>
                <div class="tactic-brand-row">
                  <p class="token-brand tactic-brand">${card.label}</p>
                </div>
              </article>
            `,
            ).join("")}
          </div>
        </div>
      </section>

      <section class="homecard-organism">
        <header class="homecard-header">
          <h3 class="token-h6 homecard-title">Novedades</h3>
        </header>
        <div class="homecard-content homecard-content-default" style="padding:0 16px">
          <div class="homecard-grid">
            ${HOME_TILES.map(tile).join("")}
          </div>
        </div>
        <footer class="homecard-footer">
          <button class="btn btn-primary btn-small" type="button">Ver más</button>
        </footer>
      </section>
    </div>

    ${navbar("home")}
  `;
}

/* ── PDP (99105:32284 / 99105:37017 / 99140:13571) ──────── */
function screenPdp(state) {
  const product = PRODUCTS[state.params.product];
  const amount = state.amounts[product.key];
  const tier = getTier(amount);
  const cashback = amount * tier.rate;
  const inCart = state.cart.some((item) => item.productKey === product.key);

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
              inCart
                ? `<button class="btn btn-primary summary-btn" data-action="open-cart" type="button">Ver carrito</button>`
                : `<button class="btn btn-primary summary-btn" data-action="add-to-cart" data-product="${product.key}"
                     type="button" ${amount > 0 ? "" : "disabled"}>
                     <i class="fa-solid fa-plus" aria-hidden="true"></i>Agregar
                   </button>`
            }
          </div>
        </div>
      </div>
    </div>

    ${savingBar(cashback, tier, (v) => `Gana <strong>${v}</strong> de <strong>OKY Cash</strong>`)}
    ${navbar("")}
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
          const tier = getTier(item.amount);
          return `
            <div class="oky-flow-cart-row">
              <div class="oky-flow-cart-head">
                <span class="brand-item-atom is-no-label">
                  <span class="brand-item-frame">
                    <span class="brand-item-base"><img src="${product.art}" alt="${product.label}" /></span>
                  </span>
                </span>
                <button class="oky-flow-cart-trash" data-action="remove-item" data-product="${item.productKey}"
                  type="button" aria-label="Quitar ${product.label}">
                  <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                </button>
              </div>
              <div class="oky-flow-cart-body">
                <p class="oky-flow-cart-title">${product.cardTitle}</p>
                <p class="oky-flow-cart-price">${money(item.amount)}</p>
                <span class="discount-ribbon discount-ribbon-list ${tier.ribbon}">
                  <span class="discount-ribbon-text token-price-percent">Gana ${Math.round(tier.rate * 100)}%</span>
                </span>
              </div>
            </div>
          `;
        })
        .join("")
    : `<p class="oky-flow-empty">Tu carrito está vacío.</p>`;

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
        <div class="oky-flow-cart-card">${rows}</div>
      </div>

      <div class="oky-flow-drawer-foot">
        <div class="summary-box summary-box-compact">
          <div class="summary-card">
            <div class="summary-card-body">
              <div class="summary-row summary-row-total">
                <span class="summary-label-strong">TOTAL</span>
                <span class="summary-label-strong">${money(total)}</span>
              </div>
            </div>
            <div class="summary-cta-row double">
              <button class="btn btn-outlined btn-large" data-action="close-cart" type="button">Seguir comprando</button>
              <button class="btn btn-primary btn-large" data-action="go:decision" type="button"
                ${state.cart.length ? "" : "disabled"}>Ir a pagar</button>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <div class="oky-flow-savingbar is-drawer-bar">
      <div class="saving-bar is-oky-cash">
        <div class="saving-bar-copy">
          <span>Compra y gana <strong>${money(cashback)}+</strong> en <strong>OKY Cash</strong></span>
        </div>
      </div>
    </div>
  `;
}

/* ── Checkout (99105:31768) ─────────────────────────────── */
function screenCheckout(state) {
  const total = cartTotal(state);
  const cashback = cartCashback(state);
  const tier = getTier(total);
  const active = clamp(state.checkoutIndex, 0, Math.max(state.cart.length - 1, 0));
  const giftCard = (item) => `
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
      </article>
    </section>
  `;

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
              ${state.cart[active - 1] ? giftCard(state.cart[active - 1]) : ""}
            </div>
            <div class="brand-carrousel-center">
              <div class="brand-carrousel-center-card">${giftCard(state.cart[active])}</div>
            </div>
            <div class="brand-carrousel-side brand-carrousel-side-right">
              ${state.cart[active + 1] ? giftCard(state.cart[active + 1]) : ""}
            </div>
          </div>
          ${
            state.cart.length > 1
              ? `
            <button class="oky-flow-carousel-nav is-prev" data-action="carousel-prev" type="button"
              aria-label="Anterior" ${active === 0 ? "disabled" : ""}>
              <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
            </button>
            <button class="oky-flow-carousel-nav is-next" data-action="carousel-next" type="button"
              aria-label="Siguiente" ${active === state.cart.length - 1 ? "disabled" : ""}>
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
            <div class="summary-row">
              <span class="summary-label-strong">Subtotal</span>
              <span class="summary-label-strong">${money(total)}</span>
            </div>
            ${
              applied > 0
                ? `<div class="summary-row">
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

    ${savingBar(cashback, { bar: "" }, (v) => `Compra y gana <strong>${v}+</strong> en <strong>OKY Cash</strong>`)}
    ${navbar("")}
  `;
}

/* ── Métodos de pago (99105:41588) ──────────────────────── */
function screenMethods(state) {
  const total = cartTotal(state);
  const max = Math.min(state.okyCashBalance, total);
  const applied = clamp(state.okyCashApplied, 0, max);
  const toCard = Math.max(total - applied, 0);
  const keep = Math.max(state.okyCashBalance - applied, 0);
  const progress = max > 0 ? (applied / max) * 100 : 0;

  const selected = CARDS.find((c) => c.key === state.selectedCard) || CARDS[0];
  const others = CARDS.filter((c) => c.key !== selected.key);

  const top = { ...findPaymentCard(selected.variant) };
  const cash = { ...findPaymentCard("Molecule/Payment Card/OKY Cash Black") };
  cash.balance = { ...cash.balance, value: keep.toFixed(2) };
  cash.art = "oky-saldo-card-art.png";
  cash.cta = { ...cash.cta, action: "nav:okycash" };

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
          <div class="oky-flow-cash-slider" style="--oky-cash-progress:${progress}%">
            <input type="range" min="0" max="${max}" step="0.5" value="${applied}"
              data-action="slide-okycash" aria-label="Monto de OKY Cash" />
          </div>
          <p class="oky-flow-cash-caption">
            ${money(applied)} de ${money(state.okyCashBalance)} &nbsp;·&nbsp; Guardas <strong>${money(keep)}</strong> para después
          </p>
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
    ${navbar("")}
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
    ${navbar("")}
  `;
}

/* ── Tus compras (99140:56031) + Success (99140:56018) ─── */
function screenPurchases(state, { celebrate = false } = {}) {
  const list = state.purchases
    .slice()
    .reverse()
    .map((p) => ({ ...PRODUCTS[p.productKey], id: p.id }));

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
                <button class="oky-flow-voucher" data-action="open-purchase" data-id="${v.id}" type="button">
                  <img src="${v.art}" alt="${v.label}" />
                  <span class="oky-flow-voucher-badge">1<i class="fa-solid fa-qrcode" aria-hidden="true"></i></span>
                </button>
              `,
                )
                .join("")}
            </div>`
          : `<p class="oky-flow-empty">Todavía no tienes compras.</p>`
      }
    </div>

    <div class="oky-flow-cta-bar">
      <button class="btn btn-outlined btn-large oky-flow-wallet-btn" data-action="nav:wallet" type="button">
        <img src="Wallet-icon.png" alt="" />Mi Wallet
      </button>
    </div>
    ${navbar("")}

    ${
      celebrate
        ? `<div class="oky-flow-celebration" data-action="dismiss-celebration" role="button" tabindex="0">
            <div class="oky-flow-celebration-confetti" data-role="celebration-confetti"></div>
            <div class="oky-flow-stamp-group">
              <img class="oky-flow-stamp" src="oky-stamp-exitosa.png" alt="" />
              <p class="oky-flow-stamp-label">Compra exitosa</p>
            </div>
          </div>`
        : ""
    }
  `;
}

/* ── Mi wallet (99105:43773) ────────────────────────────── */
function screenWallet(state) {
  const cash = { ...findPaymentCard("Molecule/Payment Card/OKY Cash Black") };
  cash.balance = { ...cash.balance, value: state.okyCashBalance.toFixed(2) };
  cash.art = "oky-saldo-card-art.png";
  cash.cta = { ...cash.cta, action: "nav:okycash" };

  const filters = [
    { label: "OKY Cash", icon: "oky-cash-coin.png" },
    { label: "Gift Cards", icon: "plateu9.png" },
    { label: "OKY Vales", icon: "plateu10.png" },
    { label: "Servicios", icon: "plateu11.png" },
    { label: "Recargas", icon: "plateu12.png" },
  ];

  return `
    ${statusBar()}
    ${titledHeader("Mi wallet")}

    <section class="plateu-molecule is-static is-default" aria-label="Filtros">
      <div class="plateu-track is-static">
        ${filters
          .map(
            (f, i) => `
          <div class="plateu-item">
            <div class="plateu-icon-wrap"><img class="plateu-icon" src="${f.icon}" alt="" /></div>
            ${i === 0 ? `<span class="plateu-chip is-outlined">${f.label}</span>` : `<span class="plateu-label">${f.label}</span>`}
          </div>
        `,
          )
          .join("")}
      </div>
    </section>

    <div class="oky-flow-section" style="gap:16px">
      <div class="oky-flow-section-head">
        <i class="fa-solid fa-wallet" aria-hidden="true"></i>OKY CASH
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </div>
      <div style="display:flex;justify-content:center;width:100%">${renderPaymentCard(cash)}</div>

      <div class="oky-flow-section-head">
        <i class="fa-solid fa-gift" aria-hidden="true"></i>GIFT CARDS
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </div>
      <div class="oky-flow-stack">
        ${WALLET_VOUCHERS.map(
          (v) => `
          <button class="oky-flow-voucher" ${v.live ? `data-action="open-voucher" data-key="${v.key}"` : "disabled"} type="button">
            <img src="${v.art}" alt="${v.label}" />
            <span class="oky-flow-voucher-badge">1<i class="fa-solid fa-qrcode" aria-hidden="true"></i></span>
          </button>
        `,
        ).join("")}
      </div>
      <button class="btn btn-primary btn-small" data-action="go:purchases" type="button">Ver más</button>
    </div>

    ${navbar("")}
  `;
}

/* ── OKY Cash: destino del coin de la navbar (99135:103474) ─ */
function screenOkyCash(state) {
  const cash = { ...findPaymentCard("Molecule/Payment Card/OKY Cash Black") };
  cash.balance = { ...cash.balance, value: state.okyCashBalance.toFixed(2) };
  cash.art = "oky-saldo-card-art.png";
  /* Aquí ya estás en la actividad, así que la tarjeta va sin ese CTA. */
  cash.cta = null;

  /* Los movimientos se agrupan por mes conservando el orden. */
  const groups = [];
  state.activity.forEach((entry) => {
    const label = entry.group || monthGroup(0);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(entry);
    else groups.push({ label, items: [entry] });
  });

  const historyRow = (entry) =>
    renderHistoryCard({
      key: "oky-cash",
      id: "99135:104411",
      layout: "row",
      icon: { glyph: "fa-coins", weight: "fa-solid" },
      date: entry.date,
      amount: entry.amount,
      meta: { type: "order", note: entry.order },
      chip: { label: "Acreditado", tone: "success", icon: "fa-circle-check" },
    });

  const rows = groups.length
    ? groups
        .map(
          (group) => `
          <div class="oky-flow-history-group">
            <h2 class="oky-flow-history-label">${group.label}</h2>
            ${group.items.map(historyRow).join("")}
          </div>
        `,
        )
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

    ${navbar("okycash")}
  `;
}

/* ── Detalle de vale ──────────────────────────────────────
   Misma pantalla desde "Tus compras" (por id de compra) y desde
   Mi wallet (por marca): en ambos casos el organismo Card. */
function screenVoucher(state) {
  const purchase = state.params.id
    ? state.purchases.find((p) => p.id === state.params.id)
    : state.purchases.filter((p) => p.productKey === state.params.key).slice(-1)[0];

  const product = PRODUCTS[purchase ? purchase.productKey : state.params.key];
  const amount = purchase ? purchase.amount : state.amounts[product.key];

  /* Desde "Tus compras" la pantalla es el detalle de la orden; desde
     Mi wallet, el vale de la marca. */
  const title = state.params.id ? "Detalle de la orden" : product.label;

  return `
    ${statusBar()}
    ${titledHeader(title)}
    <div class="oky-flow-section">
      ${
        purchase
          ? `<div class="toast-banner toast-banner-success" role="status">
              <span class="toast-banner-icon"><i class="fa-solid fa-circle-check" aria-hidden="true"></i></span>
              <span class="toast-banner-message">Compra exitosa</span>
            </div>`
          : ""
      }

      ${renderCardOrganism({
        topVariantPath: "Molecule/Top Card/Gift Card",
        topBrandLabel: product.label,
        topHeroImage: product.art,
        topHeroAlt: product.label,
        topFooterLeftLabel: "Terms & Conditions",
        topFooterRightLabel: "Brand Disclaimer",
        middleCardPath: "Molecule/Middle Card/Amount",
        middleTitle: "Gift Card",
        middleCurrency: "$",
        middleAmount: String(amount),
        bottomVariantPath: "Molecule/Bottom Card/Gift Card",
        bottomButtonLabel: "Help",
      })}

      <button class="btn btn-outlined btn-large" style="width:100%" type="button">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>&nbsp;Compartir
      </button>
    </div>
    ${navbar("")}
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
  purchases: "has-cta",
  success: "has-cta",
};

function renderScreen(state) {
  switch (state.screen) {
    case "home": return screenHome(state);
    case "pdp": return screenPdp(state);
    case "checkout": return screenCheckout(state);
    case "methods": return screenMethods(state);
    case "processing": return screenProcessing(state);
    case "success": return screenPurchases(state, { celebrate: true });
    case "purchases": return screenPurchases(state);
    case "wallet": return screenWallet(state);
    case "okycash": return screenOkyCash(state);
    case "voucher": return screenVoucher(state);
    case "decision": return screenDecision();
    default: return screenHome(state);
  }
}

export function mountOkyCashPrototype(root, { userType = "first-time" } = {}) {
  let state = createInitialState(userType);
  let celebrationTimer = 0;

  function render() {
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
         deja a la vista los vales recién comprados. */
      clearTimeout(celebrationTimer);
      celebrationTimer = setTimeout(() => {
        if (state.screen === "success") go("purchases", {}, { push: false });
      }, 2600);
    }

    const frame = root.querySelector(".oky-flow-frame");
    const scroll = frame.querySelector(".oky-flow-scroll");
    scroll
      .querySelectorAll(".oky-flow-navbar, .oky-flow-savingbar, .oky-flow-cta-bar, .oky-flow-dock")
      .forEach((bar) => frame.appendChild(bar));

    /* El drawer trae su propia saving bar; la de la pantalla de abajo
       se quita para que no quede pintada encima. */
    if (state.cartOpen) {
      frame
        .querySelectorAll(".oky-flow-savingbar:not(.is-drawer-bar), .oky-flow-dock, .oky-flow-cta-bar")
        .forEach((bar) => bar.remove());
    }
  }

  function go(screen, params = {}, { push = true } = {}) {
    if (push) state.history.push({ screen: state.screen, params: state.params });
    state.screen = screen;
    state.params = params;
    state.cartOpen = false;
    render();
  }

  function goBack() {
    const prev = state.history.pop();
    if (!prev) return go("home", {}, { push: false });
    state.screen = prev.screen;
    state.params = prev.params;
    state.cartOpen = false;
    render();
  }

  function completePurchase() {
    const total = cartTotal(state);
    const used = state.okyCashEnabled
      ? clamp(state.okyCashApplied, 0, Math.min(state.okyCashBalance, total))
      : 0;
    let earned = 0;

    state.cart.forEach((item, i) => {
      state.purchases.push({
        id: `p-${Date.now()}-${i}`,
        productKey: item.productKey,
        amount: item.amount,
        cashback: item.cashback,
        used: i === 0 ? used : 0,
        date: stamp(0),
      });
      earned += item.cashback;
      state.activity.unshift({
        date: stamp(0),
        group: monthGroup(0),
        amount: `+ ${money(item.cashback)}`,
        order: `Orden #${11112440 + state.activity.length + 1}`,
      });
    });

    state.okyCashBalance = state.okyCashBalance - used + earned;
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

    if (action === "back") return goBack();
    if (action === "nav:home") return go("home");
    if (action === "nav:wallet") return go("wallet");
    if (action === "nav:okycash") return go("okycash");
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
    if (action === "go:decision") return go("decision");

    if (action === "open-pdp") return go("pdp", { product: el.dataset.product });

    if (action === "add-to-cart") {
      const product = PRODUCTS[el.dataset.product];
      const amount = state.amounts[product.key];
      if (!amount) return;
      const tier = getTier(amount);
      state.cart = state.cart
        .filter((item) => item.productKey !== product.key)
        .concat({ productKey: product.key, amount, cashback: amount * tier.rate });
      state.cartOpen = true;
      return render();
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

    if (action === "carousel-prev" || action === "carousel-next") {
      const step = action === "carousel-next" ? 1 : -1;
      state.checkoutIndex = clamp(state.checkoutIndex + step, 0, state.cart.length - 1);
      return render();
    }

    if (action === "select-card") {
      state.selectedCard = el.dataset.card;
      return render();
    }

    if (action === "confirm-methods") return goBack();

    if (action === "pay") {
      go("processing", {}, { push: false });
      setTimeout(completePurchase, 1400);
      return;
    }

    if (action === "dismiss-celebration") {
      clearTimeout(celebrationTimer);
      return go("purchases", {}, { push: false });
    }
    if (action === "open-purchase") return go("voucher", { id: el.dataset.id });
    if (action === "open-voucher") return go("voucher", { key: el.dataset.key });

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

      const tier = getTier(amount);
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

      const addBtn = root.querySelector("[data-action='add-to-cart']");
      if (addBtn) addBtn.disabled = amount <= 0;
      return;
    }

    const slider = event.target.closest("[data-action='slide-okycash']");
    if (slider) {
      const total = cartTotal(state);
      const max = Math.min(state.okyCashBalance, total);
      const applied = clamp(Number(slider.value) || 0, 0, max);
      state.okyCashApplied = applied;
      state.okyCashEnabled = applied > 0;

      const keep = Math.max(state.okyCashBalance - applied, 0);
      slider.parentElement.style.setProperty("--oky-cash-progress", `${max ? (applied / max) * 100 : 0}%`);

      const cashChip = root.querySelector(".oky-flow-method-row.is-cash .oky-flow-chip.is-cash");
      if (cashChip) cashChip.textContent = money(applied);
      const cardChip = root.querySelector(".oky-flow-method-row.is-selected .oky-flow-chip.is-card");
      if (cardChip) cardChip.textContent = money(Math.max(total - applied, 0));
      const caption = root.querySelector(".oky-flow-cash-caption");
      if (caption) {
        caption.innerHTML =
          `${money(applied)} de ${money(state.okyCashBalance)} &nbsp;·&nbsp; Guardas <strong>${money(keep)}</strong> para después`;
      }
      const cardBalance = root.querySelector(".payment-card-molecule.is-oky-cash-black .payment-card-amount-value");
      if (cardBalance) cardBalance.textContent = keep.toFixed(2);
    }
  });

  render();
}
