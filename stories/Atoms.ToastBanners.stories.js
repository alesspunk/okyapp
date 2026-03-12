const TOAST_VARIANTS = ["Success", "Warning", "Error"];
const TOAST_ICON_OPTIONS = [
  "circle-check",
  "gift",
  "clock",
  "circle-exclamation",
  "triangle-exclamation",
  "circle-info",
];
const TOAST_MESSAGE_LIMIT = 30;

const TOAST_CONFIG = {
  Success: {
    nodeId: "1807:17380",
    icon: "circle-check",
    iconWeight: "fa-light",
    message: "Vale enviado correctamente",
    description: "Toast de confirmación usando semantic tokens de success.",
  },
  Warning: {
    nodeId: "1807:18261 / 2189:10119",
    icon: "gift",
    iconWeight: "fa-light",
    message: "Revisa las condiciones del vale",
    description: "Toast preventivo o informativo usando semantic tokens de warning.",
  },
  Error: {
    nodeId: "2189:10151",
    icon: "circle-exclamation",
    iconWeight: "fa-light",
    message: "No pudimos procesar tu vale",
    description: "Toast de error sin acción secundaria.",
  },
};

function limitToastMessage(message) {
  const trimmed = message?.trim() || "";
  if (trimmed.length <= TOAST_MESSAGE_LIMIT) return trimmed;
  return `${trimmed.slice(0, TOAST_MESSAGE_LIMIT - 1).trimEnd()}…`;
}

function resolveToast(args = {}) {
  const variant = TOAST_VARIANTS.includes(args.variant) ? args.variant : "Success";
  const base = TOAST_CONFIG[variant];
  const requestedIcon = TOAST_ICON_OPTIONS.includes(args.icon) ? args.icon : base.icon;

  let icon = requestedIcon;
  let message = limitToastMessage(args.message || base.message);

  if (variant === "Warning" && !args.message && requestedIcon === "clock") {
    message = "Puede tardar unos minutos";
  }

  return {
    ...base,
    variant,
    icon,
    message,
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
    icon: {
      control: "select",
      options: TOAST_ICON_OPTIONS,
      description: "Permite probar distintos íconos de Font Awesome en el visor. El color sigue dependiendo del estado.",
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
    icon: "circle-check",
    message: "",
  },
  render: (args) => {
    const toast = resolveToast(args);

    return `
      <div class="mars-story">
        <div class="mars-label">Toast Banner · ${toast.variant} · Ref Figma: ${toast.nodeId}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Recomendado: máximo ${TOAST_MESSAGE_LIMIT} caracteres para mantener una sola línea en 328px.
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
          "Referencia de las variantes del átomo con copys ajustados al límite de una línea.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div style="display:flex;flex-direction:column;gap:20px;max-width:328px">
        ${renderToastBanner({ variant: "Success" })}
        ${renderToastBanner({ variant: "Warning", icon: "gift" })}
        ${renderToastBanner({ variant: "Warning", icon: "clock" })}
        ${renderToastBanner({ variant: "Error" })}
      </div>
    </div>
  `,
};
