export const CARD_TOP_VARIANTS = [
  {
    path: "Molecule/Top Card/OKY Vales",
    key: "oky-vales",
    id: "7390:140799",
    kind: "oky-vales",
    brandLabel: "",
    showBrandLabel: false,
    heroImage: "pollo-campero.webp",
    heroAlt: "Pollo Campero gift card",
    flagImage: "guatemala-flag.png",
    flagAlt: "Guatemala flag",
    footerLeftLabel: "Qué incluye",
    footerRightLabel: "",
    recommendation: 'Recomendado: arte principal centrado tipo card y un solo CTA inferior (base: "Qué incluye").',
  },
  {
    path: "Molecule/Top Card/Gift Card",
    key: "gift-card",
    id: "7390:140798",
    kind: "gift-card",
    brandLabel: "Target",
    showBrandLabel: true,
    heroImage: "target.webp",
    heroAlt: "Target gift card",
    flagImage: "usa-flag.png",
    flagAlt: "USA flag",
    footerLeftLabel: "Terms & Conditions",
    footerRightLabel: "Brand Disclaimer",
    recommendation:
      'Recomendado: brand label corto centrado (base: "Target") y dos CTAs inferiores en una sola línea.',
  },
];

export const CARD_BOTTOM_VARIANTS = [
  {
    path: "Molecule/Bottom Card/Default",
    key: "default",
    id: "7390:140801",
    lines: [
      { label: "Código", value: "X00OOMMDFRA", copyable: true },
      { label: "PIN", value: "7025", copyable: true },
      { label: "Aux code", value: "09109201", copyable: true },
    ],
    expiry: "10 / Sep / 2025",
    buttonLabel: "Ayuda",
    recommendation: 'Recomendado: 3 líneas máximo y CTA con label corto (base: "Ayuda").',
  },
  {
    path: "Molecule/Bottom Card/Canjeado",
    key: "canjeado",
    id: "7479:68596",
    stampImage: "Stamp_canjeado@3x.webp",
    stampAlt: "Stamp Canjeado",
    transactionId: "",
    expiry: "10 / Sep / 2025",
    buttonLabel: "",
    recommendation: "Recomendado: stamp centrado, sin CTA lateral y una sola línea de fecha.",
  },
  {
    path: "Molecule/Bottom Card/Fallido",
    key: "fallido",
    id: "7479:68598",
    stampImage: "Stamp_Comprafallida@3x.webp",
    stampAlt: "Stamp Compra Fallida",
    transactionId: "ID transacción #09091090192",
    expiry: "",
    buttonLabel: "",
    recommendation: "Recomendado: stamp centrado y línea inferior con ID transacción y acción de copy.",
  },
  {
    path: "Molecule/Bottom Card/En Proceso",
    key: "en-proceso",
    id: "7479:68597",
    stampImage: "Stamp_Enproceso@3x.webp",
    stampAlt: "Stamp En Proceso",
    transactionId: "ID transacción #09091090192",
    expiry: "",
    buttonLabel: "",
    recommendation: "Recomendado: stamp centrado y línea inferior con ID transacción y acción de copy.",
  },
  {
    path: "Molecule/Bottom Card/Expirado",
    key: "expirado",
    id: "7479:68599",
    stampImage: "Stamp_Expirado@3x.webp",
    stampAlt: "Stamp Expirado",
    transactionId: "ID transacción #09091090192",
    expiry: "10 / Sep / 2025",
    buttonLabel: "",
    recommendation: "Recomendado: stamp centrado y línea inferior con ID transacción, copy y fecha.",
  },
  {
    path: "Molecule/Bottom Card/OKY Vales",
    key: "oky-vales",
    id: "7390:140803",
    lines: [{ label: "Código", value: "X00OOMMDFRA", copyable: true }],
    expiry: "10 / Sep / 2025",
    buttonLabel: "Ayuda",
    recommendation: "Recomendado: 1 sola línea de código y fecha de expiración visible.",
  },
  {
    path: "Molecule/Bottom Card/Oh Gif Card",
    key: "oh-gif-card",
    id: "7390:140804",
    lines: [
      { label: "Código", value: "X00OOMMDFRA", copyable: true },
      { label: "PIN", value: "7025", copyable: true },
    ],
    expiry: "10 / Sep / 2025",
    buttonLabel: "Ayuda",
    recommendation: "Recomendado: 2 líneas visibles y CTA de soporte a la derecha.",
  },
  {
    path: "Molecule/Bottom Card/Gift Card",
    key: "gift-card",
    id: "7390:140805",
    lines: [
      { label: "Reward Credential", value: "9905839250955525", copyable: true },
      { label: "Access Number", value: "7025", copyable: true },
      { label: "Event Number", value: "09109201", copyable: true },
    ],
    expiry: "",
    buttonLabel: "Help",
    recommendation: "Recomendado: credenciales largas y CTA en inglés para gift cards internacionales.",
  },
  {
    path: "Molecule/Bottom Card/Telco",
    key: "telco",
    id: "7390:140806",
    lines: [{ label: "Quien lo envió", value: "Jorge Ramos", copyable: false }],
    expiry: "",
    buttonLabel: "Ayuda",
    recommendation: "Recomendado: remitente visible y CTA de ayuda sin bloques extra de código.",
  },
];

