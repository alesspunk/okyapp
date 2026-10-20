/* ─────────────────────────────────────────────────────────
   Piezas de OKY Cash para Storybook (sprint del 20/10).
   Mismo marcado y clases que el prototipo (okyCashPrototype.js),
   pero en estático: cada función devuelve el HTML de una pieza con
   los datos que se le pasen, sin estado ni acciones. Así la historia
   y el prototipo pintan lo mismo con el mismo mars.css.

   Fuera de esta entrega (no se agregan): Clarita, cronómetro y los
   tiers Promo / Terminada / Aviso de la saving bar, Mi wallet v1.
───────────────────────────────────────────────────────── */

import { lottie } from "./lottieLight";
import { renderFlag } from "./flag";
import { renderHistoryCard } from "./historyCards";

export const money = (n) => `$${Number(n).toFixed(2)}`;

export const EMOJI_SELF = `<img class="oky-flow-emoji-img" src="oky-emoji-para-mi.png" alt="" />`;
export const EMOJI_OTHERS = `<img class="oky-flow-emoji-img" src="oky-emoji-para-otros.png" alt="" />`;

/* Marco de 360 × 800 para lo que se pinta encima de una pantalla
   (hojas, sellos, transiciones): las piezas van en absoluto dentro
   del frame, igual que en el prototipo. */
export function phoneFrame(inner, { background = "var(--white)" } = {}) {
  return `<div class="oky-flow-frame" style="background:${background}">${inner}</div>`;
}

/* ── Átomos ─────────────────────────────────────────────── */

export function renderScrollHint() {
  return `
    <button class="oky-flow-scroll-hint" type="button" aria-label="Ver más contenido" style="position:static">
      <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
    </button>`;
}

/* Insignia de la pila: unidades + bandera del marketplace (vale) o
   unidades + check (comprado) o + equis (no se procesó). */
export function renderVoucherBadge({ type = "vale", count = 2, country = "US" } = {}) {
  if (type === "compra") {
    return `<span class="oky-flow-voucher-badge" style="position:static">${count}<i class="fa-solid fa-circle-check" aria-hidden="true"></i></span>`;
  }
  if (type === "fallida") {
    return `<span class="oky-flow-voucher-badge is-failed" style="position:static">${count}<i class="fa-solid fa-circle-xmark" aria-hidden="true" style="color:var(--error-main)"></i></span>`;
  }
  return `
    <span class="oky-flow-voucher-badge" style="position:static">
      ${count}
      <span class="oky-flow-voucher-badge-flag">${renderFlag({ code: country, size: "Small" })}</span>
    </span>`;
}

/* Toast de estado de la poscompra (MARS · Poscompra / Toast de estado):
   ocupa el centro de la cabecera cuando la compra no dio OKY Cash. */
export function renderStatusToast({ estado = "Exito" } = {}) {
  const ok = estado !== "Error";
  return `
    <div class="oky-flow-toast ${ok ? "is-success" : "is-error"} is-header" role="status" style="flex:none">
      <i class="fa-solid ${ok ? "fa-circle-check" : "fa-circle-exclamation"}" aria-hidden="true"></i>
      <span>${ok ? "Compra exitosa" : "No se pudo completar"}</span>
    </div>`;
}

/* Cabecera de sección de Mis compras (MARS · Wallet / Sección plegada):
   pliega, dice cuántas guarda y avisa las nuevas con un número. */
export function renderSectionHead({ label = "Usados", icon = "fa-box-archive", count = 1, news = 0, open = false } = {}) {
  return `
    <button class="oky-flow-section-head is-tappable" data-action="toggle-section" type="button" aria-expanded="${open}" style="width:328px">
      ${news ? `<span class="oky-flow-section-news" aria-label="${news} sin abrir">${news}</span>` : ""}
      <span class="oky-flow-section-head-label"><i class="fa-solid ${icon}" aria-hidden="true"></i>${label}</span>
      <span class="oky-flow-section-head-meta">
        <span class="oky-flow-section-count">(${count})</span>
        <i class="fa-solid fa-chevron-down oky-flow-section-caret" aria-hidden="true"></i>
      </span>
    </button>`;
}

export function renderNewDot() {
  return `<span class="oky-flow-voucher-dot" aria-label="Nuevo" style="position:static;display:inline-block"></span>`;
}

