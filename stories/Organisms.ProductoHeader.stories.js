import {
  DISCOUNT_RIBBON_TYPES,
  findMiddleCard,
  MIDDLE_CARD_PATHS,
  MIDDLE_CARD_VARIANTS,
  renderMiddleCard,
  resolveMiddleCard,
} from "./_shared/middleCard";
import { buildPlateu, PLATEU_VARIANT_OPTIONS, PLATEU_VARIANTS } from "./_shared/plateu";

const BRAND_PRESETS = [
  { key: "mcdonalds", label: "McDonald's", image: "mcdonalds.webp" },
  { key: "starbucks", label: "Starbucks", image: "starbucks.webp" },
  { key: "uber", label: "Uber", image: "uber.png" },
  { key: "target", label: "Target", image: "target.webp" },
  { key: "apple", label: "Apple", image: "apple.webp" },
  { key: "xbox", label: "Xbox", image: "xbox.png" },
  { key: "amazon", label: "Amazon", image: "amazon.png" },
  { key: "twitch", label: "Twitch", image: "twitch.png" },
  { key: "nike", label: "Nike", image: "nike.png" },
  { key: "doordash", label: "DoorDash", image: "doordash.png" },
];

const BRAND_VARIANTS = ["With label", "No label"];
const PAGE_HEADER_VARIANTS = ["screens", "modal", "no-title"];
const PRODUCTO_HEADER_LAYOUTS = ["Default", "With Plateu"];
const DYNAMIC_INPUT_STATES = ["Empty", "Hasvalue"];
const CARD_COUNT_OPTIONS = [1, 2, 3];

function renderCartBitmap({ indicated = true } = {}) {
  return `
    <div class="header-icon header-icon-bitmap header-icon-bitmap-cart${indicated ? " header-icon-bitmap-indicated" : ""}" aria-hidden="true">
      <img class="header-icon-bitmap-image header-icon-bitmap-cart-image" src="images/Cart-3d-icon.png" alt="">
      ${indicated ? '<span class="header-icon-indicator-dot"></span>' : ""}
    </div>
  `;
}

function findBrand(key) {
  return BRAND_PRESETS.find((brand) => brand.key === key) ?? BRAND_PRESETS[0];
}

function renderPageHeader({ variant, title, showAction, showCartIndicator = true }) {
  let left;
  let right;

  if (variant === "modal") {
    left = `<div class="header-icon header-icon-placeholder"><i class="fa-light fa-circle icon-medium"></i></div>`;
    right = showAction
      ? `<div class="header-icon"><i class="fa-light fa-xmark icon-medium"></i></div>`
      : `<div class="header-icon header-icon-placeholder"></div>`;
  } else {
    left = `<div class="header-icon header-icon-light"><i class="fa-light fa-arrow-left icon-medium"></i></div>`;
    right = showAction
      ? renderCartBitmap({ indicated: showCartIndicator })
      : `<div class="header-icon header-icon-placeholder"></div>`;
  }

  const titleMarkup =
    variant === "no-title"
      ? `<div class="page-header-title page-header-title-empty" aria-hidden="true"></div>`
      : `<div class="page-header-title">${title}</div>`;

  return `
    <div class="${variant === "modal" ? "page-header-modal" : "page-header-screen"}">
      ${left}
      ${titleMarkup}
      ${right}
    </div>
  `;
}

function renderBrandItem({ variant, brandKey, label, image, background }) {
  const brand = findBrand(brandKey);
  const resolvedLabel = label?.trim() || brand.label;
  const resolvedImage = image?.trim() || brand.image;
  const resolvedBackground = background?.trim() || "transparent";
  const showLabel = variant === "With label";

  return `
    <div class="brand-item-atom ${showLabel ? "is-with-label" : "is-no-label"}">
      ${showLabel ? `<p class="brand-item-label token-product-text">${resolvedLabel}</p>` : ""}
      <div class="brand-item-frame">
        <div class="brand-item-base" style="background:${resolvedBackground}">
          <img src="${resolvedImage}" alt="${resolvedLabel}" />
        </div>
      </div>
    </div>
  `;
}

