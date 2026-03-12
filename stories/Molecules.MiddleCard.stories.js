import {
  DISCOUNT_RIBBON_TYPES,
  findMiddleCard,
  MIDDLE_CARD_PATHS,
  MIDDLE_CARD_VARIANTS,
  renderMiddleCard,
  resolveMiddleCard,
} from "./_shared/middleCard";

const typographyMapping = [
  {
    element: "Title",
    appliesTo: "Vale de Monto · Vale de Producto · eGift Card",
    token: "productText",
    closest: "productText",
    spec: "Nunito Sans 14 / 600 / 1.5 / 0.15",
    note: "Se usa el token del sistema aunque difiera del texto de Figma.",
  },
  {
    element: "Currency prefix",
    appliesTo: "Vale de Monto · eGift Card",
    token: "subtitle2",
    closest: "subtitle2",
    spec: "Nunito Sans 14 / 500 / 1.57 / 0.1",
    note: "Se adopta el token del sistema para mantener consistencia tipográfica.",
  },
  {
    element: "Amount",
    appliesTo: "Vale de Monto · eGift Card",
    token: "H2",
    closest: "H2",
    spec: "Nunito Sans 60 / 700 / 1.2 / -0.5",
    note: "Usa H2 del sistema.",
  },
  {
    element: "Footer labels",
    appliesTo: "All variants",
    token: "CARDLABEL",
    closest: "CARDLABEL",
    spec: "Nunito Sans 10 / 500 / 1.6 / 0 uppercase",
    note: "Usa Card Label del sistema.",
  },
];

function renderReferenceItem(card) {
  return `
    <div class="middle-card-reference">
      <div class="mars-label">${card.path}</div>
      ${renderMiddleCard(card)}
      <div class="mars-label" style="margin-top:10px">ID .pen: ${card.id}</div>
    </div>
  `;
}

