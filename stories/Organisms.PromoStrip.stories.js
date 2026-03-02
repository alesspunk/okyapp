function discountRibbon(label) {
  return `
    <div class="discount-ribbon discount-ribbon-wrap discount-ribbon-wrap-small discount-ribbon-type-normal">
      <span class="discount-ribbon-text token-price-percent">${label}</span>
    </div>`;
}

function promoCard({ image, brand, ribbon }) {
  return `
    <article class="promo-strip-item">
      <div class="promo-strip-image-box">
        <img src="${image}" alt="${brand}">
        ${discountRibbon(ribbon)}
      </div>
      <p class="token-brand promo-strip-brand">${brand}</p>
    </article>`;
}

function promoStripBlock({
  heading,
  cards,
  compact = false,
}) {
  return `
    <section class="promo-strip-organism${compact ? " promo-strip-organism-compact" : ""}">
      ${
        compact
          ? ""
          : `
      <div class="promo-strip-heading-wrap">
        <h3 class="token-h6 promo-strip-heading">${heading}</h3>
      </div>
      <div class="promo-strip-divider"></div>
      `
      }
      <div class="promo-strip-row">
        ${cards.map((card) => promoCard(card)).join("")}
      </div>
    </section>`;
}

const baseCards = [
  {
    image: "target.webp",
    brand: "Target",
    ribbon: "-23%",
  },
  {
    image: "google.webp",
    brand: "Google Play",
    ribbon: "-23%",
  },
];

const secondCards = [
  {
    image: "xbox.png",
    brand: "Xbox",
    ribbon: "-23%",
  },
  {
    image: "twitch.png",
    brand: "Twitch",
    ribbon: "-23%",
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
          "Replica anatomy de Figma con 2 cards por fila y anida el átomo **Discount Ribbon (Wrap)** en cada card.",
      },
    },
  },
};

export const Playground = {
  args: {
    variant: "Single",
    singleHeading: "Tus compras online",
    doubleHeading: "Todas estas 25% menos",
    discount: "25%",
  },
  argTypes: {
    variant: {
      control: { type: "inline-radio" },
      options: ["Single", "Double"],
      description: "Single muestra 1 fila. Double muestra 2 filas.",
    },
    singleHeading: { control: "text" },
    doubleHeading: { control: "text" },
    discount: { control: "text" },
  },
  render: ({ variant, singleHeading, doubleHeading, discount }) => {
    const cardsA = baseCards.map((card) => ({ ...card, ribbon: discount }));
    const cardsB = secondCards.map((card) => ({ ...card, ribbon: discount }));

    const singleBlock = promoStripBlock({
      heading: singleHeading,
      cards: cardsA,
    });

    const doubleTop = promoStripBlock({
      heading: doubleHeading,
      cards: cardsA,
    });
    const doubleBottom = promoStripBlock({
      heading: "",
      cards: cardsB,
      compact: true,
    });

    return `
      <div class="mars-story">
        <div class="mars-label">Promo Strip / ${variant} · IDs .pen: 72353:23990 · 72353:23953</div>
        <div class="mars-mobile promo-strip-mobile-shell">
          <div class="promo-strip-stack">
            ${variant === "Double" ? `${doubleTop}${doubleBottom}` : singleBlock}
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
          heading: "Tus compras online",
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
            heading: "Todas estas 25% menos",
            cards: baseCards,
          })}
          ${promoStripBlock({
            cards: secondCards,
            compact: true,
          })}
        </div>
      </div>
    </div>`,
};
