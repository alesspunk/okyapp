import {
  DISCOUNT_RIBBON_TYPES,
  findMiddleCard,
  MIDDLE_CARD_PATHS,
  renderMiddleCard,
  resolveMiddleCard,
} from "./_shared/middleCard";
import {
  CARD_BOTTOM_PATHS,
  CARD_TOP_PATHS,
  findCardBottom,
  findCardTop,
  renderCardBottom,
  renderCardTop,
  resolveCardBottom,
  resolveCardTop,
} from "./_shared/primeCards";

function resolveArgs(args = {}) {
  const topBase = findCardTop(args.topVariantPath);
  const middleBase = findMiddleCard(args.middleCardPath);
  const bottomBase = findCardBottom(args.bottomVariantPath);

  return {
    top: resolveCardTop({
      variantPath: CARD_TOP_PATHS.includes(args.topVariantPath) ? args.topVariantPath : topBase.path,
      showBrandLabel: args.topShowBrandLabel,
      brandLabel: args.topBrandLabel?.trim() || topBase.brandLabel,
      heroImage: args.topHeroImage?.trim() || topBase.heroImage,
      heroAlt: args.topHeroAlt?.trim() || topBase.heroAlt,
      flagImage: args.topFlagImage?.trim() || topBase.flagImage,
      flagAlt: args.topFlagAlt?.trim() || topBase.flagAlt,
      footerLeftLabel: args.topFooterLeftLabel?.trim() || topBase.footerLeftLabel,
      footerRightLabel: args.topFooterRightLabel?.trim() || topBase.footerRightLabel,
    }),
    middle: resolveMiddleCard({
      variantPath: MIDDLE_CARD_PATHS.includes(args.middleCardPath) ? args.middleCardPath : middleBase.path,
      pageContext: "PDP",
      title: args.middleTitle?.trim() || middleBase.title,
      currency: args.middleCurrency?.trim() || middleBase.currency,
      amount: args.middleAmount?.trim() || middleBase.amount,
      leftLabel: args.middleLeftLabel?.trim() || middleBase.leftLabel,
      rightLabel: args.middleRightLabel?.trim() || middleBase.rightLabel,
      image: args.middleImage?.trim() || middleBase.image,
      showDiscountRibbon: args.middleShowDiscountRibbon === true,
      discountRibbonType: DISCOUNT_RIBBON_TYPES.includes(args.middleDiscountRibbonType)
        ? args.middleDiscountRibbonType
        : "Normal",
      discountRibbonLabel: args.middleDiscountRibbonLabel?.trim() || "25% OFF",
      discountRibbonSize: "Default",
    }),
    bottom: resolveCardBottom({
      variantPath: CARD_BOTTOM_PATHS.includes(args.bottomVariantPath) ? args.bottomVariantPath : bottomBase.path,
      expiry: typeof args.bottomExpiry === "string" ? args.bottomExpiry : bottomBase.expiry,
      buttonLabel: args.bottomButtonLabel?.trim() || bottomBase.buttonLabel,
      showButtonLabel:
        typeof args.bottomShowButtonLabel === "boolean" ? args.bottomShowButtonLabel : true,
      whatsappImage: args.bottomWhatsappImage?.trim() || "whatsapp-icon-card-bottom.png",
    }),
  };
}

function renderCardOrganism(args = {}) {
  const resolved = resolveArgs(args);

  return `
    <section class="card-organism" aria-label="Card organism">
      <div class="card-organism-stack">
        <div class="card-organism-part card-organism-part-top">
          ${renderCardTop(resolved.top)}
        </div>
        <div class="card-organism-separator-slot">
          <div class="separator-atom" role="separator" aria-orientation="horizontal"></div>
        </div>
        <div class="card-organism-part card-organism-part-middle">
          ${renderMiddleCard(resolved.middle)}
        </div>
        <div class="card-organism-separator-slot">
          <div class="separator-atom" role="separator" aria-orientation="horizontal"></div>
        </div>
        <div class="card-organism-part card-organism-part-bottom">
          ${renderCardBottom(resolved.bottom)}
        </div>
      </div>
    </section>
  `;
}

