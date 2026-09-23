/* ─────────────────────────────────────────────────────────
   Discovery Header (Organismo)
   Figma 7333:70239.

   Extraído de Organisms.DiscoveryHeader.stories.js para que la
   story y Pages/OKY Cash/Prototype rendericen exactamente el
   mismo organismo en vez de duplicarlo.

   Se compone solo de moléculas existentes: Status Bar, Header,
   Folder (expandido/colapsado), Input/Search y Plateu Home.
───────────────────────────────────────────────────────── */

import { buildPlateu } from "./plateu";
import { renderFlag } from "./flag";

export const SIDE_OPTIONS = ["Left", "Right"];
export const STATE_OPTIONS = ["State 1", "State 2", "State 3"];

export const DISCOVERY_CONFIG = {
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
    code: "USA",
    iso: "US",
    alt: "USA flag",
  },
  right: {
    code: "GUA",
    iso: "GT",
    alt: "Guatemala flag",
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

function renderWalletBitmap({ indicated = false, shiftLeft = false, action = "" } = {}) {
  const tag = action
    ? `<button type="button" data-action="${action}" aria-label="Mi wallet"`
    : `<div aria-hidden="true"`;
  return `
    ${tag} class="header-icon header-icon-bitmap header-icon-bitmap-wallet-wrap${indicated ? " header-icon-bitmap-wallet-indicated" : ""}${shiftLeft ? " header-icon-bitmap-wallet-indicated-left" : ""}">
      <img class="header-icon-bitmap-image header-icon-bitmap-wallet" src="Wallet-icon.png" alt="">
      ${indicated ? '<span class="header-icon-indicator-dot"></span>' : ""}
    ${action ? "</button>" : "</div>"}
  `;
}

function renderCartBitmap({ indicated = false, action = "" } = {}) {
  const tag = action
    ? `<button type="button" data-action="${action}" aria-label="Carrito"`
    : `<div aria-hidden="true"`;
  return `
    ${tag} class="header-icon header-icon-bitmap header-icon-bitmap-cart">
      <img class="header-icon-bitmap-image header-icon-bitmap-cart-image" src="Cart-3d-icon.png" alt="">
      ${indicated ? '<span class="header-icon-indicator-dot"></span>' : ""}
    ${action ? "</button>" : "</div>"}
  `;
}

function renderAppHeader(
  kind,
  { walletAction = "", cartAction = "", cartIndicated, walletIndicated = false } = {},
) {
  if (kind === "none") return "";

  const dot = cartIndicated === undefined ? kind === "logged-cart" : cartIndicated;
  const right = renderCartBitmap({ indicated: dot, action: cartAction });

  return `
    <section data-pen-id="${kind === "logged-cart" ? "ArMsV" : "WO8oM"}">
      <div class="app-header">
        <div class="header-left-group">
          ${renderWalletBitmap({ action: walletAction, indicated: walletIndicated })}
        </div>
        <img class="header-logo" src="logo-oky.svg" alt="OKY" data-action="nav:country-home" role="button" tabindex="0" />
        ${right}
      </div>
    </section>
  `;
}

/* Centro de cada pestaña dentro del folder de 360px. Son los mismos en
   las cuatro variantes: así el grupo no salta al pasar de Left a Right
   ni al aparecer el chevron. */
const TAB_CENTER = { left: 88, right: 277 };

function renderFolderOption({
  x,
  side,
  selectedSide,
  code,
  flagCode,
  alt,
  showChevrons,
  codeOffset = 0,
  codeOffsetY = 0,
  withFlag = true,
  flagVariant = "round",
  width,
}) {
  const isActive = side === selectedSide;
  const showChevronForOption = showChevrons;
  const style = [
    codeOffset ? `margin-left:${codeOffset}px` : "",
    codeOffsetY ? `transform:translateY(${codeOffsetY}px)` : "",
  ]
    .filter(Boolean)
    .join(";");

  const optionStyle = [`left:${x}px`];

  return `
    <span class="folder-option ${isActive ? "is-active" : "is-inactive"}" style="${optionStyle.join(";")}"
      ${
        /* En la pestaña de delante toda la pastilla —bandera, código y
           flecha— abre el selector de país: la flecha sola era un
           blanco de 10px para un dedo. En la de atrás toda ella cambia
           de marketplace, que es lo que se espera al tocarla. */
        isActive
          ? `data-action="open-market" data-side="${side}"`
          : side === "left"
            ? `data-action="nav:home"`
            : `data-action="nav:homegua"`
      } role="button" tabindex="0"
      aria-label="${isActive ? "Cambiar de país" : `Ir a ${code}`}">
      ${
        /* La bandera es el átomo Flag (flagpack), no un bitmap suelto:
           mismo 4:3, borde y radio que el resto del sistema. */
        withFlag
          ? `<span class="folder-flag ${flagVariant === "rect" ? "is-rect" : ""}" aria-hidden="true">${renderFlag({ code: flagCode, size: "Large" })}</span>`
          : ""
      }
      <span class="folder-code"${style ? ` style="${style}"` : ""}>${code}</span>
      ${
        /* La flecha ya no lleva la acción: la lleva la pastilla entera,
           así que aquí solo se dibuja. */
        showChevronForOption
          ? `<span class="folder-chevron-stack${isActive ? " is-enabled" : ""}" aria-hidden="true"><img src="chevron.svg" alt=""></span>`
          : ""
      }
      ${isActive ? `<span class="folder-selection-line" aria-hidden="true"></span>` : ""}
    </span>
  `;
}

function renderFolder(property1, { showNewItemChip = true, showChevrons = true, newItemSide = "right", markets } = {}) {
  /* Cada lado enseña el país elegido en él; sin elección, el de
     siempre. La izquierda sigue siendo el marketplace de USA y la
     derecha el de Guatemala: lo que cambia es la bandera. */
  const country = (side) => ({ ...COUNTRY_BASE[side], ...((markets || {})[side] || {}) });
  const isCollapsed = property1.startsWith("Collapsed");
  const isLeft = property1 === "Left" || property1 === "Collapsed Left";

  if (isCollapsed) {
    const selectedSide = isLeft ? "left" : "right";
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
                x: TAB_CENTER.left,
                side: "left",
                selectedSide,
                code: country("left").code,
                flagCode: country("left").iso,
                alt: country("left").alt,
                showChevrons,
                withFlag: true,
                flagVariant: "rect",
              })}
              ${renderFolderOption({
                x: TAB_CENTER.right,
                side: "right",
                selectedSide,
                code: country("right").code,
                flagCode: country("right").iso,
                alt: country("right").alt,
                showChevrons,
                withFlag: true,
                flagVariant: "rect",
              })}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  const selectedSide = isLeft ? "left" : "right";
  const showChipOnLeftExpanded = !isCollapsed && !isLeft && showNewItemChip;
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
              x: TAB_CENTER.left,
              side: "left",
              selectedSide,
              code: country("left").code,
              flagCode: country("left").iso,
              alt: country("left").alt,
              showChevrons,
            })}
            ${renderFolderOption({
              x: TAB_CENTER.right,
              side: "right",
              selectedSide,
              code: country("right").code,
              flagCode: country("right").iso,
              alt: country("right").alt,
              showChevrons,
            })}
          </div>
          ${
            showChipOnLeftExpanded
              ? `<span class="folder-new-item-chip chip-ds chip-ds-new-item ${newItemSide === "left" ? "is-on-left" : ""}" aria-label="New item">Nuevo</span>`
              : ""
          }
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
      ${buildPlateu({ property1: "State=Home, Telco=No, Scrolling=Yes" })}
    </section>
  `;
}

export function renderDiscoveryHeader({
  side,
  state,
  showNewItemChip = true,
  newItemSide = "right",
  walletAction = "",
  cartAction = "",
  cartIndicated,
  walletIndicated = false,
  showPlateu = true,
  keepAppHeader = false,
  markets,
}) {
  const safeSide = SIDE_OPTIONS.includes(side) ? side : "Left";
  const safeState = STATE_OPTIONS.includes(state) ? state : "State 1";
  const config = DISCOVERY_CONFIG[safeSide][safeState];

  /* Colapsado, el organismo se queda sin cabecera de app. Quien lo usa
     puede pedir que se quede: el header es el que lleva el wallet y el
     carrito, y hay pantallas donde no pueden desaparecer al bajar. Se
     toma el del State 1 de ese mismo lado —no se inventa una cabecera
     que el sistema no tenga. */
  const headerKind =
    keepAppHeader && config.header === "none"
      ? DISCOVERY_CONFIG[safeSide]["State 1"].header
      : config.header;

  return `
    <section class="discovery-header-organism" data-side="${safeSide}" data-state="${safeState}" data-pen-id="${config.penId}">
      ${renderStatusBar()}
      ${renderAppHeader(headerKind, { walletAction, cartAction, cartIndicated, walletIndicated })}
      ${renderFolder(config.folder, { showNewItemChip, newItemSide, markets })}
      ${renderSearchInput({ compact: config.searchCompact })}
      ${config.plateu && showPlateu ? renderPlateuHome() : ""}
    </section>
  `;
}
