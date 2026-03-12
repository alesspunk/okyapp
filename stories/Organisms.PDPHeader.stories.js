import { buildPlateu, PLATEU_VARIANT_OPTIONS, PLATEU_VARIANTS } from "./_shared/plateu";

const BRAND_PRESETS = [
  { key: "mcdonalds", label: "McDonald's", image: "mcdonalds.webp", background: "#fe0015" },
  { key: "starbucks", label: "Starbucks", image: "starbucks.webp", background: "#006241" },
  { key: "uber", label: "Uber", image: "uber.png", background: "#111111" },
  { key: "target", label: "Target", image: "target.webp", background: "#cc0000" },
  { key: "apple", label: "Apple", image: "apple.webp", background: "#111111" },
  { key: "xbox", label: "Xbox", image: "xbox.png", background: "#107c10" },
  { key: "amazon", label: "Amazon", image: "amazon.png", background: "#131921" },
  { key: "twitch", label: "Twitch", image: "twitch.png", background: "#9146ff" },
  { key: "nike", label: "Nike", image: "nike.png", background: "#111111" },
  { key: "doordash", label: "DoorDash", image: "doordash.png", background: "#ff3008" },
];

const BRAND_VARIANTS = ["With label", "No label"];
const PAGE_HEADER_VARIANTS = ["screens", "modal", "no-title"];
const PDP_HEADER_LAYOUTS = ["Default", "With Plateu"];
const MIDDLE_CARD_VARIANTS = [
  {
    path: "Molecule/Middle Card/Vale de Monto",
    id: "6991:146235",
    kind: "amount",
    title: "Vale de Monto",
    currency: "Q",
    amount: "1,000",
    leftLabel: "Mostrar al cajero",
    rightLabel: "Como canjear",
    image: "",
    recommendation: 'Card title máx. 14 caracteres (base: "Vale de Monto").',
  },
  {
    path: "Molecule/Middle Card/Vale de Producto",
    id: "6991:146181",
    kind: "product",
    title: "Cajita Feliz de McNuggets + Cono Vainilla y Juguete incluido",
    currency: "",
    amount: "",
    leftLabel: "Mostrar al cajero",
    rightLabel: "Como canjear",
    image: "middle-card-vale-de-producto.png",
    recommendation:
      'Card title máx. 60 caracteres (base: "Cajita Feliz de McNuggets + Cono Vainilla y Juguete incluido").',
  },
  {
    path: "Molecule/Middle Card/eGift Card",
    id: "6991:146335",
    kind: "egift",
    title: "Brand Name eGift Card",
    currency: "$",
    amount: "10",
    leftLabel: "In Store, Online",
    rightLabel: "Redemption Instructions",
    image: "",
    recommendation: 'Card title máx. 21 caracteres (base: "Brand Name eGift Card").',
  },
];

const MIDDLE_CARD_PATHS = MIDDLE_CARD_VARIANTS.map((variant) => variant.path);
const DYNAMIC_INPUT_STATES = ["Empty", "Hasvalue"];

function findBrand(key) {
  return BRAND_PRESETS.find((brand) => brand.key === key) ?? BRAND_PRESETS[0];
}

function findMiddleCard(path) {
  return MIDDLE_CARD_VARIANTS.find((variant) => variant.path === path) ?? MIDDLE_CARD_VARIANTS[0];
}

function renderPageHeader({ variant, title, showAction }) {
  let left;
  let right;

  if (variant === "modal") {
    left = `<div class="header-icon header-icon-placeholder"><i class="fa-light fa-circle icon-medium"></i></div>`;
    right = showAction
      ? `<div class="header-icon"><i class="fa-light fa-xmark icon-medium"></i></div>`
      : `<div class="header-icon header-icon-placeholder"></div>`;
  } else {
    left = `<div class="header-icon header-icon-light"><i class="fa-light fa-arrow-left icon-medium"></i></div>`;
    right = showAction
      ? `<div class="header-icon header-icon-light"><i class="fa-light fa-cart-shopping icon-medium"></i></div>`
      : `<div class="header-icon header-icon-placeholder"></div>`;
  }

  const titleMarkup =
    variant === "no-title"
      ? `<div class="page-header-title page-header-title-empty" aria-hidden="true"></div>`
      : `<div class="page-header-title">${title}</div>`;

  return `
    <div class="${variant === "modal" ? "page-header-modal" : "page-header-screen"}">
      ${left}
      ${titleMarkup}
      ${right}
    </div>
  `;
}