function renderDynamicInput({ state, placeholder, value, currencySymbol, helperText }) {
  const isHasValue = state === "Hasvalue";
  const inputId = `pdp-header-dinamic-${isHasValue ? "hasvalue" : "empty"}`;
  const labelId = `${inputId}-label`;

  return `
    <div class="input-wrapper">
      ${
        isHasValue
          ? `<label id="${labelId}" class="input-label input-label-dinamic" for="${inputId}">${helperText}</label>`
          : ""
      }
      ${
        isHasValue
          ? `<span class="input-dinamic-prefix" aria-hidden="true">${currencySymbol}</span>`
          : ""
      }
      <input
        id="${inputId}"
        class="input-field input-dinamic ${isHasValue ? "input-dinamic-hasvalue" : "input-dinamic-empty"}"
        type="text"
        inputmode="decimal"
        name="pdp-dinamic-amount"
        placeholder="${placeholder}"
        value="${isHasValue ? value : ""}"
        ${isHasValue ? `aria-labelledby="${labelId}"` : `aria-label="${placeholder}"`}
      />
    </div>
  `;
}

// Arma el set de Middle Cards del carrusel dejando siempre la card
// configurada por los args (`primaryCard`) en la posición "activa": al
// medio cuando hay 3 cards, primera cuando hay 2, única cuando hay 1.
// Cada card lleva además su propio brandKey (la marca "dueña" de esa
// card), para que el Brand Item de arriba pueda seguir a la card activa
// mientras el usuario desliza el carrusel.
function buildCarouselCards(primaryCard, cardCount, pageContext, primaryBrandKey) {
  const clampedCount = CARD_COUNT_OPTIONS.includes(cardCount) ? cardCount : 1;

  if (clampedCount === 1) {
    return [{ ...primaryCard, brandKey: primaryBrandKey }];
  }

  const primaryIndex = MIDDLE_CARD_VARIANTS.findIndex((variant) => variant.path === primaryCard.path);
  const primaryBrandIndex = BRAND_PRESETS.findIndex((brand) => brand.key === primaryBrandKey);
  const extrasNeeded = clampedCount - 1;
  const extras = [];

  for (let step = 1; extras.length < extrasNeeded && step < MIDDLE_CARD_VARIANTS.length; step += 1) {
    const nextIndex = (primaryIndex + step) % MIDDLE_CARD_VARIANTS.length;
    const candidate = MIDDLE_CARD_VARIANTS[nextIndex];

    // Los estados "Disable Monto"/"Disable Foto" (isDisabled + hideFooter)
    // representan una card puntual sin footer/CTA — no tienen sentido como
    // vecina "genérica" de un carrusel rotativo de marcas, y forzarían un
    // footer vacío incluso con centerLabel configurado. Se saltan al
    // armar el set automático (si el usuario las elige como card activa
    // explícitamente, eso no cambia: solo afecta el auto-ciclado).
    if (candidate.isDisabled || candidate.hideFooter) {
      continue;
    }

    const nextBrandIndex = (primaryBrandIndex + extras.length + 1) % BRAND_PRESETS.length;
    extras.push({
      ...resolveMiddleCard({
        variantPath: candidate.path,
        pageContext,
        // El footer centerLabel es una decisión del carrusel completo, no
        // solo de la card activa: si la card configurada por los args trae
        // centerLabel, todas las cards del carrusel lo heredan (y por lo
        // tanto también pierden leftLabel/rightLabel + icono, igual que ella).
        centerLabel: primaryCard.centerLabel || "",
      }),
      brandKey: BRAND_PRESETS[nextBrandIndex].key,
    });
  }

  const activeSlot = Math.floor((clampedCount - 1) / 2);
  const cards = [...extras];
  cards.splice(activeSlot, 0, { ...primaryCard, brandKey: primaryBrandKey });
  return cards;
}

function renderProductoHeaderCarousel(cards) {
  const activeIndex = Math.floor((cards.length - 1) / 2);

  return `
    <div class="pdp-header-carousel-viewport">
      <div class="pdp-header-carousel-track">
        ${cards
          .map(
            (card, index) => `
              <div class="pdp-header-carousel-card ${index === activeIndex ? "is-active" : "is-hint"}" data-brand-key="${card.brandKey || ""}">
                ${renderMiddleCard(card)}
              </div>
            `
          )
          .join("")}
      </div>
    </div>
    <button type="button" class="pdp-header-carousel-nav pdp-header-carousel-nav-prev" aria-label="Ver card anterior">
      <i class="fa-solid fa-circle-chevron-left" aria-hidden="true"></i>
    </button>
    <button type="button" class="pdp-header-carousel-nav pdp-header-carousel-nav-next" aria-label="Ver siguiente card">
      <i class="fa-solid fa-circle-chevron-right" aria-hidden="true"></i>
    </button>
  `;
}