/* ── Moléculas ──────────────────────────────────────────── */

/* ── OKY Cash · Estilo (exploración 20/10) ───────────────
   Los cinco estilos de OKY Cash de MARS (propiedad «Estilo»). El aqua
   claro queda para descuento; mientras se decide, cada componente de
   OKY Cash acepta uno con la clase is-estilo-* (ver mars.css). Sin
   estilo, el componente se ve como hasta hoy (aqua). */
export const OKY_CASH_ESTILOS = ["Aqua", "Aqua Oscuro", "Oscuro", "Dark Night", "Plata"];

export function estiloClass(estilo) {
  return estilo ? ` is-estilo-${estilo.toLowerCase().replace(/\s+/g, "-")}` : "";
}

export function renderBalanceStrip({ balance = 5, estilo } = {}) {
  return `
    <button class="oky-flow-cash-strip${estiloClass(estilo)}" type="button">
      <img src="oky-cash-coin.png" alt="" />
      <span class="oky-flow-cash-strip-copy">
        <span class="oky-flow-cash-strip-amount"><span>$</span><strong>${Number(balance).toFixed(2)}</strong></span>
        <span class="oky-flow-cash-strip-label">OKY Cash</span>
      </span>
      <span class="btn btn-primary btn-small" style="pointer-events:none">Explora</span>
    </button>`;
}

/* La pastilla de saldo: flotante (dock) en homes y wallet, y en la
   cabecera de la poscompra con lo disponible. */
export function renderCashPill({ size = "Dock", tipo = "OKY Cash", text = "$5.00 en OKY Cash", balance = 5.25, estilo } = {}) {
  /* Recibo (MARS · Tipo=Recibo): la misma pastilla en blanco con borde,
     para abrir el recibo de la compra. Icono: solo el botón redondo
     del recibo, que cuelga a la derecha de la pastilla de saldo. */
  if (size === "Icono") {
    return `<button class="oky-flow-purchase-receipt" type="button" aria-label="Ver recibo" style="position:static"><i class="fa-regular fa-receipt" aria-hidden="true"></i></button>`;
  }
  if (tipo === "Recibo") {
    return `
      <button class="oky-flow-purchase-badge is-receipt" type="button" aria-label="Ver recibo">
        <i class="fa-regular fa-file-lines" aria-hidden="true"></i>
        <span>${text}</span>
      </button>`;
  }
  if (size === "Header") {
    return `
      <button class="oky-flow-purchase-badge is-cash${estiloClass(estilo)}" type="button" aria-label="${money(balance)} disponible en OKY Cash">
        <img src="oky-cash-coin.png" alt="" />
        <span>${money(balance)} <span class="oky-flow-purchase-badge-note">disponible</span></span>
      </button>`;
  }
  return `
    <div class="oky-flow-cashdock" style="position:static;transform:none;opacity:1">
      <button class="oky-flow-purchase-badge is-cash is-wallet${estiloClass(estilo)}" type="button"><span>${text}</span></button>
    </div>`;
}

const SEG_TABS = {
  "Mis compras": [
    { key: "mio", label: "Para mí", icon: EMOJI_SELF, emoji: true },
    { key: "otros", label: "Para otros", icon: EMOJI_OTHERS, emoji: true },
  ],
  "Tu billetera": [
    { key: "cash", label: "OKY Cash", icon: `<img class="oky-flow-wallet-seg-icon" src="oky-cash-coin.png" alt="" />` },
    { key: "methods", label: "Métodos de pago", icon: `<img class="oky-flow-wallet-seg-icon" src="oky-card-3d.png" alt="" />` },
  ],
};

export const SEG_KINDS = Object.keys(SEG_TABS);

export function renderSegTabs({ kind = "Mis compras", active = 0, decision = false } = {}) {
  const tabs = SEG_TABS[kind] || SEG_TABS["Mis compras"];
  const cls = decision ? " is-decision" : kind === "Tu billetera" ? " is-cash-solo" : "";
  return `
    <section class="oky-flow-wallet-seg${cls}" role="tablist" aria-label="${kind}" style="width:328px">
      ${tabs
        .map(
          (t, i) => `
        <button class="oky-flow-wallet-seg-item${!decision && i === active ? " is-on" : ""}" type="button" role="tab"
          aria-selected="${!decision && i === active}">
          ${t.emoji ? `<span class="oky-flow-wallet-seg-emoji" aria-hidden="true">${t.icon}</span>` : t.icon}${t.label}
        </button>`,
        )
        .join("")}
    </section>`;
}

