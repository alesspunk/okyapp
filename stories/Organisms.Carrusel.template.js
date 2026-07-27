import { renderMiddleCard } from "./_shared/middleCard.js";

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

/* ─────────────────────────────────────────────────────────
   Carrusel / Default (Cards) — variante con Middle Cards en vez de
   banners de imagen. Reutiliza tal cual `renderMiddleCard`
   (Molecules/Middle Card) y las flechas rectangulares
   `.pdp-header-carousel-nav` ya construidas para Organisms/Producto
   Header y Pages/Checkout — mismo scroll-snap real + loop infinito
   (ver justificación técnica en el docs.description del default export
   de este archivo de stories).
───────────────────────────────────────────────────────── */

export const CARRUSEL_CARDS_ITEMS = [
  { brandKey: "amazon", id: "local:carrusel-cards-amazon", title: "Amazon E-Gift Card", currency: "$", amount: "25" },
  { brandKey: "target", id: "6991:146335", title: "Target E-Gift Card", currency: "$", amount: "40" },
  { brandKey: "starbucks", id: "local:carrusel-cards-starbucks", title: "Starbucks E-Gift Card", currency: "$", amount: "15" },
];

function buildCarruselCardData(item) {
  return {
    ...item,
    pageContext: "Checkout",
    kind: "egift",
    isDisabled: false,
    hideFooter: false,
    titleImage: "",
    titleImageAlt: "",
    leftLabel: "",
    rightLabel: "",
    centerLabel: "Que necesito saber",
    image: "",
    showDiscountRibbon: false,
  };
}

// Loop infinito: la secuencia de N cards únicas se triplica en el
// track (3N nodos). Las copias de los extremos son decorativas
// (aria-hidden, buffer visual); la copia del medio trae la card real
// activa — así SIEMPRE hay una card real a ambos lados sin importar
// cuál esté activa.
export function renderCarruselCardsOrganism() {
  const setSize = CARRUSEL_CARDS_ITEMS.length;
  const tiled = [...CARRUSEL_CARDS_ITEMS, ...CARRUSEL_CARDS_ITEMS, ...CARRUSEL_CARDS_ITEMS];
  const activeFlatIndex = setSize + 1; // copia del medio, Target (índice 1 dentro de cada copia)

  return `
    <section class="carrusel-organism carrusel-organism-cards" aria-label="Carrusel de cards (loop infinito)">
      <div class="carrusel-cards-shell" style="position:relative;width:100%">
        <div class="pdp-header-carousel-viewport">
          <div class="pdp-header-carousel-track">
            ${tiled
              .map((item, flatIndex) => {
                const copy = Math.floor(flatIndex / setSize);
                const isActive = flatIndex === activeFlatIndex;
                const ariaHidden = copy !== 1 ? ' aria-hidden="true"' : "";
                return `
                  <div class="pdp-header-carousel-card ${isActive ? "is-active" : "is-hint"}" data-brand-key="${item.brandKey}"${ariaHidden}>
                    ${renderMiddleCard(buildCarruselCardData(item))}
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
        <button type="button" class="pdp-header-carousel-nav pdp-header-carousel-nav-prev" aria-label="Ver card anterior">
          <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>
        <button type="button" class="pdp-header-carousel-nav pdp-header-carousel-nav-next" aria-label="Ver siguiente card">
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </section>
  `;
}

// Misma mecánica que initProductoHeaderCarousels / el carrusel inline
// de checkout-page.html: centra la card activa al montar (con retry
// vía requestAnimationFrame mientras el nodo no tenga layout real
// todavía), mueve el scroll una card a la vez con prev/next, y —
// apenas el scroll-snap "asienta" (debounce 120ms) — si la card activa
// quedó en una copia de los extremos, se recicla sin animación a la
// posición equivalente en la copia del medio.
export function initCarruselCardsInfinite(root, attempt = 0) {
  const viewport = root.querySelector(".pdp-header-carousel-viewport");
  if (!viewport) {
    return;
  }

  if (viewport.clientWidth === 0) {
    if (attempt < 20) {
      requestAnimationFrame(() => initCarruselCardsInfinite(root, attempt + 1));
    }
    return;
  }

  const cards = Array.from(viewport.querySelectorAll(".pdp-header-carousel-card"));
  if (!cards.length) {
    return;
  }

  const wrap = viewport.closest(".carrusel-cards-shell");
  const prevBtn = wrap?.querySelector(".pdp-header-carousel-nav-prev");
  const nextBtn = wrap?.querySelector(".pdp-header-carousel-nav-next");
  const setSize = cards.length / 3;

  function closestCard() {
    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    return cards.reduce(
      (closest, card) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - center);
        return distance < closest.distance ? { card, distance } : closest;
      },
      { card: cards[0], distance: Infinity },
    ).card;
  }

  function syncActiveCard(active) {
    cards.forEach((card) => {
      card.classList.toggle("is-active", card === active);
      card.classList.toggle("is-hint", card !== active);
    });
  }

  function centerCard(target, smooth) {
    target.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "nearest",
      inline: "center",
    });
  }

  function recycleToMiddleCopy(active) {
    const index = cards.indexOf(active);
    const copy = Math.floor(index / setSize);
    if (copy === 1) {
      return active;
    }
    const middleCard = cards[setSize + (index % setSize)];
    centerCard(middleCard, false);
    syncActiveCard(middleCard);
    return middleCard;
  }

  // Infinito: las flechas quedan siempre visibles/activas en ambos
  // extremos, nunca se ocultan.
  function updateNavVisibility() {
    if (!prevBtn || !nextBtn) {
      return;
    }
    prevBtn.style.display = "";
    nextBtn.style.display = "";
  }

  prevBtn?.addEventListener("click", () => {
    const index = cards.indexOf(closestCard());
    const target = cards[index - 1] || cards[cards.length - 1];
    centerCard(target, true);
  });

  nextBtn?.addEventListener("click", () => {
    const index = cards.indexOf(closestCard());
    const target = cards[index + 1] || cards[0];
    centerCard(target, true);
  });

  const initialActive = cards.find((card) => card.classList.contains("is-active")) || cards[Math.floor(cards.length / 2)];
  centerCard(initialActive, false);
  syncActiveCard(initialActive);
  updateNavVisibility();

  let ticking = false;
  let settleTimer = null;
  viewport.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        syncActiveCard(closestCard());
        updateNavVisibility();
        ticking = false;
      });
    }

    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      recycleToMiddleCopy(closestCard());
    }, 120);
  });
}
