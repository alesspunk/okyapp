/* ─────────────────────────────────────────────────────────
   OKY Cash — Prototipo clickable end-to-end
   Pages/OKY Cash/Prototype

   Fuente de verdad: Figma "7600 - UX Exploration",
   canvas "Cash Back" (99101:20345). Frames leídos vía MCP:

     Home                   99105:31149
     PDP Lyft               99105:32284
     PDP Nike tier naranja  99105:37017   ($200 → 20%)
     PDP Nike tier aqua     99140:13571   ($201 → 5%)
     Producto Agregado      99140:54432
     Carrito                99105:38191
     Checkout               99105:31768
     Métodos de pago        99105:41588
     Progress Bar           99140:56017
     Success (Lottie)       99140:56018
     Tus compras            99140:56031
     Mi wallet              99105:43773
     Onboarding Contactos   99140:47037

   Reglas del diseño que se respetan aquí:
   · El monto se escribe en un input con label flotante
     "Desde 10 hasta 1,000" — no hay chips ni slider en el PDP.
   · El cashback vive SOLO en el ribbon y el Saving Bar; nunca
     se suma al summary de precio (regla explícita del spec
     frame 99105:32415).
   · Tier: ≤$50 y >$200 → aqua #a8faf5/#00524d con 5%.
     $50–$200 → naranja #ff9800/#663d00 con 20%.
   · Checkout aplica OKY Cash con un CHECKBOX dentro de una fila
     agrupada de método de pago. Es split payment: el chip morado
     es lo que va a la tarjeta, el chip teal lo que sale del saldo.
   · Métodos de pago cambia el monto con un SLIDER teal, con la
     leyenda "$X de $Y · Guardas $Z para después".
   · "Onboarding Contactos" NO es un modal: es una pantalla
     morada #410d86 a pantalla completa, sin scrim ni cerrar.

   Reutiliza sin reimplementar: .pdp-page-* / .checkout-page-* /
   .success-page-* (los mockups HTML), .middle-card-*,
   .brand-item-atom, .summary-box, .discount-ribbon, .saving-bar,
   .payment-method-*, .dual-molecule, .plateu-*, .input-dinamic,
   .bottom-nav, .btn y el molecule Payment Card.
───────────────────────────────────────────────────────── */

import { findPaymentCard, renderPaymentCard } from "./paymentCards";

/* ── Catálogo ────────────────────────────────────────────── */

const PRODUCTS = {
  lyft: {
    key: "lyft",
    label: "Lyft",
    cardTitle: "Lyft Gift Card",
    art: "oky-card-lyft.png",
    min: 10,
    max: 1000,
    defaultAmount: 10,
    legal: false,
  },
  nike: {
    key: "nike",
    label: "Nike",
    cardTitle: "Nike Gift Card",
    art: "oky-card-nike.png",
    min: 10,
    max: 1000,
    defaultAmount: 200,
    legal: true,
  },
};

/* Tier del cashback. Verificado contra los dos frames de Nike:
   $200 → "Ganas 20%" naranja · $201 → "Ganas 5%" aqua. */
function getTier(amount) {
  if (amount > 50 && amount <= 200) {
    return { rate: 0.2, ribbon: "is-tier-promo", bar: "is-tier-promo" };
  }
  return { rate: 0.05, ribbon: "is-tier-base", bar: "" };
}

/* Vales del Wallet. Lyft y Nike son los funcionales; el resto es
   decorativo, como pide el brief. */
const WALLET_VOUCHERS = [
  { key: "krispy", label: "Krispy Kreme", art: "oky-card-krispy.png", count: 1, live: false },
  { key: "underarmour", label: "Under Armour", art: "oky-card-underarmour.png", count: 1, live: false },
  { key: "lyft", label: "Lyft", art: "oky-card-lyft.png", count: 1, live: true },
  { key: "nike", label: "Nike", art: "oky-card-nike.png", count: 1, live: true },
];