export function renderTourCallout({ label = "Aquí ves tus compras", position = "Debajo" } = {}) {
  const up = position !== "Encima";
  return `
    <div style="position:relative;width:328px;padding:24px;border-radius:16px;background:var(--scrim-72)">
      ${/* Como en el prototipo: flecha y frase en ese orden; .is-below
           deja la flecha arriba y sin ella mars.css la baja. */ ""}
      <div class="oky-flow-tour-call${up ? " is-below" : ""}" style="position:static;transform:none">
        <i class="fa-solid fa-arrow-${up ? "up" : "down"} oky-flow-tour-arrow" aria-hidden="true"></i>
        <p class="oky-flow-tour-label">${label}</p>
      </div>
    </div>`;
}

export function renderWebviewBar({ loading = false } = {}) {
  return `
    <div class="oky-webview" style="position:relative;inset:auto;width:360px;height:auto;transform:none">
      <header class="oky-webview-bar">
        <button class="oky-webview-icon" type="button" aria-label="Cerrar"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        <div class="oky-webview-title">
          <strong>OKY Cash</strong>
          <span><i class="fa-solid fa-lock" aria-hidden="true"></i>okyapp.com/oky-cash</span>
        </div>
        <button class="oky-webview-icon" type="button" aria-label="Recargar"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i></button>
        ${loading ? `<span class="oky-webview-progress" aria-hidden="true"></span>` : ""}
      </header>
    </div>`;
}

const EMPTY_STATES = {
  "OKY Cash": {
    cls: "is-cash",
    art: "oky-cash-coin.png",
    title: "Aún no has ganado OKY Cash",
    note: "Compra una gift card en USA y usa el saldo que ganes en tus próximas compras.",
    cta: "Explorar gift cards de USA",
  },
  "Métodos de pago": {
    cls: "is-methods",
    art: "oky-card-3d.png",
    title: "Aún no tienes tarjetas",
    note: "Agrega una tarjeta para pagar tus compras.",
    cta: "Agregar tarjeta",
  },
};

export const EMPTY_KINDS = Object.keys(EMPTY_STATES);

export function renderEmptyState({ kind = "OKY Cash" } = {}) {
  const c = EMPTY_STATES[kind] || EMPTY_STATES["OKY Cash"];
  return `
    <div class="oky-flow-cash-empty is-wallet ${c.cls}" style="width:328px;margin:0">
      <span class="oky-flow-cash-empty-art"><img src="${c.art}" alt="" /></span>
      <h2 class="oky-flow-cash-empty-title">${c.title}</h2>
      <p class="oky-flow-cash-empty-note">${c.note}</p>
      <button class="btn btn-primary btn-large oky-flow-cash-empty-cta" type="button">${c.cta}</button>
    </div>`;
}

/* Método de pago minimalista (MARS, 15/10): sin chips. OKY Cash con
   el saldo en teal y la moneda a la derecha; la tarjeta solo con su
   nombre y su ícono. Lo que paga cada uno lo dice el resumen. */
export const PAY_ROWS = ["OKY Cash", "OKY Cash · marcado", "Visa", "Paypal", "Agregar tarjeta", "Aviso · Tienes OKY Cash"];

