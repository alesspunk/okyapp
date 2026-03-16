export const MIDDLE_CARD_VARIANTS = [
  {
    path: "Molecule/Middle Card/Vale de Monto",
    key: "vale-de-monto",
    id: "6991:146235",
    kind: "amount",
    title: "Vale de Monto",
    currency: "Q",
    amount: "1,000",
    leftLabel: "Mostrar al cajero",
    rightLabel: "Como canjear",
    image: "",
    recommendation: 'Recomendado: título máx. 14 caracteres ("Vale de Monto") · monto máx. 5 dígitos + separadores.',
  },
  {
    path: "Molecule/Middle Card/Con Logo",
    key: "with-logo",
    id: "local:middle-card-with-logo",
    kind: "egift",
    title: "Brand Name eGift Card",
    titleImage: "logo-middle-card.png",
    titleImageAlt: "Brand logo",
    currency: "$",
    amount: "10",
    leftLabel: "In Store, Online",
    rightLabel: "Redemption Instructions",
    image: "",
    recommendation:
      "Recomendado: usar logo horizontal en el header superior cuando la marca necesite mayor presencia visual que un título de texto.",
  },
  {
    path: "Molecule/Middle Card/Vale de Producto",
    key: "vale-de-producto",
    id: "6991:146181",
    kind: "product",
    title: "Cajita Feliz de McNuggets + Cono Vainilla y Juguete incluido",
    currency: "",
    amount: "",
    leftLabel: "Mostrar al cajero",
    rightLabel: "Como canjear",
    image: "middle-card-vale-de-producto.png",
    recommendation:
      'Recomendado: título máx. 60 caracteres (base Figma: "Cajita Feliz de McNuggets + Cono Vainilla y Juguete incluido").',
  },
  {
    path: "Molecule/Middle Card/eGift Card",
    key: "egift-card",
    id: "6991:146335",
    kind: "egift",
    title: "Brand Name eGift Card",
    currency: "$",
    amount: "10",
    leftLabel: "In Store, Online",
    rightLabel: "Redemption Instructions",
    image: "",
    recommendation:
      'Recomendado: título máx. 21 caracteres ("Brand Name eGift Card") · monto máx. 2 dígitos para esta composición.',
  },
];

export const MIDDLE_CARD_PATHS = MIDDLE_CARD_VARIANTS.map((variant) => variant.path);
export const DISCOUNT_RIBBON_TYPES = ["Normal", "Por tiempo", "Finito", "Por temporada", "OKY"];

function discountRibbonTypeClass(type) {
  return `discount-ribbon-type-${type
    .toLowerCase()
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")}`;
}

function renderDiscountRibbonWrap(card) {
  const sizeClass = card.discountRibbonSize === "Small" ? "discount-ribbon-wrap-small" : "";
  return `
    <div class="middle-card-ribbon-slot">
      <div class="discount-ribbon discount-ribbon-wrap ${sizeClass} ${discountRibbonTypeClass(card.discountRibbonType)}">
        <span class="discount-ribbon-text token-price-percent">${card.discountRibbonLabel}</span>
      </div>
    </div>
  `;
}

function renderFooter(card) {
  return `
    <div class="middle-card-footer">
      <span class="middle-card-footer-start">${card.leftLabel}</span>
      <span class="middle-card-footer-end">${card.rightLabel}</span>
      <span class="fa-icon fa-icon-card-use middle-card-link-icon" aria-hidden="true">
        <i class="fa-thin fa-arrow-up-right-from-square"></i>
      </span>
    </div>
  `;
}

function renderTitleSlot(card) {
  if (card.titleImage) {
    return `
      <div class="middle-card-title middle-card-title-media" aria-label="${card.titleImageAlt || card.title}">
        <img src="${card.titleImage}" alt="${card.titleImageAlt || card.title}" />
      </div>
    `;
  }

  return `<p class="middle-card-title">${card.title}</p>`;
}

function renderBody(card) {
  if (card.kind === "product") {
    return `
      <div class="middle-card-content">
        <div class="middle-card-main">
          ${renderTitleSlot(card)}
          <div class="middle-card-center">
            <figure class="middle-card-product-figure">
              <img src="${card.image}" alt="${card.title}" />
            </figure>
          </div>
        </div>
        ${renderFooter(card)}
      </div>
    `;
  }

  return `
    <div class="middle-card-content">
      <div class="middle-card-main">
        ${renderTitleSlot(card)}
        <div class="middle-card-center">
          <div class="middle-card-value">
            <span class="middle-card-currency">${card.currency}</span>
            <p class="middle-card-amount">${card.amount}</p>
          </div>
        </div>
      </div>
      ${renderFooter(card)}
    </div>
  `;
}

export function findMiddleCard(path) {
  return MIDDLE_CARD_VARIANTS.find((variant) => variant.path === path) ?? MIDDLE_CARD_VARIANTS[0];
}

export function resolveMiddleCard(args = {}) {
  const base = findMiddleCard(args.variantPath);
  return {
    ...base,
    pageContext: args.pageContext || "PDP",
    title: args.title?.trim() || base.title,
    titleImage: args.titleImage?.trim() || base.titleImage || "",
    titleImageAlt: args.titleImageAlt?.trim() || base.titleImageAlt || base.title,
    currency: args.currency?.trim() || base.currency,
    amount: args.amount?.trim() || base.amount,
    leftLabel: args.leftLabel?.trim() || base.leftLabel,
    rightLabel: args.rightLabel?.trim() || base.rightLabel,
    image: args.image?.trim() || base.image,
    showDiscountRibbon: args.showDiscountRibbon === true,
    discountRibbonType: DISCOUNT_RIBBON_TYPES.includes(args.discountRibbonType) ? args.discountRibbonType : "Normal",
    discountRibbonLabel: args.discountRibbonLabel?.trim() || "25% OFF",
    discountRibbonSize:
      args.discountRibbonSize || (args.pageContext === "Checkout" ? "Small" : "Default"),
  };
}

export function renderMiddleCard(card) {
  return `
    <div
      class="middle-card-shell is-${card.pageContext.toLowerCase()} ${card.showDiscountRibbon ? "has-discount-ribbon" : ""}"
      data-pen-id="${card.id}"
    >
      ${card.showDiscountRibbon ? renderDiscountRibbonWrap(card) : ""}
      <article class="middle-card-molecule is-${card.kind}">
        ${renderBody(card)}
      </article>
    </div>
  `;
}
