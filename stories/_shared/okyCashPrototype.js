/* ─────────────────────────────────────────────────────────
   OKY Cash — Prototipo clickable end-to-end
   Pages/OKY Cash/Prototype

   Fuente de verdad pedida: Figma "7600 - UX Exploration". El MCP de
   Figma se desconectó durante la construcción de este prototipo y no
   pudo reautenticarse (sesión no interactiva) — no se pudo leer NINGÚN
   frame de ese archivo (Home, PDP Lyft/Nike, modal returning-user,
   onboarding first-time). Este módulo se construyó 100% contra
   Storybook (componentes y tokens ya existentes en este repo) más
   criterio de producto para lo que solo existe en ese Figma. Cada
   supuesto de contenido/copy que normalmente vendría de Figma está
   marcado explícitamente con "SUPUESTO" en un comentario cercano —
   son los puntos a validar primero contra el diseño real.

   Reutiliza (sin reimplementar):
     - .mars-mobile shell / .status-bar          → stories/mars.css
     - .bottom-nav / .nav-item                    → Organisms/Navigation
     - .payment-method-input pattern (checkout)   → checkout-page.html
     - .summary-box / .summary-row                → Organisms/SummaryBox
     - Payment Card (OKY Cash Teal)                → _shared/paymentCards.js
     - History Card (layout "row")                 → _shared/historyCards.js
     - Super Ribbon (types normal/oky)              → Atoms/SuperRibbon
     - Saving Bar (+ nuevo modifier is-tier-2)      → Molecules/SavingBar
     - Modal centrado (header/close/botones)        → Molecules/Modal
   Nuevo (sin equivalente en el repo, todo bajo prefijo oky-proto-*):
     shell de teléfono, tiles de Home/Wallet, chips de monto, filas de
     dinero, pantalla de success, modal de returning-user.
───────────────────────────────────────────────────────── */

import { findPaymentCard, renderPaymentCard } from "./paymentCards";
import { renderHistoryCard } from "./historyCards";

/* ── Mock data ───────────────────────────────────────────── */

/* SUPUESTO: no hay asset de Lyft en el repo y no se pudo exportar uno
   de Figma (MCP desconectado) → placeholder de marca en texto/color
   sólido en vez de inventar un isotipo. Nike sí usa el asset real
   images/nike.png que ya existía en el repo. */
const PRODUCTS = {
  lyft: {
    key: "lyft",
    label: "Lyft",
    tagline: "Viajes por Guatemala",
    hasLogoAsset: false,
    presetAmounts: [10, 20, 30],
    cashbackRate: () => 0.1,
    tiered: false,
  },
  nike: {
    key: "nike",
    label: "Nike",
    tagline: "Gift Card digital",
    hasLogoAsset: true,
    logoSrc: "nike.png",
    presetAmounts: [25, 50, 100, 150, 250],
    cashbackRate: (amount) => getNikeTier(amount).rate,
    tiered: true,
  },
};

/* SUPUESTO — rangos y porcentajes de cashback de Nike (Figma indicaba
   solo los rangos $0-50 / $50-200 / >$200 y "el color debe cambiar",
   no los porcentajes exactos). Tier 1 y 3 comparten el aqua default
   del sistema; tier 2 usa el nuevo modifier morado. */
function getNikeTier(amount) {
  if (amount > 50 && amount <= 200) {
    return { tier: 2, rate: 0.15, ribbonType: "oky", barModifier: "is-tier-2", label: "Nivel promocional" };
  }
  if (amount > 200) {
    return { tier: 3, rate: 0.05, ribbonType: "normal", barModifier: "", label: "Fuera del rango promocional" };
  }
  return { tier: 1, rate: 0.05, ribbonType: "normal", barModifier: "", label: "Nivel base" };
}

const OKY_CASH_CHIP_AMOUNTS = [5, 10, 15, 20];

/* Vales decorativos del Wallet — no interactivos, solo para que la
   pantalla no se vea vacía. Assets ya existentes en /images. */
const DECORATIVE_WALLET_ITEMS = [
  { key: "starbucks", label: "Starbucks", image: "starbucks.webp" },
  { key: "target", label: "Target", image: "target.webp" },
];

