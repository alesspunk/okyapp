/* ─────────────────────────────────────────────────────────
   History Card (Molecule)
   Figma:
     Service Payment    99105:47460
     OKY Cash           99135:104411
     Balance Top-up     99105:45204
     OKY Vales          99105:47763
     Archived Gift Card 99105:41197
     Yayo Approved      99105:7037
     Yayo Rejected      99105:6997

   Dos anatomías:
     layout "row"   → avatar + (fecha | monto) + fila meta
     layout "order" → header (iniciales + fecha/orden + monto + acción)
                      + divider + lista de ítems
   Todos los logos salen de assets que ya existen en /images.
───────────────────────────────────────────────────────── */

export const HISTORY_CARD_VARIANTS = [
  {
    path: "Molecule/History Card/Service Payment",
    key: "service-payment",
    id: "99105:47460",
    layout: "row",
    icon: { glyph: "fa-phone", weight: "fa-light" },
    date: "24 / AGO / 2026",
    amount: "$20.00",
    meta: {
      type: "brand",
      logo: "claro.webp",
      logoAlt: "Claro",
      brand: "Claro Residencial",
      secondaryAmount: "Q144",
    },
    recommendation:
      "Recomendado: historial de Pago de servicios. Logo del proveedor 34x22 + nombre y el monto local a la derecha.",
  },
  {
    path: "Molecule/History Card/OKY Cash",
    key: "oky-cash",
    id: "99135:104411",
    layout: "row",
    icon: { glyph: "fa-coins", weight: "fa-light" },
    date: "24 / AGO / 2026",
    amount: "+ $4.07",
    meta: { type: "order", note: "Orden #01112442" },
    chip: { label: "Acreditado", tone: "success", icon: "fa-circle-check" },
    recommendation:
      "Recomendado: movimientos de OKY Cash. Número de orden + chip de estado en tono success; monto con signo.",
  },
  {
    path: "Molecule/History Card/Balance Top-up",
    key: "balance-topup",
    id: "99105:45204",
    layout: "row",
    icon: { glyph: "fa-money-bill", weight: "fa-light" },
    date: "24 / AGO / 2026",
    amount: "+ $30.00",
    meta: { type: "order", note: "Orden #01112477" },
    chip: { label: "Reembolso", tone: "success", icon: "fa-circle-check" },
    recommendation:
      "Recomendado: recargas de saldo OKY. Misma anatomía que OKY Cash, cambia el ícono a `money-bill` y el copy del chip.",
  },
  {
    path: "Molecule/History Card/Yayo Approved",
    key: "yayo-approved",
    id: "99105:7037",
    layout: "row",
    icon: { glyph: "fa-store", weight: "fa-light" },
    date: "01 / AGO / 2026",
    amount: "-Q120.00",
    amountTone: "neutral",
    meta: {
      type: "stack",
      brand: "Tienda Don Juan",
      brandTone: "success",
      note: "ID: AP-4784",
    },
    chip: { label: "Aprobado", tone: "success", icon: "fa-circle-check" },
    recommendation:
      "Recomendado (Yayo Flow): pago aprobado. Comercio en tono success sobre el ID, chip `Aprobado` y monto en texto primario.",
  },
  {
    path: "Molecule/History Card/Yayo Rejected",
    key: "yayo-rejected",
    id: "99105:6997",
    layout: "row",
    tone: "muted",
    icon: { glyph: "fa-store", weight: "fa-light" },
    date: "24 / AGO / 2026",
    amount: "Q380.00",
    amountTone: "muted",
    meta: {
      type: "stack",
      note: "ID: RX-0041",
      brand: "Tienda Don Juan",
      noteFirst: true,
    },
    chip: { label: "Rechazada", tone: "error", icon: "fa-circle-xmark" },
    recommendation:
      "Recomendado (Yayo Flow): pago rechazado. Toda la card en gris, monto tachado, ID sobre el comercio y chip `Rechazada` en tono error.",
  },
  {
    path: "Molecule/History Card/Archived Gift Card",
    key: "archived-gift-card",
    id: "99105:41197",
    layout: "order",
    initials: "V77",
    archived: true,
    date: "03 / ABR / 2026",
    note: "Orden #01112477",
    amount: "$130.99",
    amountTone: "compact",
    /* Figma pide `inbox-out` (FA5 Pro), que no existe en el kit FA6 instalado:
       `box-archive` es el glifo equivalente disponible. */
    action: { glyph: "fa-box-archive", weight: "fa-solid", label: "Desarchivar" },
    items: [
      {
        logo: "plp-cajita-feliz.webp",
        logoAlt: "Cajita Feliz de McNuggets",
        brand: "McDonalds",
        product: "Cajita Feliz de McNuggets + Cono Vainilla y Juguete Incluido",
      },
    ],
    itemMenu: true,
    recommendation:
      "Recomendado: giftcards archivadas. Avatar de iniciales al 20% de opacidad, ícono `inbox-out` para desarchivar y el detalle del producto bajo el divider.",
  },
  {
    path: "Molecule/History Card/OKY Vales",
    key: "oky-vales",
    id: "99105:47763",
    layout: "order",
    flat: true,
    initials: "A13",
    archived: true,
    date: "24 / AGO / 2026",
    note: "Orden #01112477",
    amount: "$23.39",
    action: { glyph: "fa-ellipsis-vertical", weight: "fa-solid", label: "Más opciones", variant: "menu" },
    items: [
      { logo: "tigo.webp", logoAlt: "Tigo", brand: "Tigo", product: "Vale de monto" },
      { logo: "mcdonalds.webp", logoAlt: "McDonalds", brand: "McDonalds", product: "Cajita Feliz de McNuggets" },
      { logo: "target.webp", logoAlt: "Target", brand: "Target", product: "Gift Cards" },
    ],
    recommendation:
      "Recomendado: orden de OKY Vales con varios vales. Radio 16px y sin shadow; una fila por vale con logo 63x40, marca y producto.",
  },
];

