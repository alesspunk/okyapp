/**
 * Headers — DS-MARS v2
 * Icon rule: fak fa-kit fa-wallet for wallet icon · fa-light for remaining header icons · fa-solid only for fa-circle-user (not-logged)
 * Icon token: icon-medium (24px) inside .header-icon wrapper
 * App Header: WO8oM · ZPc9u · ArMsV  |  Page Header: 6IKuE · 5mGYt
 */

export default {
  title: "Molecules/Headers",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Headers del app OKY. " +
          "**Regla de íconos:** `fak fa-kit fa-wallet` para wallet · `fa-light` para el resto de íconos de header · " +
          "`fa-solid` solo para `fa-circle-user` (estado Not Logged). " +
          "Token de tamaño: `icon-medium` (24px) dentro de wrapper `.header-icon`.",
      },
    },
  },
};

/* ── App Header — Playground ──────────────────────────── */
export const AppHeaderPlayground = {
  name: "App Header — Playground",
  args: {
    variant: "logged-empty",
    leftButtons: "single",
    cartCount: 2,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["logged-empty", "logged-cart", "not-logged"],
      labels: {
        "logged-empty": "Logged / Empty Cart (WO8oM)",
        "logged-cart":  "Logged / Cart Full (ArMsV)",
        "not-logged":   "Not Logged (ZPc9u)",
      },
      description: "Variante del App Header principal.",
    },
    leftButtons: {
      control: "select",
      options: ["single", "double"],
      labels: {
        single: "1 botón izquierdo",
        double: "2 botones izquierdos",
      },
      description:
        "Configura si el header usa un solo ícono izquierdo (wallet) o dos (wallet + search).",
    },
    cartCount: {
      control: { type: "number", min: 0, max: 99 },
      description: "Cantidad de items en carrito (solo aplica en Cart Full).",
    },
  },
  render: ({ variant, leftButtons, cartCount }) => {
    const penIds = {
      "logged-empty": "WO8oM",
      "logged-cart":  "ArMsV",
      "not-logged":   "ZPc9u",
    };

    const isDualLeft = leftButtons === "double";

    const leftGroup = isDualLeft
      ? `
      <div class="header-left-group header-side-cluster">
        <div class="header-icon">
          <i class="fak fa-kit fa-wallet icon-medium"></i>
        </div>
        <div class="header-icon">
          <i class="fa-light fa-magnifying-glass icon-medium"></i>
        </div>
      </div>`
      : `
      <div class="header-left-group">
        <div class="header-icon">
          <i class="fak fa-kit fa-wallet icon-medium"></i>
        </div>
      </div>`;

    const logo = `<img class="header-logo" src="logo-oky.svg" alt="OKY">`;

    const wrapRight = (content) =>
      isDualLeft
        ? `<div class="header-side-cluster header-side-cluster-right">${content}</div>`
        : content;

    let right;
    if (variant === "logged-empty") {
      right = wrapRight(`
        <div class="header-icon">
          <i class="fa-light fa-cart-shopping icon-medium"></i>
        </div>`);
    } else if (variant === "logged-cart") {
      right = wrapRight(`
        <div class="header-cart-chip header-cart-full">
          <span class="header-cart-count">${cartCount}</span>
          <i class="fa-light fa-cart-shopping"></i>
        </div>`);
    } else {
      right = wrapRight(`
        <div class="header-icon">
          <i class="fa-solid fa-circle-user icon-medium-solid"></i>
        </div>`);
    }

    return `
      <div class="mars-story">
        <div class="mars-label">App Header / ${variant} / ${leftButtons}-left · ID .pen: ${penIds[variant]}</div>
        <div class="mars-mobile">
          <div class="app-header ${variant === "logged-cart" ? "is-logged-cart" : ""}">
            ${leftGroup}
            ${logo}
            ${right}
          </div>
        </div>
      </div>`;
  },
};