function renderBrandItem({ variant, brandKey, label, image, background }) {
  const brand = findBrand(brandKey);
  const resolvedLabel = label?.trim() || brand.label;
  const resolvedImage = image?.trim() || brand.image;
  const resolvedBackground = background?.trim() || brand.background;
  const showLabel = variant === "With label";

  return `
    <div class="brand-item-atom ${showLabel ? "is-with-label" : "is-no-label"}">
      ${showLabel ? `<p class="brand-item-label token-product-text">${resolvedLabel}</p>` : ""}
      <div class="brand-item-frame">
        <div class="brand-item-base" style="background:${resolvedBackground}">
          <img src="${resolvedImage}" alt="${resolvedLabel}" />
        </div>
      </div>
    </div>
  `;
}

function renderMiddleCard(card) {
  const footer = `
    <div class="middle-card-footer">
      <span class="middle-card-footer-start">${card.leftLabel}</span>
      <span class="middle-card-footer-end">${card.rightLabel}</span>
      <span class="fa-icon fa-icon-card-use middle-card-link-icon" aria-hidden="true">
        <i class="fa-thin fa-arrow-up-right-from-square"></i>
      </span>
    </div>
  `;

  const content =
    card.kind === "product"
      ? `
        <div class="middle-card-content">
          <div class="middle-card-main">
            <p class="middle-card-title">${card.title}</p>
            <div class="middle-card-center">
              <figure class="middle-card-product-figure">
                <img src="${card.image}" alt="${card.title}" />
              </figure>
            </div>
          </div>
          ${footer}
        </div>
      `
      : `
        <div class="middle-card-content">
          <div class="middle-card-main">
            <p class="middle-card-title">${card.title}</p>
            <div class="middle-card-center">
              <div class="middle-card-value">
                <span class="middle-card-currency">${card.currency}</span>
                <p class="middle-card-amount">${card.amount}</p>
              </div>
            </div>
          </div>
          ${footer}
        </div>
      `;

  return `
    <div class="middle-card-shell is-${card.pageContext.toLowerCase()}" data-pen-id="${card.id}">
      <article class="middle-card-molecule is-${card.kind}">
        ${content}
      </article>
    </div>
  `;
}

function renderDynamicInput({ state, placeholder, value, currencySymbol, helperText }) {
  const isHasValue = state === "Hasvalue";
  const inputId = `pdp-header-dinamic-${isHasValue ? "hasvalue" : "empty"}`;
  const labelId = `${inputId}-label`;

  return `
    <div class="input-wrapper">
      ${
        isHasValue
          ? `<label id="${labelId}" class="input-label input-label-dinamic" for="${inputId}">${helperText}</label>`
          : ""
      }
      ${
        isHasValue
          ? `<span class="input-dinamic-prefix" aria-hidden="true">${currencySymbol}</span>`
          : ""
      }
      <input
        id="${inputId}"
        class="input-field input-dinamic ${isHasValue ? "input-dinamic-hasvalue" : "input-dinamic-empty"}"
        type="text"
        inputmode="decimal"
        name="pdp-dinamic-amount"
        placeholder="${placeholder}"
        value="${isHasValue ? value : ""}"
        ${isHasValue ? `aria-labelledby="${labelId}"` : `aria-label="${placeholder}"`}
      />
    </div>
  `;
}

function resolveArgs(args = {}) {
  const brand = findBrand(args.brandKey);
  const middle = findMiddleCard(args.middleCardPath);
  const layoutVariant = PDP_HEADER_LAYOUTS.includes(args.layoutVariant) ? args.layoutVariant : "Default";
  const showPlateu = typeof args.showPlateu === "boolean" ? args.showPlateu : layoutVariant === "With Plateu";

  return {
    layoutVariant,
    showPlateu,
    plateuVariant: PLATEU_VARIANT_OPTIONS.includes(args.plateuVariant)
      ? args.plateuVariant
      : "State=Productos, Telco=No, Scrolling=No",
    pageHeaderVariant: PAGE_HEADER_VARIANTS.includes(args.pageHeaderVariant) ? args.pageHeaderVariant : "no-title",
    pageTitle: args.pageTitle?.trim() || brand.label,
    showAction: args.showAction !== false,
    brandVariant: BRAND_VARIANTS.includes(args.brandVariant) ? args.brandVariant : "With label",
    brandKey: brand.key,
    brandLabel: args.brandLabel?.trim() || brand.label,
    brandImage: args.brandImage?.trim() || brand.image,
    brandBackground: args.brandBackground?.trim() || brand.background,
    dynamicInput: {
      state: DYNAMIC_INPUT_STATES.includes(args.dynamicInputState) ? args.dynamicInputState : "Empty",
      placeholder: args.dynamicPlaceholder?.trim() || "Ingresa el monto",
      value: args.dynamicValue?.trim() || "40.00",
      currencySymbol: args.dynamicCurrencySymbol || "$",
      helperText: args.dynamicHelperText?.trim() || "Desde 10 hasta 1000",
    },
    middleCard: {
      ...middle,
      pageContext: args.cardContext || "PDP",
      title: args.cardTitle?.trim() || middle.title,
      currency: args.currency?.trim() || middle.currency,
      amount: args.amount?.trim() || middle.amount,
      leftLabel: args.leftLabel?.trim() || middle.leftLabel,
      rightLabel: args.rightLabel?.trim() || middle.rightLabel,
      image: args.cardImage?.trim() || middle.image,
    },
  };
}