export const CARD_TOP_PATHS = CARD_TOP_VARIANTS.map((variant) => variant.path);
export const CARD_BOTTOM_PATHS = CARD_BOTTOM_VARIANTS.map((variant) => variant.path);

function renderLinkIcon(icon = "fa-arrow-up-right-from-square", className = "") {
  return `
    <span class="fa-icon fa-icon-card-use ${className}" aria-hidden="true">
      <i class="fa-thin ${icon}"></i>
    </span>
  `;
}

function renderCopyIcon() {
  return renderLinkIcon("fa-copy", "prime-card-copy-icon");
}

function renderTopFooter(card) {
  if (card.footerRightLabel) {
    return `
      <div class="prime-card-top-footer is-split">
        <span class="prime-card-top-footer-link is-left">
          <span class="prime-card-top-footer-text">${card.footerLeftLabel}</span>
          ${renderLinkIcon()}
        </span>
        <span class="prime-card-top-footer-link is-right">
          <span class="prime-card-top-footer-text">${card.footerRightLabel}</span>
          ${renderLinkIcon()}
        </span>
      </div>
    `;
  }

  return `
    <div class="prime-card-top-footer is-single">
      <span class="prime-card-top-footer-link is-single">
        <span class="prime-card-top-footer-text">${card.footerLeftLabel}</span>
        ${renderLinkIcon()}
      </span>
    </div>
  `;
}

function renderTopBody(card) {
  return `
    <div class="prime-card-top-body">
      <div class="prime-card-top-hero is-${card.kind}">
        <img src="${card.heroImage}" alt="${card.heroAlt}" />
      </div>
    </div>
  `;
}

function renderTopHeader(card) {
  return `
    <div class="prime-card-top-header">
      <img class="prime-card-top-logo" src="logo-card-top.svg" alt="OKY" />
      <div class="prime-card-top-header-main">
        ${card.showBrandLabel ? `<span class="prime-card-top-brand token-product-text">${card.brandLabel}</span>` : ""}
      </div>
      <span class="dropdown-flag-sm prime-card-top-flag" aria-hidden="true">
        <img src="${card.flagImage}" alt="${card.flagAlt}" />
      </span>
    </div>
  `;
}

function renderBottomLine(line) {
  return `
    <div class="prime-card-bottom-line">
      <div class="prime-card-bottom-line-header">
        <span class="prime-card-bottom-line-label">${line.label}</span>
        ${line.copyable ? renderCopyIcon() : ""}
      </div>
      <p class="prime-card-bottom-line-value token-code">${line.value}</p>
    </div>
  `;
}

function renderBottomButton(card) {
  return `
    <button
      class="btn btn-primary prime-card-bottom-help-btn ${card.showButtonLabel ? "has-label" : "is-icon-only"}"
      type="button"
    >
      <span class="prime-card-bottom-help-icon" aria-hidden="true">
        <img src="${card.whatsappImage}" alt="" />
      </span>
      ${card.showButtonLabel ? `<span class="prime-card-bottom-help-label">${card.buttonLabel}</span>` : ""}
    </button>
  `;
}