// Carrusel funcional: el markup arriba solo posiciona las cards en fila;
// el scroll real (touch/trackpad/wheel) lo maneja el navegador via
// overflow-x + scroll-snap (mars.css). En JS: 1) fija el scroll inicial
// sobre la card "activa" al montar (misma regla de centrado: 3 cards →
// media; 2 cards → primera; 1 card → sin carrusel) y 2) mientras el
// usuario desliza, detecta qué card queda centrada y actualiza el Brand
// Item de arriba para que siga a la marca de esa card.
function initProductoHeaderCarousels(root) {
  function setupCarousel(viewport, attempt = 0) {
    // El track tiene padding-inline = calc(50% - 125px) (mars.css), así
    // que hay espacio físico de scroll de sobra para centrar CUALQUIER
    // card, incluidas la primera y la última — sin ese buffer, el
    // navegador clampea scrollLeft y esas cards quedan pegadas al borde
    // en vez de centradas. Si el nodo todavía no tiene layout real
    // (clientWidth 0, p. ej. si aún no se adjuntó al documento), se
    // reintenta unos frames en vez de centrar mal; si nunca se adjunta,
    // se desiste después de un rato en lugar de reintentar para siempre.
    if (viewport.clientWidth === 0) {
      if (attempt < 20) {
        requestAnimationFrame(() => setupCarousel(viewport, attempt + 1));
      }
      return;
    }

    const cards = Array.from(viewport.querySelectorAll(".pdp-header-carousel-card"));
    if (!cards.length) {
      return;
    }

    const organism = viewport.closest(".pdp-header-organism");
    const brandSlot = organism?.querySelector(".pdp-header-brand-slot");
    const brandVariant = organism?.dataset.brandVariant === "No label" ? "No label" : "With label";

    function closestCard() {
      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      return cards.reduce((closest, card) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - center);
        return distance < closest.distance ? { card, distance } : closest;
      }, { card: cards[0], distance: Infinity }).card;
    }

    function syncActiveCard(active) {
      cards.forEach((card) => {
        card.classList.toggle("is-active", card === active);
        card.classList.toggle("is-hint", card !== active);
      });
    }

    function syncBrand(active, force) {
      const brandKey = active.dataset.brandKey;
      if (!brandSlot || !brandKey) {
        return;
      }
      if (!force && brandSlot.dataset.brandKey === brandKey) {
        return;
      }
      brandSlot.dataset.brandKey = brandKey;
      brandSlot.innerHTML = renderBrandItem({ variant: brandVariant, brandKey, label: "", image: "", background: "" });
    }

    // scrollIntoView({ inline: "center" }) delega el cálculo de centrado
    // al navegador (más robusto que restar manualmente offsetLeft/
    // clientWidth) y, combinado con el buffer del track, funciona igual
    // de bien para la card del medio que para la primera o la última.
    function centerCard(target, smooth) {
      target.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "nearest",
        inline: "center",
      });
    }

    // Botones circle-chevron-left/right: mueven el scroll una card a la
    // vez (centrada) y solo se muestran cuando hay una card real hacia
    // ese lado — si el usuario ya está en el extremo izquierdo/derecho,
    // ese botón se oculta en vez de quedar deshabilitado.
    const cardSlot = viewport.parentElement;
    const prevBtn = cardSlot?.querySelector(".pdp-header-carousel-nav-prev");
    const nextBtn = cardSlot?.querySelector(".pdp-header-carousel-nav-next");

    function updateNavVisibility() {
      if (!prevBtn || !nextBtn) {
        return;
      }
      const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
      prevBtn.style.display = viewport.scrollLeft <= 1 ? "none" : "";
      nextBtn.style.display = viewport.scrollLeft >= maxScrollLeft - 1 ? "none" : "";
    }

    prevBtn?.addEventListener("click", () => {
      const index = cards.indexOf(closestCard());
      const target = cards[index - 1];
      if (target) {
        centerCard(target, true);
      }
    });

    nextBtn?.addEventListener("click", () => {
      const index = cards.indexOf(closestCard());
      const target = cards[index + 1];
      if (target) {
        centerCard(target, true);
      }
    });

    const initialActive = cards.find((card) => card.classList.contains("is-active")) || cards[0];
    centerCard(initialActive, false);
    syncBrand(initialActive, true);
    updateNavVisibility();

    let ticking = false;
    viewport.addEventListener("scroll", () => {
      if (ticking) {
        return;
      }
      ticking = true;
      requestAnimationFrame(() => {
        const active = closestCard();
        syncActiveCard(active);
        syncBrand(active, false);
        updateNavVisibility();
        ticking = false;
      });
    });
  }

  requestAnimationFrame(() => {
    root.querySelectorAll(".pdp-header-carousel-viewport").forEach(setupCarousel);
  });
}

