import {
  DISCOUNT_RIBBON_TYPES,
  findMiddleCard,
  MIDDLE_CARD_PATHS,
  renderMiddleCard,
  resolveMiddleCard,
} from "./_shared/middleCard";

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

function findBrand(key) {
  return BRAND_PRESETS.find((brand) => brand.key === key) ?? BRAND_PRESETS[0];
}

function renderBrandItemMedium({ brandKey, label, image, background }) {
  const brand = findBrand(brandKey);
  const resolvedLabel = label?.trim() || brand.label;
  const resolvedImage = image?.trim() || brand.image;
  const resolvedBackground = background?.trim() || "transparent";

  return `
    <div class="brand-item-atom is-medium">
      <div class="brand-item-frame">
        <div class="brand-item-base" style="background:${resolvedBackground}">
          <img src="${resolvedImage}" alt="${resolvedLabel}" />
        </div>
      </div>
    </div>
  `;
}

function resolveArgs(args = {}) {
  const leftBrand = findBrand(args.leftBrandKey);
  const rightBrand = findBrand(args.rightBrandKey);
  const middleCardMeta = findMiddleCard(args.middleCardPath);

  return {
    leftBrand: {
      brandKey: leftBrand.key,
      label: args.leftBrandLabel?.trim() || leftBrand.label,
      image: args.leftBrandImage?.trim() || leftBrand.image,
      background: args.leftBrandBackground?.trim() || "transparent",
    },
    rightBrand: {
      brandKey: rightBrand.key,
      label: args.rightBrandLabel?.trim() || rightBrand.label,
      image: args.rightBrandImage?.trim() || rightBrand.image,
      background: args.rightBrandBackground?.trim() || "transparent",
    },
    middleCard: resolveMiddleCard({
      variantPath: MIDDLE_CARD_PATHS.includes(args.middleCardPath) ? args.middleCardPath : middleCardMeta.path,
      pageContext: "PDP",
      title: args.cardTitle?.trim() || middleCardMeta.title,
      currency: args.currency?.trim() || middleCardMeta.currency,
      amount: args.amount?.trim() || middleCardMeta.amount,
      leftLabel: args.leftLabel?.trim() || middleCardMeta.leftLabel,
      rightLabel: args.rightLabel?.trim() || middleCardMeta.rightLabel,
      image: args.cardImage?.trim() || middleCardMeta.image,
      showDiscountRibbon: args.showDiscountRibbon === true,
      discountRibbonType: DISCOUNT_RIBBON_TYPES.includes(args.discountRibbonType) ? args.discountRibbonType : "Normal",
      discountRibbonLabel: args.discountRibbonLabel?.trim() || "25% OFF",
      discountRibbonSize: "Default",
    }),
  };
}

function renderBrandCarrousel(args = {}) {
  const resolved = resolveArgs(args);

  return `
    <section class="brand-carrousel-organism" aria-label="Brand Carrousel">
      <div class="brand-carrousel-track">
        <div class="brand-carrousel-side">
          ${renderBrandItemMedium(resolved.leftBrand)}
        </div>
        <div class="brand-carrousel-center">
          <div class="brand-carrousel-center-card">
            ${renderMiddleCard(resolved.middleCard)}
          </div>
          <button class="btn btn-primary btn-small brand-carrousel-cta" type="button">Ver detalle</button>
        </div>
        <div class="brand-carrousel-side">
          ${renderBrandItemMedium(resolved.rightBrand)}
        </div>
      </div>
    </section>
  `;
}

