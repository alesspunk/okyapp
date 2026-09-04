/* ─────────────────────────────────────────────────────────
   Reminder Card (Molecule)
   Figma: 99105:14325 (card) · 99105:14130 (carousel en pantalla)
   Variantes: Default · With Brand · With Channels
───────────────────────────────────────────────────────── */

export const REMINDER_CARD_VARIANTS = [
  {
    path: "Molecule/Reminder Card/Default",
    key: "default",
    id: "99105:14139",
    title: "Electricidad de Daniel Paz",
    body: "La última vez que pagaste fue el 23 de Septiembre.",
    ctaLabel: "Ver saldo",
    brand: null,
    pills: [],
    recommendation:
      "Recomendado: recordatorio sin marca ni canal; título, contexto de la última vez que pagó y un solo CTA.",
  },
  {
    path: "Molecule/Reminder Card/With Brand",
    key: "with-brand",
    id: "99105:14325",
    title: "Electricidad de Daniel Paz",
    body: "Hace 25 días pagaste $43.05 en electricidad.",
    ctaLabel: "Ver saldo",
    brand: {
      src: "eggsa.png",
      alt: "EEGSA",
    },
    pills: [],
    recommendation:
      "Recomendado: logo del proveedor 71x45 a la izquierda del contexto; usar cuando el recordatorio viene de una marca reconocible.",
  },
  {
    path: "Molecule/Reminder Card/With Channels",
    key: "with-channels",
    id: "99105:14156",
    /* Oculta: el producto no la necesita por ahora. Se mantiene la
       definición (y su CSS de pills) para poder retomarla. */
    hidden: true,
    title: "Agua de mi mamá",
    body: "Aviso automático antes del 2 de Julio.",
    ctaLabel: "Pagar ahora",
    brand: null,
    pills: [
      { label: "Push", type: "channel" },
      { label: "Empagua", type: "provider" },
    ],
    recommendation:
      "Recomendado: pill de canal (success) + pill de proveedor (outlined) cuando el recordatorio es un aviso automático programado.",
  },
  {
    path: "Molecule/Reminder Card/Yayo Approval",
    key: "yayo-approval",
    id: "99101:21022",
    kind: "approval",
    amount: { currency: "Q", value: "380.00" },
    merchant: "Tienda Don Juan",
    countdown: { label: "Vence en:", value: "13:14" },
    actions: [
      { key: "reject", label: "Rechazar", icon: "fa-xmark", tone: "error" },
      { key: "approve", label: "Aprobar pago", icon: "fa-check", tone: "success" },
    ],
    recommendation:
      "Recomendado (Yayo Flow): monto grande + comercio, chip Super Ribbon con countdown de vencimiento y doble acción rechazar/aprobar. Sin CTA de una sola vía.",
  },
];

/* Variantes que se listan en Storybook. `findReminderCard` sigue
   resolviendo las ocultas si alguien pasa su path a mano. */
export const VISIBLE_REMINDER_CARD_VARIANTS = REMINDER_CARD_VARIANTS.filter((variant) => !variant.hidden);

export const REMINDER_CARD_PATHS = VISIBLE_REMINDER_CARD_VARIANTS.map((variant) => variant.path);

export function findReminderCard(path) {
  return REMINDER_CARD_VARIANTS.find((variant) => variant.path === path) ?? REMINDER_CARD_VARIANTS[0];
}

export function resolveReminderCard(args = {}) {
  const base = findReminderCard(args.variantPath);

  return {
    ...base,
    title: args.title?.trim() || base.title,
    body: args.body?.trim() || base.body,
    ctaLabel: args.ctaLabel?.trim() || base.ctaLabel,
    showMenu: typeof args.showMenu === "boolean" ? args.showMenu : true,
    showCta: typeof args.showCta === "boolean" ? args.showCta : true,
  };
}

function renderMenu(card) {
  if (card.showMenu === false) {
    return "";
  }

  return `
    <button class="reminder-card-menu" type="button" aria-label="Más opciones">
      <i class="fa-light fa-ellipsis-vertical" aria-hidden="true"></i>
    </button>
  `;
}