function resolveArgs(args = {}) {
  const brand = findBrand(args.brandKey);
  const middle = findMiddleCard(args.middleCardPath);
  const layoutVariant = PRODUCTO_HEADER_LAYOUTS.includes(args.layoutVariant) ? args.layoutVariant : "Default";
  const showPlateu = typeof args.showPlateu === "boolean" ? args.showPlateu : layoutVariant === "With Plateu";
  const cardCount = CARD_COUNT_OPTIONS.includes(args.cardCount) ? args.cardCount : 1;
  const cardContext = args.cardContext || "PDP";
  const middleCard = resolveMiddleCard({
    variantPath: middle.path,
    pageContext: cardContext,
    title: args.cardTitle?.trim() || middle.title,
    currency: args.currency?.trim() || middle.currency,
    amount: args.amount?.trim() || middle.amount,
    leftLabel: args.leftLabel?.trim() || middle.leftLabel,
    rightLabel: args.rightLabel?.trim() || middle.rightLabel,
    centerLabel: typeof args.centerLabel === "string" ? args.centerLabel : middle.centerLabel,
    image: args.cardImage?.trim() || middle.image,
    showDiscountRibbon: args.showDiscountRibbon,
    discountRibbonType: args.discountRibbonType,
    discountRibbonLabel: args.discountRibbonLabel,
    discountRibbonSize: args.discountRibbonSize,
  });

  return {
    layoutVariant,
    showPlateu,
    plateuVariant: PLATEU_VARIANT_OPTIONS.includes(args.plateuVariant)
      ? args.plateuVariant
      : "State=Productos, Telco=No, Scrolling=No",
    pageHeaderVariant: PAGE_HEADER_VARIANTS.includes(args.pageHeaderVariant) ? args.pageHeaderVariant : "no-title",
    pageTitle: args.pageTitle?.trim() || brand.label,
    showAction: args.showAction !== false,
    showCartIndicator: args.showCartIndicator !== false,
    brandVariant: BRAND_VARIANTS.includes(args.brandVariant) ? args.brandVariant : "With label",
    brandKey: brand.key,
    brandLabel: args.brandLabel?.trim() || brand.label,
    brandImage: args.brandImage?.trim() || brand.image,
    brandBackground: args.brandBackground?.trim() || "transparent",
    showDynamicInput: args.showDynamicInput !== false,
    dynamicInput: {
      state: DYNAMIC_INPUT_STATES.includes(args.dynamicInputState) ? args.dynamicInputState : "Empty",
      placeholder: args.dynamicPlaceholder?.trim() || "Ingresa el monto",
      value: args.dynamicValue?.trim() || "40.00",
      currencySymbol: args.dynamicCurrencySymbol || "$",
      helperText: args.dynamicHelperText?.trim() || "Desde 10 hasta 1000",
    },
    middleCard,
    cardCount,
    carouselCards: buildCarouselCards(middleCard, cardCount, cardContext, brand.key),
  };
}

function renderProductoHeader(args = {}) {
  const resolved = resolveArgs(args);
  const hasPlateu = resolved.showPlateu;
  const plateuPenId = PLATEU_VARIANTS[resolved.plateuVariant]?.penId;

  return `
    <section
      class="pdp-header-organism ${hasPlateu ? "has-plateu" : "has-no-plateu"} ${resolved.cardCount > 1 ? "has-carousel" : "has-single-card"} ${resolved.showDynamicInput ? "has-dynamic-input" : "has-no-dynamic-input"}"
      data-header-variant="${resolved.pageHeaderVariant}"
      data-card-context="${resolved.middleCard.pageContext}"
      data-plateu-variant="${resolved.plateuVariant}"
      data-card-count="${resolved.cardCount}"
      data-brand-variant="${resolved.brandVariant}"
      data-cart-indicator="${resolved.showCartIndicator}"
    >
      ${renderPageHeader({
        variant: resolved.pageHeaderVariant,
        title: resolved.pageTitle,
        showAction: resolved.showAction,
        showCartIndicator: resolved.showCartIndicator,
      })}
      <div class="pdp-header-stack">
        <div class="pdp-header-brand-slot">
          ${renderBrandItem({
            variant: resolved.brandVariant,
            brandKey: resolved.brandKey,
            label: resolved.brandLabel,
            image: resolved.brandImage,
            background: resolved.brandBackground,
          })}
        </div>
        ${
          hasPlateu
            ? `<div class="pdp-header-plateu-slot" data-pen-id="${plateuPenId}">
                ${buildPlateu({ property1: resolved.plateuVariant })}
              </div>`
            : ""
        }
        <div class="pdp-header-card-slot ${resolved.carouselCards.length > 1 ? "is-carousel" : ""}">
          ${
            resolved.carouselCards.length > 1
              ? renderProductoHeaderCarousel(resolved.carouselCards)
              : renderMiddleCard(resolved.middleCard)
          }
        </div>
        ${
          resolved.showDynamicInput
            ? `<div class="pdp-header-input-slot">
                ${renderDynamicInput(resolved.dynamicInput)}
              </div>`
            : ""
        }
      </div>
    </section>
  `;
}

