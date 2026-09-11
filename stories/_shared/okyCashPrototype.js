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

const money = (v) => `$${(Number(v) || 0).toFixed(2)}`;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function stamp(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const m = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  return `${String(d.getDate()).padStart(2, "0")} / ${m[d.getMonth()]} / ${d.getFullYear()}`;
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
    /* El PDP arranca siempre en 0. */
    amounts: { nike: 0, lyft: 0 },
    cart: [],
    cartOpen: false,
    okyCashEnabled: false,
    okyCashApplied: 0,
    purchases: returning
      ? [{ id: "seed", productKey: "lyft", amount: 20, cashback: 1, used: 5, date: stamp(6) }]
      : [],
    activity: returning
      ? [
          { date: stamp(18), amount: "+ $4.07", order: "Orden #01112442" },
          { date: stamp(41), amount: "+ $2.10", order: "Orden #01112441" },
        ]
      : [],
    decisionSeen: false,
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

/* Un solo botón de atrás para todas las pantallas. */
function backButton() {
  return `
    <button class="oky-flow-header-icon" data-action="back" type="button" aria-label="Atrás">
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
function productHeader(state) {
  const count = state.cart.length;
  return `
    <header class="oky-flow-header">
      ${backButton()}
      <span class="oky-flow-title" aria-hidden="true"></span>
      <button class="oky-flow-iconbtn" data-action="open-cart" type="button" aria-label="Carrito">
        <img src="Cart-3d-icon.png" alt="" />
        ${count ? `<span class="oky-flow-dot"></span>` : ""}
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
  const photoItem = (product) => {
    const tier = getTier(state.amounts[product.key] || 200);
    return `
      <button class="homecard-photo-item" data-action="open-pdp" data-product="${product.key}" type="button">
        <div class="homecard-photo-media-wrap">
          <img class="homecard-photo-hero" src="${product.hero}" alt="${product.label}" />
          <div class="homecard-photo-ribbon-wrap">
            <div class="discount-ribbon discount-ribbon-wrap ${tier.ribbon}">
              <span class="discount-ribbon-text token-price-percent">Ganas hasta 20%</span>
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
  };

  const tile = (brand) => `
    <article class="homecard-tile">
      <div class="homecard-tile-logo-wrap">
        <img class="homecard-tile-logo" src="${brand.art}" alt="${brand.label}" />
      </div>
      <p class="token-brand homecard-tile-name">${brand.label}</p>
    </article>
  `;

  return `
    ${statusBar()}
    <div class="page-header-screen" style="justify-content:space-between;padding:0 12px">
      <button class="oky-flow-iconbtn" data-action="nav:wallet" type="button" aria-label="Mi wallet">
        <img src="Wallet-icon.png" alt="" />
      </button>
      <img class="header-logo" src="logo-oky.svg" alt="OKY" />
      <button class="oky-flow-iconbtn" data-action="open-cart" type="button" aria-label="Carrito">
        <img src="Cart-3d-icon.png" alt="" />
        ${state.cart.length ? `<span class="oky-flow-dot"></span>` : ""}
      </button>
    </div>

    <div class="oky-flow-tabs">
      <button class="oky-flow-tab is-active" type="button">
        <span class="oky-flow-tab-flag">🇺🇸</span>USA
      </button>
      <button class="oky-flow-tab" type="button">
        <span class="oky-flow-tab-flag">🇬🇹</span>GUA
        <i class="fa-solid fa-chevron-down" style="font-size:11px" aria-hidden="true"></i>
      </button>
    </div>

    <div class="oky-flow-section">
      <div class="input-wrapper" style="width:100%">
        <i class="fa-solid fa-magnifying-glass search-icon" aria-hidden="true"></i>
        <input class="input-field search-input search-input-empty" value="" placeholder="Buscar marcas" readonly />
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
    ${productHeader(state)}

    <div class="oky-flow-stack-center">
      <div>
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
                    <p class="middle-card-amount">${amount}</p>
                  </div>
                </div>
              </div>
              <div class="middle-card-footer">
                <span class="middle-card-footer-start">Redemption Instructions</span>
                <span class="middle-card-footer-end">Terms &amp; Conditions</span>
              </div>
            </div>
            <div class="discount-ribbon discount-ribbon-wrap is-pdp-bottom ${tier.ribbon}">
              <span class="discount-ribbon-text token-price-percent">Ganas ${Math.round(tier.rate * 100)}%</span>
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
          <input id="oky-amount" class="input-field input-dinamic${amount ? " input-dinamic-hasvalue" : ""}" type="text"
            inputmode="decimal" value="${amount}" data-action="input-amount" data-product="${product.key}"
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

    ${savingBar(cashback, tier, (v) => `Ganas <strong>${v}</strong> de <strong>OKY Cash</strong>`)}
    ${navbar("")}
  `;
}

/* ── Carrito: drawer desde la derecha (99105:38191) ─────── */
function cartDrawer(state) {
  const total = cartTotal(state);
  const cashback = cartCashback(state);

  const rows = state.cart.length
    ? state.cart
        .map((item) => {
          const product = PRODUCTS[item.productKey];
          const tier = getTier(item.amount);
          return `
            <div class="oky-flow-cart-row">
              <img class="oky-flow-cart-art" src="${product.art}" alt="${product.label}" />
              <div class="oky-flow-cart-copy">
                <p class="oky-flow-cart-title">${product.cardTitle}</p>
                <p class="oky-flow-cart-price">${money(item.amount)}</p>
                <span class="oky-flow-cart-chip">Ganas ${Math.round(tier.rate * 100)}%</span>
              </div>
              <button class="oky-flow-cart-trash" data-action="remove-item" data-product="${item.productKey}"
                type="button" aria-label="Quitar ${product.label}">
                <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
              </button>
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
        <div class="oky-flow-cart-total">
          <span>TOTAL</span>
          <span>${money(total)}</span>
        </div>
        <div class="oky-flow-cart-actions">
          <button class="btn btn-outlined btn-large" data-action="close-cart" type="button">Seguir comprando</button>
          <button class="btn btn-primary btn-large" data-action="go:checkout" type="button"
            ${state.cart.length ? "" : "disabled"}>Ir a pagar</button>
        </div>
      </div>
    </aside>

    <div class="oky-flow-savingbar">
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
  const first = PRODUCTS[state.cart[0].productKey];
  const applied = state.okyCashEnabled
    ? Math.min(state.okyCashApplied || state.okyCashBalance, total, state.okyCashBalance)
    : 0;
  const toCard = Math.max(total - applied, 0);

  return `
    ${statusBar()}
    ${productHeader(state)}

    <div class="oky-flow-section">
      <section class="brand-item-atom is-with-label">
        <p class="brand-item-label token-product-text">${first.label}</p>
        <div class="brand-item-frame">
          <div class="brand-item-base"><img src="${first.art}" alt="${first.label}" /></div>
        </div>
      </section>

      <section class="middle-card-shell is-checkout" style="width:100%">
        <article class="middle-card-molecule is-egift">
          <div class="middle-card-content">
            <div class="middle-card-main">
              <p class="middle-card-title">${state.cart.length > 1 ? `${state.cart.length} Gift Cards` : first.cardTitle}</p>
              <div class="middle-card-center">
                <div class="middle-card-value">
                  <span class="middle-card-currency">$</span>
                  <p class="middle-card-amount">${total}</p>
                </div>
              </div>
            </div>
            <div class="middle-card-footer">
              <span class="middle-card-footer-start">Que necesitas saber</span>
              <span class="middle-card-footer-end" aria-hidden="true"></span>
            </div>
          </div>
        </article>
      </section>

      <article class="dual-molecule is-default" style="width:100%">
        <span class="dual-floating-label">¿Para quién es?</span>
        <div class="dual-card">
          <span class="dual-avatar" aria-hidden="true"><i class="fa-solid fa-user"></i></span>
          <div class="dual-copy">
            <p class="dual-title">Para mí</p>
            <p class="dual-subtitle">+1 407 284-8092</p>
          </div>
          <span class="dual-action" aria-hidden="true"><i class="fa-solid fa-ellipsis-vertical"></i></span>
        </div>
      </article>

      <div class="payment-method-input oky-flow-paygroup" style="width:100%">
        <span class="payment-method-label">Método de pago</span>
        <div class="oky-flow-payrow is-first" data-action="open-methods" role="button" tabindex="0">
          <img class="oky-flow-method-art is-visa" src="payment-card-logo-visa.png" alt="Visa" />
          <p class="oky-flow-payrow-copy">**2111</p>
          <span class="oky-flow-chip is-card">${money(toCard)}</span>
          <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true" style="color:var(--primary-base)"></i>
        </div>
        <div class="oky-flow-payrow is-last" data-action="toggle-okycash" role="button" tabindex="0">
          <span class="oky-flow-check" aria-hidden="true">
            <i class="fa-${state.okyCashEnabled ? "solid fa-square-check" : "regular fa-square"}"></i>
          </span>
          <p class="oky-flow-payrow-copy">OKY Cash</p>
          <span class="oky-flow-chip is-cash">${money(state.okyCashEnabled ? applied : state.okyCashBalance)}</span>
          <button class="oky-flow-header-icon" data-action="open-methods" type="button"
            aria-label="Editar monto" style="width:24px">
            <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true" style="font-size:16px"></i>
          </button>
        </div>
      </div>

      <div class="summary-box summary-box-compact" style="width:100%">
        <div class="summary-card">
          <div class="summary-card-body">
            <div class="summary-row summary-row-total">
              <span class="summary-label-strong">TOTAL</span>
              <span class="summary-label-strong">${money(total)}</span>
            </div>
          </div>
          <div class="summary-cta-row">
            <button class="btn btn-primary summary-btn" data-action="pay" type="button">Comprar</button>
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

  const visa = { ...findPaymentCard("Molecule/Payment Card/Visa") };
  const cash = { ...findPaymentCard("Molecule/Payment Card/OKY Cash Black") };
  cash.balance = { ...cash.balance, value: keep.toFixed(2) };
  cash.art = "oky-saldo-card-art.png";

  return `
    ${statusBar()}
    ${titledHeader("Métodos de pago")}

    <div class="oky-flow-section" style="gap:8px">
      <button class="oky-flow-addcard" type="button">
        <i class="fa-solid fa-plus" aria-hidden="true"></i>Agregar tarjeta crédito/débito
      </button>

      <div class="payment-card-stack" style="--payment-card-stack-offset:-144px">
        ${renderPaymentCard(visa)}
        ${renderPaymentCard(cash)}
      </div>

      <div class="oky-flow-method-group" style="width:100%;padding-top:8px">
        <div class="oky-flow-method-row is-selected">
          <span class="oky-flow-radio" aria-hidden="true"><i class="fa-solid fa-circle-dot"></i></span>
          <img class="oky-flow-method-art is-visa" src="payment-card-logo-visa.png" alt="Visa" />
          <p class="oky-flow-method-name">**2111</p>
          <span class="oky-flow-chip is-card">${money(toCard)}</span>
        </div>

        <div class="oky-flow-method-row is-cash">
          <div class="oky-flow-method-head">
            <button class="oky-flow-check" data-action="toggle-okycash" type="button" aria-label="Usar OKY Cash">
              <i class="fa-${state.okyCashEnabled ? "solid fa-square-check" : "regular fa-square"}"></i>
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

      <div class="oky-flow-method-row" style="width:100%;margin-top:8px">
        <span class="oky-flow-radio" aria-hidden="true"><i class="fa-regular fa-circle"></i></span>
        <img class="oky-flow-method-art is-mastercard" src="payment-card-logo-mastercard.png" alt="" />
        <p class="oky-flow-method-name is-regular">**4566</p>
      </div>
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
      <button class="btn btn-outlined btn-large" data-action="nav:wallet" type="button"
        style="display:inline-flex;align-items:center;justify-content:center;gap:8px">
        <img src="oky-wallet-3d.png" alt="" style="width:28px;height:28px;object-fit:contain" />
        Mi Wallet
      </button>
    </div>
    ${navbar("")}

    ${
      celebrate
        ? `<div class="oky-flow-celebration" data-action="dismiss-celebration" role="button" tabindex="0">
            <img class="oky-flow-confetti is-top" src="oky-confetti.png" alt="" />
            <img class="oky-flow-confetti is-bottom" src="oky-confetti.png" alt="" />
            <img class="oky-flow-stamp" src="oky-stamp-exitosa.png" alt="Compra Exitosa" />
          </div>`
        : ""
    }
  `;
}

/* ── Detalle de compra ──────────────────────────────────── */
function screenPurchaseDetail(state) {
  const purchase =
    state.purchases.find((p) => p.id === state.params.id) || state.purchases[state.purchases.length - 1];
  const product = PRODUCTS[purchase.productKey];

  const rows = [
    ["Comercio", product.label],
    ["Producto", product.cardTitle],
    ["Valor", money(purchase.amount)],
    ["Fecha", purchase.date],
    ["Estado", "Completado"],
    ["OKY Cash usado", money(purchase.used)],
    ["OKY Cash ganado", `+ ${money(purchase.cashback)}`],
  ];

  return `
    ${statusBar()}
    ${titledHeader("Detalle de la orden")}
    <div class="oky-flow-section">
      <div class="oky-flow-voucher" style="cursor:default">
        <img src="${product.art}" alt="${product.label}" />
        <span class="oky-flow-voucher-badge">1<i class="fa-solid fa-qrcode" aria-hidden="true"></i></span>
      </div>
      <div class="summary-box summary-box-compact" style="width:100%">
        <div class="summary-card">
          <div class="summary-card-body">
            ${rows
              .map(
                ([k, v]) => `
              <div class="summary-row">
                <span class="summary-label">${k}</span>
                <span class="summary-label-strong">${v}</span>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
    ${navbar("")}
  `;
}

/* ── Mi wallet (99105:43773) ────────────────────────────── */
function screenWallet(state) {
  const cash = { ...findPaymentCard("Molecule/Payment Card/OKY Cash Black") };
  cash.balance = { ...cash.balance, value: state.okyCashBalance.toFixed(2) };
  cash.art = "oky-saldo-card-art.png";

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

  const rows = state.activity.length
    ? state.activity
        .map((entry) =>
          renderHistoryCard({
            key: "oky-cash",
            id: "99135:104411",
            layout: "row",
            icon: { glyph: "fa-coins", weight: "fa-solid" },
            date: entry.date,
            amount: entry.amount,
            meta: { type: "order", note: entry.order },
            chip: { label: "Acreditado", tone: "success", icon: "fa-circle-check" },
          }),
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

      <div class="oky-flow-home-head">
        <h2 class="oky-flow-home-title" style="font-size:16px">ESTE MES</h2>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;width:100%">${rows}</div>
    </div>

    ${navbar("okycash")}
  `;
}

/* ── Detalle de vale ────────────────────────────────────── */
function screenVoucher(state) {
  const product = PRODUCTS[state.params.key];
  const purchase = state.purchases.filter((p) => p.productKey === product.key).slice(-1)[0];

  return `
    ${statusBar()}
    ${titledHeader(product.label)}
    <div class="oky-flow-section">
      <div class="oky-flow-voucher" style="cursor:default">
        <img src="${product.art}" alt="${product.label}" />
        <span class="oky-flow-voucher-badge">1<i class="fa-solid fa-qrcode" aria-hidden="true"></i></span>
      </div>

      <div class="summary-box summary-box-compact" style="width:100%">
        <div class="summary-card">
          <div class="summary-card-body">
            ${
              purchase
                ? `
              <div class="summary-row"><span class="summary-label">Última compra</span><span class="summary-label-strong">${money(purchase.amount)}</span></div>
              <div class="summary-row"><span class="summary-label">OKY Cash usado</span><span class="summary-label-strong">${money(purchase.used)}</span></div>
              <div class="summary-row"><span class="summary-value-success">OKY Cash ganado</span><span class="summary-value-success">+ ${money(purchase.cashback)}</span></div>
            `
                : `<div class="summary-row"><span class="summary-label">Aún no has comprado ${product.label}</span></div>`
            }
            <div class="summary-row summary-row-total">
              <span class="summary-label-strong">Saldo OKY Cash</span>
              <span class="summary-label-strong">${money(state.okyCashBalance)}</span>
            </div>
          </div>
          <div class="summary-cta-row">
            <button class="btn btn-primary summary-btn" data-action="open-pdp" data-product="${product.key}" type="button">
              ${purchase ? "Comprar de nuevo" : "Ver producto"}
            </button>
          </div>
        </div>
      </div>
    </div>
    ${navbar("")}
  `;
}

/* ── Onboarding Contactos (99140:47037) ─────────────────── */
function screenDecision() {
  return `
    <div class="oky-flow-decision">
      <div class="oky-flow-decision-head">${statusBar()}</div>
      <h2 class="oky-flow-decision-title">¿Es para ti o para alguien más?</h2>
      <div class="oky-flow-decision-art">
        <img src="oky-returning-illustration.png" alt="" />
      </div>
      <div class="oky-flow-decision-actions">
        <button class="oky-flow-btn-inverted" data-action="decision-self" type="button">Para mi</button>
        <button class="oky-flow-btn-ghost" data-action="decision-other" type="button">Para alguien más</button>
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
    case "purchase-detail": return screenPurchaseDetail(state);
    case "wallet": return screenWallet(state);
    case "okycash": return screenOkyCash(state);
    case "voucher": return screenVoucher(state);
    default: return screenHome(state);
  }
}

export function mountOkyCashPrototype(root, { userType = "first-time" } = {}) {
  let state = createInitialState(userType);

  function render() {
    const showDecision =
      state.screen === "wallet" && state.userType === "returning" && !state.decisionSeen;

    root.innerHTML = `
      <div class="oky-flow-frame">
        <div class="oky-flow-scroll ${SCROLL_CLASS[state.screen] || ""}">
          ${renderScreen(state)}
        </div>
        ${state.cartOpen ? cartDrawer(state) : ""}
        ${showDecision ? screenDecision() : ""}
      </div>
    `;

    /* Las barras se escriben dentro de la plantilla de cada pantalla
       por comodidad, pero .oky-flow-scroll está posicionado, así que
       ahí dentro un position:absolute se ancla al box que scrollea y
       las barras se movían con el contenido. Se re-parentan al frame,
       que es el contenedor fijo real. */
    const frame = root.querySelector(".oky-flow-frame");
    const scroll = frame.querySelector(".oky-flow-scroll");
    scroll
      .querySelectorAll(".oky-flow-navbar, .oky-flow-savingbar, .oky-flow-cta-bar, .oky-flow-dock")
      .forEach((bar) => frame.appendChild(bar));
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
    if (action === "go:checkout") return go("checkout");

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
      state.okyCashEnabled = !state.okyCashEnabled;
      state.okyCashApplied = state.okyCashEnabled
        ? Math.min(state.okyCashBalance, cartTotal(state))
        : 0;
      return render();
    }

    if (action === "confirm-methods") return goBack();

    if (action === "pay") {
      go("processing", {}, { push: false });
      setTimeout(completePurchase, 1400);
      return;
    }

    if (action === "dismiss-celebration") return go("purchases", {}, { push: false });
    if (action === "open-purchase") return go("purchase-detail", { id: el.dataset.id });
    if (action === "open-voucher") return go("voucher", { key: el.dataset.key });

    if (action === "decision-self" || action === "decision-other") {
      state.decisionSeen = true;
      return render();
    }
  });

  /* Monto del PDP: se parchean solo los nodos afectados para no
     perder el foco del input en cada tecla. */
  root.addEventListener("input", (event) => {
    const amountInput = event.target.closest("[data-action='input-amount']");
    if (amountInput) {
      const product = PRODUCTS[amountInput.dataset.product];
      const raw = Number(String(amountInput.value).replace(/[^\d.]/g, "")) || 0;
      const amount = clamp(raw, 0, product.max);
      state.amounts[product.key] = amount;

      const tier = getTier(amount);
      const cashback = amount * tier.rate;

      amountInput.classList.toggle("input-dinamic-hasvalue", amount > 0);

      const bigAmount = root.querySelector(".middle-card-amount");
      if (bigAmount) bigAmount.textContent = amount;

      const ribbon = root.querySelector(".discount-ribbon-wrap.is-pdp-bottom");
      if (ribbon) {
        ribbon.classList.remove("is-tier-base", "is-tier-promo");
        ribbon.classList.add(tier.ribbon);
        ribbon.querySelector(".discount-ribbon-text").textContent = `Ganas ${Math.round(tier.rate * 100)}%`;
      }

      const bar = root.querySelector(".saving-bar");
      if (bar) {
        bar.classList.toggle("is-tier-promo", tier.bar === "is-tier-promo");
        bar.querySelector(".saving-bar-copy span").innerHTML =
          `Ganas <strong>${money(cashback)}</strong> de <strong>OKY Cash</strong>`;
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
