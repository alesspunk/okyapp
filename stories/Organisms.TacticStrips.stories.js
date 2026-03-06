const VARIANT_OPTIONS = ["Por tiempo", "Finita", "Normal", "Por temporada", "OKY"];
const VARIANT_DATA = {
  "Por tiempo": {
    heading: "Solo por hoy",
    superType: "Por tiempo",
    left: {
      hero: "promo-image1.png",
      logo: "twitch.png",
      brand: "Twitch",
    },
    right: {
      hero: "promo-image2.png",
      logo: "amazon.png",
      brand: "Amazon",
    },
    discountType: "Por tiempo",
  },
  Finita: {
    heading: "Ofertas del día",
    superType: "Finito",
    left: {
      hero: "promo-image3.png",
      logo: "ultra-beauty.png",
      brand: "Ultra Beauty",
    },
    right: {
      hero: "promo-image4.png",
      logo: "macys.png",
      brand: "Macy’s",
    },
    discountType: "Finito",
  },
  Normal: {
    heading: "Solo por hoy",
    superType: "Normal",
    left: {
      hero: "promo-image6.png",
      logo: "nordstrom.png",
      brand: "Nordstrom",
    },
    right: {
      hero: "promo-image7.png",
      logo: "macys.png",
      brand: "Macy’s",
    },
    discountType: "Normal",
  },
  "Por temporada": {
    heading: "Promos",
    superType: "Por temporada",
    left: {
      hero: "promo-image8.png",
      logo: "instacart.png",
      brand: "Instacart",
    },
    right: {
      hero: "promo-image1.png",
      logo: "doordash.png",
      brand: "Doordash",
    },
    discountType: "Por temporada",
  },
  OKY: {
    heading: "OKY Day",
    superType: "OKY",
    left: {
      hero: "promo-image2.png",
      logo: "adidas.png",
      brand: "Adidas",
    },
    right: {
      hero: "promo-image3.png",
      logo: "bestbuy.jpg",
      brand: "Best Buy",
    },
    discountType: "OKY",
  },
};

