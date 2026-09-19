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
    path: "Molecule/Bottom Card/BAR CODE + Code + PIN",
    key: "bar-code-code-pin",
    id: "bottom-card-bar-code-code-pin",
    lines: [
      { label: "Código", value: "X00OO MMDFR AX00O OMMDF RAX", copyable: true },
      { label: "PIN", value: "7025", copyable: true },
    ],
    content: [
      {
        type: "media",
        media: {
          type: "bar-code",
          src: "bottom-card-barcode-purple.png",
          alt: "Barcode credential",
        },
      },
      { type: "line", line: { label: "Código", value: "X00OO MMDFR AX00O OMMDF RAX", copyable: true } },
      { type: "line", line: { label: "PIN", value: "7025", copyable: true } },
    ],
    expiry: "",
    buttonLabel: "Ayuda",
    recommendation:
      "Recomendado: barcode, código y PIN en orden; código soporta 23 caracteres agrupados cada 5 con espacio; sin fecha de vencimiento.",
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
    buttonLabel: "Ayuda",
    recommendation: "Recomendado: credenciales largas y CTA en inglés para gift cards internacionales.",
  },
  {
    /* Las gift cards de USA no reparten tres credenciales: se copia un
       código y se va a canjear a la tienda de la marca, así que la
       parte de abajo es una sola línea y el CTA de ayuda va outlined
       para no competir con ella. */
    path: "Molecule/Bottom Card/Gift Card USA",
    key: "gift-card-usa",
    id: "101310:7431",
    lines: [{ label: "Copia el código", value: "X232 35DF RA", copyable: true }],
    content: [
      { type: "line", line: { label: "Copia el código", value: "X232 35DF RA", copyable: true } },
      {
        type: "action",
        action: {
          label: "URL",
          value: "https://www.giftcardmall.com/redeem",
          copyable: true,
          buttonLabel: "Pégalo aquí",
        },
      },
    ],
    expiry: "",
    buttonLabel: "Ayuda",
    recommendation: "Recomendado: código, URL con su CTA de pegar, y el de ayuda en outlined abajo a la derecha.",
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

/* El icono de copiar es un botón de verdad: el prototipo escucha
   data-action y lo lleva al portapapeles. En las stories sueltas no hay
   quien escuche y se queda en un icono, como estaba. */
function renderCopyIcon(value) {
  return `
    <button class="prime-card-copy" type="button" data-action="copy-code"
      data-value="${value == null ? "" : String(value)}" aria-label="Copiar">
      ${renderLinkIcon("fa-copy", "prime-card-copy-icon")}
    </button>
  `;
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
        ${line.copyable ? renderCopyIcon(line.value) : ""}
      </div>
      <p class="prime-card-bottom-line-value token-code">${line.value}</p>
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
      ${media.caption ? `<p class="prime-card-bottom-media-caption">${media.caption}</p>` : ""}
    </div>
  `;
}

/* La línea de la URL no enseña la dirección: enseña el botón que la
   pega donde toca. La etiqueta y el icono de copiar son los mismos que
   los de un código. */
function renderBottomAction(action) {
  if (!action) return "";
  return `
    <div class="prime-card-bottom-line is-action">
      <div class="prime-card-bottom-line-header">
        <span class="prime-card-bottom-line-label">${action.label}</span>
        ${action.copyable ? renderCopyIcon(action.value) : ""}
      </div>
      <button class="btn btn-primary prime-card-bottom-paste" type="button">${action.buttonLabel}</button>
    </div>
  `;
}

function renderBottomItem(item) {
  if (item?.type === "media") {
    return renderBottomMedia(item.media);
  }

  if (item?.type === "action") {
    return renderBottomAction(item.action);
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

/* Clarita, la asistente de la card. Ocupa el sitio y la altura que
   tenía el botón de ayuda, pero no es un botón: se asoma sola y ofrece
   lo que sabe hacer, al estilo de Clippy. No hay nada que pulsar —lo
   que importa aquí es que alguien se ofrezca antes de que te pierdas
   canjeando—, así que no roba el toque ni entra en el orden de
   tabulación.

   Es un personaje, no un icono: la cabeza es la marca de OKY —el aro
   con la sonrisa— sobre un cuerpecito con brazos y pies, dibujado en
   SVG para que herede el color, escale sin pesar y se pueda animar por
   partes. Saluda con la mano al aparecer y después se queda
   balanceándose. */
function renderClarita() {
  return `
    <div class="prime-card-clarita" role="status" aria-label="Clarita: ¿Necesitas ayuda con el canje?">
      <p class="prime-card-clarita-bubble">¿Necesitas ayuda<br />con el canje?</p>
      <span class="prime-card-clarita-pet" aria-hidden="true">
        <svg viewBox="0 0 48 58" xmlns="http://www.w3.org/2000/svg" focusable="false">
          <defs>
            <linearGradient id="oky-clarita-vol" x1="0.18" y1="0" x2="0.72" y2="1">
              <stop offset="0" stop-color="#7a45bd" />
              <stop offset="0.52" stop-color="#552588" />
              <stop offset="1" stop-color="#330063" />
            </linearGradient>
            <linearGradient id="oky-clarita-ring" x1="0.15" y1="0.05" x2="0.8" y2="1">
              <stop offset="0" stop-color="#8b57cc" />
              <stop offset="0.5" stop-color="#552588" />
              <stop offset="1" stop-color="#3a1168" />
            </linearGradient>
          </defs>
          <ellipse class="clarita-shadow" cx="24" cy="55.6" rx="10.6" ry="2.2" />
          <g class="clarita-body">
            <rect class="clarita-arm is-left clarita-back" x="9" y="33.2" width="5" height="11.4" rx="2.5" />
            <rect class="clarita-leg clarita-back" x="17.2" y="44.6" width="5.4" height="8.6" rx="2.7" />
            <rect class="clarita-leg" x="25.4" y="44.6" width="5.4" height="8.6" rx="2.7" />
            <rect class="clarita-torso" x="13.8" y="31.2" width="20.4" height="17" rx="7.4" />
            <ellipse class="clarita-gloss" cx="19.6" cy="35.6" rx="3.9" ry="2.5" />
            <rect class="clarita-arm is-right" x="34" y="33.2" width="5" height="11.4" rx="2.5" />
            <g class="clarita-head">
              <circle class="clarita-ring" cx="24" cy="17.4" r="12.6" />
              <path class="clarita-rim" d="M14.1 9.7 A12.6 12.6 0 0 1 30.6 6.6" />
              <path class="clarita-smile" d="M18.2 18.4 Q24 25.6 29.8 18.4" />
            </g>
          </g>
        </svg>
      </span>
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

function replaceContentLines(content, lines) {
  let next = 0;
  return content
    .map((item) => {
      /* Solo se relevan los códigos: el barcode y el botón de la URL
         no son una línea que se pueda sustituir. */
      if (item?.type === "media" || item?.type === "action") return item;
      const line = lines[next];
      next += 1;
      return line ? { type: "line", line } : null;
    })
    .filter(Boolean);
}

export function resolveCardBottom(args = {}) {
  const base = findCardBottom(args.variantPath);
  const overrideLines = Array.isArray(args.lines) ? args.lines : null;

  return {
    ...base,
    /* Una lista vacía es una respuesta válida: el vale compartido
       cambia sus códigos por el sello. */
    lines: overrideLines ?? base.lines,
    /* Cambiar los códigos de una variante que intercala barcode no
       puede tirarlo: las líneas nuevas entran donde iban las viejas y
       el media se queda en su sitio. Con la lista vacía —el vale
       compartido— no queda orden que respetar. */
    content: overrideLines
      ? base.content && overrideLines.length
        ? replaceContentLines(base.content, overrideLines)
        : null
      : base.content,
    media: args.media || base.media,
    expiry: typeof args.expiry === "string" ? args.expiry.trim() : base.expiry,
    buttonLabel: args.buttonLabel?.trim() || base.buttonLabel,
    showButtonLabel: typeof args.showButtonLabel === "boolean" ? args.showButtonLabel : true,
    showButton: typeof args.showButton === "boolean" ? args.showButton : true,
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
          ${
            /* showButton: false deja la parte de abajo sin columna de
               ayuda —el vale compartido no tiene nada que consultar—. */
            card.showButton === false
              ? ""
              : `
            <div class="prime-card-bottom-side">
              <div class="prime-card-bottom-expiry">${card.expiry || "&nbsp;"}</div>
              <div class="prime-card-bottom-button-slot">
                ${renderClarita()}
              </div>
            </div>
          `
          }
        </div>
      </article>
    </div>
  `;
}
