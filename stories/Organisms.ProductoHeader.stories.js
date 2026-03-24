import {
  DISCOUNT_RIBBON_TYPES,
  findMiddleCard,
  MIDDLE_CARD_PATHS,
  renderMiddleCard,
  resolveMiddleCard,
} from "./_shared/middleCard";
import { buildPlateu, PLATEU_VARIANT_OPTIONS, PLATEU_VARIANTS } from "./_shared/plateu";

const BRAND_PRESETS = [
  { key: "mcdonalds", label: "McDonald's", image: "mcdonalds.webp" },
  { key: "starbucks", label: "Starbucks", image: "starbucks.webp" },
  { key: "uber", label: "Uber", image: "uber.png" },
  { key: "target", label: "Target", image: "target.webp" },
  { key: "apple", label: "Apple", image: "apple.webp" },
  { key: "xbox", label: "Xbox", image: "xbox.png" },
  { key: "amazon", label: "Amazon", image: "amazon.png" },
  { key: "twitch", label: "Twitch", image: "twitch.png" },
  { key: "nike", label: "Nike", image: "nike.png" },
  { key: "doordash", label: "DoorDash", image: "doordash.png" },
];

const BRAND_VARIANTS = ["With label", "No label"];
const PAGE_HEADER_VARIANTS = ["screens", "modal", "no-title"];
const PRODUCTO_HEADER_LAYOUTS = ["Default", "With Plateu"];
const DYNAMIC_INPUT_STATES = ["Empty", "Hasvalue"];

function renderCartBitmap() {
  return `
    <div class="header-icon header-icon-bitmap header-icon-bitmap-cart" aria-hidden="true">
      <img class="header-icon-bitmap-image header-icon-bitmap-cart-image" src="images/Cart-3d-icon.png" alt="">
    </div>
  `;
}

function findBrand(key) {
  return BRAND_PRESETS.find((brand) => brand.key === key) ?? BRAND_PRESETS[0];
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
      ? renderCartBitmap()
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
  const resolvedBackground = background?.trim() || "transparent";
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
  const layoutVariant = PRODUCTO_HEADER_LAYOUTS.includes(args.layoutVariant) ? args.layoutVariant : "Default";
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
    brandBackground: args.brandBackground?.trim() || "transparent",
    dynamicInput: {
      state: DYNAMIC_INPUT_STATES.includes(args.dynamicInputState) ? args.dynamicInputState : "Empty",
      placeholder: args.dynamicPlaceholder?.trim() || "Ingresa el monto",
      value: args.dynamicValue?.trim() || "40.00",
      currencySymbol: args.dynamicCurrencySymbol || "$",
      helperText: args.dynamicHelperText?.trim() || "Desde 10 hasta 1000",
    },
    middleCard: resolveMiddleCard({
      variantPath: middle.path,
      pageContext: args.cardContext || "PDP",
      title: args.cardTitle?.trim() || middle.title,
      currency: args.currency?.trim() || middle.currency,
      amount: args.amount?.trim() || middle.amount,
      leftLabel: args.leftLabel?.trim() || middle.leftLabel,
      rightLabel: args.rightLabel?.trim() || middle.rightLabel,
      image: args.cardImage?.trim() || middle.image,
      showDiscountRibbon: args.showDiscountRibbon,
      discountRibbonType: args.discountRibbonType,
      discountRibbonLabel: args.discountRibbonLabel,
      discountRibbonSize: args.discountRibbonSize,
    }),
  };
}

function renderProductoHeader(args = {}) {
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
  title: "Organisms/Producto Header",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo **Producto Header** compuesto únicamente con componentes ya existentes del sistema: " +
          "`Page Header`, `Brand Item`, `Plateu`, `Middle Card` e `Input/Dinamic`. " +
          "Se presenta como stack vertical para encabezados de PDP y usa por defecto la variante `Page Header / No title`. " +
          "Puede mostrarse con o sin `Plateu`, y también prender/apagar el `Discount Ribbon / Wrap` del `Middle Card`, reutilizando en ambos casos las variantes ya documentadas de los componentes existentes.",
      },
    },
  },
  argTypes: {
    layoutVariant: {
      control: "inline-radio",
      options: PRODUCTO_HEADER_LAYOUTS,
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
      description: "Preset de marca para poblar imagen y label base.",
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
      description: "Override del color de fondo del Brand Item. Si está vacío, usa transparent.",
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
    showDiscountRibbon: {
      control: "boolean",
      description: "Prende o apaga el Discount Ribbon / Wrap en la esquina superior derecha del Middle Card.",
    },
    discountRibbonType: {
      control: "select",
      options: DISCOUNT_RIBBON_TYPES,
      description: "Type del Discount Ribbon montado sobre Middle Card.",
    },
    discountRibbonLabel: {
      control: "text",
      description: "Texto del Discount Ribbon / Wrap.",
    },
    discountRibbonSize: {
      control: "inline-radio",
      options: ["Default", "Small"],
      description: "Size del Wrap para Producto Header.",
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
    showDiscountRibbon: true,
    discountRibbonType: "Por tiempo",
    discountRibbonLabel: "25% OFF",
    discountRibbonSize: "Default",
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
        <div class="mars-label">Producto Header · ${resolved.layoutVariant} · Page Header ${resolved.pageHeaderVariant} · Brand ${resolved.brandKey} · Card ${cardMeta.path}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Recomendado: Brand label máx. 12 caracteres · Plateu activo: ${resolved.showPlateu ? plateuMeta.penId : "off"} · ${cardMeta.recommendation} · Input placeholder máx. 16 caracteres.
        </div>
        <div class="mars-mobile">
          ${renderProductoHeader(args)}
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
          <div class="mars-label">Producto Header · Vale de Monto + Plateu</div>
          <div class="mars-mobile">
            ${renderProductoHeader({
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
              showDiscountRibbon: true,
              discountRibbonType: "Por tiempo",
              discountRibbonLabel: "25% OFF",
              discountRibbonSize: "Default",
              dynamicInputState: "Empty",
            })}
          </div>
        </article>
        <article class="story-card">
          <div class="mars-label">Producto Header · Vale de Producto</div>
          <div class="mars-mobile">
            ${renderProductoHeader({
              layoutVariant: "Default",
              showPlateu: false,
              pageHeaderVariant: "no-title",
              pageTitle: "McDonald's",
              showAction: true,
              brandVariant: "With label",
              brandKey: "mcdonalds",
              middleCardPath: "Molecule/Middle Card/Vale de Producto",
              cardContext: "PDP",
              showDiscountRibbon: false,
              dynamicInputState: "Hasvalue",
            })}
          </div>
        </article>
        <article class="story-card">
          <div class="mars-label">Producto Header · eGift Card + Plateu</div>
          <div class="mars-mobile">
            ${renderProductoHeader({
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
              showDiscountRibbon: true,
              discountRibbonType: "Por tiempo",
              discountRibbonLabel: "18% OFF",
              discountRibbonSize: "Small",
              dynamicInputState: "Hasvalue",
              dynamicCurrencySymbol: "$",
            })}
          </div>
        </article>
      </div>
    </div>
  `,
};