export default {
  title: "Organisms/Brand Carrousel",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo **Brand Carrousel** compuesto por dos `Brand Item / Medium` laterales y un `Middle Card` al centro. " +
          "La composicion esta centrada verticalmente para que la tarjeta activa del medio se perciba mas grande sin perder simetria visual, " +
          "y agrega un boton `Primary / Small` centrado debajo del card.",
      },
    },
  },
  argTypes: {
    leftBrandKey: {
      control: "select",
      options: BRAND_PRESETS.map((brand) => brand.key),
      description: "Marca del Brand Item lateral izquierdo.",
    },
    leftBrandLabel: {
      control: "text",
      description: "Override del alt para la marca izquierda.",
    },
    leftBrandImage: {
      control: "select",
      options: BRAND_PRESETS.map((brand) => brand.image),
      description: "Override de imagen para la marca izquierda.",
    },
    rightBrandKey: {
      control: "select",
      options: BRAND_PRESETS.map((brand) => brand.key),
      description: "Marca del Brand Item lateral derecho.",
    },
    rightBrandLabel: {
      control: "text",
      description: "Override del alt para la marca derecha.",
    },
    rightBrandImage: {
      control: "select",
      options: BRAND_PRESETS.map((brand) => brand.image),
      description: "Override de imagen para la marca derecha.",
    },
    middleCardPath: {
      control: "select",
      options: MIDDLE_CARD_PATHS,
      description: "Variante base del Middle Card activo en el centro.",
    },
    cardTitle: {
      control: "text",
      description: "Titulo del Middle Card central.",
    },
    currency: {
      control: "text",
      description: "Moneda visible en variantes numericas.",
    },
    amount: {
      control: "text",
      description: "Monto visible en variantes numericas.",
    },
    leftLabel: {
      control: "text",
      description: "Footer inferior izquierdo del Middle Card.",
    },
    rightLabel: {
      control: "text",
      description: "Footer inferior derecho del Middle Card.",
    },
    cardImage: {
      control: "text",
      description: "Imagen para la variante de producto del Middle Card.",
    },
    showDiscountRibbon: {
      control: "boolean",
      description: "Prende o apaga el Discount Ribbon sobre la tarjeta central.",
    },
    discountRibbonType: {
      control: "select",
      options: DISCOUNT_RIBBON_TYPES,
      description: "Tipo del Discount Ribbon reutilizado sobre Middle Card.",
    },
    discountRibbonLabel: {
      control: "text",
      description: "Texto del Discount Ribbon central.",
    },
    showMeta: {
      control: "boolean",
      description: "Muestra una nota con la composicion usada en la story.",
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    leftBrandKey: "target",
    leftBrandLabel: "",
    leftBrandImage: "",
    rightBrandKey: "apple",
    rightBrandLabel: "",
    rightBrandImage: "",
    middleCardPath: "Molecule/Middle Card/eGift Card",
    cardTitle: "Amazon eGift Card",
    currency: "$",
    amount: "10",
    leftLabel: "In Store, Online",
    rightLabel: "Redemption Instructions",
    cardImage: "middle-card-vale-de-producto.png",
    showDiscountRibbon: false,
    discountRibbonType: "Normal",
    discountRibbonLabel: "25% OFF",
    showMeta: true,
  },
  render: (args) => {
    const resolved = resolveArgs(args);
    return `
      <div class="mars-story">
        <div class="mars-label">Brand Carrousel</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Dos Brand Item / Medium laterales + Middle Card PDP al centro, alineados verticalmente al medio para mantener simetria, con CTA centrado debajo del card.
        </div>
        ${
          args.showMeta
            ? `<div class="mars-label">Laterales: Brand Item / Medium · Centro: ${resolved.middleCard.path} · ID .pen centro: ${resolved.middleCard.id}</div>`
            : ""
        }
        <div class="brand-carrousel-story-shell">
          ${renderBrandCarrousel(args)}
        </div>
      </div>
    `;
  },
};

export const Default = {
  parameters: {
    controls: { disable: true },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Brand Carrousel / Default</div>
      <div class="brand-carrousel-story-shell">
        ${renderBrandCarrousel({
          leftBrandKey: "target",
          rightBrandKey: "apple",
          middleCardPath: "Molecule/Middle Card/eGift Card",
          cardTitle: "Amazon eGift Card",
          currency: "$",
          amount: "10",
          leftLabel: "In Store, Online",
          rightLabel: "Redemption Instructions",
          showDiscountRibbon: false,
        })}
      </div>
    </div>
  `,
};
