/**
 * Headers — DS-MARS v2
 * App Header variants WO8oM, ZPc9u, ArMsV and Both Ind now use bitmap icons from /images to match Figma.
 * Remaining header variants keep the existing Font Awesome rules and icon tokens.
 * Page Header: 6IKuE · 5mGYt
 */

const walletBitmap = ({ indicated = false } = {}) => `
  <div class="header-icon header-icon-bitmap header-icon-bitmap-wallet-wrap${indicated ? " header-icon-bitmap-wallet-indicated" : ""}" aria-hidden="true">
    <img class="header-icon-bitmap-image header-icon-bitmap-wallet" src="images/Wallet-icon.png" alt="">
    ${indicated ? '<span class="header-icon-indicator-dot"></span>' : ""}
  </div>`;

const loginBitmap = () => `
  <div class="header-icon header-icon-bitmap" aria-hidden="true">
    <img class="header-icon-bitmap-image header-icon-bitmap-login" src="images/Log-In-Icon.png" alt="">
  </div>`;

const cartBitmap = ({ indicated = false } = {}) => `
  <div class="header-icon header-icon-bitmap header-icon-bitmap-cart${indicated ? " header-icon-bitmap-indicated" : ""}" aria-hidden="true">
    <img class="header-icon-bitmap-image header-icon-bitmap-cart-image" src="images/Cart-3d-icon.png" alt="">
    ${indicated ? '<span class="header-icon-indicator-dot"></span>' : ""}
  </div>`;

export default {
  title: "Molecules/Headers",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Headers del app OKY. " +
          "**WO8oM, ZPc9u, ArMsV y la nueva variante Both Ind** usan bitmaps desde `/images` para coincidir con Figma. " +
          "El punto rojo del estado con indicador se construye con HTML/CSS sobre el bitmap. " +
          "El resto de variantes mantiene la regla previa: `fak fa-kit fa-wallet` para wallet, `fa-light` para los demás íconos y `fa-solid` para `fa-circle-user`.",
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
      options: ["logged-empty", "logged-cart", "logged-cart-both-ind", "not-logged"],
      labels: {
        "logged-empty": "Logged / Empty Cart (WO8oM)",
        "logged-cart":  "Logged / Cart Full (ArMsV)",
        "logged-cart-both-ind": "Logged / Both Indicators (Figma 7406:50941)",
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
      "logged-cart-both-ind": "7406:50941",
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
        ${walletBitmap({ indicated: variant === "logged-cart-both-ind" })}
      </div>`;

    const logo = `<img class="header-logo" src="logo-oky.svg" alt="OKY">`;

    const wrapRight = (content) =>
      isDualLeft
        ? `<div class="header-side-cluster header-side-cluster-right">${content}</div>`
        : content;

    let right;
    if (variant === "logged-empty") {
      right = wrapRight(cartBitmap());
    } else if (variant === "logged-cart" || variant === "logged-cart-both-ind") {
      right = wrapRight(cartBitmap({ indicated: true }));
    } else {
      right = wrapRight(loginBitmap());
    }

    return `
      <div class="mars-story">
        <div class="mars-label">App Header / ${variant} / ${leftButtons}-left · ID .pen: ${penIds[variant]}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Estas variantes usan bitmaps iguales a Figma. El control cartCount ya no altera los estados con indicador porque ahora usan dot rojo sobre el ícono.
        </div>
        <div class="mars-mobile">
          <div class="app-header">
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
      options: ["screens", "modal", "no-title"],
      labels: {
        screens: "Screens (6IKuE)",
        modal:   "Modal (5mGYt)",
        "no-title": "No title (PDP)",
      },
      description: "**Screens** — con flecha atrás y acción derecha. **Modal** — título centrado y cierre. **No title** — header de PDP sin título centrado.",
    },
    title:      { control: "text" },
    showAction: {
      control: "boolean",
      description: "Muestra u oculta el ícono de acción derecha (cart en screens, siempre xmark en modal).",
    },
  },
  render: ({ variant, title, showAction }) => {
    const penId = variant === "modal" ? "5mGYt" : variant === "no-title" ? "PDP" : "6IKuE";
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
        ? cartBitmap()
        : `<div class="header-icon header-icon-placeholder"></div>`;
    }

    const titleMarkup =
      variant === "no-title"
        ? `<div class="page-header-title page-header-title-empty" aria-hidden="true"></div>`
        : `<div class="page-header-title">${title}</div>`;

    return `
      <div class="mars-story">
        <div class="mars-label">Page Header / ${variant} · ID .pen: ${penId}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          ${
            variant === "no-title"
              ? "Esta variante oculta el título central para usos como Producto Header."
              : 'Recomendado: máximo 11 caracteres en título (base: "Modal Title").'
          }
        </div>
        <div class="mars-mobile">
          <div class="${containerClass}">
            ${left}
            ${titleMarkup}
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
        story: "WO8oM, ZPc9u, ArMsV y la nueva variante Both Ind usan bitmaps del folder `images`. Los dots rojos se construyen con HTML/CSS sobre los bitmaps. Las demás variantes conservan el sistema anterior de Font Awesome.",
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
                ${walletBitmap()}
              </div>
              <img class="header-logo" src="logo-oky.svg" alt="OKY">
              ${cartBitmap()}
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
                ${walletBitmap()}
              </div>
              <img class="header-logo" src="logo-oky.svg" alt="OKY">
              ${loginBitmap()}
            </div>
          </div>
        </div>

        <div>
          <div class="mars-label" style="margin-bottom:8px">Header / Logged / Cart Full · ArMsV</div>
          <div class="mars-mobile">
            <div class="app-header">
              <div class="header-left-group">
                ${walletBitmap()}
              </div>
              <img class="header-logo" src="logo-oky.svg" alt="OKY">
              ${cartBitmap({ indicated: true })}
            </div>
          </div>
        </div>

        <div>
          <div class="mars-label" style="margin-bottom:8px">Header / Logged / Both Indicators · Figma 7406:50941</div>
          <div class="mars-mobile">
            <div class="app-header">
              <div class="header-left-group">
                ${walletBitmap({ indicated: true })}
              </div>
              <img class="header-logo" src="logo-oky.svg" alt="OKY">
              ${cartBitmap({ indicated: true })}
            </div>
          </div>
        </div>

        <div>
          <div class="mars-label" style="margin-bottom:8px">Page Header / Screens · 6IKuE</div>
          <div class="mars-mobile">
            <div class="page-header-screen">
              <div class="header-icon header-icon-light"><i class="fa-light fa-arrow-left icon-medium"></i></div>
              <div class="page-header-title">Page Title</div>
              ${cartBitmap()}
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

        <div>
          <div class="mars-label" style="margin-bottom:8px">Page Header / No Title · PDP</div>
          <div class="mars-mobile">
            <div class="page-header-screen">
              <div class="header-icon header-icon-light"><i class="fa-light fa-arrow-left icon-medium"></i></div>
              <div class="page-header-title page-header-title-empty" aria-hidden="true"></div>
              ${cartBitmap()}
            </div>
          </div>
        </div>

      </div>
    </div>`,
};
