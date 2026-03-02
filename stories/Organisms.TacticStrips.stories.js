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

function superRibbon(type) {
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

  return `
    <div class="super-ribbon ${ribbonType}">
      <span class="super-ribbon-icon"><i class="fa-solid ${iconByType[type]}"></i></span>
      <span class="super-ribbon-text">${textByType[type]}</span>
    </div>`;
}

function discountRibbon(type, label = "17% OFF") {
  const ribbonType = `discount-ribbon-type-${toClassSuffix(type)}`;
  return `
    <div class="discount-ribbon discount-ribbon-wrap ${ribbonType}">
      <span class="discount-ribbon-text token-price-percent">${label}</span>
    </div>`;
}

function offerCard({ side, hero, logo, brand, discountType }) {
  const isLeft = side === "left";
  return `
    <article class="tactic-offer tactic-offer-${side}">
      <div class="tactic-offer-hero-wrap">
        <img class="tactic-offer-hero" src="${hero}" alt="${brand}">
        <div class="tactic-logo-wrap tactic-logo-wrap-${side}">
          <img class="tactic-logo" src="${logo}" alt="${brand} logo">
        </div>
        <div class="tactic-discount-wrap tactic-discount-wrap-${side}">
          ${discountRibbon(discountType)}
        </div>
      </div>
      <div class="tactic-brand-row">
        <p class="token-brand tactic-brand">${brand}</p>
      </div>
    </article>`;
}

function tacticStrip({ property1 }) {
  const config = VARIANT_DATA[property1];
  return `
    <section class="tactic-strip">
      <header class="tactic-strip-header">
        <h3 class="token-h6 tactic-strip-title">${config.heading}</h3>
        ${superRibbon(config.superType)}
      </header>

      <div class="tactic-strip-carousel-window">
        <div class="tactic-strip-carousel-track">
          ${offerCard({ side: "left", ...config.left, discountType: config.discountType })}
          ${offerCard({ side: "right", ...config.right, discountType: config.discountType })}
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
  },
  argTypes: {
    property1: {
      name: "Property 1",
      control: { type: "select" },
      options: VARIANT_OPTIONS,
      description: "Variante de tactic strip definida en Figma.",
    },
  },
  render: ({ property1 }) => `
    <div class="mars-story">
      <div class="mars-label">Tactic Strips · Property 1=${property1} · ID set .pen: 7295:52040</div>
      <div class="mars-mobile tactic-strip-mobile-shell">
        ${tacticStrip({ property1 })}
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
