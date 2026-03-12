const BASE_VARIANT_OPTIONS = ["Left", "Right"];
const DOCS_VARIANT_OPTIONS = ["Left", "Right", "Collapsed Left", "Collapsed Right"];

const VARIANT_IDS = {
  Left: "7296:48469",
  Right: "7296:48471",
  "Collapsed Left": "7296:48472",
  "Collapsed Right": "7296:48473",
};

const COUNTRY_BASE = {
  left: {
    code: "GUA",
    flag: "guatemala-flag.png",
    collapsedFlag: "flag-guate.png",
    alt: "Guatemala flag",
  },
  right: {
    code: "USA",
    flag: "usa-flag.png",
    collapsedFlag: "flag-usa.png",
    alt: "USA flag",
  },
};

const LEFT_TOP_SHAPE = `
  <svg width="360" height="77" viewBox="0 0 360 77" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g filter="url(#filter0_d_7295_52268_story)">
      <path d="M0 36.9611V72.4925V77H360V72.4925H210.086C189.022 72.4925 185.476 59.0328 185.142 57.4792C183.708 50.801 183.479 48.5296 182.925 33.0669C182.251 14.28 157.502 15.3481 148.003 15.4421C116.776 15.1085 48.8908 14.6414 27.1616 15.4421C5.43231 16.2428 0 30.1217 0 36.9611Z" fill="white"/>
    </g>
    <defs>
      <filter id="filter0_d_7295_52268_story" x="-24" y="-5" width="408" height="110" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="12"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.17 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7295_52268"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7295_52268" result="shape"/>
      </filter>
    </defs>
  </svg>
`;

const LEFT_BOTTOM_SHAPE = `
  <svg width="360" height="60" viewBox="0 0 360 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M360 21.0188V55.6968V60H0V55.6968H159.294C180.415 55.6968 182.209 42.5942 182.311 41.0441C182.654 35.8185 182.654 30.7861 182.654 17.2181C182.654 -1.20169 203.044 0.0166291 212.569 0.0166289H333.763C355.564 0.0166276 360 14.3437 360 21.0188Z" fill="url(#paint0_linear_7295_52258_story)"/>
    <defs>
      <linearGradient id="paint0_linear_7295_52258_story" x1="180" y1="0" x2="180" y2="60" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F1F2F5"/>
        <stop offset="0.880066" stop-color="#ECEFF8"/>
      </linearGradient>
    </defs>
  </svg>
`;

const RIGHT_TOP_SHAPE = `
  <svg width="360" height="77" viewBox="0 0 360 77" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g filter="url(#filter0_d_7295_52299_story)">
      <path d="M360 36.9611V72.4925V77H0V72.4925H149.33C170.453 72.4925 174.009 59.0328 174.344 57.4792C175.782 50.801 176.011 48.5296 176.567 33.0669C177.242 14.28 202.06 15.3481 211.586 15.4421C242.899 15.1085 310.973 14.6414 332.763 15.4421C354.553 16.2428 360 30.1217 360 36.9611Z" fill="white"/>
    </g>
    <defs>
      <filter id="filter0_d_7295_52299_story" x="-24" y="-5" width="408" height="110" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="12"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.17 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7295_52299"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7295_52299" result="shape"/>
      </filter>
    </defs>
  </svg>
`;

const RIGHT_BOTTOM_SHAPE = `
  <svg width="360" height="60" viewBox="0 0 360 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M0 20.8834V55.3381V59.5878H360V55.3381H201.263C180.084 55.3381 178.285 42.3198 178.183 40.7798C177.839 35.5878 177.839 30.5878 177.839 17.1072C177.839 -1.19395 157.392 0.016522 147.84 0.0165218L26.31 0.0165217C4.44822 0.0165205 0 14.2513 0 20.8834Z" fill="url(#paint0_linear_7295_52287_story)"/>
    <defs>
      <linearGradient id="paint0_linear_7295_52287_story" x1="180" y1="0" x2="180" y2="59.5878" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F1F2F5"/>
        <stop offset="0.880066" stop-color="#ECEFF8"/>
      </linearGradient>
    </defs>
  </svg>
`;