const money = (v) => `$${(Number(v) || 0).toFixed(2)}`;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function todayMock(offsetDays = 0) {
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
    /* El saldo del diseño es $56.00 disponible con $36.00 en la card */
    okyCashBalance: returning ? 56 : 20,
    screen: "home",
    params: {},
    history: [],
    amounts: { lyft: PRODUCTS.lyft.defaultAmount, nike: PRODUCTS.nike.defaultAmount },
    cart: null,
    okyCashEnabled: false,
    okyCashApplied: 0,
    purchases: returning
      ? [{ id: "seed", productKey: "lyft", amount: 20, cashback: 1, used: 5, date: todayMock(6) }]
      : [],
    lastPurchaseId: null,
    decisionSeen: false,
  };
}

/* ── Piezas compartidas ─────────────────────────────────── */

function statusBar() {
  return `
    <div class="status-bar">
      <div>9:41</div>
      <div style="display:flex;gap:8px">
        <i class="fa-regular fa-signal" aria-hidden="true"></i>
        <i class="fa-regular fa-wifi" aria-hidden="true"></i>
        <i class="fa-regular fa-battery-full" aria-hidden="true"></i>
      </div>
    </div>
  `;
}

/* Header del PDP/Checkout: back + título vacío + cart 3D con dot */
function pdpHeader({ cart = true } = {}) {
  return `
    <div class="page-header-screen pdp-page-header">
      <button class="header-icon header-icon-light oky-flow-header-icon" data-action="back" type="button" aria-label="Atrás">
        <i class="fa-light fa-arrow-left icon-medium" aria-hidden="true"></i>
      </button>
      <div class="page-header-title page-header-title-empty" aria-hidden="true"></div>
      ${
        cart
          ? `<button class="header-icon header-icon-bitmap header-icon-bitmap-cart" data-action="go:cart" type="button" aria-label="Carrito">
              <img class="header-icon-bitmap-image header-icon-bitmap-cart-image" src="Cart-3d-icon.png" alt="" />
              <span class="header-icon-indicator-dot"></span>
            </button>`
          : `<span class="header-icon header-icon-placeholder" aria-hidden="true"></span>`
      }
    </div>
  `;
}

/* Header con título (Mi wallet / Métodos de pago / Tus compras) */
function titledHeader(title, { action = "" } = {}) {
  return `
    <header class="oky-flow-header">
      <button class="oky-flow-header-icon" data-action="back" type="button" aria-label="Atrás">
        <i class="fa-light fa-arrow-left" aria-hidden="true"></i>
      </button>
      <h1 class="oky-flow-title">${title}</h1>
      ${
        action
          ? `<span class="oky-flow-header-icon" aria-hidden="true"><i class="fa-light ${action}"></i></span>`
          : `<span class="oky-flow-header-icon" aria-hidden="true"></span>`
      }
    </header>
  `;
}

/* Navbar del diseño: Home · Notificaciones · OKY Cash (bitmap) ·
   Ayuda · Menú, con labels. Solo Home y OKY Cash navegan. */
function navbar(active) {
  const item = (key, label, icon, action) => `
    <div class="nav-item ${key === active ? "active" : ""} ${action ? "" : "is-dim"}"
      ${action ? `data-action="${action}" role="button" tabindex="0"` : ""}>
      ${
        key === "okycash"
          ? `<img class="oky-flow-coin" src="oky-cash-coin.png" alt="" />`
          : `<i class="fa-light fa-${icon} icon-medium" aria-hidden="true"></i>`
      }
      <span class="nav-label">${label}</span>
    </div>
  `;

  return `
    <nav class="oky-flow-navbar">
      <div class="bottom-nav">
        ${item("home", "Home", "house", "nav:home")}
        ${item("notif", "Notificaciones", "bell", null)}
        ${item("okycash", "OKY Cash", null, "nav:wallet")}
        ${item("ayuda", "Ayuda", "messages", null)}
        ${item("menu", "Menú", "bars", null)}
      </div>
    </nav>
  `;
}

