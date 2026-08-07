import { renderMiddleCard } from "./_shared/middleCard.js";

/* ─────────────────────────────────────────────────────────
   Brand Carrousel — rediseño que reemplaza el diseño anterior
   (dos `Brand Item / Medium` laterales + un `Middle Card` estático al
   centro). El nuevo diseño reutiliza tal cual `renderMiddleCard`
   (Molecules/Middle Card) y las flechas rectangulares
   `.pdp-header-carousel-nav` ya construidas para Organisms/Producto
   Header y Pages/Checkout, en modo carrusel real con scroll-snap y
   loop infinito — misma mecánica que la variante Cards que existía
   provisionalmente (y por error) dentro de Organisms/Carrusel, que
   ahora vive aquí.

   Justificación técnica · Loop infinito: la secuencia de N cards
   únicas se triplica en el track (3N nodos). Las copias de los
   extremos son puramente decorativas (aria-hidden) y actúan como
   buffer visual, mientras que la copia del medio contiene la card
   real activa. De este modo SIEMPRE hay una card real a ambos lados
   del carrusel, sin importar cuál esté activa, y las flechas de
   navegación nunca necesitan ocultarse en los extremos. Cuando el
   scroll-snap termina de asentar (debounce de 120ms tras el último
   evento de scroll), si la card activa quedó en una de las copias de
   los extremos, el carrusel se "teletransporta" sin animación a la
   posición equivalente en la copia del medio.
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
function renderBrandCarrousel() {
  const setSize = CARRUSEL_CARDS_ITEMS.length;
  const tiled = [...CARRUSEL_CARDS_ITEMS, ...CARRUSEL_CARDS_ITEMS, ...CARRUSEL_CARDS_ITEMS];
  const activeFlatIndex = setSize + 1; // copia del medio, Target (índice 1 dentro de cada copia)

  return `
    <section class="carrusel-organism carrusel-organism-cards" aria-label="Brand Carrousel (loop infinito)">
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
function initBrandCarrouselInfinite(root, attempt = 0) {
  const viewport = root.querySelector(".pdp-header-carousel-viewport");
  if (!viewport) {
    return;
  }

  if (viewport.clientWidth === 0) {
    if (attempt < 20) {
      requestAnimationFrame(() => initBrandCarrouselInfinite(root, attempt + 1));
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

export default {
  title: "Organisms/Brand Carrousel",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo **Brand Carrousel** rediseñado: carrusel funcional de `Middle Card` (Amazon / Target / " +
          "Starbucks) con scroll-snap real, flechas rectangulares reutilizadas de `Organisms/Producto Header` y " +
          "`Pages/Checkout`, y **loop infinito** — siempre hay una card real a ambos lados, sin importar cuál " +
          "esté activa. Reemplaza el diseño anterior (dos `Brand Item / Medium` laterales + un `Middle Card` " +
          "estático al centro), que quedó dado de baja.\n\n" +
          "### Justificación técnica · Loop infinito\n\n" +
          "La secuencia de cards únicas se triplica en el track (3 copias seguidas): las copias de los extremos " +
          "son puramente decorativas (`aria-hidden`) y actúan como buffer visual, mientras que la copia del " +
          "medio contiene la card real activa. De este modo SIEMPRE hay una card real a ambos lados del " +
          "carrusel, sin importar cuál esté activa, y las flechas de navegación nunca necesitan ocultarse en " +
          "los extremos.\n\n" +
          "Cuando el scroll-snap termina de asentar (debounce de 120ms tras el último evento de scroll), si la " +
          "card activa quedó en una de las copias de los extremos, el carrusel se \"teletransporta\" sin " +
          "animación a la posición equivalente en la copia del medio — visualmente idéntico, pero deja margen " +
          "de sobra para seguir navegando en cualquier dirección de forma indefinida, sin necesidad de clonar " +
          "nodos en tiempo real ni reconstruir el DOM en cada paso.",
      },
    },
  },
};

export const Default = {
  name: "Default",
  parameters: { controls: { disable: true } },
  render: () => {
    const root = document.createElement("div");
    root.className = "mars-story";
    root.innerHTML = `
      <div class="mars-label">Brand Carrousel / Default (loop infinito)</div>
      <div class="mars-label" style="margin-bottom:12px;color:var(--text-secondary)">
        Carrusel de Middle Cards con scroll-snap real, flechas rectangulares reutilizadas de Producto Header /
        Checkout, y loop infinito — siempre hay una card real a ambos lados, sin importar cuál esté activa.
      </div>
      <div class="mars-mobile">${renderBrandCarrousel()}</div>
    `;
    initBrandCarrouselInfinite(root);
    return root;
  },
};