export default {
  title: "Organisms/Producto Header",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo **Producto Header** compuesto únicamente con componentes ya existentes del sistema: " +
          "`Page Header`, `Brand Item`, `Plateu`, `Middle Card` e `Input/Dinamic`. " +
          "Se presenta como stack vertical para encabezados de PDP y usa por defecto la variante `Page Header / No title`. " +
          "Puede mostrarse con o sin `Plateu`, y también prender/apagar el `Discount Ribbon / Wrap` del `Middle Card`, reutilizando en ambos casos las variantes ya documentadas de los componentes existentes. " +
          "Cuando `Plateu` está presente, hereda el chip activo con fill blanco, border accent de `1px` y texto `Primary Main`. " +
          "El slot de `Middle Card` admite además una variante de **carrusel horizontal** con 1, 2 o 3 cards (`cardCount`), cada una de 250×160px: " +
          "con 3 cards la card activa queda centrada mostrando hint izquierdo y derecho; con 2 cards la activa queda centrada con hint solo a la derecha; con 1 card se comporta como el slot simple original, sin hint. " +
          "El `Input/Dinamic` final es opcional: `showDynamicInput` lo muestra u oculta por completo del stack. " +
          "El Cart 3D Icon del `Page Header` (screens/no-title) usa por defecto el estado con indicador (dot rojo), " +
          "reutilizando el mismo bitmap + indicator del organismo `Page Header`; `showCartIndicator` permite apagarlo.",
      },
    },
  },
  argTypes: {
    layoutVariant: {
      control: "inline-radio",
      options: PRODUCTO_HEADER_LAYOUTS,
      description: "Activa la composición base o la composición con Plateu entre Brand Item y Middle Card.",
    },
    showPlateu: {
      control: "boolean",
      description: "Permite prender o apagar Plateu dentro del stack.",
    },
    plateuVariant: {
      control: "select",
      options: PLATEU_VARIANT_OPTIONS,
      description: "Variante existente de Plateu usada dentro del organismo.",
    },
    pageHeaderVariant: {
      control: "inline-radio",
      options: PAGE_HEADER_VARIANTS,
      labels: {
        screens: "Screens",
        modal: "Modal",
        "no-title": "No title",
      },
      description: "Variante del Page Header usado en el organismo.",
    },
    pageTitle: {
      control: "text",
      description: "Título del Page Header.",
    },
    showAction: {
      control: "boolean",
      description: "Muestra u oculta la acción derecha del Page Header (cart en screens/no-title, xmark en modal).",
    },
    showCartIndicator: {
      name: "Show Cart Indicator",
      control: "boolean",
      description:
        "Prende el dot rojo del Cart 3D Icon en el Page Header (variantes screens/no-title). Reutiliza el mismo " +
        "bitmap + indicator ya usado en el organismo Page Header. No aplica en modal (usa xmark, sin cart).",
    },
    brandVariant: {
      control: "inline-radio",
      options: BRAND_VARIANTS,
      description: "Variante del átomo Brand Item dentro del stack.",
    },
    brandKey: {
      control: "select",
      options: BRAND_PRESETS.map((brand) => brand.key),
      description: "Preset de marca para poblar imagen y label base.",
    },
    brandLabel: {
      control: "text",
      description: "Override del label de marca. Si está vacío, usa el preset.",
    },
    brandImage: {
      control: "select",
      options: BRAND_PRESETS.map((brand) => brand.image),
      description: "Override de imagen de marca. Si está vacío, usa el preset.",
    },
    brandBackground: {
      control: "color",
      description: "Override del color de fondo del Brand Item. Si está vacío, usa transparent.",
    },
    middleCardPath: {
      control: "select",
      options: MIDDLE_CARD_PATHS,
      description: "Variante base del Middle Card anidado. Es la card que queda activa/centrada en el carrusel.",
    },
    cardCount: {
      name: "Card Count (Carousel)",
      control: "inline-radio",
      options: CARD_COUNT_OPTIONS,
      description:
        "Cards visibles en el carrusel horizontal (250×160px c/u). 3 → activa centrada + hint izq. y der.; " +
        "2 → activa centrada + hint solo a la der.; 1 → sin carrusel, sin hint.",
    },
    cardContext: {
      control: "inline-radio",
      options: ["PDP", "Checkout"],
      description: "Contexto del Middle Card dentro del organismo.",
    },
    cardTitle: {
      control: "text",
      description: "Título del Middle Card.",
    },
    currency: {
      control: "text",
      description: "Moneda del Middle Card numérico.",
    },
    amount: {
      control: "text",
      description: "Monto del Middle Card numérico.",
    },
    leftLabel: {
      control: "text",
      description: "Label inferior izquierdo del Middle Card.",
    },
    rightLabel: {
      control: "text",
      description: "Label inferior derecho del Middle Card.",
    },
    centerLabel: {
      control: "text",
      description:
        "Footer alterno de un solo label centrado del Middle Card, en Sentence case y sin icono (ej. \"Que necesitas saber\"). " +
        "Si tiene valor, reemplaza leftLabel/rightLabel + icono.",
    },
    cardImage: {
      control: "text",
      description: "Imagen del Middle Card de producto.",
    },
    showDiscountRibbon: {
      control: "boolean",
      description: "Prende o apaga el Discount Ribbon / Wrap en la esquina superior derecha del Middle Card.",
    },
    discountRibbonType: {
      control: "select",
      options: DISCOUNT_RIBBON_TYPES,
      description: "Type del Discount Ribbon montado sobre Middle Card.",
    },
    discountRibbonLabel: {
      control: "text",
      description: "Texto del Discount Ribbon / Wrap.",
    },
    discountRibbonSize: {
      control: "inline-radio",
      options: ["Default", "Small"],
      description: "Size del Wrap para Producto Header.",
    },
    showDynamicInput: {
      name: "Show Dynamic Value",
      control: "boolean",
      description: "Muestra u oculta por completo el Input/Dinamic al final del stack.",
    },
    dynamicInputState: {
      control: "inline-radio",
      options: DYNAMIC_INPUT_STATES,
      description: "Estado del Input/Dinamic al final del stack. Solo aplica si Show Dynamic Value está activo.",
    },
    dynamicPlaceholder: {
      control: "text",
      description: "Placeholder del Input/Dinamic.",
    },
    dynamicValue: {
      control: "text",
      description: "Valor del Input/Dinamic cuando está en Hasvalue.",
    },
    dynamicCurrencySymbol: {
      control: "inline-radio",
      options: ["Q", "$"],
      description: "Prefijo monetario del Input/Dinamic.",
    },
    dynamicHelperText: {
      control: "text",
      description: "Texto flotante del Input/Dinamic en Hasvalue.",
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    layoutVariant: "With Plateu",
    showPlateu: true,
    plateuVariant: "State=Productos, Telco=No, Scrolling=No",
    pageHeaderVariant: "no-title",
    pageTitle: "McDonald's",
    showAction: true,
    showCartIndicator: true,
    brandVariant: "With label",
    brandKey: "mcdonalds",
    brandLabel: "",
    brandImage: "",
    brandBackground: "",
    middleCardPath: "Molecule/Middle Card/Vale de Monto",
    cardCount: 1,
    cardContext: "PDP",
    cardTitle: "Vale de Monto",
    currency: "Q",
    amount: "1,000",
    leftLabel: "Mostrar al cajero",
    rightLabel: "Como canjear",
    centerLabel: "",
    cardImage: "middle-card-vale-de-producto.png",
    showDiscountRibbon: true,
    discountRibbonType: "Por tiempo",
    discountRibbonLabel: "25% OFF",
    discountRibbonSize: "Default",
    showDynamicInput: true,
    dynamicInputState: "Empty",
    dynamicPlaceholder: "Ingresa el monto",
    dynamicValue: "40.00",
    dynamicCurrencySymbol: "$",
    dynamicHelperText: "Desde 10 hasta 1000",
  },
  render: (args) => {
    const resolved = resolveArgs(args);
    const cardMeta = findMiddleCard(args.middleCardPath);
    const plateuMeta = PLATEU_VARIANTS[resolved.plateuVariant];

    const root = document.createElement("div");
    root.innerHTML = `
      <div class="mars-story">
        <div class="mars-label">Producto Header · ${resolved.layoutVariant} · Page Header ${resolved.pageHeaderVariant} · Brand ${resolved.brandKey} · Card ${cardMeta.path} · Cards ${resolved.cardCount}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Recomendado: Brand label máx. 12 caracteres · Plateu activo: ${resolved.showPlateu ? plateuMeta.penId : "off"} · ${cardMeta.recommendation} · Input placeholder máx. 16 caracteres.
          ${resolved.cardCount > 1 ? ` · Carrusel funcional (desliza con touch/trackpad): card activa "${resolved.middleCard.path}" centrada (250×160), ${resolved.cardCount === 3 ? "hint a ambos lados" : "hint solo a la derecha"}.` : ""}
        </div>
        <div class="mars-mobile">
          ${renderProductoHeader(args)}
        </div>
      </div>
    `;
    initProductoHeaderCarousels(root);
    return root;
  },
};