function savingBar(cashback, tier, { fixed = true } = {}) {
  return `
    <div class="${fixed ? "oky-flow-savingbar" : ""}">
      <div class="saving-bar is-oky-cash ${tier.bar}">
        <div class="saving-bar-copy">
          <span>Ganas <strong>${money(cashback)}</strong> de <strong>OKY Cash</strong></span>
        </div>
      </div>
    </div>
  `;
}

/* ── Home (99105:31149) ─────────────────────────────────── */
function screenHome(state) {
  /* El ribbon del tile refleja el tier del monto actual del producto,
     así el % que se ve aquí es el mismo que aparecerá en el PDP. */
  const tile = (product) => {
    const tier = getTier(state.amounts[product.key]);
    return `
      <button class="oky-flow-tile" data-action="open-pdp" data-product="${product.key}" type="button">
        <span class="brand-item-atom is-medium">
          <span class="brand-item-frame">
            <span class="brand-item-base"><img src="${product.art}" alt="${product.label}" /></span>
          </span>
          <span class="discount-ribbon discount-ribbon-wrap ${tier.ribbon}">
            <span class="discount-ribbon-text token-price-percent">Ganas ${Math.round(tier.rate * 100)}%</span>
          </span>
        </span>
        <span class="oky-flow-tile-label token-product-text">${product.label}</span>
      </button>
    `;
  };

  return `
    ${statusBar()}
    <div class="page-header-screen" style="justify-content:space-between">
      <span class="header-icon header-icon-bitmap" aria-hidden="true">
        <img class="header-icon-bitmap-image" src="Wallet-icon.png" alt="" />
      </span>
      <img class="header-logo" src="logo-oky.svg" alt="OKY" />
      <button class="header-icon header-icon-bitmap header-icon-bitmap-cart" data-action="go:cart" type="button" aria-label="Carrito">
        <img class="header-icon-bitmap-image header-icon-bitmap-cart-image" src="Cart-3d-icon.png" alt="" />
      </button>
    </div>

    <div class="oky-flow-section">
      <div class="input-wrapper">
        <i class="fa-regular fa-magnifying-glass search-icon" aria-hidden="true"></i>
        <input class="input-field search-input search-input-empty" value="" placeholder="Buscar marcas" readonly />
      </div>

      <button class="oky-flow-cash-strip" data-action="nav:wallet" type="button">
        <img src="oky-cash-coin.png" alt="" />
        <span class="oky-flow-cash-strip-copy">
          <span class="oky-flow-cash-strip-amount"><span>$</span><strong>${state.okyCashBalance.toFixed(2)}</strong></span>
          <span class="oky-flow-cash-strip-label">OKY Cash</span>
        </span>
        <span class="btn btn-primary btn-small" style="pointer-events:none">Explora</span>
      </button>

      <p class="promo-strip-heading" style="margin:4px 0 0">Labor Day</p>
      <div class="oky-flow-grid">
        ${tile(PRODUCTS.nike)}
        ${tile(PRODUCTS.lyft)}
      </div>
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
  const added = state.params.added === true;

  const summary = added
    ? `
      <div class="summary-card">
        <div class="summary-card-body">
          <div class="summary-row">
            <span class="summary-label-strong">Subtotal</span>
            <span class="summary-label-strong">${money(amount)}</span>
          </div>
        </div>
        <div class="summary-cta-row double" style="gap:16px">
          <button class="oky-flow-header-icon" data-action="remove-cart" type="button" aria-label="Quitar"
            style="border:1px solid var(--primary-base);border-radius:16px;padding:8px;width:auto;height:auto;color:var(--error-dark)">
            <i class="fa-light fa-trash-alt" aria-hidden="true"></i>
          </button>
          <button class="btn btn-outlined btn-large" data-action="nav:home" type="button" style="flex:1">Seguir comprando</button>
        </div>
        <div class="summary-cta-row">
          <button class="btn btn-primary summary-btn" data-action="go:cart" type="button">Ver carrito</button>
        </div>
      </div>
    `
    : `
      <div class="summary-card">
        <div class="summary-card-body">
          <div class="summary-row">
            <span class="summary-label-strong">Subtotal</span>
            <span class="summary-label-strong">${money(amount)}</span>
          </div>
        </div>
        <div class="summary-cta-row">
          <button class="btn btn-primary summary-btn" data-action="add-to-cart" data-product="${product.key}" type="button">
            <i class="fa-regular fa-plus" aria-hidden="true"></i>Agregar
          </button>
        </div>
      </div>
    `;

  return `
    ${statusBar()}
    ${pdpHeader()}

    <div class="pdp-page-stack" style="padding-top:8px">
      <div class="pdp-page-brand-slot">
        <section class="brand-item-atom is-with-label" aria-label="${product.label}">
          <p class="brand-item-label token-product-text">${product.label}</p>
          <div class="brand-item-frame">
            <div class="brand-item-base"><img src="${product.art}" alt="${product.label}" /></div>
          </div>
        </section>
        <p class="oky-flow-brand-online">Online</p>
      </div>

      <div class="pdp-page-card-slot">
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
                <span class="middle-card-footer-end" aria-hidden="true"></span>
              </div>
            </div>
            <div class="discount-ribbon discount-ribbon-wrap is-pdp-bottom ${tier.ribbon}">
              <span class="discount-ribbon-text token-price-percent">Ganas ${Math.round(tier.rate * 100)}%</span>
            </div>
          </article>
        </section>
      </div>

      <div class="pdp-page-input-slot">
        <div class="input-wrapper">
          <label id="oky-amount-label" class="input-label input-label-dinamic" for="oky-amount">
            Desde ${product.min} hasta ${product.max.toLocaleString("en-US")}
          </label>
          <span class="input-dinamic-prefix" aria-hidden="true">$</span>
          <input id="oky-amount" class="input-field input-dinamic input-dinamic-hasvalue" type="text"
            inputmode="decimal" value="${amount}" data-action="input-amount" data-product="${product.key}"
            aria-labelledby="oky-amount-label" />
        </div>
      </div>

      ${
        product.legal
          ? `<p class="oky-flow-legal"><strong>Disponibilidad limitada</strong> Las gift cards con descuento especial estarán disponibles por tiempo limitado o hasta que se agote el inventario.</p>`
          : ""
      }
    </div>

    <section class="pdp-page-summary-wrap" aria-label="Resumen">
      <div class="summary-box summary-box-compact">${summary}</div>
    </section>

    ${savingBar(cashback, tier)}
    ${navbar("")}
  `;
}

/* ── Carrito (99105:38191) ──────────────────────────────── */
function screenCart(state) {
  if (!state.cart) {
    return `
      ${statusBar()}
      ${titledHeader("Carrito")}
      <div class="oky-flow-section">
        <p class="oky-flow-empty">Tu carrito está vacío.</p>
        <button class="btn btn-outlined btn-large" data-action="nav:home" type="button">Ir a comprar</button>
      </div>
      ${navbar("")}
    `;
  }

  const { amount, cashback, productKey } = state.cart;
  const product = PRODUCTS[productKey];
  const tier = getTier(amount);

  return `
    ${statusBar()}
    ${titledHeader("Carrito")}

    <div class="oky-flow-section">
      <section class="middle-card-shell is-checkout" aria-label="${product.cardTitle}">
        <article class="middle-card-molecule is-egift">
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
              <span class="middle-card-footer-start">Que necesitas saber</span>
              <span class="middle-card-footer-end" aria-hidden="true"></span>
            </div>
          </div>
        </article>
      </section>

      <div class="summary-box summary-box-compact">
        <div class="summary-card">
          <div class="summary-card-body">
            <div class="summary-row summary-row-total">
              <span class="summary-label-strong">TOTAL</span>
              <span class="summary-label-strong">${money(amount)}</span>
            </div>
          </div>
          <div class="summary-cta-row">
            <button class="btn btn-primary summary-btn" data-action="go:checkout" type="button">Ir a pagar</button>
          </div>
        </div>
      </div>
    </div>

    ${savingBar(cashback, tier)}
    ${navbar("")}
  `;
}

/* ── Checkout (99105:31768) ─────────────────────────────── */
function screenCheckout(state) {
  const { amount, cashback, productKey } = state.cart;
  const product = PRODUCTS[productKey];
  const tier = getTier(amount);
  const applied = state.okyCashEnabled ? Math.min(state.okyCashApplied || state.okyCashBalance, amount, state.okyCashBalance) : 0;
  const toCard = Math.max(amount - applied, 0);

  return `
    ${statusBar()}
    <div class="checkout-page-header-wrap page-header-organism is-checkout-overlap">
      ${pdpHeader()}
      <div class="checkout-page-brand-overlap page-header-organism-brand-overlap">
        <div class="brand-item-atom is-with-label">
          <p class="brand-item-label token-product-text">${product.label}</p>
          <div class="brand-item-frame">
            <div class="brand-item-base"><img src="${product.art}" alt="${product.label}" /></div>
          </div>
        </div>
      </div>
    </div>

    <section class="checkout-page-main" style="padding-top:48px">
      <div class="checkout-brand-carrousel-shell">
        <section class="brand-carrousel-organism checkout-brand-carrousel" aria-label="Producto">
          <div class="brand-carrousel-track">
            <div class="brand-carrousel-center">
              <div class="brand-carrousel-center-card">
                <section class="middle-card-shell is-checkout">
                  <article class="middle-card-molecule is-egift">
                    <div class="middle-card-content">
                      <div class="middle-card-main">
                        <p class="middle-card-title">Gift Card</p>
                        <div class="middle-card-center">
                          <div class="middle-card-value">
                            <span class="middle-card-currency">$</span>
                            <p class="middle-card-amount">${amount}</p>
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
              </div>
            </div>
          </div>
        </section>
      </div>

      <section class="checkout-recipient-wrap" aria-label="¿Para quién es?">
        <article class="dual-molecule is-default">
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
      </section>

      <section class="checkout-payment-wrap" aria-label="Método de pago">
        <div class="payment-method-input oky-flow-paygroup">
          <span class="payment-method-label">Método de pago</span>
          <div class="oky-flow-payrow is-first" data-action="open-methods" role="button" tabindex="0">
            <img class="oky-flow-method-art" src="payment-card-logo-visa.png" alt="Visa" />
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
            <button class="oky-flow-header-icon" data-action="open-methods" type="button" aria-label="Editar monto" style="width:24px">
              <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true" style="font-size:16px"></i>
            </button>
          </div>
        </div>
      </section>

      <section class="checkout-summary-wrap" aria-label="Resumen">
        <div class="summary-box summary-box-compact">
          <div class="summary-card">
            <div class="summary-card-body">
              <div class="summary-row summary-row-total">
                <span class="summary-label-strong">TOTAL</span>
                <span class="summary-label-strong">${money(amount)}</span>
              </div>
            </div>
            <div class="summary-cta-row">
              <button class="btn btn-primary summary-btn" data-action="pay" type="button">Comprar</button>
            </div>
          </div>
        </div>
      </section>
    </section>

    <div class="oky-flow-savingbar">
      <div class="saving-bar is-oky-cash ${tier.bar}">
        <div class="saving-bar-copy">
          <span>Compra y gana <strong>${money(cashback)}+</strong> en <strong>OKY Cash</strong></span>
        </div>
      </div>
    </div>
    ${navbar("")}
  `;
}

/* ── Métodos de pago (99105:41588) ──────────────────────── */
function screenMethods(state) {
  const { amount } = state.cart;
  const max = Math.min(state.okyCashBalance, amount);
  const applied = clamp(state.okyCashApplied, 0, max);
  const toCard = Math.max(amount - applied, 0);
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
      <button class="oky-flow-addcard" data-action="noop" type="button">
        <i class="fa-light fa-plus" aria-hidden="true"></i>Agregar tarjeta crédito/débito
      </button>

      <div class="payment-card-stack" style="--payment-card-stack-offset:-144px;margin:0 auto">
        ${renderPaymentCard(visa)}
        ${renderPaymentCard(cash)}
      </div>

      <div class="oky-flow-method-group" style="padding-top:8px">
        <div class="oky-flow-method-row is-selected">
          <span class="oky-flow-radio" aria-hidden="true"><i class="fa-solid fa-circle-dot"></i></span>
          <img class="oky-flow-method-art" src="payment-card-logo-visa.png" alt="Visa" />
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

      <div class="oky-flow-method-row" style="margin-top:8px">
        <span class="oky-flow-radio" aria-hidden="true"><i class="fa-regular fa-circle"></i></span>
        <img class="oky-flow-method-art" src="payment-card-logo-mastercard.png" alt="" />
        <p class="oky-flow-method-name is-regular">**4566</p>
      </div>
    </div>

    <div class="oky-flow-cta-bar">
      <button class="btn btn-primary btn-large" data-action="confirm-methods" type="button" data-role="methods-cta">
        Siguiente - <span data-role="methods-cta-amount">${money(toCard)}</span>
      </button>
    </div>
  `;
}