function payRow(kind, { balance = 5, pos = "is-only" } = {}) {
  const dots = `<span class="oky-flow-payrow-more" aria-hidden="true"><i class="fa-solid fa-ellipsis-vertical"></i></span>`;
  if (kind === "OKY Cash" || kind === "OKY Cash · marcado" || kind === "Aviso · Tienes OKY Cash") {
    const on = kind === "OKY Cash · marcado";
    const notice = kind === "Aviso · Tienes OKY Cash";
    return `
      <div class="oky-flow-payrow is-cash ${pos}${on ? " is-checked" : ""}">
        <span class="oky-flow-check${on ? " is-checked" : ""}" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
        <p class="oky-flow-payrow-copy">OKY Cash</p>
        <span class="oky-flow-pay-amount">${money(balance)}</span>
        ${notice ? `<span class="oky-flow-pay-icon is-empty" aria-hidden="true"></span><span class="oky-flow-payrow-more is-empty" aria-hidden="true"></span>` : `<img class="oky-flow-pay-icon is-coin" src="oky-cash-coin.png" alt="" />${dots}`}
      </div>`;
  }
  if (kind === "Agregar tarjeta") {
    return `
      <div class="oky-flow-payrow is-add ${pos}">
        <span class="oky-flow-payrow-add" aria-hidden="true"><i class="fa-solid fa-plus"></i></span>
        <p class="oky-flow-payrow-copy">Agregar tarjeta</p>
        <span class="oky-flow-payrow-more" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
      </div>`;
  }
  const paypal = kind === "Paypal";
  return `
    <div class="oky-flow-payrow ${pos}">
      <p class="oky-flow-payrow-copy is-card">${paypal ? "Paypal" : "Visa **** 2111"}</p>
      ${paypal ? `<img class="oky-flow-pay-icon" src="oky-paypal-logo.png" alt="" />` : `<img class="oky-flow-pay-icon is-card" src="oky-card-3d.png" alt="" />`}
      ${dots}
    </div>`;
}

export function renderPayGroup(rows = ["OKY Cash", "Visa"], { balance = 5 } = {}) {
  const list = rows
    .map((kind, i) => {
      const pos = rows.length === 1 ? "is-only" : i === 0 ? "is-first" : i === rows.length - 1 ? "is-last" : "";
      return payRow(kind, { balance, pos });
    })
    .join("");
  return `
    <div class="payment-method-input oky-flow-paygroup" style="width:328px">
      <span class="payment-method-label">Método de pago</span>
      ${list}
    </div>`;
}

/* ── Movimiento de OKY Cash con su desglose ──────────────
   Como en la actividad de Tu billetera: la History Card de OKY Cash y,
   debajo, el panel que abre «Con qué lo ganaste» / «En qué lo usaste».
   Lo usado suma también el costo por servicio (OKYC-EXP-044). */
export function renderCashMovement({ positive = true, open = false, date = "15 / OCT / 2026", order = "Orden #11112442", lines, estilo } = {}) {
  const items =
    lines ||
    (positive
      ? [{ label: "Nike", amount: "+ $2.55" }, { label: "Starbucks", amount: "+ $0.50" }]
      : [{ label: "Hamburguesa de Pollo", amount: "- $5.69" }, { label: "Costo por servicio", amount: "- $0.99" }]);
  const total = items.reduce((sum, i) => sum + Number(String(i.amount).replace(/[^0-9.]/g, "")), 0);
  const row = renderHistoryCard({
    key: "oky-cash",
    id: "99135:104411",
    layout: "row",
    icon: {
      src: positive ? "oky-activity-earned.png" : "oky-activity-used.png",
      badge: positive ? { src: "oky-activity-up.png", tone: "up" } : { src: "oky-activity-down.png", tone: "down" },
    },
    date,
    amount: `${positive ? "+" : "-"} ${money(total)}`,
    amountTone: positive ? "credit" : "debit",
    meta: { type: "order", note: order },
    chip: positive ? { label: "Ganado", tone: "success", className: estiloClass(estilo).trim() } : { label: "Usado", tone: "neutral" },
  });
  return `
    <div class="oky-flow-order has-panel${open ? " is-open" : ""}" style="width:328px">
      ${row}
      <div class="oky-flow-order-panel">
        <span class="oky-flow-order-toggle">
          ${positive ? "Con qué lo ganaste" : "En qué lo usaste"}
          <i class="fa-solid fa-chevron-${open ? "up" : "down"}" aria-hidden="true"></i>
        </span>
        ${
          open
            ? `<ul class="oky-flow-order-detail">${items
                .map((i) => `<li class="oky-flow-order-line"><span>${i.label}</span><span class="${positive ? "is-credit" : "is-debit"}">${i.amount}</span></li>`)
                .join("")}</ul>`
            : ""
        }
      </div>
    </div>`;
}

/* ── Tarjeta de OKY Cash · los 5 diseños ─────────────────
   Copia de CARD_DESIGNS del prototipo: la Payment Card de OKY Cash
   con el estilo de cada diseño encima. */