export const ReferenceStacks = {
  name: "Reference Stacks",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Tres configuraciones base del organismo para revisar cómo se comporta el stack con cada variante de Middle Card.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-grid">
        <article class="story-card">
          <div class="mars-label">Producto Header · Vale de Monto + Plateu</div>
          <div class="mars-mobile">
            ${renderProductoHeader({
              layoutVariant: "With Plateu",
              showPlateu: true,
              plateuVariant: "State=Productos, Telco=No, Scrolling=No",
              pageHeaderVariant: "no-title",
              pageTitle: "McDonald's",
              showAction: true,
              brandVariant: "With label",
              brandKey: "mcdonalds",
              middleCardPath: "Molecule/Middle Card/Vale de Monto",
              cardContext: "PDP",
              showDiscountRibbon: true,
              discountRibbonType: "Por tiempo",
              discountRibbonLabel: "25% OFF",
              discountRibbonSize: "Default",
              dynamicInputState: "Empty",
            })}
          </div>
        </article>
        <article class="story-card">
          <div class="mars-label">Producto Header · Vale de Producto</div>
          <div class="mars-mobile">
            ${renderProductoHeader({
              layoutVariant: "Default",
              showPlateu: false,
              pageHeaderVariant: "no-title",
              pageTitle: "McDonald's",
              showAction: true,
              brandVariant: "With label",
              brandKey: "mcdonalds",
              middleCardPath: "Molecule/Middle Card/Vale de Producto",
              cardContext: "PDP",
              showDiscountRibbon: false,
              dynamicInputState: "Hasvalue",
            })}
          </div>
        </article>
        <article class="story-card">
          <div class="mars-label">Producto Header · eGift Card + Plateu</div>
          <div class="mars-mobile">
            ${renderProductoHeader({
              layoutVariant: "With Plateu",
              showPlateu: true,
              plateuVariant: "State=Vales, Telco=No, Scrolling=No",
              pageHeaderVariant: "no-title",
              pageTitle: "Apple",
              showAction: true,
              brandVariant: "No label",
              brandKey: "apple",
              middleCardPath: "Molecule/Middle Card/eGift Card",
              cardContext: "Checkout",
              showDiscountRibbon: true,
              discountRibbonType: "Por tiempo",
              discountRibbonLabel: "18% OFF",
              discountRibbonSize: "Small",
              dynamicInputState: "Hasvalue",
              dynamicCurrencySymbol: "$",
            })}
          </div>
        </article>
      </div>
    </div>
  `,
};

export const CarouselVariants = {
  name: "Carousel Variants",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Variante de carrusel horizontal del slot de `Middle Card` (250×160px por card), con la regla de centrado: " +
          "con **3 cards** la card activa queda al centro con hint a la izquierda y a la derecha; " +
          "con **2 cards** la activa queda al centro con hint solo a la derecha; " +
          "con **1 card** no hay carrusel ni hint, igual que el slot simple original. " +
          "El carrusel es funcional: se puede deslizar con touch/trackpad/wheel entre todas las cards, con scroll-snap.",
      },
    },
  },
  render: () => {
    const root = document.createElement("div");
    root.innerHTML = `
    <div class="mars-story">
      <div class="mars-grid">
        <article class="story-card">
          <div class="mars-label">Producto Header · Carrusel · 1 card (sin hint)</div>
          <div class="mars-mobile">
            ${renderProductoHeader({
              showPlateu: false,
              pageHeaderVariant: "no-title",
              pageTitle: "McDonald's",
              brandVariant: "With label",
              brandKey: "mcdonalds",
              middleCardPath: "Molecule/Middle Card/Vale de Monto",
              cardContext: "PDP",
              cardCount: 1,
              dynamicInputState: "Empty",
            })}
          </div>
        </article>
        <article class="story-card">
          <div class="mars-label">Producto Header · Carrusel · 2 cards (hint a la derecha)</div>
          <div class="mars-mobile">
            ${renderProductoHeader({
              showPlateu: false,
              pageHeaderVariant: "no-title",
              pageTitle: "McDonald's",
              brandVariant: "With label",
              brandKey: "mcdonalds",
              middleCardPath: "Molecule/Middle Card/Vale de Monto",
              cardContext: "PDP",
              cardCount: 2,
              dynamicInputState: "Empty",
            })}
          </div>
        </article>
        <article class="story-card">
          <div class="mars-label">Producto Header · Carrusel · 3 cards (hint izq. y der.)</div>
          <div class="mars-mobile">
            ${renderProductoHeader({
              showPlateu: false,
              pageHeaderVariant: "no-title",
              pageTitle: "McDonald's",
              brandVariant: "With label",
              brandKey: "mcdonalds",
              middleCardPath: "Molecule/Middle Card/Vale de Monto",
              cardContext: "PDP",
              cardCount: 3,
              dynamicInputState: "Empty",
            })}
          </div>
        </article>
      </div>
    </div>
  `;
    initProductoHeaderCarousels(root);
    return root;
  },
};

export const CarouselRealExample = {
  name: "Carousel · Monto + Producto",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Ejemplo con contenido real de carrusel (2 cards): **Vale de Monto** activa y centrada, **Vale de Producto** " +
          "como hint a la derecha, ambas con el footer `centerLabel` (\"Que necesitas saber\"). " +
          "Ref. Figma: node `94184:15159`. Usa el asset ya existente en el repo `middle-card-vale-de-producto.png` como imagen placeholder. " +
          "El carrusel es funcional (desliza con touch/trackpad/wheel) y el Brand Item de arriba sigue a la marca de la card activa.",
      },
    },
  },
  render: () => {
    const montoCard = {
      ...resolveMiddleCard({
        variantPath: "Molecule/Middle Card/Vale de Monto",
        pageContext: "PDP",
        centerLabel: "Que necesitas saber",
      }),
      brandKey: "mcdonalds",
    };
    const productoCard = {
      ...resolveMiddleCard({
        variantPath: "Molecule/Middle Card/Vale de Producto",
        pageContext: "PDP",
        centerLabel: "Que necesitas saber",
        image: "middle-card-vale-de-producto.png",
      }),
      brandKey: "mcdonalds",
    };

    const root = document.createElement("div");
    root.innerHTML = `
      <div class="mars-story">
        <div class="mars-label">Producto Header · Carrusel · Vale de Monto + Vale de Producto</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Ref. Figma node 94184:15159 · footer centerLabel compartido · imagen placeholder existente del repo.
        </div>
        <div class="mars-mobile">
          <section
            class="pdp-header-organism has-no-plateu has-carousel has-dynamic-input"
            data-header-variant="no-title"
            data-card-context="PDP"
            data-card-count="2"
            data-brand-variant="With label"
          >
            ${renderPageHeader({ variant: "no-title", title: "McDonald's", showAction: true })}
            <div class="pdp-header-stack">
              <div class="pdp-header-brand-slot">
                ${renderBrandItem({ variant: "With label", brandKey: "mcdonalds", label: "", image: "", background: "" })}
              </div>
              <div class="pdp-header-card-slot is-carousel">
                ${renderProductoHeaderCarousel([montoCard, productoCard])}
              </div>
              <div class="pdp-header-input-slot">
                ${renderDynamicInput({
                  state: "Empty",
                  placeholder: "Ingresa el monto",
                  value: "40.00",
                  currencySymbol: "$",
                  helperText: "Desde 10 hasta 1000",
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
    initProductoHeaderCarousels(root);
    return root;
  },
};
