import {
  CARD_TOP_PATHS,
  CARD_TOP_VARIANTS,
  findCardTop,
  renderCardTop,
  resolveCardTop,
} from "./_shared/primeCards";

function renderReferenceItem(card) {
  return `
    <div class="prime-card-reference">
      <div class="mars-label">${card.path}</div>
      ${renderCardTop(card)}
      <div class="mars-label" style="margin-top:10px">ID .pen: ${card.id}</div>
    </div>
  `;
}

export default {
  title: "Molecules/Top Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Top Card** es una molécula hermana de `Middle Card`, pensada para la parte superior de credenciales y gift cards. " +
          "Usa el surface token **Card Top**, conserva el shadow **PDP Card**, mantiene ancho PDP (`342px`) y reutiliza el wrapper de iconos `fa-icon-card-use` para los links inferiores. " +
          "La anatomía se resuelve en dos variantes base de Figma: **OKY Vales** y **Gift Card**. " +
          "Flags, assets y tratamientos de borde se montan sobre recursos ya existentes del sistema. " +
          "No existe todavía un token tipográfico específico para el brand chip de Figma, así que se mapea al tratamiento más cercano del sistema (`productText`).",
      },
    },
  },
  argTypes: {
    variantPath: {
      control: "select",
      options: CARD_TOP_PATHS,
      description: "Selecciona la variante base del componente.",
    },
    showBrandLabel: {
      control: "boolean",
      description: "Prende o apaga el label central de marca.",
    },
    brandLabel: {
      control: "text",
      description: "Label central. Base Figma: `Target`.",
    },
    heroImage: {
      control: "select",
      options: ["Saldo Card.png", "target.webp", "middle-card-vale-de-producto.png"],
      description: "Imagen principal dentro del cuerpo del card.",
    },
    heroAlt: {
      control: "text",
      description: "Alt del arte principal.",
    },
    flagImage: {
      control: "select",
      options: ["guatemala-flag.png", "usa-flag.png"],
      description: "Flag circular del lado derecho.",
    },
    flagAlt: {
      control: "text",
      description: "Alt de la bandera.",
    },
    footerLeftLabel: {
      control: "text",
      description: "Label inferior izquierdo o label único centrado.",
    },
    footerRightLabel: {
      control: "text",
      description: "Label inferior derecho. Si está vacío, se usa footer simple.",
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
    variantPath: "Molecule/Top Card/Gift Card",
    showBrandLabel: true,
    brandLabel: "Target",
    heroImage: "target.webp",
    heroAlt: "Target gift card",
    flagImage: "usa-flag.png",
    flagAlt: "USA flag",
    footerLeftLabel: "Terms & Conditions",
    footerRightLabel: "Brand Disclaimer",
    showMeta: true,
  },
  render: (args) => {
    const card = resolveCardTop(args);
    const base = findCardTop(args.variantPath);

    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${card.path}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          ${base.recommendation}
        </div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Surface: Card Top · Shadow: PDP Card · Iconos: fa-icon-card-use · Width PDP: 342px
        </div>
        ${args.showMeta ? `<div class="mars-label">ID .pen: ${card.id}</div>` : ""}
        ${renderCardTop(card)}
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
        story: "Referencia side-by-side de las dos variantes base de `Top Card`.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="prime-card-grid">
        ${CARD_TOP_VARIANTS.map((card) => renderReferenceItem(card)).join("")}
      </div>
    </div>
  `,
};