function normalizeCode(value, fallback) {
  const safeValue = typeof value === "string" ? value : fallback;
  const trimmed = safeValue.trim().toUpperCase();
  return trimmed || fallback;
}

function renderFolderOption({
  x,
  side,
  selectedSide,
  code,
  flag,
  alt,
  showChevrons,
  codeOffset = 0,
  codeOffsetY = 0,
  withFlag = true,
  flagVariant = "round",
}) {
  const isActive = side === selectedSide;
  const showChevronForOption = showChevrons && isActive && side === "left";
  const codeStyleParts = [];
  if (codeOffset) {
    codeStyleParts.push(`margin-left:${codeOffset}px`);
  }
  if (codeOffsetY) {
    codeStyleParts.push(`transform:translateY(${codeOffsetY}px)`);
  }
  const codeStyle = codeStyleParts.length ? ` style="${codeStyleParts.join(";")}"` : "";
  return `
    <span class="folder-option ${isActive ? "is-active" : "is-inactive"}" style="left:${x}px">
      ${
        withFlag
          ? `<span class="folder-flag ${flagVariant === "rect" ? "is-rect" : ""}" aria-hidden="true">
               <img src="${flag}" alt="${alt}">
             </span>`
          : ""
      }
      <span class="folder-code"${codeStyle}>${code}</span>
      ${
        showChevronForOption
          ? `<span class="folder-chevron-stack" aria-hidden="true">
              <img src="chevron.svg" alt="">
            </span>`
          : ""
      }
    </span>
  `;
}

function buildFolder({ property1, leftCode, rightCode, showChevrons, showNewItemChip = true }) {
  const variant = DOCS_VARIANT_OPTIONS.includes(property1) ? property1 : "Left";
  const isCollapsed = variant.startsWith("Collapsed");
  const side = variant === "Right" ? "right" : "left";
  const collapsedSide = variant === "Collapsed Right" ? "right" : "left";
  const effectiveSide = isCollapsed ? collapsedSide : side;
  const isLeft = side === "left";
  const isCollapsedLeft = collapsedSide === "left";

  const countries = {
    left: {
      ...COUNTRY_BASE.left,
      code: normalizeCode(leftCode, COUNTRY_BASE.left.code),
    },
    right: {
      ...COUNTRY_BASE.right,
      code: normalizeCode(rightCode, COUNTRY_BASE.right.code),
    },
  };

  if (isCollapsed) {
    const leftX = isCollapsedLeft ? 51 : 57;
    const rightX = 248;
    const lineX = isCollapsedLeft ? 55 : 245;
    const lineWidth = 66;
    const lineTop = 30;

    return `
      <div class="folder-responsive-host is-collapsed">
        <div class="folder-control is-collapsed ${isCollapsedLeft ? "is-left" : "is-right"}">
        <span class="folder-layer folder-layer-bottom">
          ${isCollapsedLeft ? LEFT_BOTTOM_SHAPE : RIGHT_BOTTOM_SHAPE}
        </span>
        <span class="folder-layer folder-layer-top">
          ${isCollapsedLeft ? LEFT_TOP_SHAPE : RIGHT_TOP_SHAPE}
        </span>

        <div class="folder-options">
          ${renderFolderOption({
            x: leftX,
            side: "left",
            selectedSide: effectiveSide,
            code: countries.left.code,
            flag: countries.left.collapsedFlag,
            alt: countries.left.alt,
            showChevrons: isCollapsedLeft,
            withFlag: true,
            flagVariant: "rect",
          })}
          ${renderFolderOption({
            x: rightX,
            side: "right",
            selectedSide: effectiveSide,
            code: countries.right.code,
            flag: countries.right.collapsedFlag,
            alt: countries.right.alt,
            showChevrons: false,
            withFlag: true,
            flagVariant: "rect",
          })}
        </div>

        <span class="folder-selection-line" style="left:${lineX}px;width:${lineWidth}px;top:${lineTop}px" aria-hidden="true"></span>
      </div>
      </div>
    `;
  }

  const leftX = isLeft ? 55 : 54;
  const rightX = isLeft ? 245 : 235;
  const lineX = isLeft ? 51 : 235;
  const lineWidth = isLeft ? 86 : 66;
  const showChipOnLeftExpanded = variant === "Left" && showNewItemChip;

  return `
    <div class="folder-responsive-host is-expanded">
      <div class="folder-control ${isLeft ? "is-left" : "is-right"}">
      <span class="folder-layer folder-layer-bottom">
        ${isLeft ? LEFT_BOTTOM_SHAPE : RIGHT_BOTTOM_SHAPE}
      </span>
      <span class="folder-layer folder-layer-top">
        ${isLeft ? LEFT_TOP_SHAPE : RIGHT_TOP_SHAPE}
      </span>

      <div class="folder-options">
        ${renderFolderOption({
          x: leftX,
          side: "left",
          selectedSide: effectiveSide,
          code: countries.left.code,
          flag: countries.left.flag,
          alt: countries.left.alt,
          showChevrons,
        })}
        ${renderFolderOption({
          x: rightX,
          side: "right",
          selectedSide: effectiveSide,
          code: countries.right.code,
          flag: countries.right.flag,
          alt: countries.right.alt,
          showChevrons,
        })}
      </div>
      ${
        showChipOnLeftExpanded
          ? `<span class="folder-new-item-chip chip-ds chip-ds-new-item" aria-label="New item">Nuevo</span>`
          : ""
      }

      <span class="folder-selection-line" style="left:${lineX}px;width:${lineWidth}px" aria-hidden="true"></span>
    </div>
    </div>
  `;
}