export default {
  title: "Organisms/Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo **Card** compuesto por `Top Card`, `Separator`, `Middle Card`, `Separator` y `Bottom Card`. " +
          "La intención es poder jugar con combinaciones completas de credencial o gift card sin duplicar la anatomía interna de cada molécula. " +
          "El stack mantiene ancho PDP, centra el separator de `390px` con color `border main` y hereda los surfaces y shadows ya declarados en el sistema.",
      },
    },
  },
  argTypes: {
    topVariantPath: {
      control: "select",
      options: CARD_TOP_PATHS,
      description: "Variante base de Top Card.",
    },
    middleCardPath: {
      control: "select",
      options: MIDDLE_CARD_PATHS,
      description: "Variante base del Middle Card.",
    },
    bottomVariantPath: {
      control: "select",
      options: CARD_BOTTOM_PATHS,
      description: "Variante base de Bottom Card.",
    },
    topShowBrandLabel: {
      control: "boolean",
      description: "Muestra u oculta el label central de Top Card.",
    },
    topBrandLabel: {
      control: "text",
      description: "Override del brand label de Top Card.",
    },
    middleTitle: {
      control: "text",
      description: "Título del Middle Card.",
    },
    middleCurrency: {
      control: "text",
      description: "Moneda del Middle Card numérico.",
    },
    middleAmount: {
      control: "text",
      description: "Monto del Middle Card numérico.",
    },
    middleLeftLabel: {
      control: "text",
      description: "Footer inferior izquierdo del Middle Card.",
    },
    middleRightLabel: {
      control: "text",
      description: "Footer inferior derecho del Middle Card.",
    },
    middleShowDiscountRibbon: {
      control: "boolean",
      description: "Prende o apaga el Discount Ribbon del Middle Card.",
    },
    middleDiscountRibbonType: {
      control: "select",
      options: DISCOUNT_RIBBON_TYPES,
      description: "Type del Discount Ribbon reutilizado en Middle Card.",
    },
    middleDiscountRibbonLabel: {
      control: "text",
      description: "Texto del Discount Ribbon del Middle Card.",
    },
    bottomShowButtonLabel: {
      control: "boolean",
      description: "Muestra u oculta el label del botón lateral de Bottom Card.",
    },
    bottomButtonLabel: {
      control: "text",
      description: "Label del botón lateral de Bottom Card.",
    },
    bottomExpiry: {
      control: "text",
      description: "Fecha de expiración visible en Bottom Card.",
    },
    showMeta: {
      control: "boolean",
      description: "Muestra un resumen de la composición usada.",
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    topVariantPath: "Molecule/Top Card/Gift Card",
    middleCardPath: "Molecule/Middle Card/eGift Card",
    bottomVariantPath: "Molecule/Bottom Card/Gift Card",
    topShowBrandLabel: true,
    topBrandLabel: "Target",
    middleTitle: "Target eGift Card",
    middleCurrency: "$",
    middleAmount: "40",
    middleLeftLabel: "Brand Disclaimer",
    middleRightLabel: "Redemption Instructions",
    middleShowDiscountRibbon: false,
    middleDiscountRibbonType: "Normal",
    middleDiscountRibbonLabel: "25% OFF",
    bottomShowButtonLabel: true,
    bottomButtonLabel: "Help",
    bottomExpiry: "",
    showMeta: true,
  },
  render: (args) => {
    const resolved = resolveArgs(args);

    return `
      <div class="mars-story">
        <div class="mars-label">Organism / Card</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Stack vertical de Top Card + Separator + Middle Card + Separator + Bottom Card.
        </div>
        ${
          args.showMeta
            ? `<div class="mars-label">Top: ${resolved.top.path} · Middle: ${resolved.middle.path} · Bottom: ${resolved.bottom.path}</div>`
            : ""
        }
        <div class="card-organism-story-shell">
          ${renderCardOrganism(args)}
        </div>
      </div>
    `;
  },
};

export const GiftCardFlow = {
  name: "Gift Card Flow",
  parameters: {
    controls: { disable: true },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Gift Card Flow</div>
      <div class="card-organism-story-shell">
        ${renderCardOrganism({
          topVariantPath: "Molecule/Top Card/Gift Card",
          middleCardPath: "Molecule/Middle Card/eGift Card",
          middleTitle: "Target eGift Card",
          middleCurrency: "$",
          middleAmount: "40",
          middleLeftLabel: "Brand Disclaimer",
          middleRightLabel: "Redemption Instructions",
          bottomVariantPath: "Molecule/Bottom Card/Gift Card",
          bottomShowButtonLabel: true,
          bottomButtonLabel: "Help",
        })}
      </div>
    </div>
  `,
};

export const OkyValesFlow = {
  name: "OKY Vales Flow",
  parameters: {
    controls: { disable: true },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">OKY Vales Flow</div>
      <div class="card-organism-story-shell">
        ${renderCardOrganism({
          topVariantPath: "Molecule/Top Card/OKY Vales",
          middleCardPath: "Molecule/Middle Card/Vale de Monto",
          middleTitle: "Vale de Monto",
          middleCurrency: "Q",
          middleAmount: "1,000",
          middleLeftLabel: "Mostrar al cajero",
          middleRightLabel: "Como canjear",
          bottomVariantPath: "Molecule/Bottom Card/OKY Vales",
          bottomShowButtonLabel: true,
          bottomButtonLabel: "Ayuda",
          bottomExpiry: "Vence 10 / Sep / 2025",
        })}
      </div>
    </div>
  `,
};

export const MixedFlow = {
  name: "Mixed Flow",
  parameters: {
    controls: { disable: true },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Mixed Flow</div>
      <div class="card-organism-story-shell">
        ${renderCardOrganism({
          topVariantPath: "Molecule/Top Card/Gift Card",
          middleCardPath: "Molecule/Middle Card/eGift Card",
          middleTitle: "Amazon eGift Card",
          middleCurrency: "$",
          middleAmount: "25",
          middleLeftLabel: "In Store, Online",
          middleRightLabel: "Redemption Instructions",
          bottomVariantPath: "Molecule/Bottom Card/Default",
          bottomShowButtonLabel: true,
          bottomButtonLabel: "Ayuda",
          bottomExpiry: "Vence 10 / Sep / 2025",
        })}
      </div>
    </div>
  `,
};

export const TelcoSupportFlow = {
  name: "Telco Support Flow",
  parameters: {
    controls: { disable: true },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Telco Support Flow</div>
      <div class="card-organism-story-shell">
        ${renderCardOrganism({
          topVariantPath: "Molecule/Top Card/OKY Vales",
          middleCardPath: "Molecule/Middle Card/Vale de Monto",
          middleTitle: "Paquete de Internet",
          middleCurrency: "$",
          middleAmount: "50",
          middleLeftLabel: "Uso inmediato",
          middleRightLabel: "Más detalles",
          bottomVariantPath: "Molecule/Bottom Card/Telco",
          bottomShowButtonLabel: false,
          bottomButtonLabel: "Ayuda",
          bottomExpiry: "",
        })}
      </div>
    </div>
  `,
};