function formatMoney(value) {
  const n = Number(value) || 0;
  return `$${n.toFixed(2)}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function todayMock(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  return `${String(d.getDate()).padStart(2, "0")} / ${months[d.getMonth()]} / ${d.getFullYear()}`;
}

/* ── Estado ──────────────────────────────────────────────── */

function createInitialState(userType) {
  const isReturning = userType === "returning";

  return {
    userType,
    okyCashBalance: isReturning ? 32.4 : 20,
    screen: "home",
    screenParams: {},
    history: [],
    onboardingDismissed: false,
    returningModalSeen: false,
    pdpAmount: { lyft: 10, nike: 100 },
    cart: null,
    okyCashApplied: 0,
    purchases: isReturning
      ? [
          {
            id: "p-seed-1",
            productKey: "lyft",
            merchant: "Lyft",
            amount: 20,
            cashbackEarned: 2,
            okyCashUsed: 5,
            date: todayMock(6),
            status: "Completado",
          },
        ]
      : [],
    lastPurchaseId: null,
  };
}

function renderTopbar({ title, showBack }) {
  return `
    <header class="oky-proto-topbar">
      ${
        showBack
          ? `<button class="oky-proto-back" data-action="back" type="button" aria-label="Atrás">
              <i class="fa-light fa-arrow-left" aria-hidden="true"></i>
            </button>`
          : `<span class="oky-proto-back" aria-hidden="true"></span>`
      }
      <h1 class="oky-proto-topbar-title">${title}</h1>
      <span class="oky-proto-back" aria-hidden="true"></span>
    </header>
  `;
}

function renderBottomNav(state) {
  const items = [
    { key: "home", label: "Inicio", icon: "home", action: "nav:home" },
    { key: "canje", label: "Canje", icon: "map", action: null },
    { key: "wallet", label: "Wallet", icon: "wallet", action: "nav:wallet", isKit: true },
    { key: "ayuda", label: "Ayuda", icon: "messages", action: null },
    { key: "menu", label: "Menú", icon: "bars", action: null },
  ];

  const activeKey = state.screen === "wallet" || state.screen === "wallet-detail" ? "wallet" : state.screen === "home" ? "home" : "";

  return `
    <nav class="bottom-nav">
      ${items
        .map(
          (item) => `
        <div
          class="nav-item ${item.key === activeKey ? "active" : ""} ${item.action ? "" : "is-inert"}"
          ${item.action ? `data-action="${item.action}" role="button" tabindex="0"` : ""}
          style="${item.action ? "cursor:pointer" : "opacity:0.55"}"
        >
          <i class="${item.isKit ? "fak fa-kit" : "fa-light"} fa-${item.icon} icon-medium" aria-hidden="true"></i>
          <span class="nav-label">${item.label}</span>
        </div>
      `,
        )
        .join("")}
    </nav>
  `;
}

/* ── Pantalla: Home ──────────────────────────────────────── */
function screenHome(state) {
  /* SUPUESTO: no se pudo leer el frame de Home (99135:106016) ni el de
     onboarding first-time (99140:54432). El banner de abajo resume los
     4 puntos que pediste poder demostrar; el copy exacto es mío. */
  const onboarding =
    state.userType === "first-time" && !state.onboardingDismissed
      ? `
    <div class="toast-banner toast-banner-info oky-proto-onboarding" style="align-items:flex-start">
      <span class="fa-icon toast-banner-icon icon-main-info" aria-hidden="true">
        <i class="fa-regular fa-circle-info"></i>
      </span>
      <div class="toast-banner-stack">
        <p class="toast-banner-message" style="font-weight:700">¿Qué es OKY Cash?</p>
        <p class="toast-banner-message">
          Es el saldo que ganas al comprar. El % de cashback puede cambiar según el monto —
          lo vas a ver en vivo en el producto de Nike. Usa tu saldo en el checkout de tu
          próxima compra.
        </p>
      </div>
      <button class="toast-banner-close" data-action="dismiss-onboarding" type="button" aria-label="Cerrar">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>
  `
      : "";

  return `
    ${renderTopbar({ title: "Hola 👋", showBack: false })}
    <div class="oky-proto-scroll">
      <div class="oky-proto-section">
        ${onboarding}
        <div class="oky-proto-money-row" style="background:var(--white);border:1px solid var(--border-main);border-radius:14px;padding:12px 14px">
          <span style="display:flex;align-items:center;gap:8px">
            <i class="fak fa-kit fa-okysaldo" aria-hidden="true" style="font-size:18px;color:var(--primary-main)"></i>
            Saldo OKY Cash
          </span>
          <strong>${formatMoney(state.okyCashBalance)}</strong>
        </div>
        <p class="oky-proto-section-label">Comprar</p>
        <div class="oky-proto-product-grid">
          ${renderProductTile(PRODUCTS.lyft)}
          ${renderProductTile(PRODUCTS.nike)}
        </div>
      </div>
    </div>
    ${renderBottomNav(state)}
  `;
}

function renderProductTile(product) {
  const media = product.hasLogoAsset
    ? `<img src="${product.logoSrc}" alt="${product.label}" />`
    : `<span>${product.label}</span>`;

  return `
    <button class="oky-proto-product-tile" data-action="open-pdp" data-product="${product.key}" type="button">
      <span class="oky-proto-product-media ${product.hasLogoAsset ? "" : "is-lyft-placeholder"}">${media}</span>
      <span class="oky-proto-product-body">
        <span class="oky-proto-product-name">${product.label}</span>
        <span class="oky-proto-product-sub">${product.tagline}</span>
      </span>
    </button>
  `;
}

/* ── Pantalla: PDP ───────────────────────────────────────── */
function screenPdp(state) {
  const product = PRODUCTS[state.screenParams.product];
  const amount = state.pdpAmount[product.key];
  const cashback = amount * product.cashbackRate(amount);

  const hero = product.hasLogoAsset
    ? `<div class="oky-proto-pdp-hero"><img src="${product.logoSrc}" alt="${product.label}" /></div>`
    : `<div class="oky-proto-pdp-hero is-lyft-placeholder"><span>Lyft</span></div>`;

  const tierBlock = product.tiered
    ? (() => {
        const tier = getNikeTier(amount);
        return `
        <div class="super-ribbon super-ribbon-type-${tier.ribbonType}">
          <span class="super-ribbon-icon"><i class="fa-solid fa-tags" aria-hidden="true"></i></span>
          <span class="super-ribbon-text">Ganas ${Math.round(tier.rate * 100)}% en OKY Cash · ${tier.label}</span>
        </div>
        <p class="oky-proto-tier-caption">
          $0–$50 → 5% · $50–$200 → 15% · más de $200 → 5%. Cambia el monto arriba y mira el ribbon y la barra de abajo.
        </p>
      `;
      })()
    : "";

  return `
    ${renderTopbar({ title: product.label, showBack: true })}
    <div class="oky-proto-scroll">
      ${hero}
      <div class="oky-proto-section">
        <h2 class="oky-proto-pdp-title">${product.label} ${product.tiered ? "Gift Card" : ""}</h2>
        <p class="oky-proto-pdp-price">${formatMoney(amount)}</p>

        <p class="oky-proto-section-label">Selecciona un monto</p>
        <div class="oky-proto-amount-row">
          ${product.presetAmounts
            .map(
              (value) => `
            <button
              class="oky-proto-amount-chip ${value === amount ? "is-active" : ""}"
              data-action="select-amount"
              data-product="${product.key}"
              data-amount="${value}"
              type="button"
            >${formatMoney(value)}</button>
          `,
            )
            .join("")}
        </div>

        ${tierBlock}

        <div class="oky-proto-cashback-line">
          <i class="fa-solid fa-coins" aria-hidden="true"></i>
          Ganas ${formatMoney(cashback)} en OKY Cash con esta compra
        </div>
      </div>
    </div>

    ${
      product.tiered
        ? `<div class="saving-bar ${getNikeTier(amount).barModifier}">
            <div class="saving-bar-copy">
              <i class="fa-solid fa-tags" aria-hidden="true"></i>
              <span>Vas ganando ${formatMoney(cashback)} en OKY Cash</span>
            </div>
          </div>`
        : ""
    }

    <div class="oky-proto-pdp-footer">
      <button class="btn btn-primary btn-large" style="width:100%" data-action="add-to-cart" data-product="${product.key}" type="button">
        Agregar · ${formatMoney(amount)}
      </button>
    </div>
  `;
}

/* ── Pantalla: Cart ──────────────────────────────────────── */
function screenCart(state) {
  const cart = state.cart;

  if (!cart) {
    return `
      ${renderTopbar({ title: "Carrito", showBack: true })}
      <div class="oky-proto-scroll">
        <div class="oky-proto-section">
          <p class="oky-proto-available-note">Tu carrito está vacío.</p>
          <button class="btn btn-outlined btn-large" data-action="nav:home" type="button">Ir a comprar</button>
        </div>
      </div>
      ${renderBottomNav(state)}
    `;
  }

  const product = PRODUCTS[cart.productKey];

  return `
    ${renderTopbar({ title: "Carrito", showBack: true })}
    <div class="oky-proto-scroll">
      <div class="oky-proto-section">
        <div class="oky-proto-money-row" style="border-bottom:1px solid var(--divider);padding-bottom:12px">
          <span>${product.label}</span>
          <strong>${formatMoney(cart.amount)}</strong>
        </div>
        <div class="oky-proto-money-row is-success">
          <span>Cashback que ganarás</span>
          <span>+ ${formatMoney(cart.cashback)}</span>
        </div>
        <div class="oky-proto-money-row is-muted">
          <span>Saldo OKY Cash disponible</span>
          <span>${formatMoney(state.okyCashBalance)}</span>
        </div>
      </div>
    </div>
    <div class="oky-proto-pdp-footer">
      <button class="btn btn-primary btn-large" style="width:100%" data-action="go:checkout" type="button">
        Continuar a Checkout
      </button>
    </div>
  `;
}

/* ── Pantalla: Checkout ──────────────────────────────────── */
function screenCheckout(state) {
  const cart = state.cart;
  const product = PRODUCTS[cart.productKey];
  const applied = state.okyCashApplied;
  const remaining = Math.max(cart.amount - applied, 0);

  return `
    ${renderTopbar({ title: "Checkout", showBack: true })}
    <div class="oky-proto-scroll">
      <div class="oky-proto-section">
        <p class="oky-proto-section-label">Producto</p>
        <div class="oky-proto-money-row">
          <span>${product.label}</span>
          <strong>${formatMoney(cart.amount)}</strong>
        </div>

        <p class="oky-proto-section-label">Método de pago</p>
        <div class="oky-proto-payment-row" data-action="open-payment-methods" role="button" tabindex="0">
          <div class="payment-method-input">
            <span class="payment-method-label">Usar OKY Cash</span>
            <div class="payment-method-control">
              <span class="fa-icon fa-icon-md payment-method-icon" aria-hidden="true">
                <i class="fak fa-kit fa-okysaldo payment-method-icon-glyph"></i>
              </span>
              <span class="payment-method-copy">Saldo OKY · disponible ${formatMoney(state.okyCashBalance)}</span>
              <span class="payment-method-chip">${applied > 0 ? `-${formatMoney(applied)}` : "Aplicar"}</span>
              ${
                applied > 0
                  ? `<button class="payment-method-action" data-action="remove-oky" type="button" aria-label="Quitar OKY Cash">
                      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
                    </button>`
                  : `<span class="fa-icon fa-icon-md" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>`
              }
            </div>
          </div>
        </div>

        <div class="summary-box summary-box-compact summary-box-saving" style="margin-top:8px">
          <div class="summary-card">
            <div class="summary-card-body">
              <div class="summary-row">
                <span class="summary-label-strong">${product.label}</span>
                <span class="summary-label-strong">${formatMoney(cart.amount)}</span>
              </div>
              ${
                applied > 0
                  ? `<div class="summary-row">
                      <span class="summary-value-success">OKY Cash aplicado</span>
                      <span class="summary-value-success">-${formatMoney(applied)}</span>
                    </div>`
                  : ""
              }
              <div class="summary-row summary-row-total">
                <span class="summary-label-strong">TOTAL A PAGAR</span>
                <span class="summary-label-strong">${formatMoney(remaining)}</span>
              </div>
            </div>
            ${
              applied > 0
                ? `<div class="summary-savings-row">
                    <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
                    <span>Usando ${formatMoney(applied)} de tu saldo OKY Cash</span>
                  </div>`
                : ""
            }
          </div>
        </div>
      </div>
    </div>
    <div class="oky-proto-pdp-footer">
      <button class="btn btn-primary btn-large" style="width:100%" data-action="pay-now" type="button">
        Pagar ${formatMoney(remaining)}
      </button>
    </div>
  `;
}

/* ── Pantalla: Payment Methods (editar monto de OKY Cash) ─ */
function screenPaymentMethods(state) {
  const cart = state.cart;
  const maxApplicable = Math.min(state.okyCashBalance, cart.amount);
  const draft = state.screenParams.draftAmount ?? state.okyCashApplied;

  return `
    ${renderTopbar({ title: "Usar OKY Cash", showBack: true })}
    <div class="oky-proto-scroll">
      <div class="oky-proto-section">
        <p class="oky-proto-available-note">
          Disponible: <strong>${formatMoney(state.okyCashBalance)}</strong> · Total de la compra: ${formatMoney(cart.amount)}
        </p>

        <p class="oky-proto-section-label">Monto a usar</p>
        <div class="oky-proto-amount-row">
          ${OKY_CASH_CHIP_AMOUNTS.map((value) => {
            const disabled = value > maxApplicable;
            const active = Math.abs(value - draft) < 0.001;
            return `
              <button
                class="oky-proto-amount-chip ${active ? "is-active" : ""}"
                data-action="set-oky-draft"
                data-amount="${value}"
                type="button"
                ${disabled ? "disabled style=\"opacity:0.4;cursor:not-allowed\"" : ""}
              >${formatMoney(value)}</button>
            `;
          }).join("")}
        </div>

        <p class="oky-proto-section-label">O ingresa un monto</p>
        <div class="oky-proto-custom-input">
          <span>$</span>
          <input
            type="number"
            min="0"
            max="${maxApplicable}"
            step="0.5"
            value="${draft.toFixed(2)}"
            data-action="input-oky-draft"
            inputmode="decimal"
          />
        </div>

        <div class="oky-proto-money-row is-total" style="border-top:0">
          <span>Total restante</span>
          <span data-role="remaining-total">${formatMoney(Math.max(cart.amount - draft, 0))}</span>
        </div>
      </div>
    </div>
    <div class="oky-proto-pdp-footer" style="display:flex;flex-direction:column;gap:8px">
      <button class="btn btn-primary btn-large" style="width:100%" data-action="confirm-oky-draft" data-role="confirm-oky-btn" type="button">
        Aplicar ${formatMoney(draft)}
      </button>
      <button class="btn btn-outlined btn-large" style="width:100%" data-action="clear-oky-draft" type="button">
        No usar OKY Cash
      </button>
    </div>
  `;
}

/* ── Pantalla: Processing / Success ──────────────────────── */
function screenProcessing() {
  return `
    ${renderTopbar({ title: "Procesando", showBack: false })}
    <div class="oky-proto-scroll">
      <div class="oky-proto-section" style="align-items:center;padding-top:64px">
        <i class="fa-solid fa-spinner fa-spin" style="font-size:32px;color:var(--primary-main)" aria-hidden="true"></i>
        <p class="oky-proto-success-sub">Procesando tu pago…</p>
      </div>
    </div>
  `;
}

function screenSuccess(state) {
  const purchase = state.purchases.find((p) => p.id === state.lastPurchaseId);
  const product = PRODUCTS[purchase.productKey];

  return `
    ${renderTopbar({ title: "", showBack: false })}
    <div class="oky-proto-scroll">
      <div class="oky-proto-section" style="align-items:center;text-align:center">
        <div class="oky-proto-success-icon"><i class="fa-solid fa-check" aria-hidden="true"></i></div>
        <h2 class="oky-proto-success-title">¡Compra completada!</h2>
        <p class="oky-proto-success-sub">${product.label} · ${formatMoney(purchase.amount)}</p>
        ${
          purchase.cashbackEarned > 0
            ? `<span class="oky-proto-earned-badge">
                <i class="fa-solid fa-coins" aria-hidden="true"></i>
                + ${formatMoney(purchase.cashbackEarned)} en OKY Cash
              </span>`
            : ""
        }
        <p class="oky-proto-available-note">Tu nuevo saldo OKY Cash es ${formatMoney(state.okyCashBalance)}.</p>
      </div>
    </div>
    <div class="oky-proto-pdp-footer" style="display:flex;flex-direction:column;gap:8px">
      <button class="btn btn-primary btn-large" style="width:100%" data-action="view-purchase" type="button">
        Ver mi compra
      </button>
      <button class="btn btn-outlined btn-large" style="width:100%" data-action="nav:home" type="button">
        Volver al inicio
      </button>
    </div>
  `;
}

/* ── Pantalla: Purchases ─────────────────────────────────── */
function screenPurchases(state) {
  const empty = state.purchases.length === 0;

  return `
    ${renderTopbar({ title: "Mis compras", showBack: true })}
    <div class="oky-proto-scroll">
      <div class="oky-proto-section">
        ${
          empty
            ? `<p class="oky-proto-available-note">Todavía no tienes compras. Ve a Home y compra algo para verlo aquí.</p>`
            : state.purchases
                .slice()
                .reverse()
                .map((purchase) => {
                  const product = PRODUCTS[purchase.productKey];
                  const card = {
                    key: purchase.id,
                    id: purchase.id,
                    layout: "row",
                    icon: { glyph: product.key === "lyft" ? "fa-car-side" : "fa-shoe-prints", weight: "fa-light" },
                    date: purchase.date,
                    amount: formatMoney(purchase.amount),
                    meta: {
                      type: "stack",
                      brand: purchase.merchant,
                      note: `OKY Cash usado ${formatMoney(purchase.okyCashUsed)} · Ganaste ${formatMoney(purchase.cashbackEarned)}`,
                    },
                    chip: { label: purchase.status, tone: "success", icon: "fa-circle-check" },
                  };

                  return `
                    <button class="oky-proto-payment-row" data-action="open-purchase" data-id="${purchase.id}" type="button">
                      ${renderHistoryCard(card)}
                    </button>
                  `;
                })
                .join("")
        }
      </div>
    </div>
    ${renderBottomNav(state)}
  `;
}

function screenPurchaseDetail(state) {
  const purchase = state.purchases.find((p) => p.id === state.screenParams.id);
  const product = PRODUCTS[purchase.productKey];

  const rows = [
    ["Comercio", purchase.merchant],
    ["Producto", `${product.label}${product.tiered ? " Gift Card" : ""}`],
    ["Valor", formatMoney(purchase.amount)],
    ["Fecha", purchase.date],
    ["Estado", purchase.status],
    ["OKY Cash usado", formatMoney(purchase.okyCashUsed)],
    ["OKY Cash ganado", `+ ${formatMoney(purchase.cashbackEarned)}`],
  ];

  return `
    ${renderTopbar({ title: "Detalle de compra", showBack: true })}
    <div class="oky-proto-scroll">
      <div class="oky-proto-section">
        ${rows
          .map(
            ([label, value]) => `
          <div class="oky-proto-money-row">
            <span class="is-muted" style="color:var(--text-secondary)">${label}</span>
            <strong>${value}</strong>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;
}

/* ── Pantalla: Wallet ────────────────────────────────────── */
function screenWallet(state) {
  const okyCashCard = { ...findPaymentCard("Molecule/Payment Card/OKY Cash Teal") };
  okyCashCard.balance = { ...okyCashCard.balance, value: state.okyCashBalance.toFixed(2) };
  okyCashCard.cta = null; // el CTA interno de la molécula no tiene ruta propia en este prototipo

  return `
    ${renderTopbar({ title: "Wallet", showBack: false })}
    <div class="oky-proto-scroll">
      <div class="oky-proto-section">
        <div style="display:flex;justify-content:center">${renderPaymentCard(okyCashCard)}</div>

        <p class="oky-proto-section-label">Tus vales</p>
        <div class="oky-proto-wallet-grid">
          ${renderWalletTile(PRODUCTS.lyft, state)}
          ${renderWalletTile(PRODUCTS.nike, state)}
          ${DECORATIVE_WALLET_ITEMS.map(
            (item) => `
            <button class="oky-proto-wallet-tile" type="button" disabled>
              <span class="oky-proto-wallet-tile-media"><img src="${item.image}" alt="${item.label}" /></span>
              <span class="oky-proto-wallet-tile-name">${item.label}</span>
            </button>
          `,
          ).join("")}
        </div>

        <button class="btn btn-outlined btn-large" style="width:100%;margin-top:8px" data-action="go:purchases" type="button">
          Ver mis compras
        </button>
      </div>
    </div>
    ${renderBottomNav(state)}
  `;
}

function renderWalletTile(product, state) {
  const media = product.hasLogoAsset
    ? `<img src="${product.logoSrc}" alt="${product.label}" />`
    : `<span>${product.label}</span>`;

  return `
    <button class="oky-proto-wallet-tile" data-action="open-wallet-item" data-key="${product.key}" type="button">
      <span class="oky-proto-wallet-tile-media ${product.hasLogoAsset ? "" : "is-lyft-placeholder"}">${media}</span>
      <span class="oky-proto-wallet-tile-name">${product.label}</span>
    </button>
  `;
}

function screenWalletDetail(state) {
  const product = PRODUCTS[state.screenParams.key];
  const purchase = state.purchases.filter((p) => p.productKey === product.key).slice(-1)[0];

  return `
    ${renderTopbar({ title: product.label, showBack: true })}
    <div class="oky-proto-scroll">
      <div class="oky-proto-section">
        ${
          purchase
            ? `
          <div class="oky-proto-money-row"><span style="color:var(--text-secondary)">Última compra</span><strong>${formatMoney(purchase.amount)}</strong></div>
          <div class="oky-proto-money-row"><span style="color:var(--text-secondary)">OKY Cash usado</span><strong>${formatMoney(purchase.okyCashUsed)}</strong></div>
          <div class="oky-proto-money-row is-success"><span>OKY Cash ganado</span><span>+ ${formatMoney(purchase.cashbackEarned)}</span></div>
          <div class="oky-proto-money-row"><span style="color:var(--text-secondary)">Saldo OKY Cash actual</span><strong>${formatMoney(state.okyCashBalance)}</strong></div>
        `
            : `<p class="oky-proto-available-note">Aún no has comprado ${product.label}. Cómpralo para ganar OKY Cash.</p>`
        }
      </div>
    </div>
    <div class="oky-proto-pdp-footer">
      <button class="btn btn-primary btn-large" style="width:100%" data-action="open-pdp" data-product="${product.key}" type="button">
        ${purchase ? "Comprar de nuevo" : "Ver producto"}
      </button>
    </div>
  `;
}

/* ── Modal: Returning user ───────────────────────────────── */
/* SUPUESTO: no se pudo leer el frame 99140:47037. Estructura y copy
   ("¿Este vale es para ti?") son una interpretación razonable del
   objetivo descrito — confirmar/comunicar para quién es el beneficio —
   construida con los mismos átomos del Modal Centered (header, close,
   botones) ya presentes en el repo. */
function renderReturningModal(state) {
  return `
    <div class="oky-proto-returning-modal" style="position:absolute;inset:0;z-index:30;display:flex;align-items:center;justify-content:center">
      <div class="modal-molecule-backdrop"></div>
      <section class="modal-sheet is-centered" style="position:relative">
        <div class="modal-centered-body">
          <div class="modal-sheet-header">
            <div class="modal-sheet-header-main"></div>
            <button class="header-icon modal-sheet-close" data-action="close-returning-modal" type="button" aria-label="Cerrar">
              <span class="fa-icon fa-icon-lg" aria-hidden="true"><i class="fa-light fa-times"></i></span>
            </button>
          </div>
          <div class="oky-proto-returning-icon"><i class="fa-solid fa-wallet" aria-hidden="true"></i></div>
          <h3 class="oky-proto-returning-title">¿Este saldo es para ti?</h3>
          <p class="oky-proto-returning-body">
            Encontramos tu Wallet de OKY Cash con ${formatMoney(state.okyCashBalance)} disponibles. Confirma que
            eres tú para seguir usando tus vales y tu saldo.
          </p>
          <div class="oky-proto-returning-actions">
            <button class="btn btn-primary btn-large" style="width:100%" data-action="close-returning-modal" type="button">
              Sí, es para mí
            </button>
            <button class="btn btn-outlined btn-large" style="width:100%" data-action="close-returning-modal" type="button">
              No, cerrar sesión
            </button>
          </div>
        </div>
      </section>
    </div>
  `;
}

/* ── Router / mount ──────────────────────────────────────── */


function renderScreen(state) {
  switch (state.screen) {
    case "home":
      return screenHome(state);
    case "pdp":
      return screenPdp(state);
    case "cart":
      return screenCart(state);
    case "checkout":
      return screenCheckout(state);
    case "payment-methods":
      return screenPaymentMethods(state);
    case "processing":
      return screenProcessing(state);
    case "success":
      return screenSuccess(state);
    case "purchases":
      return screenPurchases(state);
    case "purchase-detail":
      return screenPurchaseDetail(state);
    case "wallet":
      return screenWallet(state);
    case "wallet-detail":
      return screenWalletDetail(state);
    default:
      return screenHome(state);
  }
}

export function mountOkyCashPrototype(root, { userType = "first-time" } = {}) {
  let state = createInitialState(userType);

  function render() {
    const showModal = state.screen === "wallet" && state.userType === "returning" && !state.returningModalSeen;

    root.innerHTML = `
      <div class="oky-proto-frame">
        <div class="status-bar"><div>9:41</div><div style="display:flex;gap:8px"><i class="fa-regular fa-signal"></i><i class="fa-regular fa-wifi"></i><i class="fa-regular fa-battery-full"></i></div></div>
        <div class="oky-proto-screen">
          ${renderScreen(state)}
        </div>
        ${showModal ? renderReturningModal(state) : ""}
      </div>
    `;
  }

  function go(screen, params = {}, { push = true } = {}) {
    if (push) {
      state.history.push({ screen: state.screen, params: state.screenParams });
    }
    state.screen = screen;
    state.screenParams = params;
    render();
  }

  function goBack() {
    const prev = state.history.pop();
    if (!prev) {
      go("home", {}, { push: false });
      return;
    }
    state.screen = prev.screen;
    state.screenParams = prev.params;
    render();
  }

  function completePurchase() {
    const cart = state.cart;
    const applied = Math.min(state.okyCashApplied, cart.amount, state.okyCashBalance);
    const purchaseId = `p-${Date.now()}`;

    state.purchases.push({
      id: purchaseId,
      productKey: cart.productKey,
      merchant: PRODUCTS[cart.productKey].label,
      amount: cart.amount,
      cashbackEarned: cart.cashback,
      okyCashUsed: applied,
      date: todayMock(0),
      status: "Completado",
    });

    state.okyCashBalance = state.okyCashBalance - applied + cart.cashback;
    state.lastPurchaseId = purchaseId;
    state.cart = null;
    state.okyCashApplied = 0;
    state.history = [];
    go("success", {}, { push: false });
  }

  root.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target || target.disabled) return;
    const action = target.dataset.action;

    if (action === "back") return goBack();
    if (action === "dismiss-onboarding") {
      state.onboardingDismissed = true;
      return render();
    }
    if (action === "close-returning-modal") {
      state.returningModalSeen = true;
      return render();
    }
    if (action === "nav:home") return go("home");
    if (action === "nav:wallet") return go("wallet");
    if (action === "go:purchases") return go("purchases");
    if (action === "go:cart") return go("cart");
    if (action === "go:checkout") return go("checkout");

    if (action === "open-pdp") {
      return go("pdp", { product: target.dataset.product });
    }

    if (action === "select-amount") {
      const product = target.dataset.product;
      state.pdpAmount[product] = Number(target.dataset.amount);
      return render();
    }

    if (action === "add-to-cart") {
      const product = PRODUCTS[target.dataset.product];
      const amount = state.pdpAmount[product.key];
      state.cart = {
        productKey: product.key,
        amount,
        cashback: amount * product.cashbackRate(amount),
      };
      return go("cart");
    }

    if (action === "open-payment-methods") {
      return go("payment-methods", { draftAmount: state.okyCashApplied });
    }

    if (action === "set-oky-draft") {
      const cart = state.cart;
      const max = Math.min(state.okyCashBalance, cart.amount);
      state.screenParams.draftAmount = clamp(Number(target.dataset.amount), 0, max);
      return render();
    }

    if (action === "confirm-oky-draft") {
      state.okyCashApplied = state.screenParams.draftAmount ?? state.okyCashApplied;
      return goBack();
    }

    if (action === "clear-oky-draft") {
      state.okyCashApplied = 0;
      return goBack();
    }

    if (action === "remove-oky") {
      state.okyCashApplied = 0;
      return render();
    }

    if (action === "pay-now") {
      go("processing", {}, { push: false });
      setTimeout(completePurchase, 700);
      return;
    }

    if (action === "view-purchase") {
      return go("purchase-detail", { id: state.lastPurchaseId }, { push: false });
    }

    if (action === "open-purchase") {
      return go("purchase-detail", { id: target.dataset.id });
    }

    if (action === "open-wallet-item") {
      return go("wallet-detail", { key: target.dataset.key });
    }
  });

  /* Patch puntual en vez de render() completo: un render() en cada
     tecla reemplaza el <input> y le hace perder el foco/cursor. */
  root.addEventListener("input", (event) => {
    const target = event.target.closest("[data-action='input-oky-draft']");
    if (!target) return;
    const cart = state.cart;
    const max = Math.min(state.okyCashBalance, cart.amount);
    const draft = clamp(Number(target.value) || 0, 0, max);
    state.screenParams.draftAmount = draft;

    root.querySelectorAll(".oky-proto-amount-chip[data-action='set-oky-draft']").forEach((chip) => {
      chip.classList.toggle("is-active", Math.abs(Number(chip.dataset.amount) - draft) < 0.001);
    });
    const remainingEl = root.querySelector("[data-role='remaining-total']");
    if (remainingEl) remainingEl.textContent = formatMoney(Math.max(cart.amount - draft, 0));
    const confirmBtn = root.querySelector("[data-role='confirm-oky-btn']");
    if (confirmBtn) confirmBtn.textContent = `Aplicar ${formatMoney(draft)}`;
  });

  render();
}
