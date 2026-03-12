const middleCardVariants = [
  {
    path: "Molecule/Middle Card/Vale de Monto",
    key: "vale-de-monto",
    id: "6991:146235",
    kind: "amount",
    title: "Vale de Monto",
    currency: "Q",
    amount: "1,000",
    leftLabel: "Mostrar al cajero",
    rightLabel: "Como canjear",
    image: "",
    recommendation: 'Recomendado: título máx. 14 caracteres ("Vale de Monto") · monto máx. 5 dígitos + separadores.',
  },
  {
    path: "Molecule/Middle Card/Vale de Producto",
    key: "vale-de-producto",
    id: "6991:146181",
    kind: "product",
    title: "Cajita Feliz de McNuggets + Cono Vainilla y Juguete incluido",
    currency: "",
    amount: "",
    leftLabel: "Mostrar al cajero",
    rightLabel: "Como canjear",
    image: "middle-card-vale-de-producto.png",
    recommendation:
      'Recomendado: título máx. 60 caracteres (base Figma: "Cajita Feliz de McNuggets + Cono Vainilla y Juguete incluido").',
  },
  {
    path: "Molecule/Middle Card/eGift Card",
    key: "egift-card",
    id: "6991:146335",
    kind: "egift",
    title: "Brand Name eGift Card",
    currency: "$",
    amount: "10",
    leftLabel: "In Store, Online",
    rightLabel: "Redemption Instructions",
    image: "",
    recommendation:
      'Recomendado: título máx. 21 caracteres ("Brand Name eGift Card") · monto máx. 2 dígitos para esta composición.',
  },
];

const variantPaths = middleCardVariants.map((variant) => variant.path);

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

function findVariant(path) {
  return middleCardVariants.find((variant) => variant.path === path) ?? middleCardVariants[0];
}

function resolveCard(args = {}) {
  const base = findVariant(args.variantPath);
  return {
    ...base,
    pageContext: args.pageContext || "PDP",
    title: args.title?.trim() || base.title,
    currency: args.currency?.trim() || base.currency,
    amount: args.amount?.trim() || base.amount,
    leftLabel: args.leftLabel?.trim() || base.leftLabel,
    rightLabel: args.rightLabel?.trim() || base.rightLabel,
    image: args.image?.trim() || base.image,
  };
}

function renderFooter(card) {
  return `
    <div class="middle-card-footer">
      <span class="middle-card-footer-start">${card.leftLabel}</span>
      <span class="middle-card-footer-end">${card.rightLabel}</span>
      <i class="fa-light fa-arrow-up-right-from-square middle-card-link-icon" aria-hidden="true"></i>
    </div>
  `;
}

function renderBody(card) {
  if (card.kind === "product") {
    return `
      <div class="middle-card-content">
        <div class="middle-card-top">
          <p class="middle-card-title">${card.title}</p>
          <figure class="middle-card-product-figure">
            <img src="${card.image}" alt="${card.title}" />
          </figure>
        </div>
        ${renderFooter(card)}
      </div>
    `;
  }

  return `
    <div class="middle-card-content">
      <div class="middle-card-top">
        <p class="middle-card-title">${card.title}</p>
        <div class="middle-card-value">
          <span class="middle-card-currency">${card.currency}</span>
          <p class="middle-card-amount">${card.amount}</p>
        </div>
      </div>
      ${renderFooter(card)}
    </div>
  `;
}

function renderMiddleCard(card) {
  return `
    <div class="middle-card-shell is-${card.pageContext.toLowerCase()}" data-pen-id="${card.id}">
      <article class="middle-card-molecule is-${card.kind}">
        ${renderBody(card)}
      </article>
    </div>
  `;
}

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
          "Incluye además un switch de contexto para **PDP** y **Checkout**, cambiando tamaño y shadow sin alterar la anatomía. " +
          "La variante de producto usa `mix-blend-mode: darken` sobre la imagen para respetar el tratamiento visual de Figma. " +
          "Tipografía asignada: **Title → productText**, **Currency prefix → subtitle2**, **Amount → H2**, **Footer labels → CARDLABEL**.",
      },
    },
  },
  argTypes: {
    variantPath: {
      control: "select",
      options: variantPaths,
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
    showMeta: true,
  },
  render: (args) => {
    const card = resolveCard(args);
    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${card.path} · Page: ${card.pageContext}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          ${findVariant(card.path).recommendation}
        </div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Typography: Title → productText · Currency → subtitle2 · Amount → H2 · Footer labels → CARDLABEL.
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
        ${middleCardVariants.map((card) => renderReferenceItem(card)).join("")}
      </div>
    </div>
  `,
};

export const PageContexts = {
  name: "Page Contexts",
  parameters: {
    docs: {
      description: {
        story: "Comparación de tamaño y shadow del mismo componente cuando se usa en PDP vs Checkout.",
      },
    },
  },
  render: () => {
    const sample = middleCardVariants[0];
    return `
      <div class="mars-story">
        <div class="mars-label">Middle Card · Page Context Switch</div>
        <div class="middle-card-grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
          <div class="middle-card-reference">
            <div class="mars-label">PDP · 342x194</div>
            ${renderMiddleCard({ ...sample, pageContext: "PDP" })}
          </div>
          <div class="middle-card-reference">
            <div class="mars-label">Checkout · 300x177</div>
            ${renderMiddleCard({ ...sample, pageContext: "Checkout" })}
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