export const HISTORY_CARD_PATHS = HISTORY_CARD_VARIANTS.map((variant) => variant.path);

export function findHistoryCard(path) {
  return HISTORY_CARD_VARIANTS.find((variant) => variant.path === path) ?? HISTORY_CARD_VARIANTS[0];
}

export function resolveHistoryCard(args = {}) {
  const base = findHistoryCard(args.variantPath);

  return {
    ...base,
    date: args.date?.trim() || base.date,
    amount: args.amount?.trim() || base.amount,
    chip: base.chip ? { ...base.chip, label: args.chipLabel?.trim() || base.chip.label } : base.chip,
  };
}

function renderAvatar(card) {
  const muted = card.tone === "muted" ? " is-muted" : "";

  if (card.initials) {
    return `
      <span class="icon-avatar${card.archived ? " is-faded" : ""}${muted}">
        <span class="icon-avatar-initials">${card.initials}</span>
      </span>
    `;
  }

  return `
    <span class="icon-avatar${muted}">
      <i class="${card.icon.weight} ${card.icon.glyph}" aria-hidden="true"></i>
    </span>
  `;
}

function renderChip(chip) {
  if (!chip) {
    return "";
  }

  return `
    <span class="history-card-chip is-${chip.tone}">
      <span class="history-card-chip-icon">
        <i class="fa-solid ${chip.icon}" aria-hidden="true"></i>
      </span>
      ${chip.label}
    </span>
  `;
}

function renderAmount(card) {
  const tone = card.amountTone ? ` is-${card.amountTone}` : "";
  return `<p class="history-card-amount${tone}">${card.amount}</p>`;
}

function renderMeta(card) {
  const meta = card.meta ?? {};

  if (meta.type === "brand") {
    return `
      <div class="history-card-meta">
        <span class="history-card-logo">
          <img src="${meta.logo}" alt="${meta.logoAlt || ""}" />
        </span>
        <p class="history-card-brand">${meta.brand}</p>
        <p class="history-card-secondary-amount">${meta.secondaryAmount}</p>
      </div>
    `;
  }

  if (meta.type === "order") {
    return `
      <div class="history-card-meta">
        <p class="history-card-brand is-nowrap">${meta.note}</p>
        ${renderChip(card.chip)}
      </div>
    `;
  }

  const brand = `<p class="history-card-brand${meta.brandTone ? ` is-${meta.brandTone}` : ""}">${meta.brand}</p>`;
  const note = `<p class="history-card-note">${meta.note}</p>`;

  return `
    <div class="history-card-meta">
      <div class="history-card-meta-stack">
        ${meta.noteFirst ? `${note}${brand}` : `${brand}${note}`}
      </div>
      ${renderChip(card.chip)}
    </div>
  `;
}

function renderRowCard(card) {
  return `
    <article class="history-card-molecule is-${card.key}" data-pen-id="${card.id}">
      ${renderAvatar(card)}
      <div class="history-card-body">
        <div class="history-card-headline">
          <p class="history-card-date${card.tone === "muted" ? " is-muted" : ""}">${card.date}</p>
          ${renderAmount(card)}
        </div>
        ${renderMeta(card)}
      </div>
    </article>
  `;
}

function renderOrderCard(card) {
  const action = card.action
    ? `
      <button
        class="history-card-order-action${card.action.variant === "menu" ? " is-menu" : ""}"
        type="button"
        aria-label="${card.action.label}"
      >
        <i class="${card.action.weight} ${card.action.glyph}" aria-hidden="true"></i>
      </button>
    `
    : "";

  return `
    <article class="history-card-molecule is-order is-${card.key}${card.flat ? " is-flat" : ""}" data-pen-id="${card.id}">
      <div class="history-card-order-head">
        ${renderAvatar(card)}
        <div class="history-card-order-titles">
          <p class="history-card-date">${card.date}</p>
          <p class="history-card-note">${card.note}</p>
        </div>
        ${renderAmount(card)}
        ${action}
      </div>
      <hr class="history-card-divider" />
      <div class="history-card-items">
        ${card.items
          .map(
            (item) => `
          <div class="history-card-item">
            <span class="history-card-item-logo">
              <img src="${item.logo}" alt="${item.logoAlt || ""}" />
            </span>
            <div class="history-card-item-text">
              <p class="history-card-item-brand">${item.brand}</p>
              <p class="history-card-item-product">${item.product}</p>
            </div>
            ${
              card.itemMenu
                ? `<button class="history-card-order-action is-menu" type="button" aria-label="Más opciones">
                    <i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i>
                  </button>`
                : ""
            }
          </div>
        `,
          )
          .join("")}
      </div>
    </article>
  `;
}

export function renderHistoryCard(card) {
  return card.layout === "order" ? renderOrderCard(card) : renderRowCard(card);
}
