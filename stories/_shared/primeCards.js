import { renderFlag } from "./flag.js";

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
    flagCode: "GTM",
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
    flagCode: "USA",
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
    expiry: "Vence 10 / Sep / 2025",
    buttonLabel: "Ayuda",
    recommendation: 'Recomendado: 3 líneas máximo y CTA con label corto (base: "Ayuda").',
  },
  {
    path: "Molecule/Bottom Card/OKY Vales",
    key: "oky-vales",
    id: "7390:140803",
    lines: [{ label: "Código", value: "X00OOMMDFRA", copyable: true }],
    expiry: "Vence 10 / Sep / 2025",
    buttonLabel: "Ayuda",
    recommendation: "Recomendado: 1 sola línea de código y fecha de expiración visible.",
  },
  {
    path: "Molecule/Bottom Card/Code + Firma",
    key: "code-firma",
    id: "bottom-card-code-firma",
    lines: [
      { label: "Código", value: "X00OOMMDFRA", copyable: true },
      { label: "Firma", value: "7025", copyable: true },
    ],
    expiry: "Vence 10 / Sep / 2025",
    buttonLabel: "Ayuda",
    recommendation: "Recomendado: código y firma visibles, sin Aux code.",
  },
  {
    path: "Molecule/Bottom Card/With Bar Code",
    key: "with-bar-code",
    id: "88160:46958",
    lines: [{ label: "OKY Vale", value: "X00OOMMDFRA", copyable: true }],
    media: {
      type: "bar-code",
      src: "bottom-card-barcode-purple.png",
      alt: "Barcode credential",
    },
    expiry: "Vence 10 / Sep / 2025",
    buttonLabel: "Ayuda",
    recommendation: "Recomendado: código principal y barcode 224x40 alineado al área de redención.",
  },
  {
    path: "Molecule/Bottom Card/With QR Code",
    key: "with-qr-code",
    id: "88160:47242",
    lines: [{ label: "OKY Vale", value: "X00OOMMDFRA", copyable: true }],
    media: {
      type: "qr-code",
      src: "bottom-card-qr-purple.png",
      alt: "QR credential",
    },
    expiry: "Vence 10 / Sep / 2025",
    buttonLabel: "Ayuda",
    recommendation: "Recomendado: código principal y QR 100x100 alineado al área de redención.",
  },
  {
    path: "Molecule/Bottom Card/Code + BAR CODE + PIN",
    key: "code-bar-code-pin",
    id: "bottom-card-code-bar-code-pin",
    lines: [
      { label: "Código", value: "X00OOMMDFRA", copyable: true },
      { label: "PIN", value: "7025", copyable: true },
    ],
    content: [
      { type: "line", line: { label: "Código", value: "X00OOMMDFRA", copyable: true } },
      {
        type: "media",
        media: {
          type: "bar-code",
          src: "bottom-card-barcode-purple.png",
          alt: "Barcode credential",
        },
      },
      { type: "line", line: { label: "PIN", value: "7025", copyable: true } },
    ],
    expiry: "Vence 10 / Sep / 2025",
    buttonLabel: "Ayuda",
    recommendation: "Recomendado: código, barcode y PIN en orden; barcode al centro para evitar choque con el CTA.",
  },
  {
    path: "Molecule/Bottom Card/Oh Gif Card",
    key: "oh-gif-card",
    id: "7390:140804",
    lines: [
      { label: "Código", value: "X00OOMMDFRA", copyable: true },
      { label: "PIN", value: "7025", copyable: true },
    ],
    expiry: "Vence 10 / Sep / 2025",
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
  {
    path: "Molecule/Bottom Card/eCard Selectos · Primer envío",
    key: "ecard-selectos-first-send",
    id: "90147:43127",
    lines: [],
    content: [
      { type: "section-spacer" },
      {
        type: "line",
        line: {
          label: "activación",
          value: "llama: +503 2113 0203",
          icon: "fa-phone",
          copyable: false,
        },
      },
      { type: "line", line: { label: "oky VALE", value: "016519601", copyable: true } },
    ],
    expiry: "Vence 10 / Sep / 2025",
    buttonLabel: "Ayuda",
    recommendation:
      "Recomendado: usar esta variante para el primer envío de eCard Selectos; muestra instrucción de activación por teléfono y el OKY Vale copiable.",
  },
  {
    path: "Molecule/Bottom Card/eCard Selectos · Segundo envío",
    key: "ecard-selectos-second-send",
    id: "90111:22528",
    lines: [],
    content: [
      { type: "section-spacer" },
      { type: "status", value: "app acreditada" },
      {
        type: "line",
        line: { label: "e-card selectos acreditado", value: "016519601", copyable: true },
      },
      { type: "line", line: { label: "número de orden", value: "57710", copyable: true } },
    ],
    expiry: "Vence 10 / Sep / 2025",
    buttonLabel: "Ayuda",
    recommendation:
      "Recomendado: usar esta variante cuando la app ya fue acreditada; conserva el e-card acreditado y el número de orden como valores copiables.",
  },
  {
    path: "Molecule/Bottom Card/Pago de servicio con link",
    key: "service-payment-link",
    id: "90114:37688",
    lines: [],
    content: [
      { type: "line", line: { label: "identificador del pago", value: "00119000222", copyable: true } },
      {
        type: "link",
        label: "recibo",
        value: "http://skyl...",
        icon: "fa-receipt",
        modalTitle: "Recibo de pago",
        modalDescription:
          "Este link abre un WebView o modal con más información del recibo del proveedor.",
        modalCta: "Abrir recibo",
      },
    ],
    expiry: "Pago 10 / Sep / 2025",
    buttonLabel: "Ayuda",
    recommendation:
      "Recomendado: usar esta variante para servicios tipo Sky/pagos de servicios; el valor de recibo se comporta como link y abre WebView o modal informativo.",
    modal: {
      title: "Recibo de pago",
      description: "El link del recibo debe abrir un WebView o modal con la información entregada por el proveedor.",
      cta: "Abrir recibo",
    },
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

function renderBottomInlineIcon(icon) {
  if (!icon) {
    return "";
  }

  return renderLinkIcon(icon, "prime-card-bottom-inline-icon");
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
      <span class="prime-card-top-flag">
        ${renderFlag({ code: card.flagCode, size: "Medium", hasBorder: true })}
      </span>
    </div>
  `;
}

function renderBottomLine(line) {
  return `
    <div class="prime-card-bottom-line">
      <div class="prime-card-bottom-line-header">
        <span class="prime-card-bottom-line-label">${line.label}</span>
        ${line.copyable ? renderCopyIcon() : renderBottomInlineIcon(line.icon)}
      </div>
      <p class="prime-card-bottom-line-value token-code">${line.value}</p>
    </div>
  `;
}

function renderBottomSectionTitle(label) {
  return `<p class="prime-card-bottom-section-title">${label}</p>`;
}

function renderBottomSectionSpacer() {
  return `<div class="prime-card-bottom-section-spacer" aria-hidden="true"></div>`;
}

function renderBottomStatus(value) {
  return `<p class="prime-card-bottom-status token-code">${value}</p>`;
}

function renderBottomLink(item) {
  return `
    <div class="prime-card-bottom-line is-link">
      <div class="prime-card-bottom-line-header">
        <span class="prime-card-bottom-line-label">${item.label}</span>
        ${renderBottomInlineIcon(item.icon || "fa-arrow-up-right-from-square")}
      </div>
      <button
        class="prime-card-bottom-link-value token-code"
        type="button"
        aria-haspopup="dialog"
        onclick="this.closest('.card-bottom-shell').classList.add('is-modal-open')"
      >
        ${item.value}
      </button>
    </div>
  `;
}

function renderBottomMedia(media) {
  if (!media?.src) {
    return "";
  }

  return `
    <div class="prime-card-bottom-media is-${media.type}">
      <img src="${media.src}" alt="${media.alt || ""}" />
    </div>
  `;
}

function renderBottomItem(item) {
  if (item?.type === "media") {
    return renderBottomMedia(item.media);
  }

  if (item?.type === "section-title") {
    return renderBottomSectionTitle(item.label);
  }

  if (item?.type === "section-spacer") {
    return renderBottomSectionSpacer();
  }

  if (item?.type === "status") {
    return renderBottomStatus(item.value);
  }

  if (item?.type === "link") {
    return renderBottomLink(item);
  }

  return renderBottomLine(item?.line ?? item);
}

function renderBottomMain(card) {
  if (Array.isArray(card.content) && card.content.length) {
    return card.content.map((item) => renderBottomItem(item)).join("");
  }

  return `
    ${card.lines.map((line) => renderBottomLine(line)).join("")}
    ${renderBottomMedia(card.media)}
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

function renderBottomModal(card) {
  if (!card.modal) {
    return "";
  }

  return `
    <div class="prime-card-bottom-modal-overlay" role="dialog" aria-modal="true" aria-label="${card.modal.title}">
      <div class="prime-card-bottom-modal">
        <button
          class="prime-card-bottom-modal-close"
          type="button"
          aria-label="Cerrar"
          onclick="this.closest('.card-bottom-shell').classList.remove('is-modal-open')"
        >
          ×
        </button>
        <p class="prime-card-bottom-modal-title">${card.modal.title}</p>
        <p class="prime-card-bottom-modal-description">${card.modal.description}</p>
        <button class="btn btn-primary prime-card-bottom-modal-cta" type="button">
          ${card.modal.cta}
        </button>
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
    flagCode: args.flagCode?.trim() || base.flagCode,
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
    content: overrideLines ? null : base.content,
    media: base.media,
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
  return `
    <div class="prime-card-shell card-bottom-shell" data-pen-id="${card.id}">
      <article class="prime-card-molecule card-bottom-molecule is-${card.key}">
        <div class="prime-card-bottom-content">
          <div class="prime-card-bottom-main">
            ${renderBottomMain(card)}
          </div>
          <div class="prime-card-bottom-side">
            <div class="prime-card-bottom-expiry">${card.expiry || "&nbsp;"}</div>
            <div class="prime-card-bottom-button-slot">
              ${renderBottomButton(card)}
            </div>
          </div>
        </div>
      </article>
      ${renderBottomModal(card)}
    </div>
  `;
}