/* ── Processing (99140:56017) ───────────────────────────── */
function screenProcessing(state) {
  const product = PRODUCTS[state.cart ? state.cart.productKey : "lyft"];
  const rows = [
    { name: "Google Play", time: "7:18 PM" },
    { name: "Nike", time: "7:19 PM" },
    { name: product.label, time: "7:20 PM" },
  ];

  return `
    ${statusBar()}
    ${pdpHeader()}
    <div class="oky-flow-section" style="opacity:0.35">
      <section class="brand-item-atom is-with-label">
        <p class="brand-item-label token-product-text">${product.label}</p>
        <div class="brand-item-frame">
          <div class="brand-item-base"><img src="${product.art}" alt="" /></div>
        </div>
      </section>
    </div>

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
  `;
}

/* ── Tus compras (99140:56031) + Success (99140:56018) ─── */
function screenPurchases(state, { celebrate = false } = {}) {
  const bought = state.purchases
    .slice()
    .reverse()
    .map((p) => {
      const product = PRODUCTS[p.productKey];
      return { key: product.key, art: product.art, label: product.label, count: 1, live: true, id: p.id };
    });

  const list = bought.length
    ? bought
    : [{ key: "lyft", art: PRODUCTS.lyft.art, label: "Lyft", count: 1, live: false }];

  return `
    ${statusBar()}
    <header class="oky-flow-header">
      <button class="oky-flow-header-icon" data-action="back" type="button" aria-label="Atrás">
        <i class="fa-light fa-arrow-left" aria-hidden="true"></i>
      </button>
      <h1 class="oky-flow-title">Tus compras</h1>
      <span class="oky-flow-header-icon" aria-hidden="true"><i class="fa-light fa-receipt"></i></span>
    </header>

    <div class="oky-flow-section" style="padding-top:8px">
      <div class="oky-flow-stack">
        ${list
          .map(
            (v) => `
          <button class="oky-flow-voucher" ${v.id ? `data-action="open-purchase" data-id="${v.id}"` : "disabled"} type="button">
            <img src="${v.art}" alt="${v.label}" />
            <span class="oky-flow-voucher-badge">${v.count}<i class="fa-solid fa-qrcode" aria-hidden="true"></i></span>
          </button>
        `,
          )
          .join("")}
      </div>
    </div>

    <div class="oky-flow-cta-bar">
      <button class="btn btn-outlined btn-large" data-action="nav:wallet" type="button"
        style="display:inline-flex;align-items:center;justify-content:center;gap:8px">
        <img src="oky-wallet-3d.png" alt="" style="width:32px;height:32px;object-fit:contain" />
        Mi Wallet
      </button>
    </div>

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
  const purchase = state.purchases.find((p) => p.id === state.params.id) || state.purchases[state.purchases.length - 1];
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
      <div class="summary-box summary-box-compact">
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
  `;
}