function renderPills(card) {
  if (!card.pills?.length) {
    return "";
  }

  return `
    <div class="reminder-card-pills">
      ${card.pills
        .map(
          (pill) => `
        <span class="reminder-card-pill is-${pill.type}">${pill.label}</span>
      `,
        )
        .join("")}
    </div>
  `;
}

function renderBody(card) {
  const bodyText = `<p class="reminder-card-body">${card.body}</p>`;

  if (!card.brand?.src) {
    return bodyText;
  }

  return `
    <div class="reminder-card-brand-row">
      <div class="reminder-card-brand">
        <img src="${card.brand.src}" alt="${card.brand.alt || ""}" />
      </div>
      ${bodyText}
    </div>
  `;
}

function renderCta(card) {
  if (card.showCta === false) {
    return "";
  }

  return `
    <div class="reminder-card-actions">
      <button class="btn btn-primary btn-medium reminder-card-cta" type="button">${card.ctaLabel}</button>
    </div>
  `;
}

/* Chip de countdown: reutiliza el átomo Super Ribbon con el type `vence`.
   Colores desde los tokens de soporte: warning (fondo/ícono/contador) y error (label). */
function renderCountdownRibbon(card) {
  if (!card.countdown) {
    return "";
  }

  return `
    <div class="super-ribbon super-ribbon-type-vence">
      <span class="super-ribbon-icon"><i class="fa-solid fa-clock" aria-hidden="true"></i></span>
      <span class="super-ribbon-text super-ribbon-countdown">
        <span class="super-ribbon-countdown-label">${card.countdown.label}</span>
        <span class="super-ribbon-countdown-value">${card.countdown.value}</span>
      </span>
    </div>
  `;
}

function renderApprovalActions(card) {
  if (!card.actions?.length) {
    return "";
  }

  return `
    <div class="reminder-card-approval-actions">
      ${card.actions
        .map(
          (action) => `
        <button class="action-circle is-${action.key}" type="button">
          <span class="action-circle-icon">
            <i class="fa-solid ${action.icon}" aria-hidden="true"></i>
          </span>
          <span class="action-circle-label">${action.label}</span>
        </button>
      `,
        )
        .join("")}
    </div>
  `;
}

/* Variante prima (Yayo Flow): monto + comercio + countdown + doble acción. */
function renderApprovalCard(card) {
  return `
    <article class="reminder-card-molecule is-${card.key}" data-pen-id="${card.id}">
      <div class="reminder-card-approval-head">
        <div class="reminder-card-approval-amount">
          <p class="amount-display">
            <span class="amount-display-currency">${card.amount.currency}</span>
            <span class="amount-display-value">${card.amount.value}</span>
          </p>
          <p class="reminder-card-merchant">${card.merchant}</p>
        </div>
        ${renderCountdownRibbon(card)}
      </div>
      ${renderApprovalActions(card)}
    </article>
  `;
}

export function renderReminderCard(card) {
  if (card.kind === "approval") {
    return renderApprovalCard(card);
  }

  return `
    <article class="reminder-card-molecule is-${card.key}" data-pen-id="${card.id}">
      <div class="reminder-card-top">
        <div class="reminder-card-main">
          <h3 class="reminder-card-title">${card.title}</h3>
          ${renderPills(card)}
          ${renderBody(card)}
        </div>
        ${renderMenu(card)}
      </div>
      ${renderCta(card)}
    </article>
  `;
}

export function renderReminderCarousel(cards, { activeIndex = 0, label = "Recordatorios" } = {}) {
  return `
    <div class="reminder-carousel">
      <div class="reminder-carousel-head">
        <span class="token-exchange reminder-carousel-label">${label}</span>
      </div>
      <div class="reminder-carousel-viewport">
        <div class="reminder-carousel-track">
          ${cards.map((card) => renderReminderCard(card)).join("")}
        </div>
      </div>
      <div class="carrusel-dots-wrap">
        <div class="carrusel-dots">
          ${cards
            .map((_, index) => `<span class="carrusel-dot${index === activeIndex ? " is-active" : ""}"></span>`)
            .join("")}
        </div>
      </div>
    </div>
  `;
}