function renderBottomStampCard(card) {
  const showTransaction = Boolean(card.transactionId);
  const showExpiry = Boolean(card.expiry);

  return `
    <div class="prime-card-bottom-status-body">
      <div class="prime-card-bottom-stamp-wrap">
        <img class="prime-card-bottom-stamp" src="${card.stampImage}" alt="${card.stampAlt || ""}" />
      </div>
    </div>
    <div class="prime-card-bottom-status-meta">
      <div class="prime-card-bottom-status-meta-main ${showExpiry && showTransaction ? "has-split" : ""}">
        ${
          showTransaction
            ? `
              <div class="prime-card-bottom-status-transaction">
                <span class="prime-card-bottom-status-text">${card.transactionId}</span>
                ${renderCopyIcon()}
              </div>
            `
            : ""
        }
        ${
          showExpiry
            ? `<div class="prime-card-bottom-status-expiry ${showTransaction ? "is-right" : "is-centered"}">${card.expiry}</div>`
            : ""
        }
      </div>
    </div>
  `;
}

export function findCardTop(path) {
  return CARD_TOP_VARIANTS.find((variant) => variant.path === path) ?? CARD_TOP_VARIANTS[0];
}

export function findCardBottom(path) {
  return CARD_BOTTOM_VARIANTS.find((variant) => variant.path === path) ?? CARD_BOTTOM_VARIANTS[0];
}

export function resolveCardTop(args = {}) {
  const base = findCardTop(args.variantPath);

  return {
    ...base,
    brandLabel: args.brandLabel?.trim() || base.brandLabel,
    showBrandLabel: typeof args.showBrandLabel === "boolean" ? args.showBrandLabel : base.showBrandLabel,
    heroImage: args.heroImage?.trim() || base.heroImage,
    heroAlt: args.heroAlt?.trim() || base.heroAlt,
    flagImage: args.flagImage?.trim() || base.flagImage,
    flagAlt: args.flagAlt?.trim() || base.flagAlt,
    footerLeftLabel: args.footerLeftLabel?.trim() || base.footerLeftLabel,
    footerRightLabel: args.footerRightLabel?.trim() || base.footerRightLabel,
  };
}

export function resolveCardBottom(args = {}) {
  const base = findCardBottom(args.variantPath);
  const overrideLines = Array.isArray(args.lines) && args.lines.length ? args.lines : null;

  return {
    ...base,
    lines: overrideLines ?? base.lines,
    stampImage: args.stampImage?.trim() || base.stampImage || "",
    stampAlt: args.stampAlt?.trim() || base.stampAlt || "",
    transactionId: typeof args.transactionId === "string" ? args.transactionId.trim() : base.transactionId || "",
    expiry: typeof args.expiry === "string" ? args.expiry.trim() : base.expiry,
    buttonLabel: args.buttonLabel?.trim() || base.buttonLabel,
    showButtonLabel: typeof args.showButtonLabel === "boolean" ? args.showButtonLabel : true,
    whatsappImage: args.whatsappImage?.trim() || "whatsapp-icon-card-bottom.png",
  };
}

export function renderCardTop(card) {
  return `
    <div class="prime-card-shell card-top-shell" data-pen-id="${card.id}">
      <article class="prime-card-molecule card-top-molecule is-${card.kind}">
        ${renderTopHeader(card)}
        ${renderTopBody(card)}
        ${renderTopFooter(card)}
      </article>
    </div>
  `;
}

export function renderCardBottom(card) {
  if (card.stampImage) {
    return `
      <div class="prime-card-shell card-bottom-shell" data-pen-id="${card.id}">
        <article class="prime-card-molecule card-bottom-molecule is-${card.key} is-status-card">
          ${renderBottomStampCard(card)}
        </article>
      </div>
    `;
  }

  return `
    <div class="prime-card-shell card-bottom-shell" data-pen-id="${card.id}">
      <article class="prime-card-molecule card-bottom-molecule is-${card.key}">
        <div class="prime-card-bottom-content">
          <div class="prime-card-bottom-main">
            ${card.lines.map((line) => renderBottomLine(line)).join("")}
          </div>
          <div class="prime-card-bottom-side">
            <div class="prime-card-bottom-expiry">${card.expiry || "&nbsp;"}</div>
            <div class="prime-card-bottom-button-slot">
              ${renderBottomButton(card)}
            </div>
          </div>
        </div>
      </article>
    </div>
  `;
}