/* ── Mi wallet (99105:43773) ────────────────────────────── */
function screenWallet(state) {
  const cash = { ...findPaymentCard("Molecule/Payment Card/OKY Cash Black") };
  cash.balance = { ...cash.balance, value: state.okyCashBalance.toFixed(2) };
  cash.art = "oky-saldo-card-art.png";

  const filters = ["OKY Cash", "Gift Cards", "OKY Vales", "Servicios", "Recargas"];

  return `
    ${statusBar()}
    ${titledHeader("Mi wallet")}

    <section class="plateu-molecule is-static is-default" aria-label="Filtros">
      <div class="plateu-track is-static">
        ${filters
          .map(
            (f, i) => `
          <div class="plateu-item">
            <div class="plateu-icon-wrap"><img class="plateu-icon" src="${i === 0 ? "oky-cash-coin.png" : `plateu${8 + i}.png`}" alt="" /></div>
            ${i === 0 ? `<span class="plateu-chip is-outlined">${f}</span>` : `<span class="plateu-label">${f}</span>`}
          </div>
        `,
          )
          .join("")}
      </div>
    </section>

    <div class="oky-flow-section" style="gap:16px">
      <div class="oky-flow-section-head"><i class="fa-solid fa-wallet"></i>OKY CASH<i class="fa-solid fa-chevron-down"></i></div>
      <div style="display:flex;justify-content:center">${renderPaymentCard(cash)}</div>

      <div class="oky-flow-section-head"><i class="fa-solid fa-gift"></i>giftcards<i class="fa-solid fa-chevron-down"></i></div>
      <div class="oky-flow-stack">
        ${WALLET_VOUCHERS.map(
          (v) => `
          <button class="oky-flow-voucher" ${v.live ? `data-action="open-voucher" data-key="${v.key}"` : "disabled"} type="button">
            <img src="${v.art}" alt="${v.label}" />
            <span class="oky-flow-voucher-badge">${v.count}<i class="fa-solid fa-qrcode" aria-hidden="true"></i></span>
          </button>
        `,
        ).join("")}
      </div>
      <div style="display:flex;justify-content:center">
        <button class="btn btn-primary btn-small" data-action="go:purchases" type="button">Ver más</button>
      </div>
    </div>

    ${navbar("okycash")}
  `;
}

