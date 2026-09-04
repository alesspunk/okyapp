/* ─────────────────────────────────────────────────────────
   Payment Card (Molecule)
   Figma:
     Default          — esqueleto genérico
     Yayo             99105:7819
     Saldo OKY        99131:101552
     Visa             99133:102680
     Mastercard       99133:102616
     OKY Cash Black   99140:14006
     OKY Cash Teal    99140:13835
     Stack (contexto) 99131:101546

   Tarjeta skeumórfica de 328x214. Las 7 variantes comparten
   la misma anatomía de 3 filas (header / centro / footer) y solo
   cambian piel: fondo, borde, patrón, logo y contenido.
   Toda la piel se aplica por custom properties, así que la story
   puede customizarla sin escribir CSS nuevo.
───────────────────────────────────────────────────────── */

export const PATTERN_ASSETS = {
  none: null,
  /* patrón por defecto: los dos arcos del Figma en color-burn.
     `arcs` va pintado en negro (para cards saturadas u oscuras) y
     `arcsLight` en gris #616161, que es el par que Figma usa sobre
     las cards claras — en negro se vería como una mancha. */
  arcs: { mode: "tiles", a: "payment-card-arc-a.svg", b: "payment-card-arc-b.svg" },
  arcsLight: { mode: "tiles", a: "payment-card-arc-light-a.svg", b: "payment-card-arc-light-b.svg" },
  bubbles: { mode: "full", a: "payment-card-bubbles.png" },
};

export const PATTERN_OPTIONS = Object.keys(PATTERN_ASSETS);

export const PAYMENT_CARD_VARIANTS = [
  {
    path: "Molecule/Payment Card/Default",
    key: "default",
    id: "—",
    brand: { type: "logo", src: "logo-oky.svg", alt: "OKY", shape: "wordmark" },
    balance: { currency: "$", value: "0.00", label: "disponible" },
    pattern: "arcsLight",
    showFooter: true,
    footerDivider: true,
    expiry: { label: "Vencimiento", value: "24 / SEP / 2028" },
    actionIcon: "fa-chevron-right",
    recommendation:
      "Esqueleto neutro: blanco con el borde gris del sistema, header con columna de logo + columna derecha de saldo/dígitos y el patrón por defecto. Punto de partida para cualquier marca nueva.",
  },
  {
    path: "Molecule/Payment Card/Yayo",
    key: "yayo",
    id: "99105:7819",
    brand: { type: "logo", src: "logo-yayo.png", alt: "Yayo", shape: "wide" },
    balance: { currency: "Q", value: "20", label: "disponible" },
    pattern: "arcsLight",
    showFooter: true,
    recommendation:
      "La card gris del sistema con el wordmark de Yayo y tinta navy. El patrón sube a 38% de opacidad porque sobre gris claro casi no se ve al 12%.",
  },
  {
    path: "Molecule/Payment Card/Saldo OKY",
    key: "saldo-oky",
    id: "99131:101552",
    /* wordmark en blanco: el logo-oky.svg morado no contrasta sobre el degradado */
    brand: { type: "logo", src: "logo-oky-white.svg", alt: "OKY", shape: "wordmark" },
    balance: { currency: "$", value: "0.00", label: "disponible", embossed: true },
    pattern: "arcs",
    showFooter: true,
    recommendation:
      "Degradado morado de dos paradas con borde blanco. El saldo lleva el relieve de 4 sombras del Figma.",
  },
  {
    path: "Molecule/Payment Card/Visa",
    key: "visa",
    id: "99133:102680",
    brand: { type: "logo", src: "payment-card-logo-visa.png", alt: "Visa", shape: "round" },
    balance: { currency: "", value: "**2111", label: "para pago" },
    pattern: "arcs",
    showFooter: true,
    expiry: { label: "Vencimiento", value: "SEP / 2028" },
    actionIcon: "fa-chevron-right",
    recommendation:
      "Navy Visa con últimos 4 dígitos en vez de saldo. Es la única variante del set con vencimiento y área de acción visibles.",
  },
  {
    path: "Molecule/Payment Card/Mastercard",
    key: "mastercard",
    id: "99133:102616",
    brand: {
      type: "logo",
      src: "payment-card-logo-mastercard.png",
      alt: "Mastercard",
      shape: "round",
    },
    balance: { currency: "", value: "**4566", label: "para pago", embossed: true },
    pattern: "arcs",
    showFooter: true,
    recommendation:
      "Naranja Mastercard con los últimos 4 dígitos. Figma le aplica `mix-blend-mode: luminosity` al logo, pero con el asset exportado lava la marca, así que va plano.",
  },
  {
    path: "Molecule/Payment Card/OKY Cash Black",
    key: "oky-cash-black",
    id: "99140:14006",
    brand: { type: "text", text: "OKY Cash" },
    balance: { currency: "$", value: "36.00", label: "disponible", embossed: true },
    pattern: "arcs",
    art: "payment-card-swirl.png",
    showFooter: true,
    cta: { label: "Ver actividad", icon: "fa-arrow-right" },
    editIcon: "payment-card-edit.svg",
    recommendation:
      "OKY Cash negra: ilustración protagonista encima del contenido, CTA `Ver actividad` y botón de editar abajo a la izquierda.",
  },
  {
    path: "Molecule/Payment Card/OKY Cash Teal",
    key: "oky-cash-teal",
    id: "99140:13835",
    brand: { type: "text", text: "OKY Cash" },
    balance: { currency: "$", value: "36.00", label: "disponible", embossed: true },
    pattern: "bubbles",
    showFooter: true,
    cta: { label: "Ver actividad", icon: "fa-arrow-right" },
    recommendation:
      "OKY Cash turquesa: degradado horizontal y textura full-bleed en `screen` al 27% en vez de los arcos.",
  },
];

