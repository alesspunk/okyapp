const TOAST_VARIANTS = ["Success", "Warning", "Error"];
const WARNING_ICON_OPTIONS = ["Gift", "Clock"];

const TOAST_CONFIG = {
  Success: {
    nodeId: "1807:17380",
    icon: "circle-check",
    iconWeight: "fa-light",
    message: "José Ramos te envió un OKY Vale 😀",
    description: "Toast de confirmación usando semantic tokens de success.",
  },
  Warning: {
    nodeId: "1807:18261 / 2189:10119",
    icon: "gift",
    iconWeight: "fa-light",
    message: "José Ramos te envió una tarjeta 🥳",
    description: "Toast preventivo o informativo usando semantic tokens de warning.",
  },
  Error: {
    nodeId: "2189:10151",
    icon: "circle-exclamation",
    iconWeight: "fa-light",
    message: "Esto es un error",
    description: "Toast de error sin acción secundaria.",
  },
};

function resolveToast(args = {}) {
  const variant = TOAST_VARIANTS.includes(args.variant) ? args.variant : "Success";
  const base = TOAST_CONFIG[variant];
  const warningIcon = WARNING_ICON_OPTIONS.includes(args.warningIcon) ? args.warningIcon : "Gift";

  let icon = base.icon;
  let message = args.message?.trim() || base.message;

  if (variant === "Warning" && warningIcon === "Clock") {
    icon = "clock";
    message = args.message?.trim() || "El vale no se muestra en tiempo real";
  }

  return {
    ...base,
    variant,
    icon,
    message,
    warningIcon,
  };
}

function renderToastBanner(args = {}) {
  const toast = resolveToast(args);

  return `
    <article class="toast-banner toast-banner-${toast.variant.toLowerCase()}" data-figma-node="${toast.nodeId}">
      <span class="fa-icon toast-banner-icon toast-banner-icon-${toast.variant.toLowerCase()}" aria-hidden="true">
        <i class="${toast.iconWeight} fa-${toast.icon}"></i>
      </span>
      <p class="token-body1 toast-banner-message">${toast.message}</p>
    </article>
  `;
}

export default {
  title: "Atoms/Toast Banners",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Átomo **Toast Banners** para mensajes cortos de feedback. " +
          "Incluye variantes **Success**, **Warning** y **Error**, sin action button, " +
          "y reutiliza el átomo base de ícono (`.fa-icon`) con equivalentes Font Awesome inspirados en la referencia de Figma.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: TOAST_VARIANTS,
      description: "Severidad principal del toast.",
    },
    warningIcon: {
      control: "inline-radio",
      options: WARNING_ICON_OPTIONS,
      description: "Solo para `Warning`: permite usar gift o clock, según el caso del mensaje.",
    },
    message: {
      control: "text",
      description: "Mensaje visible dentro del banner.",
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    variant: "Success",
    warningIcon: "Gift",
    message: "",
  },
  render: (args) => {
    const toast = resolveToast(args);

    return `
      <div class="mars-story">
        <div class="mars-label">Toast Banner · ${toast.variant} · Ref Figma: ${toast.nodeId}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Recomendado: máximo 36 caracteres en el mensaje para mantener una línea cómoda en 328px.
        </div>
        ${renderToastBanner(args)}
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
        story:
          "Referencia de las variantes del átomo. Warning se muestra en dos contextos visuales, usando icono `gift` y `clock`.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div style="display:flex;flex-direction:column;gap:20px;max-width:328px">
        ${renderToastBanner({ variant: "Success" })}
        ${renderToastBanner({ variant: "Warning", warningIcon: "Gift" })}
        ${renderToastBanner({ variant: "Warning", warningIcon: "Clock" })}
        ${renderToastBanner({ variant: "Error" })}
      </div>
    </div>
  `,
};
