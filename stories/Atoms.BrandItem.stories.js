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

const VARIANT_OPTIONS = ["With label", "No label", "Medium", "Big"];
const VARIANT_IDS = {
  "With label": "7359:69325",
  "No label": "7359:69326",
  Medium: null,
  Big: "7360:96832",
};

function findBrand(key) {
  return BRAND_PRESETS.find((brand) => brand.key === key) ?? BRAND_PRESETS[0];
}

function getVariantPenId(variant) {
  return VARIANT_IDS[variant] ?? null;
}

function buildBrandItem({ variant = "With label", brandKey = "mcdonalds", label, image, background }) {
  const brand = findBrand(brandKey);
  const resolvedLabel = label?.trim() || brand.label;
  const resolvedImage = image?.trim() || brand.image;
  const resolvedBackground = background?.trim() || "transparent";
  const showLabel = variant === "With label";
  const penId = getVariantPenId(variant);
  const variantClass =
    variant === "Big"
      ? "is-big"
      : variant === "Medium"
        ? "is-medium"
      : showLabel
        ? "is-with-label"
        : "is-no-label";

  return `
    <div class="brand-item-atom ${variantClass}"${penId ? ` data-pen-id="${penId}"` : ""}>
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
          "Incluye cuatro variantes: **With label**, **No label**, **Medium** y **Big**. " +
          "Respeta la huella visual de Figma (`112px` wrapper con label, `111x70` base, bordes redondeados, borde blanco interno) " +
          "y usa el token tipográfico **productText** para el label. " +
          "El fondo base del componente es **transparent**, y en Storybook puede probarse con override manual si se necesita para otro contexto. " +
          "Las variantes **Medium** y **Big** usan la misma familia visual card-like sin label, en `217x136px` y `343x215px` respectivamente, con stroke gris de `1px` usando `border-main` y `card-shadow`.",
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
      description: "Muestra el atom con label, sin label o en formato card.",
    },
    brandKey: {
      control: "select",
      options: BRAND_PRESETS.map((brand) => brand.key),
      description: "Preset de marca para cambiar imagen y label base.",
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
      description: "Override manual del fondo. Si está vacío, el componente usa transparent.",
    },
    showMeta: {
      control: "boolean",
      description: "Muestra el ID .pen de la variante.",
    },
  },
  render: ({ variant, brandKey, label, image, background, showMeta }) => {
    const brand = findBrand(brandKey);
    const penId = getVariantPenId(variant);
    const resolved = {
      variant,
      brandKey,
      label: label || brand.label,
      image: image || brand.image,
      background: background || "transparent",
    };

    return `
      <div class="mars-story">
        <div class="mars-label">Brand Item · Variant: ${variant}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Recomendado: máximo 12 caracteres en label para With label (base: "McDonald's"). Medium y Big no utilizan label.
        </div>
        ${showMeta ? `<div class="mars-label">ID .pen: ${penId ?? "Storybook only"}</div>` : ""}
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
        story: "Referencia visual de las variantes del atom Brand Item.",
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
          <div class="mars-label">Medium · Storybook only</div>
          ${buildBrandItem({ variant: "Medium", brandKey: "amazon" })}
        </div>
        <div class="story-card">
          <div class="mars-label">Big · ${VARIANT_IDS.Big}</div>
          ${buildBrandItem({ variant: "Big", brandKey: "amazon" })}
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
      <div class="mars-label" style="margin-top:16px">Brand presets · Medium</div>
      <div class="brand-item-grid brand-item-grid-medium">
        ${["amazon", "apple", "target", "xbox"]
          .map((key) => buildBrandItem({ variant: "Medium", brandKey: key }))
          .join("")}
      </div>
      <div class="mars-label" style="margin-top:16px">Brand presets · Big</div>
      <div class="brand-item-grid brand-item-grid-big">
        ${["amazon", "apple", "target", "xbox"]
          .map((key) => buildBrandItem({ variant: "Big", brandKey: key }))
          .join("")}
      </div>
    </div>
  `,
};