function renderFolderStory(args, showRecommendation = false) {
  const variant = DOCS_VARIANT_OPTIONS.includes(args.property1) ? args.property1 : "Left";
  return `
    <div class="mars-story mars-story-folder">
      <div class="mars-label">Folder · Property 1=${variant} · ID .pen: ${VARIANT_IDS[variant]}</div>
      ${
        showRecommendation
          ? `<div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
              Recomendado: códigos de país de máximo 3 caracteres (base: GUA / USA).
            </div>`
          : ""
      }
      ${buildFolder(args)}
    </div>
  `;
}

export default {
  title: "Molecules/Folder",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Molecula **Folder** en variantes `Left` y `Right` (expandidas), con soporte de `Collapsed Left/Right` en Docs Playground para validacion visual contra Figma.",
      },
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    property1: "Left",
    leftCode: "GUA",
    rightCode: "USA",
    showChevrons: true,
  },
  argTypes: {
    property1: {
      name: "Property 1",
      control: { type: "select" },
      options: DOCS_VARIANT_OPTIONS,
      description: "Variante activa definida en Figma.",
    },
    leftCode: {
      control: "text",
      description: "Codigo del pais izquierdo.",
    },
    rightCode: {
      control: "text",
      description: "Codigo del pais derecho.",
    },
    showChevrons: {
      control: "boolean",
      description: "Muestra chevrons en el pais seleccionado.",
    },
  },
  render: (args) => renderFolderStory(args, true),
};

export const VariantMatrix = {
  name: "Variant Matrix",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Referencia visual de las 2 variantes activas de `Property 1` para `Folder`.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="folder-grid">
        ${BASE_VARIANT_OPTIONS.map(
          (property1) => `
            <article class="folder-story-card">
              <div class="mars-label">Property 1=${property1} · ID .pen: ${VARIANT_IDS[property1]}</div>
              ${buildFolder({
                property1,
                leftCode: "GUA",
                rightCode: "USA",
                showChevrons: true,
              })}
            </article>
          `
        ).join("")}
      </div>
    </div>
  `,
};

export const Left = {
  name: "Property 1=Left",
  parameters: { controls: { disable: true } },
  render: () =>
    renderFolderStory({
      property1: "Left",
      leftCode: "GUA",
      rightCode: "USA",
      showChevrons: true,
    }),
};

export const Right = {
  name: "Property 1=Right",
  parameters: { controls: { disable: true } },
  render: () =>
    renderFolderStory({
      property1: "Right",
      leftCode: "GUA",
      rightCode: "USA",
      showChevrons: true,
    }),
};
