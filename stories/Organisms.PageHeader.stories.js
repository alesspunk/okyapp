const BRAND_PRESETS = [
  { key: "mcdonalds", label: "McDonald's", image: "mcdonalds.webp" },
  { key: "starbucks", label: "Starbucks", image: "starbucks.webp" },
  { key: "uber", label: "Uber", image: "uber.png" },
  { key: "target", label: "Target", image: "target.webp" },
  { key: "apple", label: "Apple", image: "apple.webp" },
  { key: "xbox", label: "Xbox", image: "xbox.png" },
  { key: "amazon", label: "Amazon", image: "amazon.png" },
];

const BRAND_VARIANTS = ["With label", "No label"];
const PAGE_HEADER_VARIANTS = ["screens", "no-title"];
const LAYOUT_VARIANTS = ["Default", "Checkout Overlap"];

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

function renderPageHeaderOrganism(args = {}) {
  const layoutVariant = LAYOUT_VARIANTS.includes(args.layoutVariant) ? args.layoutVariant : "Checkout Overlap";
  const pageHeaderVariant = PAGE_HEADER_VARIANTS.includes(args.pageHeaderVariant) ? args.pageHeaderVariant : "no-title";
  const brandVariant = BRAND_VARIANTS.includes(args.brandVariant) ? args.brandVariant : "With label";
  const brand = findBrand(args.brandKey);
  const showCartChip = args.showCartChip !== false;
  const showAction = args.showAction === true;
  const cartCount = Number.isFinite(args.cartCount) ? Math.max(0, Math.min(99, args.cartCount)) : 3;

  const rightSlot = showCartChip
    ? `<div class="header-icon header-icon-placeholder" aria-hidden="true"></div>`
    : showAction
      ? renderCartBitmap()
      : `<div class="header-icon header-icon-placeholder" aria-hidden="true"></div>`;

  return `
    <section class="page-header-organism ${layoutVariant === "Checkout Overlap" ? "is-checkout-overlap" : "is-default"}">
      <div class="page-header-screen">
        <div class="header-icon header-icon-light"><i class="fa-light fa-arrow-left icon-medium" aria-hidden="true"></i></div>
        ${
          pageHeaderVariant === "no-title"
            ? `<div class="page-header-title page-header-title-empty" aria-hidden="true"></div>`
            : `<div class="page-header-title">${args.pageTitle?.trim() || brand.label}</div>`
        }
        ${rightSlot}
      </div>
      ${
        showCartChip
          ? `<div class="header-cart-chip header-cart-full page-header-organism-cart" aria-label="Carrito con ${cartCount} productos">
              <span class="header-cart-count">${cartCount}</span>
              <i class="fa-light fa-cart-shopping" aria-hidden="true"></i>
            </div>`
          : ""
      }
      ${
        layoutVariant === "Checkout Overlap"
          ? `<div class="page-header-organism-brand-overlap">
              ${renderBrandItem({
                variant: brandVariant,
                brandKey: brand.key,
                label: args.brandLabel?.trim() || brand.label,
                image: args.brandImage?.trim() || brand.image,
                background: args.brandBackground?.trim() || "transparent",
              })}
            </div>`
          : ""
      }
    </section>
  `;
}

export default {
  title: "Organisms/Page Header",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo ligero de **Page Header** para layouts mobile. " +
          "Incluye una variante base y una variante **Checkout Overlap** que superpone un `Brand Item` con solape visual de `-55px`, siguiendo el patrón usado en checkout y PDP.",
      },
    },
  },
  argTypes: {
    layoutVariant: {
      control: "inline-radio",
      options: LAYOUT_VARIANTS,
      description: "Variante base del organismo o composición con Brand Item solapado.",
    },
    pageHeaderVariant: {
      control: "inline-radio",
      options: PAGE_HEADER_VARIANTS,
      description: "Tipo de Page Header usado dentro del organismo.",
    },
    pageTitle: {
      control: "text",
      description: "Título visible cuando la variante no es `no-title`.",
    },
    showCartChip: {
      control: "boolean",
      description: "Muestra el cart chip flotante a la derecha.",
    },
    showAction: {
      control: "boolean",
      description: "Muestra una acción derecha simple cuando no se usa cart chip.",
    },
    cartCount: {
      control: { type: "number", min: 0, max: 99 },
      description: "Cantidad visible en el cart chip flotante.",
    },
    brandVariant: {
      control: "inline-radio",
      options: BRAND_VARIANTS,
      description: "Variante de Brand Item usada en el overlap.",
    },
    brandKey: {
      control: "select",
      options: BRAND_PRESETS.map((brand) => brand.key),
      description: "Preset base de marca.",
    },
    brandLabel: {
      control: "text",
      description: "Override manual del label.",
    },
    brandImage: {
      control: "select",
      options: BRAND_PRESETS.map((brand) => brand.image),
      description: "Override manual de la imagen.",
    },
    brandBackground: {
      control: "color",
      description: "Override del fondo del Brand Item.",
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    layoutVariant: "Checkout Overlap",
    pageHeaderVariant: "no-title",
    pageTitle: "Target",
    showCartChip: true,
    showAction: false,
    cartCount: 3,
    brandVariant: "With label",
    brandKey: "target",
    brandLabel: "",
    brandImage: "",
    brandBackground: "",
  },
  render: (args) => `
    <div class="mars-story">
      <div class="mars-label">Page Header Organism · ${args.layoutVariant}</div>
      <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
        Variante reutilizable para checkout y otros detail flows con cart chip flotante y Brand Item superpuesto.
      </div>
      <div class="mars-mobile">
        ${renderPageHeaderOrganism(args)}
      </div>
    </div>
  `,
};

export const Reference = {
  name: "Reference",
  parameters: {
    controls: { disable: true },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-grid">
        <article class="story-card">
          <div class="mars-label">Default</div>
          <div class="mars-mobile">
            ${renderPageHeaderOrganism({
              layoutVariant: "Default",
              pageHeaderVariant: "screens",
              pageTitle: "Page Title",
              showCartChip: false,
              showAction: true,
              brandVariant: "With label",
              brandKey: "target",
            })}
          </div>
        </article>
        <article class="story-card">
          <div class="mars-label">Checkout Overlap</div>
          <div class="mars-mobile">
            ${renderPageHeaderOrganism({
              layoutVariant: "Checkout Overlap",
              pageHeaderVariant: "no-title",
              showCartChip: true,
              cartCount: 3,
              showAction: false,
              brandVariant: "With label",
              brandKey: "target",
            })}
          </div>
        </article>
      </div>
    </div>
  `,
};
