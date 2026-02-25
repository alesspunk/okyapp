/**
 * Carousel / Promo Banners — DS-MARS v2
 * Carrousel/Promo Banners · VSaWA · 360px
 * Promotional banner with label, title, description, CTA button and image.
 * Supports light (white bg) and dark (primary-main bg) themes.
 * Dot indicators reflect the active slide position in a multi-banner carousel.
 */

/* ── Banner data ─────────────────────────────────────── */
const BANNER_DATA = [
  {
    theme: "light",
    label: "Gift Cards",
    title: "Get 20% off today",
    desc: "Shop and save with promo codes",
    cta: "Learn more",
    image: "images/promo-strips1.webp",
  },
  {
    theme: "dark",
    label: "Expedia",
    title: "Get 25% or more off",
    desc: "Up to 3% Cash Back",
    cta: "Shop now",
    image: "images/promo-strips2.webp",
  },
  {
    theme: "light",
    label: "Starbucks",
    title: "Earn double rewards",
    desc: "Buy now and earn 2× points",
    cta: "Buy now",
    image: "images/starbucks.webp",
  },
];

/* ── Helpers ─────────────────────────────────────────── */
function buildDots(total, active) {
  return Array.from({ length: total }, (_, i) =>
    `<span class="promo-dot${i === active ? " promo-dot-active" : ""}"></span>`
  ).join("");
}

function buildBanner({ theme, label, title, desc, cta, image }, activeIndex = 0, totalSlides = 3) {
  const isDark = theme === "dark";
  return `
    <div class="promo-banner${isDark ? " promo-banner--dark" : ""}">
      <div class="promo-banner-slide">
        <div class="promo-banner-content">
          <span class="promo-banner-label">${label}</span>
          <div class="promo-banner-title">${title}</div>
          <p class="promo-banner-desc">${desc}</p>
          <button class="btn btn-primary btn-medium promo-banner-cta">${cta}</button>
        </div>
        <div class="promo-banner-image">
          <img src="${image}" alt="${label}">
        </div>
      </div>
      <div class="promo-banner-dots">${buildDots(totalSlides, activeIndex)}</div>
    </div>`;
}

/* ── Story config ────────────────────────────────────── */
export default {
  title: "Organisms/Carousel Promo Banners",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Carousel de banners promocionales del DS-MARS. " +
          "**Carrousel/Promo Banners** (`VSaWA` · 360px) — banner con imagen lateral, label, título en negrita, descripción y botón CTA. " +
          "Soporta tema **light** (fondo blanco, texto oscuro, botón `primary-main`) " +
          "y tema **dark** (fondo `primary-main`, texto blanco, botón blanco). " +
          "Los puntos de paginación muestran el slide activo. " +
          "Para múltiples banners, usar `.promo-carousel-track` como contenedor.",
      },
    },
  },
};

/* ── Playground ─────────────────────────────────────── */
export const Playground = {
  name: "Playground",
  args: {
    theme: "light",
    label: "Gift Cards",
    title: "Get 20% off today",
    desc: "Shop and save with promo codes",
    ctaText: "Learn more",
    image: "images/promo-strips1.webp",
    activeSlide: 0,
    totalSlides: 3,
  },
  argTypes: {
    theme: {
      name: "Theme",
      control: "inline-radio",
      options: ["light", "dark"],
      description:
        "Color scheme. **light** = fondo blanco, texto `#1c0040`, botón `primary-main`. " +
        "**dark** = fondo `primary-main`, texto blanco, botón blanco.",
    },
    label: {
      name: "Label",
      control: "text",
      description: "Categoría o nombre del partner (11px, muted).",
    },
    title: {
      name: "Title",
      control: "text",
      description: "Titular promocional principal (16px bold).",
    },
    desc: {
      name: "Description",
      control: "text",
      description: "Texto de apoyo debajo del título (12px).",
    },
    ctaText: {
      name: "CTA Text",
      control: "text",
      description: "Texto del botón de acción.",
    },
    image: {
      name: "Image path",
      control: "text",
      description: "Ruta de la imagen del banner (slot 116×116px, border-radius 8px).",
    },
    activeSlide: {
      name: "Active slide (0-based)",
      control: { type: "number", min: 0, max: 4 },
      description: "Índice del slide activo — controla el punto resaltado en los indicadores.",
    },
    totalSlides: {
      name: "Total slides",
      control: { type: "number", min: 1, max: 5 },
      description: "Número total de banners en el carousel — determina la cantidad de puntos.",
    },
  },
  render: ({ theme, label, title, desc, ctaText, image, activeSlide, totalSlides }) => {
    const banner = { theme, label, title, desc, cta: ctaText, image };
    const clampedActive = Math.max(0, Math.min(activeSlide, totalSlides - 1));
    return `
      <div class="mars-story">
        <div class="mars-label">Carrousel/Promo Banners · ID .pen: VSaWA</div>
        ${buildBanner(banner, clampedActive, totalSlides)}
      </div>`;
  },
};

/* ── All Banners — scrollable reference ─────────────── */
export const AllBanners = {
  name: "All Banners — scrollable",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Track horizontal con los 3 banners de muestra. Refleja la experiencia real — " +
          "el usuario desliza para ver más banners. Usar `.promo-carousel-track` como wrapper.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Carrousel/Promo Banners — 3 slides (scrollable)</div>
      <div class="promo-carousel-track">
        ${BANNER_DATA.map((b, i) => buildBanner(b, i, BANNER_DATA.length)).join("")}
      </div>
    </div>`,
};

/* ── Light Theme ─────────────────────────────────────── */
export const LightTheme = {
  name: "Light Theme",
  parameters: { controls: { disable: true } },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Promo Banner · Light Theme</div>
      ${buildBanner(BANNER_DATA[0], 0, 3)}
    </div>`,
};

/* ── Dark Theme ──────────────────────────────────────── */
export const DarkTheme = {
  name: "Dark Theme",
  parameters: { controls: { disable: true } },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Promo Banner · Dark Theme</div>
      ${buildBanner(BANNER_DATA[1], 1, 3)}
    </div>`,
};