function toClassSuffix(type) {
  return type
    .toLowerCase()
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function superRibbon(type, label = "") {
  const ribbonType = `super-ribbon-type-${toClassSuffix(type)}`;
  const iconByType = {
    "Por tiempo": "fa-clock",
    Finito: "fa-fire-flame-simple",
    Normal: "fa-tags",
    "Por temporada": "fa-sun",
    OKY: "fa-heart",
  };
  const textByType = {
    "Por tiempo": "Termina en 20:43:32",
    Finito: "Últimas 20 unidades",
    Normal: "Descuentos de temporada",
    "Por temporada": "Ofertas del mes de Abril",
    OKY: "Para la persona que quieres",
  };
  const ribbonText = typeof label === "string" && label.trim().length > 0 ? label : textByType[type];

  return `
    <div class="super-ribbon ${ribbonType}">
      <span class="super-ribbon-icon"><i class="fa-solid ${iconByType[type]}"></i></span>
      <span class="super-ribbon-text">${ribbonText}</span>
    </div>`;
}

function discountRibbon(type, label = "") {
  const ribbonType = `discount-ribbon-type-${toClassSuffix(type)}`;
  const discountText = typeof label === "string" && label.trim().length > 0 ? label : "17% OFF";
  return `
    <div class="discount-ribbon discount-ribbon-wrap ${ribbonType}">
      <span class="discount-ribbon-text token-price-percent">${discountText}</span>
    </div>`;
}

function offerCard({ side, hero, logo, brand, discountType, discountLabel }) {
  return `
    <article class="tactic-offer tactic-offer-${side}">
      <div class="tactic-offer-hero-wrap">
        <img class="tactic-offer-hero" src="${hero}" alt="${brand}">
        <div class="tactic-logo-wrap tactic-logo-wrap-${side}">
          <img class="tactic-logo" src="${logo}" alt="${brand} logo">
        </div>
        <div class="tactic-discount-wrap tactic-discount-wrap-${side}">
          ${discountRibbon(discountType, discountLabel)}
        </div>
      </div>
      <div class="tactic-brand-row">
        <p class="token-brand tactic-brand">${brand}</p>
      </div>
    </article>`;
}

function withFallback(value, fallback) {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function tacticStrip({
  property1,
  titleText = "",
  superRibbonText = "",
  discountRibbonText = "",
  leftDiscountRibbonText = "",
  rightDiscountRibbonText = "",
  leftBrandText = "",
  rightBrandText = "",
}) {
  const config = VARIANT_DATA[property1];
  const title = withFallback(titleText, config.heading);
  const leftBrand = withFallback(leftBrandText, config.left.brand);
  const rightBrand = withFallback(rightBrandText, config.right.brand);
  const leftDiscount = withFallback(leftDiscountRibbonText, discountRibbonText);
  const rightDiscount = withFallback(rightDiscountRibbonText, discountRibbonText);
  return `
    <section class="tactic-strip">
      <header class="tactic-strip-header">
        <h3 class="token-h6 tactic-strip-title">${title}</h3>
        ${superRibbon(config.superType, superRibbonText)}
      </header>

      <div class="tactic-strip-carousel-window">
        <div class="tactic-strip-carousel-track">
          ${offerCard({
            side: "left",
            ...config.left,
            brand: leftBrand,
            discountType: config.discountType,
            discountLabel: leftDiscount,
          })}
          ${offerCard({
            side: "right",
            ...config.right,
            brand: rightBrand,
            discountType: config.discountType,
            discountLabel: rightDiscount,
          })}
        </div>
      </div>
    </section>`;
}

export default {
  title: "Organisms/Tactic Strips",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo **Tactic Strips** con 5 variantes (`Property 1`). " +
          "Anida los átomos **Super Ribbon** y **Discount Ribbon (Wrap)** en la composición. " +
          "Referencia Figma: `7295:52040`.",
      },
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    property1: "Por tiempo",
    titleText: "",
    superRibbonText: "",
    discountRibbonText: "",
    leftDiscountRibbonText: "",
    rightDiscountRibbonText: "",
    leftBrandText: "",
    rightBrandText: "",
  },
  argTypes: {
    property1: {
      name: "Property 1",
      control: { type: "select" },
      options: VARIANT_OPTIONS,
      description: "Variante de tactic strip definida en Figma.",
    },
    titleText: {
      name: "Title Text",
      control: { type: "text" },
      description: "Texto libre del título del organismo. Si queda vacío, usa el título por defecto de la variante.",
    },
    superRibbonText: {
      name: "Super Ribbon Text",
      control: { type: "text" },
      description: "Texto libre dentro de Super Ribbon. Si queda vacío, usa el texto por defecto de la variante.",
    },
    discountRibbonText: {
      name: "Discount Ribbon Text",
      control: { type: "text" },
      description: "Texto libre global para ambos Discount Ribbon (Wrap). Si queda vacío, usa `17% OFF`.",
    },
    leftDiscountRibbonText: {
      name: "Left Discount Text",
      control: { type: "text" },
      description: "Override del Discount Ribbon izquierdo. Si queda vacío, usa `Discount Ribbon Text`.",
    },
    rightDiscountRibbonText: {
      name: "Right Discount Text",
      control: { type: "text" },
      description: "Override del Discount Ribbon derecho. Si queda vacío, usa `Discount Ribbon Text`.",
    },
    leftBrandText: {
      name: "Left Brand Text",
      control: { type: "text" },
      description: "Texto libre para marca izquierda. Si queda vacío, usa la marca por defecto de la variante.",
    },
    rightBrandText: {
      name: "Right Brand Text",
      control: { type: "text" },
      description: "Texto libre para marca derecha. Si queda vacío, usa la marca por defecto de la variante.",
    },
  },
  render: ({
    property1,
    titleText,
    superRibbonText,
    discountRibbonText,
    leftDiscountRibbonText,
    rightDiscountRibbonText,
    leftBrandText,
    rightBrandText,
  }) => `
    <div class="mars-story">
      <div class="mars-label">Tactic Strips · Property 1=${property1} · ID set .pen: 7295:52040</div>
      <div class="mars-mobile tactic-strip-mobile-shell">
        ${tacticStrip({
          property1,
          titleText,
          superRibbonText,
          discountRibbonText,
          leftDiscountRibbonText,
          rightDiscountRibbonText,
          leftBrandText,
          rightBrandText,
        })}
      </div>
    </div>`,
};

export const AllVariants = {
  name: "All Variants",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Muestra todas las variantes de `Tactic Strips` con la composición y anidación de átomos.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-mobile tactic-strip-mobile-shell">
        <div class="tactic-strip-stack">
          ${VARIANT_OPTIONS.map((property1) => tacticStrip({ property1 })).join("")}
        </div>
      </div>
    </div>`,
};
