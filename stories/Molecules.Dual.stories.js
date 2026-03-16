const DUAL_VARIANTS = ["Default", "PARA MI"];

const DUAL_VARIANT_META = {
  Default: {
    penId: "7370:49614",
    name: "Aracely",
    phone: "+502 6814-9122",
    icon: "user",
  },
  "PARA MI": {
    penId: "7370:49646",
    name: "Para mi",
    phone: "+1 407 284-8092",
    icon: "address-card",
  },
};

function resolveDual(args = {}) {
  const variant = DUAL_VARIANTS.includes(args.variant) ? args.variant : "Default";
  const meta = DUAL_VARIANT_META[variant];

  return {
    variant,
    penId: meta.penId,
    label: args.label?.trim() || "¿Para quién es?",
    name: args.name?.trim() || meta.name,
    phone: args.phone?.trim() || meta.phone,
    icon: meta.icon,
    whatsappImage: args.whatsappImage?.trim() || "whatsapp.png",
  };
}

function renderDual(args = {}) {
  const resolved = resolveDual(args);
  const variantClass = resolved.variant === "PARA MI" ? "is-para-mi" : "is-default";

  return `
    <article class="dual-molecule ${variantClass}" data-pen-id="${resolved.penId}">
      <span class="dual-floating-label">${resolved.label}</span>
      <div class="dual-card">
        <span class="dual-avatar" aria-hidden="true">
          <i class="fa-solid fa-${resolved.icon}"></i>
        </span>
        <div class="dual-copy">
          <p class="dual-title">${resolved.name}</p>
          <p class="dual-subtitle">${resolved.phone}</p>
        </div>
        <span class="dual-action" aria-hidden="true">
          <img src="${resolved.whatsappImage}" alt="" />
        </span>
      </div>
    </article>
  `;
}

export default {
  title: "Molecules/Dual",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Molécula **Dual** para selección de destinatario en checkout. " +
          "Tiene dos variantes del set de Figma: **Default** para un contacto guardado y **PARA MI** para compra propia. " +
          "Usa avatar circular, nombre, teléfono y el asset local `whatsapp.png` como acción visual del lado derecho.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: DUAL_VARIANTS,
      description: "Variante del componente según el set de Figma.",
    },
    label: {
      control: "text",
      description: "Texto flotante superior del selector.",
    },
    name: {
      control: "text",
      description: "Nombre principal del destinatario.",
    },
    phone: {
      control: "text",
      description: "Número de teléfono secundario.",
    },
    whatsappImage: {
      control: "text",
      description: "Asset del ícono derecho. Por default usa `whatsapp.png`.",
    },
    showMeta: {
      control: "boolean",
      description: "Muestra el ID .pen de la variante activa.",
    },
  },
};

export const Playground = {
  name: "Playground",
  args: {
    variant: "Default",
    label: "¿Para quién es?",
    name: "",
    phone: "",
    whatsappImage: "whatsapp.png",
    showMeta: true,
  },
  render: (args) => {
    const resolved = resolveDual(args);

    return `
      <div class="mars-story">
        <div class="mars-label">Dual · ${resolved.variant}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Selector de destinatario para checkout, con ancho base de 328px, label flotante y acción visual de WhatsApp.
        </div>
        ${args.showMeta ? `<div class="mars-label">ID .pen: ${resolved.penId}</div>` : ""}
        ${renderDual(args)}
      </div>
    `;
  },
};

export const Variants = {
  name: "Variants — Reference",
  parameters: {
    controls: { disable: true },
  },
  render: () => `
    <div class="mars-story">
      <div class="dual-story-stack">
        <div class="story-card">
          <div class="mars-label">Default · ${DUAL_VARIANT_META.Default.penId}</div>
          ${renderDual({ variant: "Default" })}
        </div>
        <div class="story-card">
          <div class="mars-label">PARA MI · ${DUAL_VARIANT_META["PARA MI"].penId}</div>
          ${renderDual({ variant: "PARA MI" })}
        </div>
      </div>
    </div>
  `,
};