function renderPdpHeader(args = {}) {
  const resolved = resolveArgs(args);
  const hasPlateu = resolved.showPlateu;
  const plateuPenId = PLATEU_VARIANTS[resolved.plateuVariant]?.penId;

  return `
    <section
      class="pdp-header-organism ${hasPlateu ? "has-plateu" : "has-no-plateu"}"
      data-header-variant="${resolved.pageHeaderVariant}"
      data-card-context="${resolved.middleCard.pageContext}"
      data-plateu-variant="${resolved.plateuVariant}"
    >
      ${renderPageHeader({
        variant: resolved.pageHeaderVariant,
        title: resolved.pageTitle,
        showAction: resolved.showAction,
      })}
      <div class="pdp-header-stack">
        <div class="pdp-header-brand-slot">
          ${renderBrandItem({
            variant: resolved.brandVariant,
            brandKey: resolved.brandKey,
            label: resolved.brandLabel,
            image: resolved.brandImage,
            background: resolved.brandBackground,
          })}
        </div>
        ${
          hasPlateu
            ? `<div class="pdp-header-plateu-slot" data-pen-id="${plateuPenId}">
                ${buildPlateu({ property1: resolved.plateuVariant })}
              </div>`
            : ""
        }
        <div class="pdp-header-card-slot">
          ${renderMiddleCard(resolved.middleCard)}
        </div>
        <div class="pdp-header-input-slot">
          ${renderDynamicInput(resolved.dynamicInput)}
        </div>
      </div>
    </section>
  `;
}

export default {
  title: "Organisms/PDP Header",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo **PDP Header** compuesto únicamente con componentes ya existentes del sistema: " +
          "`Page Header`, `Brand Item`, `Plateu`, `Middle Card` e `Input/Dinamic`. " +
          "Se presenta como stack vertical para encabezados de PDP y usa por defecto la variante `Page Header / No title`. " +
          "Puede mostrarse con o sin `Plateu`, reutilizando las variantes ya documentadas del componente existente.",
      },
    },
  },
  argTypes: {
    layoutVariant: {
      control: "inline-radio",
      options: PDP_HEADER_LAYOUTS,
      description: "Activa la composición base o la composición con Plateu entre Brand Item y Middle Card.",
    },
    showPlateu: {
      control: "boolean",
      description: "Permite prender o apagar Plateu dentro del stack.",
    },
    plateuVariant: {
      control: "select",
      options: PLATEU_VARIANT_OPTIONS,
      description: "Variante existente de Plateu usada dentro del organismo.",
    },
    pageHeaderVariant: {
      control: "inline-radio",
      options: PAGE_HEADER_VARIANTS,
      labels: {
        screens: "Screens",
        modal: "Modal",
        "no-title": "No title",
      },
      description: "Variante del Page Header usado en el organismo.",
    },
    pageTitle: {
      control: "text",
      description: "Título del Page Header.",
    },
    showAction: {
      control: "boolean",
      description: "Muestra u oculta la acción derecha del Page Header.",
    },
    brandVariant: {
      control: "inline-radio",
      options: BRAND_VARIANTS,
      description: "Variante del átomo Brand Item dentro del stack.",
    },
    brandKey: {
      control: "select",
      options: BRAND_PRESETS.map((brand) => brand.key),
      description: "Preset de marca para poblar imagen, fondo y label base.",
    },
    brandLabel: {
      control: "text",
      description: "Override del label de marca. Si está vacío, usa el preset.",
    },
    brandImage: {
      control: "select",
      options: BRAND_PRESETS.map((brand) => brand.image),
      description: "Override de imagen de marca. Si está vacío, usa el preset.",
    },
    brandBackground: {
      control: "color",
      description: "Override del color de fondo del Brand Item.",
    },
    middleCardPath: {
      control: "select",
      options: MIDDLE_CARD_PATHS,
      description: "Variante base del Middle Card anidado.",
    },
    cardContext: {
      control: "inline-radio",
      options: ["PDP", "Checkout"],
      description: "Contexto del Middle Card dentro del organismo.",
    },
    cardTitle: {
      control: "text",
      description: "Título del Middle Card.",
    },
    currency: {
      control: "text",
      description: "Moneda del Middle Card numérico.",
    },
    amount: {
      control: "text",
      description: "Monto del Middle Card numérico.",
    },
    leftLabel: {
      control: "text",
      description: "Label inferior izquierdo del Middle Card.",
    },
    rightLabel: {
      control: "text",
      description: "Label inferior derecho del Middle Card.",
    },
    cardImage: {
      control: "text",
      description: "Imagen del Middle Card de producto.",
    },
    dynamicInputState: {
      control: "inline-radio",
      options: DYNAMIC_INPUT_STATES,
      description: "Estado del Input/Dinamic al final del stack.",
    },
    dynamicPlaceholder: {
      control: "text",
      description: "Placeholder del Input/Dinamic.",
    },
    dynamicValue: {
      control: "text",
      description: "Valor del Input/Dinamic cuando está en Hasvalue.",
    },
    dynamicCurrencySymbol: {
      control: "inline-radio",
      options: ["Q", "$"],
      description: "Prefijo monetario del Input/Dinamic.",
    },
    dynamicHelperText: {
      control: "text",
      description: "Texto flotante del Input/Dinamic en Hasvalue.",
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    layoutVariant: "With Plateu",
    showPlateu: true,
    plateuVariant: "State=Productos, Telco=No, Scrolling=No",
    pageHeaderVariant: "no-title",
    pageTitle: "McDonald's",
    showAction: true,
    brandVariant: "With label",
    brandKey: "mcdonalds",
    brandLabel: "",
    brandImage: "",
    brandBackground: "",
    middleCardPath: "Molecule/Middle Card/Vale de Monto",
    cardContext: "PDP",
    cardTitle: "Vale de Monto",
    currency: "Q",
    amount: "1,000",
    leftLabel: "Mostrar al cajero",
    rightLabel: "Como canjear",
    cardImage: "middle-card-vale-de-producto.png",
    dynamicInputState: "Empty",
    dynamicPlaceholder: "Ingresa el monto",
    dynamicValue: "40.00",
    dynamicCurrencySymbol: "$",
    dynamicHelperText: "Desde 10 hasta 1000",
  },
  render: (args) => {
    const resolved = resolveArgs(args);
    const cardMeta = findMiddleCard(args.middleCardPath);
    const plateuMeta = PLATEU_VARIANTS[resolved.plateuVariant];

    return `
      <div class="mars-story">
        <div class="mars-label">PDP Header · ${resolved.layoutVariant} · Page Header ${resolved.pageHeaderVariant} · Brand ${resolved.brandKey} · Card ${cardMeta.path}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Recomendado: Brand label máx. 12 caracteres · Plateu activo: ${resolved.showPlateu ? plateuMeta.penId : "off"} · ${cardMeta.recommendation} · Input placeholder máx. 16 caracteres.
        </div>
        <div class="mars-mobile">
          ${renderPdpHeader(args)}
        </div>
      </div>
    `;
  },
};

