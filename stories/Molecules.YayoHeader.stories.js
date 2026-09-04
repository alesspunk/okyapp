/* ─────────────────────────────────────────────────────────
   Molecules / Yayo Header
   Figma: 99101:21449 (New Header) — 360x56
   Anatomía: tab-item izquierdo · logo OKY centrado · tab-item derecho
───────────────────────────────────────────────────────── */

const ICON_OPTIONS = [
  "fa-bars",
  "fa-qrcode",
  "fa-magnifying-glass",
  "fa-arrow-left",
  "fa-bell",
  "fa-circle-user",
];

function buildYayoHeader({ leftIcon, rightIcon, showLeft, showRight } = {}) {
  const left =
    showLeft === false
      ? `<span class="yayo-header-tab" aria-hidden="true"></span>`
      : `<button class="yayo-header-tab" type="button" aria-label="Menú">
          <i class="fa-light ${leftIcon || "fa-bars"}" aria-hidden="true"></i>
        </button>`;

  const right =
    showRight === false
      ? `<span class="yayo-header-tab" aria-hidden="true"></span>`
      : `<button class="yayo-header-tab" type="button" aria-label="Escanear código">
          <i class="fa-light ${rightIcon || "fa-qrcode"}" aria-hidden="true"></i>
        </button>`;

  return `
    <header class="app-header yayo-header" data-pen-id="99101:21449">
      ${left}
      <div class="yayo-header-brand">
        <img class="header-logo" src="logo-oky.svg" alt="OKY" />
      </div>
      ${right}
    </header>
  `;
}

export default {
  title: "Molecules/Yayo Header",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Yayo Header** es el header del flujo Yayo: `360x56` con un **tab-item de 40x40** a cada lado " +
          "(a `12px` de cada borde) y el **logo OKY** centrado ocupando el espacio restante. " +
          "Reutiliza la base `app-header` y el asset `logo-oky.svg` (`header-logo`, 100x38) de los headers existentes; " +
          "solo cambia el padding lateral a `12px` y el tamaño del hit-area a `40x40`. " +
          "Los íconos usan `fa-light` a `24px` en el token `--primary-base`. " +
          "En Figma el frame trae además dos slots ocultos (tipo de cambio `USD$1.00 = Q7.70` y un `chips` de 69x30) " +
          "que no se implementaron por venir apagados en esta variante. " +
          "Figma: `99101:21449`.",
      },
    },
  },
  argTypes: {
    leftIcon: {
      control: "select",
      options: ICON_OPTIONS,
      description: "Ícono del tab-item izquierdo. Base Figma: `fa-bars`.",
    },
    rightIcon: {
      control: "select",
      options: ICON_OPTIONS,
      description: "Ícono del tab-item derecho. Base Figma: `fa-qrcode`.",
    },
    showLeft: {
      control: "boolean",
      description: "Switch del tab-item izquierdo. Al ocultarlo conserva el espacio para no descentrar el logo.",
    },
    showRight: {
      control: "boolean",
      description: "Switch del tab-item derecho. Al ocultarlo conserva el espacio para no descentrar el logo.",
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    leftIcon: "fa-bars",
    rightIcon: "fa-qrcode",
    showLeft: true,
    showRight: true,
  },
  render: (args) => `
    <div class="mars-story">
      <div class="mars-label">Yayo Header · ID Figma: 99101:21449</div>
      <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
        360x56 · tab-items 40x40 a 12px · logo OKY centrado · íconos fa-light 24px en --primary-base
      </div>
      <div class="mars-mobile">
        ${buildYayoHeader(args)}
      </div>
    </div>
  `,
};

export const Variants = {
  name: "Variants",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Base de Figma y combinaciones de íconos más usadas del flujo Yayo.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div style="display:flex;flex-direction:column;gap:20px">

        <div>
          <div class="mars-label" style="margin-bottom:8px">Yayo Header / Base (bars + qrcode) · 99101:21449</div>
          <div class="mars-mobile">${buildYayoHeader({})}</div>
        </div>

        <div>
          <div class="mars-label" style="margin-bottom:8px">Yayo Header / Back + QR</div>
          <div class="mars-mobile">${buildYayoHeader({ leftIcon: "fa-arrow-left" })}</div>
        </div>

        <div>
          <div class="mars-label" style="margin-bottom:8px">Yayo Header / Solo logo</div>
          <div class="mars-mobile">${buildYayoHeader({ showLeft: false, showRight: false })}</div>
        </div>

      </div>
    </div>
  `,
};