/* Única lista de diseños de la tarjeta de OKY Cash: la leen las
   stories (Payment Card › OKY Cash · Diseños) y el prototipo. */
export const CARD_DESIGNS = [
  /* Diseños finales de Nicky (7600 › Design assets › 23–27, 19/10). Cada
     arte es un PNG del tamaño de la tarjeta con el dibujo en su sitio y
     las cuatro esquinas limpias: nombre, saldo, vencimiento y lápiz se
     leen sobre el color de fondo. Sin el patrón de arcos ni borde. */
  {
    key: "black",
    label: "Lo que va, vuelve",
    note: "Cada regalo que envíes a tu familia volverá a ti como un ripple effect.",
    /* La ola de Nicky, estirada solo a lo ancho para ir casi de borde a
       borde en la franja libre entre el saldo y el vencimiento. */
    art: "oky-card-art-lo-que-va-vuelve.png",
    artClass: "is-nicky",
    style: { backgroundMode: "solid", backgroundColor: "var(--black)", showBorder: false, pattern: null },
  },
  {
    key: "bubbles",
    label: "Burbujas",
    note: "Las monedas suben solas, como lo que ganas sin darte cuenta.",
    /* El morado baja a lila, como en la captura 24 de Nicky. */
    art: "oky-card-art-burbujas.png",
    artClass: "is-nicky",
    style: { backgroundMode: "gradient", gradientFrom: "var(--card-burbujas-from)", gradientTo: "var(--card-burbujas-to)", gradientAngle: 180, showBorder: false, pattern: null },
  },
  {
    key: "teal",
    label: "Turquesa",
    note: "El verde agua del cashback, para que se note lo que ganas.",
    art: "oky-card-art-turquesa.png",
    /* En MARS el arte de Turquesa va al 27 % sobre el degradado. */
    artClass: "is-nicky is-soft",
    style: { backgroundMode: "gradient", gradientFrom: "var(--card-turquesa-from)", gradientTo: "var(--card-turquesa-to)", gradientAngle: 92, showBorder: false, pattern: null },
  },
  {
    key: "purple",
    label: "Morado OKY",
    note: "El lazo de monedas que no se acaba: lo que ganas vuelve a ti.",
    art: "oky-card-art-morado-oky.png",
    artClass: "is-nicky",
    style: { backgroundMode: "solid", backgroundColor: "var(--card-morado-oky)", showBorder: false, pattern: null },
  },
  {
    key: "coins",
    label: "Ola de monedas",
    note: "Una ola de monedas cruzando el negro: lo que se va juntando.",
    /* La cinta va de lado a lado, a media altura. */
    art: "oky-card-art-ola-de-monedas.png",
    artClass: "is-nicky",
    style: { backgroundMode: "solid", backgroundColor: "var(--black)", showBorder: false, pattern: null },
  },
];

/* Igual que okyCashCard() del prototipo: saldo arriba a la derecha,
   vencimiento abajo a la izquierda (solo con saldo) y el lápiz a la
   derecha. */
export function okyCashCardData(findPaymentCard, { design = "black", balance = 56, expiry = "24 / FEB / 2027" } = {}) {
  const card = { ...findPaymentCard("Molecule/Payment Card/OKY Cash Black") };
  card.balance = { ...card.balance, value: Number(balance).toFixed(2) };
  card.cta = null;
  card.editAction = "";
  card.editSide = "right";
  card.expiry = balance > 0 && expiry ? { label: "Vencimiento", value: expiry } : null;
  const d = CARD_DESIGNS.find((x) => x.key === design) || CARD_DESIGNS[0];
  return { ...card, ...d.style, art: d.art, artClass: d.artClass };
}

/* ── Saving Bar de OKY Cash (tiers de esta entrega) ──────
   Base en PDP (con la (i) que abre la landing) y en checkout, y la de
   ahorro de Guatemala. Promo / Terminada / Aviso quedan fuera del
   sprint junto con el cronómetro. */
export const CASH_BAR_KINDS = ["Base · PDP", "Base · Checkout", "Ahorro GT"];

