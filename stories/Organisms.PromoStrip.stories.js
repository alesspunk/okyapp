/* ─────────────────────────────────────────────────────────
   Organisms / Promo Strip
   MARS 7295:52034 · Single y Double.
   Título con «Ver más», divisor punteado y por cada marca: imagen,
   nombre y el chip «Gana X%» a todo el ancho DEBAJO del nombre (el
   mismo .oky-flow-brand-rate del prototipo), no un ribbon sobre la
   imagen (19/10).
───────────────────────────────────────────────────────── */

function rateChip(rate) {
  return rate ? `<span class="oky-flow-brand-rate">Gana ${rate}%</span>` : "";
}

function promoCard({ image, brand, rate }) {
  return `
    <article class="promo-strip-item oky-flow-brand-card">
      <div class="promo-strip-image-box">
        <img src="${image}" alt="${brand}">
      </div>
      <p class="token-brand promo-strip-brand">${brand}</p>
      ${rateChip(rate)}
    </article>`;
}

function promoStripBlock({ heading, cards, compact = false }) {
  return `
    <section class="promo-strip-organism${compact ? " promo-strip-organism-compact" : ""}">
      ${
        compact
          ? ""
          : `
      <div class="promo-strip-heading-wrap oky-flow-deals-head">
        <h3 class="token-h6 promo-strip-heading">${heading}</h3>
        <span class="btn btn-outlined btn-small">Ver más</span>
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
    rate: 25,
  },
  {
    image: "google.webp",
    brand: "Google Play",
    rate: 25,
  },
];

const secondCards = [
  {
    image: "xbox.png",
    brand: "Xbox",
    rate: 25,
  },
  {
    image: "twitch.png",
    brand: "Twitch",
    rate: 25,
  },
];

export default {
  title: "Organisms/Promo Strip",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo **Promo Strip** en dos variantes de layout: **Single** y **Double** (MARS 7295:52034). " +
          "Título con «Ver más» y divisor punteado; cada marca lleva imagen, nombre y, debajo del nombre, el chip " +
          "**Gana X%** a todo el ancho en el aqua de OKY Cash (`--tier-base-bg` / `--tier-base-text`). " +
          "Prototipo: `.oky-flow-brand-card` · `.oky-flow-brand-rate`.",
      },
    },
  },
};

export const Playground = {
  args: {
    variant: "Single",
    singleHeading: "Tus compras online",
    doubleHeading: "Todas estas 25% menos",
    rate: 25,
  },
  argTypes: {
    variant: {
      control: { type: "inline-radio" },
      options: ["Single", "Double"],
      description: "Single muestra 1 fila. Double muestra 2 filas.",
    },
    singleHeading: { control: "text" },
    doubleHeading: { control: "text" },
    rate: { control: { type: "number", min: 0, max: 100 }, description: "Cashback de la marca (Gana X%). 0 lo oculta." },
  },
  render: ({ variant, singleHeading, doubleHeading, rate }) => {
    const cardsA = baseCards.map((card) => ({ ...card, rate }));
    const cardsB = secondCards.map((card) => ({ ...card, rate }));

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
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Recomendado: Single heading máx. 17 ("Tus compras online") · Double heading máx. 20 ("Todas estas 25% menos") · chip «Gana X%» bajo el nombre.
        </div>
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