/* ── Detalle de vale (Lyft / Nike) ──────────────────────── */
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

      <div class="summary-box summary-box-compact">
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

const SCROLL_CLASS = {
  home: "has-nav",
  pdp: "has-nav-bar",
  cart: "has-nav-bar",
  checkout: "has-nav-bar",
  methods: "has-cta-bar",
  purchases: "has-cta-bar",
  success: "has-cta-bar",
  wallet: "has-nav",
};

function renderScreen(state) {
  switch (state.screen) {
    case "home": return screenHome(state);
    case "pdp": return screenPdp(state);
    case "cart": return screenCart(state);
    case "checkout": return screenCheckout(state);
    case "methods": return screenMethods(state);
    case "processing": return screenProcessing(state);
    case "success": return screenPurchases(state, { celebrate: true });
    case "purchases": return screenPurchases(state);
    case "purchase-detail": return screenPurchaseDetail(state);
    case "wallet": return screenWallet(state);
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
        ${showDecision ? screenDecision() : ""}
      </div>
    `;
  }

  function go(screen, params = {}, { push = true } = {}) {
    if (push) state.history.push({ screen: state.screen, params: state.params });
    state.screen = screen;
    state.params = params;
    render();
  }

  function goBack() {
    const prev = state.history.pop();
    if (!prev) return go("home", {}, { push: false });
    state.screen = prev.screen;
    state.params = prev.params;
    render();
  }

  function completePurchase() {
    const { amount, cashback, productKey } = state.cart;
    const used = state.okyCashEnabled ? clamp(state.okyCashApplied, 0, Math.min(state.okyCashBalance, amount)) : 0;
    const id = `p-${Date.now()}`;

    state.purchases.push({ id, productKey, amount, cashback, used, date: todayMock(0) });
    state.okyCashBalance = state.okyCashBalance - used + cashback;
    state.lastPurchaseId = id;
    state.cart = null;
    state.okyCashEnabled = false;
    state.okyCashApplied = 0;
    state.history = [];
    go("success", {}, { push: false });
  }

  root.addEventListener("click", (event) => {
    const el = event.target.closest("[data-action]");
    if (!el || el.disabled) return;
    const action = el.dataset.action;

    if (action === "noop") return;
    if (action === "back") return goBack();
    if (action === "nav:home") return go("home");
    if (action === "nav:wallet") return go("wallet");
    if (action === "go:cart") return go("cart");
    if (action === "go:checkout") return go("checkout");
    if (action === "go:purchases") return go("purchases");

    if (action === "open-pdp") return go("pdp", { product: el.dataset.product });

    if (action === "add-to-cart") {
      const product = PRODUCTS[el.dataset.product];
      const amount = state.amounts[product.key];
      const tier = getTier(amount);
      state.cart = { productKey: product.key, amount, cashback: amount * tier.rate };
      return go("pdp", { product: product.key, added: true }, { push: false });
    }

    if (action === "remove-cart") {
      state.cart = null;
      return go("pdp", { product: state.params.product }, { push: false });
    }

    if (action === "open-methods") {
      if (!state.okyCashEnabled) {
        state.okyCashEnabled = true;
        state.okyCashApplied = Math.min(state.okyCashBalance, state.cart.amount);
      }
      return go("methods");
    }

    if (action === "toggle-okycash") {
      state.okyCashEnabled = !state.okyCashEnabled;
      state.okyCashApplied = state.okyCashEnabled
        ? Math.min(state.okyCashBalance, state.cart.amount)
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

  /* Monto del PDP: patch puntual para no perder el foco al teclear. */
  root.addEventListener("input", (event) => {
    const amountInput = event.target.closest("[data-action='input-amount']");
    if (amountInput) {
      const product = PRODUCTS[amountInput.dataset.product];
      const raw = Number(String(amountInput.value).replace(/[^\d.]/g, "")) || 0;
      const amount = clamp(raw, 0, product.max);
      state.amounts[product.key] = amount;

      const tier = getTier(amount);
      const cashback = amount * tier.rate;

      const bigAmount = root.querySelector(".middle-card-amount");
      if (bigAmount) bigAmount.textContent = amount;

      const ribbon = root.querySelector(".discount-ribbon-wrap");
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

      root.querySelectorAll(".summary-row .summary-label-strong").forEach((node) => {
        if (node.textContent.trim().startsWith("$")) node.textContent = money(amount);
      });
      return;
    }

    const slider = event.target.closest("[data-action='slide-okycash']");
    if (slider) {
      const max = Math.min(state.okyCashBalance, state.cart.amount);
      const applied = clamp(Number(slider.value) || 0, 0, max);
      state.okyCashApplied = applied;
      state.okyCashEnabled = applied > 0;

      const keep = Math.max(state.okyCashBalance - applied, 0);
      slider.parentElement.style.setProperty("--oky-cash-progress", `${max ? (applied / max) * 100 : 0}%`);
      const cashChip = root.querySelector(".oky-flow-method-row.is-cash .oky-flow-chip.is-cash");
      if (cashChip) cashChip.textContent = money(applied);
      const toCard = Math.max(state.cart.amount - applied, 0);
      const cardChip = root.querySelector(".oky-flow-method-row.is-selected .oky-flow-chip.is-card");
      if (cardChip) cardChip.textContent = money(toCard);
      const ctaAmount = root.querySelector("[data-role='methods-cta-amount']");
      if (ctaAmount) ctaAmount.textContent = money(toCard);
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
