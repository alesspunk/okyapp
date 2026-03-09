const VARIANT_OPTIONS = ["Default", "With Photo"];

const DEFAULT_ITEMS = [
  { logo: "twitch.png", name: "Twitch" },
  { logo: "amazon.png", name: "Amazon" },
  { logo: "adidas.png", name: "Adidas" },
  { logo: "bestbuy.jpg", name: "Best Buy" },
  { logo: "instacart.png", name: "Instacart" },
  { logo: "doordash.png", name: "Doordash" },
];

const PHOTO_ITEMS = [
  {
    hero: "promo-image2.png",
    logo: "adidas.png",
    name: "Adidas",
  },
  {
    hero: "promo-image6.png",
    logo: "nordstrom.png",
    name: "Nordstrom",
  },
  {
    hero: "promo-image7.png",
    logo: "macys.png",
    name: "Macys",
  },
];

function defaultTile(item) {
  return `
    <article class="homecard-tile">
      <div class="homecard-tile-logo-wrap">
        <img class="homecard-tile-logo" src="${item.logo}" alt="${item.name} logo">
      </div>
      <p class="token-brand homecard-tile-name">${item.name}</p>
    </article>`;
}

function photoTile(item) {
  return `
    <article class="homecard-photo-item">
      <div class="homecard-photo-media-wrap">
        <img class="homecard-photo-hero" src="${item.hero}" alt="${item.name}">
        <div class="homecard-photo-ribbon-wrap">
          <div class="discount-ribbon discount-ribbon-wrap discount-ribbon-type-normal">
            <span class="discount-ribbon-text token-price-percent">40% OFF</span>
          </div>
        </div>
      </div>
      <div class="homecard-photo-logo-stack">
        <div class="homecard-photo-logo-wrap">
          <img class="homecard-photo-logo" src="${item.logo}" alt="${item.name} logo">
        </div>
        <p class="token-brand homecard-photo-name">${item.name}</p>
      </div>
    </article>`;
}

function homeCard({ variant, title }) {
  const isWithPhoto = variant === "With Photo";
  return `
    <section class="homecard-organism ${isWithPhoto ? "homecard-organism-photo" : ""}">
      <header class="homecard-header">
        <h3 class="token-h6 homecard-title">${title}</h3>
      </header>

      <div class="homecard-content ${isWithPhoto ? "homecard-content-photo" : "homecard-content-default"}">
        ${
          isWithPhoto
            ? `<div class="homecard-photo-track">${PHOTO_ITEMS.map(photoTile).join("")}</div>`
            : `<div class="homecard-grid">${DEFAULT_ITEMS.map(defaultTile).join("")}</div>`
        }
      </div>

      <footer class="homecard-footer">
        <button class="btn btn-primary btn-small" type="button">Ver más</button>
      </footer>
    </section>`;
}

export default {
  title: "Organisms/HomeCard",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo **HomeCard** con dos variantes: **Default** y **With Photo**. " +
          "Mantiene el contenedor `IqRGM` con borde, sombra y jerarquía de contenido para home discovery.",
      },
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    variant: "Default",
    title: "Solo por hoy",
  },
  argTypes: {
    variant: {
      control: { type: "inline-radio" },
      options: VARIANT_OPTIONS,
      description: "Selecciona la variante del HomeCard.",
    },
    title: {
      control: "text",
      description: "Título principal del card.",
    },
  },
  render: ({ variant, title }) => `
    <div class="mars-story">
      <div class="mars-label">HomeCard · Variant=${variant} · ID base .pen: IqRGM</div>
      <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
        Recomendado: máximo 11 caracteres en título (base: "Solo por hoy").
      </div>
      ${homeCard({ variant, title })}
    </div>`,
};

export const Default = {
  parameters: { controls: { disable: true } },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">HomeCard / Default · IqRGM</div>
      ${homeCard({ variant: "Default", title: "Solo por hoy" })}
    </div>`,
};

export const WithPhoto = {
  parameters: { controls: { disable: true } },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">HomeCard / With Photo · IqRGM</div>
      ${homeCard({ variant: "With Photo", title: "Ropa" })}
    </div>`,
};