export default {
  title: "Molecules/Middle Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Middle Card** es la molécula de canje intermedio para vouchers y gift cards. " +
          "Incluye tres variantes iniciales: **Vale de Monto**, **Vale de Producto** y **eGift Card**. " +
          "Mantiene el mismo footer de acciones, usa tipografía del sistema basada en `Nunito Sans`, shadow suave, radial surface y CTA secundario con `arrow-up-right-from-square`. " +
          "Incluye además un switch de contexto para **PDP** y **Checkout**, cambiando tamaño sin alterar la anatomía. " +
          "También permite montar opcionalmente un **Discount Ribbon / Wrap** en la esquina superior derecha, reutilizando el átomo existente sin romper su set de variantes. " +
          "La variante de producto usa `mix-blend-mode: darken` sobre la imagen para respetar el tratamiento visual de Figma. " +
          "Tipografía asignada: **Title → productText**, **Currency prefix → subtitle2**, **Amount → H2**, **Footer labels → CARDLABEL**. " +
          "El shell usa el token de efecto **PDP Card** y la superficie **Card Middle**.",
      },
    },
  },
  argTypes: {
    variantPath: {
      control: "select",
      options: MIDDLE_CARD_PATHS,
      description: "Selecciona la variante base del componente.",
    },
    pageContext: {
      control: "inline-radio",
      options: ["PDP", "Checkout"],
      description: "Switch de uso por página. Cambia size y shadow del card.",
    },
    title: {
      control: "text",
      description: "Título principal del card.",
    },
    currency: {
      control: "text",
      description: "Moneda visible en variantes numéricas. Se ignora en Vale de Producto.",
    },
    amount: {
      control: "text",
      description: "Monto visible en variantes numéricas. Se ignora en Vale de Producto.",
    },
    leftLabel: {
      control: "text",
      description: "Etiqueta inferior izquierda.",
    },
    rightLabel: {
      control: "text",
      description: "Etiqueta inferior derecha.",
    },
    image: {
      control: "text",
      description: "Imagen para la variante Vale de Producto.",
    },
    showDiscountRibbon: {
      control: "boolean",
      description: "Prende o apaga el Discount Ribbon / Wrap montado en la esquina superior derecha.",
    },
    discountRibbonType: {
      control: "select",
      options: DISCOUNT_RIBBON_TYPES,
      description: "Type del Discount Ribbon reutilizado sobre el card.",
    },
    discountRibbonLabel: {
      control: "text",
      description: "Texto del Discount Ribbon montado.",
    },
    discountRibbonSize: {
      control: "inline-radio",
      options: ["Default", "Small"],
      description: "Size del Wrap: Default para PDP o Small para tarjetas más compactas.",
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
    variantPath: "Molecule/Middle Card/Vale de Monto",
    pageContext: "PDP",
    title: "Vale de Monto",
    currency: "Q",
    amount: "1,000",
    leftLabel: "Mostrar al cajero",
    rightLabel: "Como canjear",
    image: "middle-card-vale-de-producto.png",
    showDiscountRibbon: true,
    discountRibbonType: "Normal",
    discountRibbonLabel: "25% OFF",
    discountRibbonSize: "Default",
    showMeta: true,
  },
  render: (args) => {
    const card = resolveMiddleCard(args);
    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${card.path} · Page: ${card.pageContext}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          ${findMiddleCard(card.path).recommendation}
        </div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Typography: Title → productText · Currency → subtitle2 · Amount → H2 · Footer labels → CARDLABEL. Discount Ribbon / Wrap opcional desde el switch.
        </div>
        ${args.showMeta ? `<div class="mars-label">ID .pen: ${card.id}</div>` : ""}
        ${renderMiddleCard(card)}
      </div>
    `;
  },
};

export const AllVariants = {
  name: "All Variants",
  parameters: {
    docs: {
      description: {
        story: "Referencia side-by-side de las tres variantes iniciales del componente.",
      },
    },
  },
  render: () => `
      <div class="mars-story">
        <div class="mars-label">Middle Card · Three Variants</div>
        <div class="middle-card-grid">
        ${MIDDLE_CARD_VARIANTS.map((card) => renderReferenceItem(card)).join("")}
        </div>
      </div>
  `,
};

export const PageContexts = {
  name: "Page Contexts",
  parameters: {
    docs: {
      description: {
        story: "Comparación de tamaño del mismo componente cuando se usa en PDP vs Checkout.",
      },
    },
  },
  render: () => {
    const sample = MIDDLE_CARD_VARIANTS[0];
    return `
      <div class="mars-story">
        <div class="mars-label">Middle Card · Page Context Switch</div>
        <div class="middle-card-grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
          <div class="middle-card-reference">
            <div class="mars-label">PDP · 342x194</div>
            ${renderMiddleCard({ ...sample, pageContext: "PDP", showDiscountRibbon: true, discountRibbonType: "Normal", discountRibbonLabel: "25% OFF", discountRibbonSize: "Default" })}
          </div>
          <div class="middle-card-reference">
            <div class="mars-label">Checkout · 300x177</div>
            ${renderMiddleCard({ ...sample, pageContext: "Checkout", showDiscountRibbon: true, discountRibbonType: "Normal", discountRibbonLabel: "25% OFF", discountRibbonSize: "Small" })}
          </div>
        </div>
      </div>
    `;
  },
};

export const TypographyMapping = {
  name: "Typography Mapping",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Mapa de tokens tipográficos para `Middle Card`. Sirve para validar si el componente ya está cubierto por Foundations o si necesita tokens nuevos.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Middle Card · Typography Mapping</div>
      <table class="type-table">
        <thead>
          <tr>
            <th>Value</th>
            <th>Applies To</th>
            <th>Assigned Token</th>
            <th>Closest Existing</th>
            <th>Spec</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          ${typographyMapping
            .map(
              (item) => `
            <tr>
              <td>${item.element}</td>
              <td>${item.appliesTo}</td>
              <td><strong>${item.token}</strong></td>
              <td><code>${item.closest}</code></td>
              <td>${item.spec}</td>
              <td>${item.note}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `,
};

export const ValeDeMonto = {
  name: "Vale de Monto",
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Molecule/Middle Card/Vale de Monto</div>
      <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
        ${middleCardVariants[0].recommendation}
      </div>
      <div class="mars-label">ID .pen: ${middleCardVariants[0].id}</div>
      ${renderMiddleCard({ ...middleCardVariants[0], pageContext: "PDP" })}
    </div>
  `,
};

export const ValeDeProducto = {
  name: "Vale de Producto",
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Molecule/Middle Card/Vale de Producto</div>
      <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
        ${middleCardVariants[1].recommendation}
      </div>
      <div class="mars-label">ID .pen: ${middleCardVariants[1].id}</div>
      ${renderMiddleCard({ ...middleCardVariants[1], pageContext: "PDP" })}
    </div>
  `,
};

export const EGiftCard = {
  name: "eGift Card",
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Molecule/Middle Card/eGift Card</div>
      <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
        ${middleCardVariants[2].recommendation}
      </div>
      <div class="mars-label">ID .pen: ${middleCardVariants[2].id}</div>
      ${renderMiddleCard({ ...middleCardVariants[2], pageContext: "PDP" })}
    </div>
  `,
};