export function renderCashSavingBar({ kind = "Base · PDP", amount = 2.55, estilo } = {}) {
  if (kind === "Ahorro GT") {
    return `<div class="oky-flow-savingbar" style="position:static;width:360px"><div class="oky-flow-savebar is-bar"><i class="fa-solid fa-tag" aria-hidden="true"></i>&nbsp;¡Ahorro total! ${money(amount)}</div></div>`;
  }
  const pdp = kind === "Base · PDP";
  const copy = pdp
    ? `Gana <strong>${money(amount)}</strong> de <strong>OKY Cash</strong>`
    : `Compra y gana <strong>${money(amount)}</strong> en <strong>OKY Cash</strong>`;
  return `
    <div class="oky-flow-savingbar" style="position:static;width:360px">
      <div class="saving-bar is-oky-cash${estiloClass(estilo)}">
        ${pdp ? `<button class="saving-bar-info" type="button" aria-label="Qué es OKY Cash"><i class="fa-solid fa-circle-info" aria-hidden="true"></i></button>` : ""}
        <div class="saving-bar-copy"><span>${copy}</span></div>
      </div>
    </div>`;
}

/* ── Contador del carrito (Carrito / Cantidad) ────────── */
export const CART_QTY_STATES = ["Agregar", "Cerrada", "Abierta"];

/* Va dentro de .oky-flow-cart-head, como en la línea del carrito: ahí
   cuelgan la caja de 40px y la apertura hacia la izquierda. */
export function renderCartQty(opts = {}) {
  return `<div class="oky-flow-cart-head" style="display:flex;width:110px;height:40px">${cartQtyBox(opts)}</div>`;
}

function cartQtyBox({ state = "Agregar", qty = 3 } = {}) {
  if (state === "Abierta") {
    return `
      <span class="oky-flow-cart-qty is-open">
        <button class="oky-flow-cart-qty-btn is-less" type="button" aria-label="Quitar uno"><i class="fa-solid fa-minus" aria-hidden="true"></i></button>
        <span class="oky-flow-cart-qty-btn is-count is-plain">${qty}</span>
        <button class="oky-flow-cart-qty-btn is-more" type="button" aria-label="Agregar otro"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>
      </span>`;
  }
  const label = state === "Cerrada" ? String(qty) : `<i class="fa-solid fa-plus" aria-hidden="true"></i>`;
  return `<span class="oky-flow-cart-qty"><button class="oky-flow-cart-qty-btn is-count" type="button">${label}</button></span>`;
}

/* ── Ícono de compartir (Icono / Compartir) ───────────── */
export const SHARE_ICON_IOS = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M8.5 9.25H7.25C6.007 9.25 5 10.257 5 11.5V19.25C5 20.493 6.007 21.5 7.25 21.5H16.75C17.993 21.5 19 20.493 19 19.25V11.5C19 10.257 17.993 9.25 16.75 9.25H15.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 14.75V2.75" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M8.5 6.25L12 2.75L15.5 6.25" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const SHARE_ICON_ANDROID = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><circle cx="17.5" cy="5.5" r="2.5" stroke="currentColor" stroke-width="1.75"/><circle cx="6.5" cy="12" r="2.5" stroke="currentColor" stroke-width="1.75"/><circle cx="17.5" cy="18.5" r="2.5" stroke="currentColor" stroke-width="1.75"/><path d="M8.7 10.7L15.3 6.8M8.7 13.3L15.3 17.2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`;

/* ── Hojas (variantes de Molecules/Modal) ───────────────── */

export const SHEET_KINDS = [
  "Tienes OKY Cash",
  "¿Ya la usaste?",
  "¿Eliminar esta tarjeta?",
  "¿Es para ti o para alguien más?",
  "Filtrar",
  "Agrega más, paga menos",
  "Elige el país",
  "¿Deseas cambiar el país destino?",
];

const MARKETS = [
  { iso: "US", code: "USA", label: "Estados Unidos" },
  { iso: "CA", code: "CAN", label: "Canadá" },
];

export function renderCountryRow({ iso = "US", current = true } = {}) {
  const m = MARKETS.find((x) => x.iso === iso) || MARKETS[0];
  return `
    <button class="oky-flow-market-item${current ? " is-current" : ""}" type="button" style="width:328px">
      <span class="oky-flow-market-flag">${renderFlag({ code: m.iso, size: "Large" })}</span>
      <span class="oky-flow-market-label">${m.label}</span>
      <span class="oky-flow-market-code">${m.code}</span>
      <span class="oky-flow-market-check" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
    </button>`;
}

