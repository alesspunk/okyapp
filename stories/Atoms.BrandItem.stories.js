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

const VARIANT_OPTIONS = ["With label", "No label", "Big"];
const VARIANT_IDS = {
  "With label": "7359:69325",
  "No label": "7359:69326",
  Big: "7360:96832",
};

function findBrand(key) {
  return BRAND_PRESETS.find((brand) => brand.key === key) ?? BRAND_PRESETS[0];
}

function buildBrandItem({ variant = "With label", brandKey = "mcdonalds", label, image, background }) {
  const brand = findBrand(brandKey);
  const resolvedLabel = label?.trim() || brand.label;
  const resolvedImage = image?.trim() || brand.image;
  const resolvedBackground = background?.trim() || brand.background;
  const showLabel = variant === "With label";
  const variantClass =
    variant === "Big"
      ? "is-big"
      : showLabel
        ? "is-with-label"
        : "is-no-label";

  return `
    <div class="brand-item-atom ${variantClass}" data-pen-id="${VARIANT_IDS[variant]}">
      ${
        showLabel
          ? `<p class="brand-item-label token-product-text" aria-label="${resolvedLabel}">${resolvedLabel}</p>`
          : ""
      }
      <div class="brand-item-frame">
        <div class="brand-item-base" style="background:${resolvedBackground}">
          <img src="${resolvedImage}" alt="${resolvedLabel}" />
        </div>
      </div>
    </div>
  `;
}

export default {
  title: "Atoms/Brand Item",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Brand Item** es el átomo de marca para cards y listados. " +
          "Incluye tres variantes: **With label**, **No label** y **Big**. " +
          "Respeta la huella visual de Figma (`112px` wrapper con label, `111x70` base, bordes redondeados, borde blanco interno) " +
          "y usa el token tipográfico **productText** para el label. " +
          "La variante **Big** toma como guía visual la misma familia del nodo `7359:69327`, pero sin label, en `343x215px`, con stroke gris de `1px` usando `border-main` y `card-shadow` para un uso más card-like.",
      },
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    variant: "With label",
    brandKey: "mcdonalds",
    label: "",
    image: "",
    background: "",
    showMeta: true,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: VARIANT_OPTIONS,
      description: "Muestra el atom con label o sin label.",
    },
    brandKey: {
      control: "select",
      options: BRAND_PRESETS.map((brand) => brand.key),
      description: "Preset de marca para cambiar imagen, label y color de fondo de referencia.",
    },
    label: {
      control: "text",
      description: "Override manual del label. Si está vacío, usa el preset seleccionado.",
    },
    image: {
      control: "select",
      options: BRAND_PRESETS.map((brand) => brand.image),
      description: "Override manual de imagen. Si está vacío, usa el preset seleccionado.",
    },
    background: {
      control: "color",
      description: "Override manual del fondo. Si está vacío, usa el preset seleccionado.",
    },
    showMeta: {
      control: "boolean",
      description: "Muestra el ID .pen de la variante.",
    },
  },
  render: ({ variant, brandKey, label, image, background, showMeta }) => {
    const brand = findBrand(brandKey);
    const resolved = {
      variant,
      brandKey,
      label: label || brand.label,
      image: image || brand.image,
      background: background || brand.background,
    };

    return `
      <div class="mars-story">
        <div class="mars-label">Brand Item · Variant: ${variant}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Recomendado: máximo 12 caracteres en label para With label (base: "McDonald's"). Big no utiliza label.
        </div>
        ${showMeta ? `<div class="mars-label">ID .pen: ${VARIANT_IDS[variant]}</div>` : ""}
        ${buildBrandItem(resolved)}
      </div>
    `;
  },
};

export const Variants = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Referencia visual de ambas variantes del atom Brand Item.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-grid-tight">
        <div class="story-card">
          <div class="mars-label">With label · ${VARIANT_IDS["With label"]}</div>
          ${buildBrandItem({ variant: "With label", brandKey: "mcdonalds" })}
        </div>
        <div class="story-card">
          <div class="mars-label">No label · ${VARIANT_IDS["No label"]}</div>
          ${buildBrandItem({ variant: "No label", brandKey: "mcdonalds" })}
        </div>
        <div class="story-card">
          <div class="mars-label">Big · ${VARIANT_IDS.Big}</div>
          ${buildBrandItem({ variant: "Big", brandKey: "mcdonalds" })}
        </div>
      </div>
    </div>
  `,
};

export const BrandMatrix = {
  name: "Brand Matrix",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Dropdown-like visual reference with multiple brand assets from the images folder.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Brand presets</div>
      <div class="brand-item-grid">
        ${BRAND_PRESETS.map((brand) => buildBrandItem({ variant: "With label", brandKey: brand.key })).join("")}
      </div>
      <div class="mars-label" style="margin-top:16px">Brand presets · Big</div>
      <div class="brand-item-grid brand-item-grid-big">
        ${BRAND_PRESETS.slice(0, 4).map((brand) => buildBrandItem({ variant: "Big", brandKey: brand.key })).join("")}
      </div>
    </div>
  `,
};