/* ── Page Header — Playground ─────────────────────────── */
export const PageHeaderPlayground = {
  name: "Page Header — Playground",
  args: {
    variant: "screens",
    title: "Page Title",
    showAction: true,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["screens", "modal"],
      labels: {
        screens: "Screens (6IKuE)",
        modal:   "Modal (5mGYt)",
      },
      description: "**Screens** — con flecha atrás y acción derecha. **Modal** — título centrado y cierre.",
    },
    title:      { control: "text" },
    showAction: {
      control: "boolean",
      description: "Muestra u oculta el ícono de acción derecha (cart en screens, siempre xmark en modal).",
    },
  },
  render: ({ variant, title, showAction }) => {
    const penId = variant === "modal" ? "5mGYt" : "6IKuE";
    const containerClass = variant === "modal" ? "page-header-modal" : "page-header-screen";

    let left, right;

    if (variant === "modal") {
      left = `<div class="header-icon header-icon-placeholder"><i class="fa-light fa-circle icon-medium"></i></div>`;
      right = showAction
        ? `<div class="header-icon"><i class="fa-light fa-xmark icon-medium"></i></div>`
        : `<div class="header-icon header-icon-placeholder"></div>`;
    } else {
      left = `<div class="header-icon header-icon-light"><i class="fa-light fa-arrow-left icon-medium"></i></div>`;
      right = showAction
        ? `<div class="header-icon header-icon-light"><i class="fa-light fa-cart-shopping icon-medium"></i></div>`
        : `<div class="header-icon header-icon-placeholder"></div>`;
    }

    return `
      <div class="mars-story">
        <div class="mars-label">Page Header / ${variant} · ID .pen: ${penId}</div>
        <div class="mars-mobile">
          <div class="${containerClass}">
            ${left}
            <div class="page-header-title">${title}</div>
            ${right}
          </div>
        </div>
      </div>`;
  },
};

/* ── All Headers — Reference ──────────────────────────── */
export const AllHeaders = {
  name: "All Headers — Reference",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Referencia visual de las variantes de header. Wallet usa `fak fa-kit fa-wallet` + `icon-medium`; el resto usa `fa-light` + `icon-medium`, excepto `fa-circle-user` que usa `fa-solid` + `icon-medium-solid`.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div style="display:flex;flex-direction:column;gap:20px;">

        <div>
          <div class="mars-label" style="margin-bottom:8px">Header / Logged / Empty Cart · WO8oM</div>
          <div class="mars-mobile">
            <div class="app-header">
              <div class="header-left-group">
                <div class="header-icon"><i class="fak fa-kit fa-wallet icon-medium"></i></div>
              </div>
              <img class="header-logo" src="logo-oky.svg" alt="OKY">
              <div class="header-icon"><i class="fa-light fa-cart-shopping icon-medium"></i></div>
            </div>
          </div>
        </div>

        <div>
          <div class="mars-label" style="margin-bottom:8px">Header / Logged / Empty Cart + Search Left · NEW</div>
          <div class="mars-mobile">
            <div class="app-header">
              <div class="header-left-group header-side-cluster">
                <div class="header-icon"><i class="fak fa-kit fa-wallet icon-medium"></i></div>
                <div class="header-icon"><i class="fa-light fa-magnifying-glass icon-medium"></i></div>
              </div>
              <img class="header-logo" src="logo-oky.svg" alt="OKY">
              <div class="header-side-cluster header-side-cluster-right">
                <div class="header-icon"><i class="fa-light fa-cart-shopping icon-medium"></i></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="mars-label" style="margin-bottom:8px">Header / Not Logged · ZPc9u</div>
          <div class="mars-mobile">
            <div class="app-header">
              <div class="header-left-group">
                <div class="header-icon"><i class="fak fa-kit fa-wallet icon-medium"></i></div>
              </div>
              <img class="header-logo" src="logo-oky.svg" alt="OKY">
              <div class="header-icon"><i class="fa-solid fa-circle-user icon-medium-solid"></i></div>
            </div>
          </div>
        </div>

        <div>
          <div class="mars-label" style="margin-bottom:8px">Header / Logged / Cart Full · ArMsV</div>
          <div class="mars-mobile">
            <div class="app-header is-logged-cart">
              <div class="header-left-group">
                <div class="header-icon"><i class="fak fa-kit fa-wallet icon-medium"></i></div>
              </div>
              <img class="header-logo" src="logo-oky.svg" alt="OKY">
              <div class="header-cart-chip header-cart-full">
                <span class="header-cart-count">1</span>
                <i class="fa-light fa-cart-shopping"></i>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="mars-label" style="margin-bottom:8px">Page Header / Screens · 6IKuE</div>
          <div class="mars-mobile">
            <div class="page-header-screen">
              <div class="header-icon header-icon-light"><i class="fa-light fa-arrow-left icon-medium"></i></div>
              <div class="page-header-title">Page Title</div>
              <div class="header-icon header-icon-light"><i class="fa-light fa-cart-shopping icon-medium"></i></div>
            </div>
          </div>
        </div>

        <div>
          <div class="mars-label" style="margin-bottom:8px">Page Header / Modal · 5mGYt</div>
          <div class="mars-mobile">
            <div class="page-header-modal">
              <div class="header-icon header-icon-placeholder"><i class="fa-light fa-circle icon-medium"></i></div>
              <div class="page-header-title">Modal Title</div>
              <div class="header-icon"><i class="fa-light fa-xmark icon-medium"></i></div>
            </div>
          </div>
        </div>

      </div>
    </div>`,
};