export function renderSheet(kind, { balance = 5 } = {}) {
  const backdrop = `<div class="oky-flow-sheet-backdrop" aria-hidden="true"></div>`;
  const close = (dark = false) =>
    `<button class="oky-flow-sheet-close${dark ? " is-dark" : ""}" type="button" aria-label="Cerrar"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`;
  if (kind === "Tienes OKY Cash") {
    return `${backdrop}
      <section class="oky-flow-savings is-cash" role="dialog" aria-label="Tienes OKY Cash">
        ${close()}
        <h2 class="oky-flow-cashnote-title">
          <span class="oky-flow-cashwin-kicker">Tienes</span>
          <span class="oky-flow-cashwin-amount is-notice"><img class="oky-flow-cashnote-coin" src="oky-cash-coin.png" alt="" /><span>$</span>${Number(balance).toFixed(2)}</span>
          <span class="oky-flow-cashwin-label">en OKY Cash</span>
        </h2>
        <p class="oky-flow-savings-note">Úsalo ahora o en compras futuras</p>
        <div class="oky-flow-cashnote-preview">${renderPayGroup(["Aviso · Tienes OKY Cash"], { balance }).replace('style="width:328px"', "")}</div>
      </section>`;
  }
  if (kind === "Agrega más, paga menos") {
    return `${backdrop}
      <section class="oky-flow-savings" role="dialog" aria-label="Agrega más, paga menos">
        <h2 class="oky-flow-savings-title">Agrega más,<br />paga menos</h2>
        <p class="oky-flow-savings-note">Al agregar más productos al carrito paga un máximo <strong>$2.99</strong> de costo de servicio</p>
        <div class="oky-flow-savings-art"><img src="oky-cart-savings.png" alt="" /></div>
        <button class="btn btn-primary btn-large oky-flow-savings-cta" type="button">Entendido</button>
      </section>`;
  }
  if (kind === "¿Es para ti o para alguien más?") {
    return `${backdrop}
      <section class="oky-flow-sheet is-decision is-tabs" role="dialog" aria-label="${kind}">
        ${close()}
        <h2 class="oky-flow-sheet-title">${kind}</h2>
        <p class="oky-flow-sheet-note">Si es para ti, lo guardamos en Mis compras apenas termines de pagar.</p>
        ${renderSegTabs({ kind: "Mis compras", decision: true }).replace('style="width:328px"', "")}
      </section>`;
  }
  if (kind === "Filtrar") {
    const opt = (label, count, on) => `
      <button class="oky-flow-filter-option${on ? " is-on" : ""}" type="button" role="radio" aria-checked="${on}">
        <span class="oky-flow-radio" aria-hidden="true"></span>
        <span class="oky-flow-filter-option-label">${label}</span>
        ${count == null ? "" : `<span class="oky-flow-filter-option-count">${count}</span>`}
      </button>`;
    return `${backdrop}
      <section class="oky-flow-sheet is-filter" role="dialog" aria-label="Filtrar por categoría">
        <div class="oky-flow-sheet-grab" aria-hidden="true"></div>
        <header class="oky-flow-filter-head">
          <h2 class="oky-flow-filter-title">Filtrar</h2>
          ${close(true)}
        </header>
        <div class="oky-flow-filter-list" role="radiogroup">
          ${opt("Todas las categorías", null, true)}${opt("Moda", 2, false)}${opt("Comida y restaurantes", 3, false)}
        </div>
      </section>`;
  }
  if (kind === "Elige el país") {
    return `${backdrop}
      <section class="oky-flow-market" role="dialog" aria-label="Elige el país">
        <span class="oky-flow-market-grip" aria-hidden="true"></span>
        <header class="oky-flow-market-head">
          <h2 class="oky-flow-market-title">Elige el país</h2>
          <p class="oky-flow-market-note">Norteamérica</p>
        </header>
        <ul class="oky-flow-market-list">
          <li>${renderCountryRow({ iso: "US", current: true }).replace(' style="width:328px"', "")}</li>
          <li>${renderCountryRow({ iso: "CA", current: false }).replace(' style="width:328px"', "")}</li>
        </ul>
      </section>`;
  }
  if (kind === "¿Deseas cambiar el país destino?") {
    return `
      <div class="oky-flow-country-backdrop" aria-hidden="true"></div>
      <section class="oky-flow-country" role="dialog" aria-label="${kind}">
        <button class="oky-flow-country-close" type="button" aria-label="Cerrar"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        <h2 class="oky-flow-country-title">${kind}</h2>
        <p class="oky-flow-country-note">El cambio de país borra tu carrito.</p>
        <div class="oky-flow-country-art" aria-hidden="true"><img src="oky-globe-warning.png" alt="" /></div>
        <div class="oky-flow-country-actions">
          <button class="btn btn-large oky-flow-country-primary" type="button">Completar Compra</button>
          <button class="oky-flow-country-link" type="button">Cambiar país</button>
        </div>
      </section>
      ${/* En el prototipo esta hoja se apoya sobre la navbar, no sobre el
           borde: sin ella quedaba un hueco abajo. */ ""}
      <nav class="oky-flow-navbar" aria-hidden="true">
        <div class="bottom-nav">
          ${[["Home", "house", " active"], ["Notificaciones", "bell", " is-dim"], ["OKY Cash", null, ""], ["Ayuda", "messages", " is-dim"], ["Menú", "bars", ""]]
            .map(
              ([label, icon, cls]) => `<div class="nav-item${cls}">
                ${icon ? `<i class="fa-light fa-${icon}" style="font-size:20px"></i>` : `<span class="oky-flow-coin-3d"><img class="oky-flow-coin" src="oky-cash-coin.png" alt="" /></span>`}
                <span class="nav-label">${label}</span>
              </div>`,
            )
            .join("")}
        </div>
      </nav>`;
  }
  /* Sheet / Confirmación con la tarjeta y el basurero (CASH-28):
     mismas reglas que el prototipo (.is-deletecard, arte de 183px). */
  if (kind === "¿Eliminar esta tarjeta?") {
    return `${backdrop}
      <section class="oky-flow-sheet is-deletecard" role="dialog" aria-label="${kind}">
        ${close()}
        <h2 class="oky-flow-sheet-title">${kind}</h2>
        <p class="oky-flow-sheet-note">Dejará de aparecer en tus métodos de pago. Si era tu tarjeta para pago, la otra pasa a serlo.</p>
        <div class="oky-flow-sheet-art"><img src="icon-eliminar-tarjeta-3d.png" alt="" /></div>
        <div class="oky-flow-sheet-actions">
          <button class="oky-flow-sheet-confirm" type="button">Eliminar</button>
          <button class="oky-flow-sheet-dismiss" type="button">Cancelar</button>
        </div>
      </section>`;
  }
  /* ¿Ya la usaste? — la hoja de confirmación morada. */
  return `${backdrop}
    <section class="oky-flow-sheet is-archive" role="dialog" aria-label="¿Ya la usaste?">
      ${close()}
      <h2 class="oky-flow-sheet-title">¿Ya la usaste?</h2>
      <p class="oky-flow-sheet-note">La pasamos a la sección de usados sin perderla: la encuentras ahí cuando quieras.</p>
      <div class="oky-flow-sheet-art"><img src="oky-archive-hands.png" alt="" /></div>
      <div class="oky-flow-sheet-actions">
        <button class="oky-flow-sheet-confirm" type="button">Sí, ya la usé</button>
        <button class="oky-flow-sheet-dismiss" type="button">Ahora no</button>
      </div>
    </section>`;
}

/* ── Animaciones (Lottie) ───────────────────────────────── */

/* Monta un Lottie en un contenedor recién creado. Storybook recibe el
   elemento ya armado; el player arranca solo aunque todavía no esté en
   el DOM. Con movimiento reducido se queda en el primer cuadro. */
export function mountLottie(container, animationData, { loop = false, play = true, slice = false } = {}) {
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const run = play && !reduce;
  const anim = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: run && loop,
    autoplay: run,
    animationData,
    ...(slice ? { rendererSettings: { preserveAspectRatio: "xMidYMid slice" } } : {}),
  });
  if (!run) anim.goToAndStop(0, true);
  return anim;
}

export function htmlToElement(html) {
  const wrap = document.createElement("div");
  wrap.innerHTML = html.trim();
  return wrap.firstElementChild;
}
