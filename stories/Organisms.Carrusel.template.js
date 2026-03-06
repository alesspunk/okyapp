export const CARRUSEL_DOT_OPTIONS = [1, 2, 3, 4, 5];

export const CARRUSEL_SLIDES = [
  {
    nodeId: "6449:41078",
    image: "carrusel-images1.png",
    alt: "Promo verano",
  },
  {
    nodeId: "6449:41079",
    image: "carrusel-pops.png",
    alt: "Promo bienvenida",
  },
];

function normalizeDot(value) {
  return CARRUSEL_DOT_OPTIONS.includes(value) ? value : 1;
}

function resolveAssetPath(imageName, assetsBasePath) {
  return `${assetsBasePath}${imageName}`;
}

export function renderCarruselOrganism({ activeDot = 1, assetsBasePath = "" } = {}) {
  const currentDot = normalizeDot(activeDot);

  return `
    <section class="carrusel-organism" aria-label="Carrusel de banners">
      <div class="carrusel-content">
        <div class="carrusel-viewport">
          <div class="carrusel-track">
            ${CARRUSEL_SLIDES.map(
              (slide) => `
                <article class="carrusel-slide" data-node-id="${slide.nodeId}">
                  <img src="${resolveAssetPath(slide.image, assetsBasePath)}" alt="${slide.alt}">
                </article>
              `
            ).join("")}
          </div>
        </div>

        <div class="carrusel-dots-wrap" aria-hidden="true">
          <div class="carrusel-dots">
            ${CARRUSEL_DOT_OPTIONS.map(
              (dot) => `<span class="carrusel-dot ${dot === currentDot ? "is-active" : ""}"></span>`
            ).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}
