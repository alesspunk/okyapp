const SIDE_OPTIONS = ["Left", "Right"];
const STATE_OPTIONS = ["State 1", "State 2", "State 3"];

const DISCOVERY_CONFIG = {
  Left: {
    "State 1": {
      penId: "7333:70238",
      header: "logged-empty",
      folder: "Left",
      plateu: false,
      searchCompact: false,
    },
    "State 2": {
      penId: "7333:70233",
      header: "logged-empty",
      folder: "Collapsed Left",
      plateu: false,
      searchCompact: false,
    },
    "State 3": {
      penId: "7333:70234",
      header: "none",
      folder: "Collapsed Left",
      plateu: true,
      searchCompact: true,
    },
  },
  Right: {
    "State 1": {
      penId: "7333:70235",
      header: "logged-cart",
      folder: "Right",
      plateu: false,
      searchCompact: false,
    },
    "State 2": {
      penId: "7333:70236",
      header: "logged-cart",
      folder: "Collapsed Right",
      plateu: false,
      searchCompact: false,
    },
    "State 3": {
      penId: "7333:70237",
      header: "none",
      folder: "Collapsed Right",
      plateu: true,
      searchCompact: true,
    },
  },
};

const COUNTRY_BASE = {
  left: {
    code: "GUA",
    flag: "guatemala-flag.png",
    alt: "Guatemala flag",
  },
  right: {
    code: "USA",
    flag: "usa-flag.png",
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

function renderStatusBar() {
  return `
    <section data-pen-id="vf35d">
      <div class="status-bar">
        <div>9:41</div>
        <div style="display:flex;gap:8px">
          <i class="fa-regular fa-signal" aria-hidden="true"></i>
          <i class="fa-regular fa-wifi" aria-hidden="true"></i>
          <i class="fa-regular fa-battery-full" aria-hidden="true"></i>
        </div>
      </div>
    </section>
  `;
}

function renderAppHeader(kind) {
  if (kind === "none") return "";
  const headerClass = kind === "logged-cart" ? "app-header is-logged-cart" : "app-header";

  const right =
    kind === "logged-cart"
      ? `
        <div class="header-cart-chip header-cart-full">
          <span class="header-cart-count">2</span>
          <i class="fa-light fa-cart-shopping" aria-hidden="true"></i>
        </div>
      `
      : `
        <div class="header-icon">
          <i class="fa-light fa-cart-shopping icon-medium" aria-hidden="true"></i>
        </div>
      `;

  return `
    <section data-pen-id="${kind === "logged-cart" ? "ArMsV" : "WO8oM"}">
      <div class="${headerClass}">
        <div class="header-left-group">
          <div class="header-icon">
            <i class="fa-kit fa-wallet icon-medium" aria-hidden="true"></i>
          </div>
        </div>
        <img class="header-logo" src="logo-oky.svg" alt="OKY" />
        ${right}
      </div>
    </section>
  `;
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
}) {
  const isActive = side === selectedSide;
  const showChevronForOption = showChevrons && isActive && side === "left";
  const style = [
    codeOffset ? `margin-left:${codeOffset}px` : "",
    codeOffsetY ? `transform:translateY(${codeOffsetY}px)` : "",
  ]
    .filter(Boolean)
    .join(";");

  return `
    <span class="folder-option ${isActive ? "is-active" : "is-inactive"}" style="left:${x}px">
      ${
        withFlag
          ? `<span class="folder-flag" aria-hidden="true"><img src="${flag}" alt="${alt}"></span>`
          : ""
      }
      <span class="folder-code"${style ? ` style="${style}"` : ""}>${code}</span>
      ${
        showChevronForOption
          ? `<span class="folder-chevron-stack" aria-hidden="true"><img src="chevron.svg" alt=""></span>`
          : ""
      }
    </span>
  `;
}

function renderFolder(property1, { showNewItemChip = true } = {}) {
  const isCollapsed = property1.startsWith("Collapsed");
  const isLeft = property1 === "Left" || property1 === "Collapsed Left";

  if (isCollapsed) {
    const selectedSide = isLeft ? "left" : "right";
    const lineX = isLeft ? 55 : 245;
    const lineTop = isLeft ? 31 : 30;

    return `
      <section data-pen-id="${isLeft ? "7296:48472" : "7296:48473"}">
        <div class="folder-responsive-host is-collapsed">
          <div class="folder-control is-collapsed ${isLeft ? "is-left" : "is-right"}">
            <span class="folder-layer folder-layer-bottom">
              ${isLeft ? LEFT_BOTTOM_SHAPE : RIGHT_BOTTOM_SHAPE}
            </span>
            <span class="folder-layer folder-layer-top">
              ${isLeft ? LEFT_TOP_SHAPE : RIGHT_TOP_SHAPE}
            </span>
            <div class="folder-options">
              ${renderFolderOption({
                x: 64,
                side: "left",
                selectedSide,
                code: COUNTRY_BASE.left.code,
                flag: COUNTRY_BASE.left.flag,
                alt: COUNTRY_BASE.left.alt,
                showChevrons: false,
                codeOffset: isLeft ? 7 : 0,
                codeOffsetY: isLeft ? -2 : -5,
                withFlag: false,
              })}
              ${renderFolderOption({
                x: 245,
                side: "right",
                selectedSide,
                code: COUNTRY_BASE.right.code,
                flag: COUNTRY_BASE.right.flag,
                alt: COUNTRY_BASE.right.alt,
                showChevrons: false,
                codeOffset: isLeft ? 15 : 20,
                codeOffsetY: isLeft ? -5 : -3,
                withFlag: false,
              })}
            </div>
            <span class="folder-selection-line" style="left:${lineX}px;width:66px;top:${lineTop}px" aria-hidden="true"></span>
          </div>
        </div>
      </section>
    `;
  }

  const selectedSide = isLeft ? "left" : "right";
  const showChipOnLeftExpanded = property1 === "Left" && showNewItemChip;
  return `
    <section data-pen-id="${isLeft ? "7296:48469" : "7296:48471"}">
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
              x: isLeft ? 55 : 54,
              side: "left",
              selectedSide,
              code: COUNTRY_BASE.left.code,
              flag: COUNTRY_BASE.left.flag,
              alt: COUNTRY_BASE.left.alt,
              showChevrons: true,
            })}
            ${renderFolderOption({
              x: isLeft ? 245 : 235,
              side: "right",
              selectedSide,
              code: COUNTRY_BASE.right.code,
              flag: COUNTRY_BASE.right.flag,
              alt: COUNTRY_BASE.right.alt,
              showChevrons: true,
            })}
          </div>
          ${
            showChipOnLeftExpanded
              ? `<span class="folder-new-item-chip chip-ds chip-ds-new-item" aria-label="New item">Nuevo</span>`
              : ""
          }
          <span class="folder-selection-line" style="left:${isLeft ? 51 : 235}px;width:${isLeft ? 86 : 66}px" aria-hidden="true"></span>
        </div>
      </div>
    </section>
  `;
}

function renderSearchInput({ compact }) {
  return `
    <section class="discovery-header-search ${compact ? "is-compact" : ""}" data-pen-id="PGNyG">
      <div class="input-wrapper">
        <i class="fa-regular fa-magnifying-glass search-icon" aria-hidden="true"></i>
        <input
          class="input-field search-input search-input-empty"
          type="search"
          name="search"
          placeholder="Buscar marcas"
          aria-label="Buscar marcas"
        />
      </div>
    </section>
  `;
}

function renderPlateuHome() {
  return `
    <section class="discovery-header-plateu" data-pen-id="7331:50399">
      <section
        class="plateu-molecule is-scrolling is-home"
        style="width:360px;height:80px"
        aria-label="Plateu State=Home, Telco=No, Scrolling=Yes"
      >
        <div class="plateu-track is-scrolling">
          <div class="plateu-item plateu-item-fixed">
            <div class="plateu-icon-wrap"><img class="plateu-icon" src="plateu4.webp" alt="MODA" /></div>
            <span class="plateu-chip">MODA</span>
          </div>
          <div class="plateu-item plateu-item-fixed">
            <div class="plateu-icon-wrap"><img class="plateu-icon" src="plateu1.webp" alt="TECNOLOGÍA" /></div>
            <span class="plateu-label">TECNOLOGÍA</span>
          </div>
          <div class="plateu-item plateu-item-fixed">
            <div class="plateu-icon-wrap"><img class="plateu-icon" src="plateu3.webp" alt="LENTES" /></div>
            <span class="plateu-label">LENTES</span>
          </div>
          <div class="plateu-item plateu-item-fixed">
            <div class="plateu-icon-wrap"><img class="plateu-icon" src="plateu2.webp" alt="ONLINE" /></div>
            <span class="plateu-label">ONLINE</span>
          </div>
        </div>
      </section>
    </section>
  `;
}

function renderDiscoveryHeader({ side, state, showNewItemChip = true }) {
  const safeSide = SIDE_OPTIONS.includes(side) ? side : "Left";
  const safeState = STATE_OPTIONS.includes(state) ? state : "State 1";
  const config = DISCOVERY_CONFIG[safeSide][safeState];

  return `
    <section class="discovery-header-organism" data-side="${safeSide}" data-state="${safeState}" data-pen-id="${config.penId}">
      ${renderStatusBar()}
      ${renderAppHeader(config.header)}
      ${renderFolder(config.folder, { showNewItemChip })}
      ${renderSearchInput({ compact: config.searchCompact })}
      ${config.plateu ? renderPlateuHome() : ""}
    </section>
  `;
}

function renderVariantCard(side, state) {
  const config = DISCOVERY_CONFIG[side][state];
  return `
    <article class="discovery-header-card">
      <div class="mars-label">Discovery Header · ${side} · ${state} · ID .pen: ${config.penId}</div>
      <div class="mars-mobile">
        ${renderDiscoveryHeader({ side, state })}
      </div>
    </article>
  `;
}

export default {
  title: "Organisms/Discovery Header",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo **Discovery Header** compuesto unicamente con moleculas existentes: " +
          "`Status Bar`, `Header`, `Folder` (expanded/collapsed), `Input/Search (Empty)` y " +
          "`Plateu · State=Home, Telco=No, Scrolling=Yes (7331:50399)`. " +
          "Incluye 3 states por lado (`Left` y `Right`) segun el orden del frame de Figma `7333:70239`. " +
          "El Plateu Home usa separacion horizontal de `8px` entre items. " +
          "En Docs Playground puedes alternar `Show New Item Chip` para la vista `Left · State 1`.",
      },
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    side: "Left",
    state: "State 1",
    showNewItemChip: true,
  },
  argTypes: {
    side: {
      name: "Side",
      control: { type: "select" },
      options: SIDE_OPTIONS,
      description: "Lado de navegacion del folder (Left / Right).",
    },
    state: {
      name: "State",
      control: { type: "select" },
      options: STATE_OPTIONS,
      description: "State visual dentro del lado seleccionado.",
    },
    showNewItemChip: {
      name: "Show New Item Chip",
      control: "boolean",
      description: "Muestra el chip New item solo en Folder Left expandido (State 1).",
    },
  },
  render: ({ side, state, showNewItemChip }) => {
    const safeSide = SIDE_OPTIONS.includes(side) ? side : "Left";
    const safeState = STATE_OPTIONS.includes(state) ? state : "State 1";
    const penId = DISCOVERY_CONFIG[safeSide][safeState].penId;

    return `
      <div class="mars-story">
        <div class="mars-label">Discovery Header · ${safeSide} · ${safeState} · ID .pen: ${penId}</div>
        <div class="mars-mobile">
          ${renderDiscoveryHeader({ side: safeSide, state: safeState, showNewItemChip })}
        </div>
      </div>
    `;
  },
};

export const VariantMatrix = {
  name: "Variant Matrix",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Referencia visual de los 6 states del organismo (3 LEFT + 3 RIGHT).",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="discovery-header-grid">
        ${SIDE_OPTIONS.map((side) => STATE_OPTIONS.map((state) => renderVariantCard(side, state)).join("")).join("")}
      </div>
    </div>
  `,
};
