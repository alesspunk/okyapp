function discountRibbon(label) {
  return `
    <div class="discount-ribbon discount-ribbon-list promo-strip-ribbon">
      <span class="discount-ribbon-text token-price-percent">${label}</span>
    </div>`;
}

function promoCard({ image, brand, title, priceNow, priceBefore, ribbon }) {
  return `
    <article class="promo-strip-card">
      <div class="promo-strip-card-media">
        <img src="${image}" alt="${title}">
      </div>
      <div class="promo-strip-card-copy">
        <div class="promo-strip-card-brand mars-label">${brand}</div>
        <div class="token-product-text-plp promo-strip-card-title">${title}</div>
        <div class="promo-strip-card-prices">
          <span class="token-price-tag-plp">${priceNow}</span>
          <span class="token-price-plp">${priceBefore}</span>
        </div>
      </div>
      ${discountRibbon(ribbon)}
    </article>`;
}

function promoStripBlock({
  heading,
  subheading,
  countdown,
  cards,
}) {
  return `
    <section class="promo-strip-organism">
      <div class="promo-strip-header">
        <div>
          <div class="token-product-text-plp promo-strip-heading">${heading}</div>
          <p class="mars-subtitle promo-strip-subheading">${subheading}</p>
        </div>
        <div class="promo-strip-countdown">${countdown}</div>
      </div>
      <div class="promo-strip-divider"></div>
      <div class="promo-strip-grid">
        ${cards.map((card) => promoCard(card)).join("")}
      </div>
    </section>`;
}

const baseCards = [
  {
    image: "target.webp",
    brand: "Target",
    title: "Gift Card Target",
    priceNow: "$40.00",
    priceBefore: "$50.00",
    ribbon: "20% OFF",
  },
  {
    image: "google.webp",
    brand: "Google Play",
    title: "Gift Card Google Play",
    priceNow: "$35.00",
    priceBefore: "$50.00",
    ribbon: "30% OFF",
  },
];

const secondCards = [
  {
    image: "promo-strips1.webp",
    brand: "Especial",
    title: "Pack Combos",
    priceNow: "$15.00",
    priceBefore: "$20.00",
    ribbon: "25% OFF",
  },
  {
    image: "promo-strips2.webp",
    brand: "Express",
    title: "Delivery Promos",
    priceNow: "$12.00",
    priceBefore: "$18.00",
    ribbon: "33% OFF",
  },
];

export default {
  title: "Organisms/Promo Strip",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo Promo Strip en dos variantes de layout: **Single** y **Double**. " +
          "Anida el átomo **Discount Ribbon (List)** en cada card de oferta.",
      },
    },
  },
};

export const Playground = {
  args: {
    variant: "Single",
    heading: "Promociones de hoy",
    subheading: "Explora ofertas activas de gift cards.",
    countdown: "20:43:32",
  },
  argTypes: {
    variant: {
      control: { type: "inline-radio" },
      options: ["Single", "Double"],
      description: "Single muestra un bloque de promo. Double apila dos bloques.",
    },
    heading: { control: "text" },
    subheading: { control: "text" },
    countdown: { control: "text" },
  },
  render: ({ variant, heading, subheading, countdown }) => {
    const firstBlock = promoStripBlock({
      heading,
      subheading,
      countdown,
      cards: baseCards,
    });

    const secondBlock = promoStripBlock({
      heading: "Más ofertas para ti",
      subheading: "Variantes adicionales en la misma sección.",
      countdown,
      cards: secondCards,
    });

    return `
      <div class="mars-story">
        <div class="mars-label">Promo Strip / ${variant} · IDs .pen: 72353:23990 · 72353:23953</div>
        <div class="mars-mobile promo-strip-mobile-shell">
          <div class="promo-strip-stack">
            ${firstBlock}
            ${variant === "Double" ? secondBlock : ""}
          </div>
        </div>
      </div>`;
  },
};

export const Single = {
  parameters: { controls: { disable: true } },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Promo Strip / Single · ID .pen: 72353:23990</div>
      <div class="mars-mobile promo-strip-mobile-shell">
        ${promoStripBlock({
          heading: "Promociones de hoy",
          subheading: "Explora ofertas activas de gift cards.",
          countdown: "20:43:32",
          cards: baseCards,
        })}
      </div>
    </div>`,
};

export const Double = {
  parameters: { controls: { disable: true } },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Promo Strip / Double · ID .pen: 72353:23953</div>
      <div class="mars-mobile promo-strip-mobile-shell">
        <div class="promo-strip-stack">
          ${promoStripBlock({
            heading: "Promociones de hoy",
            subheading: "Explora ofertas activas de gift cards.",
            countdown: "20:43:32",
            cards: baseCards,
          })}
          ${promoStripBlock({
            heading: "Más ofertas para ti",
            subheading: "Variantes adicionales en la misma sección.",
            countdown: "20:43:32",
            cards: secondCards,
          })}
        </div>
      </div>
    </div>`,
};
