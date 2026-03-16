import {
  CARD_BOTTOM_PATHS,
  CARD_BOTTOM_VARIANTS,
  findCardBottom,
  renderCardBottom,
  resolveCardBottom,
} from "./_shared/primeCards";

function renderReferenceItem(card) {
  return `
    <div class="prime-card-reference">
      <div class="mars-label">${card.path}</div>
      ${renderCardBottom(card)}
      <div class="mars-label" style="margin-top:10px">ID .pen: ${card.id}</div>
    </div>
  `;
}

export default {
  title: "Molecules/Bottom Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Bottom Card** es la molécula hermana de `Middle Card` para credenciales, códigos y soporte. " +
          "Usa el surface token **Card Bottom**, conserva el mismo shadow **PDP Card**, mantiene ancho PDP (`342px`) y reutiliza `fa-icon-card-use` para acciones tipo copy. " +
          "Incluye las cinco variantes vistas en Figma: **Default**, **OKY Vales**, **Oh Gif Card**, **Gift Card** y **Telco**. " +
          "El botón lateral usa el asset local `whatsapp-icon-card-bottom.png` y permite switch para mostrar label o dejarlo solo con icono. " +
          "No existe aún un token tipográfico explícito para `Card Code` (Inter 20 / 784 / tracking 2), así que se implementa localmente para respetar Figma sin introducir tokens nuevos.",
      },
    },
  },
  argTypes: {
    variantPath: {
      control: "select",
      options: CARD_BOTTOM_PATHS,
      description: "Selecciona la variante base del componente.",
    },
    showButtonLabel: {
      control: "boolean",
      description: "Switch para mostrar u ocultar el label del botón lateral.",
    },
    buttonLabel: {
      control: "text",
      description: "Label del botón lateral. Base Figma: `Ayuda` o `Help`.",
    },
    expiry: {
      control: "text",
      description: "Fecha de expiración. Si queda vacío, no se muestra texto.",
    },
    whatsappImage: {
      control: "select",
      options: ["whatsapp-icon-card-bottom.png"],
      description: "Asset del ícono del botón lateral.",
    },
    showMeta: {
      control: "boolean",
      description: "Muestra el ID .pen debajo del playground.",
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    variantPath: "Molecule/Bottom Card/Default",
    showButtonLabel: true,
    buttonLabel: "Ayuda",
    expiry: "Vence 10 / Sep / 2025",
    whatsappImage: "whatsapp-icon-card-bottom.png",
    showMeta: true,
  },
  render: (args) => {
    const card = resolveCardBottom(args);
    const base = findCardBottom(args.variantPath);

    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${card.path}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          ${base.recommendation}
        </div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Surface: Card Bottom · Shadow: PDP Card · Copy actions: fa-icon-card-use · Width PDP: 342px
        </div>
        ${args.showMeta ? `<div class="mars-label">ID .pen: ${card.id}</div>` : ""}
        ${renderCardBottom(card)}
      </div>
    `;
  },
};

export const Variants = {
  name: "Variants",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Referencia visual de las cinco variantes base de `Bottom Card`.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="prime-card-grid">
        ${CARD_BOTTOM_VARIANTS.map((card) => renderReferenceItem({ ...card, showButtonLabel: true, whatsappImage: "whatsapp-icon-card-bottom.png" })).join("")}
      </div>
    </div>
  `,
};

export const ButtonLabelSwitch = {
  name: "Button Label Switch",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Comparación del CTA lateral con label visible y en modo icon-only.",
      },
    },
  },
  render: () => {
    const sample = findCardBottom("Molecule/Bottom Card/Default");

    return `
      <div class="mars-story">
        <div class="prime-card-grid">
          <div class="prime-card-reference">
            <div class="mars-label">With label</div>
            ${renderCardBottom({ ...sample, showButtonLabel: true, whatsappImage: "whatsapp-icon-card-bottom.png" })}
          </div>
          <div class="prime-card-reference">
            <div class="mars-label">Icon only</div>
            ${renderCardBottom({ ...sample, showButtonLabel: false, whatsappImage: "whatsapp-icon-card-bottom.png" })}
          </div>
        </div>
      </div>
    `;
  },
};