export const ReferenceStacks = {
  name: "Reference Stacks",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Tres configuraciones base del organismo para revisar cómo se comporta el stack con cada variante de Middle Card.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-grid">
        <article class="story-card">
          <div class="mars-label">PDP Header · Vale de Monto + Plateu</div>
          <div class="mars-mobile">
            ${renderPdpHeader({
              layoutVariant: "With Plateu",
              showPlateu: true,
              plateuVariant: "State=Productos, Telco=No, Scrolling=No",
              pageHeaderVariant: "no-title",
              pageTitle: "McDonald's",
              showAction: true,
              brandVariant: "With label",
              brandKey: "mcdonalds",
              middleCardPath: "Molecule/Middle Card/Vale de Monto",
              cardContext: "PDP",
              dynamicInputState: "Empty",
            })}
          </div>
        </article>
        <article class="story-card">
          <div class="mars-label">PDP Header · Vale de Producto</div>
          <div class="mars-mobile">
            ${renderPdpHeader({
              layoutVariant: "Default",
              showPlateu: false,
              pageHeaderVariant: "no-title",
              pageTitle: "McDonald's",
              showAction: true,
              brandVariant: "With label",
              brandKey: "mcdonalds",
              middleCardPath: "Molecule/Middle Card/Vale de Producto",
              cardContext: "PDP",
              dynamicInputState: "Hasvalue",
            })}
          </div>
        </article>
        <article class="story-card">
          <div class="mars-label">PDP Header · eGift Card + Plateu</div>
          <div class="mars-mobile">
            ${renderPdpHeader({
              layoutVariant: "With Plateu",
              showPlateu: true,
              plateuVariant: "State=Vales, Telco=No, Scrolling=No",
              pageHeaderVariant: "no-title",
              pageTitle: "Apple",
              showAction: true,
              brandVariant: "No label",
              brandKey: "apple",
              middleCardPath: "Molecule/Middle Card/eGift Card",
              cardContext: "Checkout",
              dynamicInputState: "Hasvalue",
              dynamicCurrencySymbol: "$",
            })}
          </div>
        </article>
      </div>
    </div>
  `,
};