export const PAYMENT_CARD_PATHS = PAYMENT_CARD_VARIANTS.map((variant) => variant.path);

export function findPaymentCard(path) {
  return PAYMENT_CARD_VARIANTS.find((variant) => variant.path === path) ?? PAYMENT_CARD_VARIANTS[0];
}

/* Traduce los args de la story a custom properties inline. */
function buildStyle(card) {
  const style = [];

  if (card.backgroundMode === "solid" && card.backgroundColor) {
    style.push(`--payment-card-bg:${card.backgroundColor}`);
  }

  if (card.backgroundMode === "gradient" && card.gradientFrom && card.gradientTo) {
    const angle = card.gradientAngle ?? 90;
    style.push(`--payment-card-bg:linear-gradient(${angle}deg, ${card.gradientFrom}, ${card.gradientTo})`);
  }

  if (card.showBorder === false) {
    style.push("--payment-card-border:transparent");
  } else if (card.borderColor) {
    style.push(`--payment-card-border:${card.borderColor}`);
  }

  if (card.ink) {
    style.push(`--payment-card-ink:${card.ink}`);
  }

  if (typeof card.patternOpacity === "number") {
    style.push(`--payment-card-pattern-opacity:${card.patternOpacity}`);
  }

  if (card.patternBlend) {
    style.push(`--payment-card-pattern-blend:${card.patternBlend}`);
  }

  return style.length ? ` style="${style.join(";")}"` : "";
}

function renderPattern(card) {
  const preset = PATTERN_ASSETS[card.pattern];

  if (!preset) {
    return "";
  }

  if (preset.mode === "full") {
    return `
      <div class="payment-card-pattern is-full" aria-hidden="true">
        <img src="${preset.a}" alt="" />
      </div>
    `;
  }

  return `
    <div class="payment-card-pattern is-tiles" aria-hidden="true">
      <img class="payment-card-pattern-a" src="${preset.a}" alt="" />
      <img class="payment-card-pattern-b" src="${preset.b}" alt="" />
    </div>
  `;
}

function renderBrand(card) {
  const brand = card.brand;

  if (!brand) {
    return `<div class="payment-card-brand"></div>`;
  }

  if (brand.type === "text") {
    return `
      <div class="payment-card-brand">
        <p class="payment-card-brand-text">${brand.text}</p>
      </div>
    `;
  }

  const shape =
    brand.shape === "wordmark" ? " is-wordmark" : brand.shape === "wide" ? " is-wide" : "";
  const blend = brand.blend === "luminosity" ? " is-luminosity" : "";

  return `
    <div class="payment-card-brand">
      <span class="payment-card-brand-logo${shape}${blend}">
        <img src="${brand.src}" alt="${brand.alt || ""}" />
      </span>
    </div>
  `;
}

function renderBalance(card) {
  const balance = card.balance;

  if (!balance) {
    return "";
  }

  return `
    <div class="payment-card-balance${balance.embossed ? " is-embossed" : ""}">
      <p class="payment-card-amount">
        ${balance.currency ? `<span class="payment-card-amount-currency">${balance.currency}</span>` : ""}
        <span class="payment-card-amount-value">${balance.value}</span>
      </p>
      <p class="payment-card-balance-label">${balance.label}</p>
    </div>
  `;
}

function renderFooter(card) {
  if (card.showFooter === false) {
    return "";
  }

  const expiry = card.expiry
    ? `
      <div class="payment-card-expiry">
        <p class="payment-card-expiry-label">${card.expiry.label}</p>
        <p class="payment-card-expiry-value">${card.expiry.value}</p>
      </div>
    `
    : `<div class="payment-card-expiry"></div>`;

  const action = card.cta
    ? `
      <button class="payment-card-cta" type="button">
        <span>${card.cta.label}</span>
        <i class="fa-solid ${card.cta.icon}" aria-hidden="true"></i>
      </button>
    `
    : card.actionIcon
      ? `<span class="payment-card-action-icon"><i class="fa-solid ${card.actionIcon}" aria-hidden="true"></i></span>`
      : "";

  return `
    <div class="payment-card-footer${card.footerDivider ? " has-divider" : ""}">
      ${expiry}
      <div class="payment-card-action-area">${action}</div>
    </div>
  `;
}

export function renderPaymentCard(card) {
  const art = card.art
    ? `<div class="payment-card-art" aria-hidden="true"><img src="${card.art}" alt="" /></div>`
    : "";

  const edit = card.editIcon
    ? `<button class="payment-card-edit" type="button" aria-label="Editar">
        <img src="${card.editIcon}" alt="" />
      </button>`
    : "";

  const header =
    card.showHeader === false
      ? ""
      : `
      <div class="payment-card-header">
        ${renderBrand(card)}
        <div class="payment-card-motivo"></div>
        ${renderBalance(card)}
      </div>
    `;

  return `
    <article class="payment-card-molecule is-${card.key}"${buildStyle(card)} data-pen-id="${card.id}">
      ${header}
      <div class="payment-card-middle"></div>
      ${renderFooter(card)}
      ${renderPattern(card)}
      ${art}
      ${edit}
    </article>
  `;
}

/* Stack skeuomórfico: las cards se solapan con offset negativo. */
export function renderPaymentCardStack(cards, { offset = -150 } = {}) {
  return `
    <div class="payment-card-stack" style="--payment-card-stack-offset:${offset}px">
      ${cards.map((card) => renderPaymentCard(card)).join("")}
    </div>
  `;
}
