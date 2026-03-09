const VARIANT_OPTIONS = [
  "State=Productos, Telco=No, Scrolling=No",
  "State=Vales, Telco=No, Scrolling=No",
  "State=Ofertas, Telco=No, Scrolling=No",
  "State=Paquetes, Telco=Yes, Scrolling=No",
  "State=Internet, Telco=Yes, Scrolling=No",
  "State=Recargas, Telco=Yes, Scrolling=No",
  "State=Paquetes, Telco=Yes, Scrolling=Yes",
  "State=Pasteleria, Telco=Yes, Scrolling=Yes",
  "State=Restaurantes, Telco=Yes, Scrolling=Yes",
  "State=Home, Telco=No, Scrolling=Yes",
];

const PLATEU_VARIANTS = {
  "State=Productos, Telco=No, Scrolling=No": {
    penId: "6944:57168",
    width: 340,
    height: 125,
    scrolling: false,
    home: false,
    items: [
      { key: "productos", label: "PRODUCTOS", image: "plateu5.png", active: true },
      { key: "vales", label: "VALES", image: "plateu6.png", active: false },
      { key: "ofertas", label: "OFERTAS", image: "plateu7.png", active: false },
    ],
  },
  "State=Vales, Telco=No, Scrolling=No": {
    penId: "6944:57208",
    width: 340,
    height: 125,
    scrolling: false,
    home: false,
    items: [
      { key: "productos", label: "PRODUCTOS", image: "plateu5.png", active: false },
      { key: "vales", label: "VALES", image: "plateu6.png", active: true },
      { key: "ofertas", label: "OFERTAS", image: "plateu7.png", active: false },
    ],
  },
  "State=Ofertas, Telco=No, Scrolling=No": {
    penId: "6944:57307",
    width: 340,
    height: 125,
    scrolling: false,
    home: false,
    items: [
      { key: "productos", label: "PRODUCTOS", image: "plateu5.png", active: false },
      { key: "vales-1", label: "VALES", image: "plateu6.png", active: false },
      { key: "vales-2", label: "VALES", image: "plateu6.png", active: false },
      { key: "ofertas", label: "OFERTAS", image: "plateu7.png", active: true },
    ],
  },
  "State=Paquetes, Telco=Yes, Scrolling=No": {
    penId: "6985:152026",
    width: 340,
    height: 125,
    scrolling: false,
    home: false,
    items: [
      { key: "paquetes", label: "PAQUETES", image: "plateu8.png", active: true },
      { key: "internet", label: "INTERNET", image: "plateu9.png", active: false },
      { key: "recargas", label: "RECARGAS", image: "plateu10.png", active: false },
      { key: "antenita", label: "ANTENITA", image: "plateu11.png", active: false },
    ],
  },
  "State=Internet, Telco=Yes, Scrolling=No": {
    penId: "6985:152223",
    width: 340,
    height: 125,
    scrolling: false,
    home: false,
    items: [
      { key: "paquetes", label: "PAQUETES", image: "plateu8.png", active: false },
      { key: "internet", label: "INTERNET", image: "plateu9.png", active: true },
      { key: "recargas", label: "RECARGAS", image: "plateu10.png", active: false },
      { key: "antenita", label: "ANTENITA", image: "plateu11.png", active: false },
    ],
  },
  "State=Recargas, Telco=Yes, Scrolling=No": {
    penId: "6989:110025",
    width: 340,
    height: 125,
    scrolling: false,
    home: false,
    items: [
      { key: "paquetes", label: "PAQUETES", image: "plateu8.png", active: false },
      { key: "internet", label: "INTERNET", image: "plateu9.png", active: false },
      { key: "recargas", label: "RECARGAS", image: "plateu10.png", active: true },
      { key: "antenita", label: "ANTENITA", image: "plateu11.png", active: false },
    ],
  },
  "State=Paquetes, Telco=Yes, Scrolling=Yes": {
    penId: "6985:152321",
    width: 340,
    height: 100,
    scrolling: true,
    home: false,
    items: [
      { key: "comida-rapida", label: "COMIDA RÁPIDA", image: "plateu5.png", active: true },
      { key: "pasteleria", label: "PASTELERIA", image: "plateu12.png", active: false },
      { key: "restaurantes", label: "RESTAURANTES", image: "plateu13.png", active: false },
      { key: "cafeterias", label: "CAFETERIAS", image: "plateu14.png", active: false },
    ],
  },
  "State=Pasteleria, Telco=Yes, Scrolling=Yes": {
    penId: "6996:111868",
    width: 340,
    height: 100,
    scrolling: true,
    home: false,
    items: [
      { key: "comida-rapida", label: "COMIDA RÁPIDA", image: "plateu12.png", active: false },
      { key: "pasteleria", label: "PASTELERIA", image: "plateu5.png", active: true },
      { key: "restaurantes", label: "RESTAURANTES", image: "plateu13.png", active: false },
      { key: "cafeterias", label: "CAFETERIAS", image: "plateu14.png", active: false },
    ],
  },
  "State=Restaurantes, Telco=Yes, Scrolling=Yes": {
    penId: "7016:135942",
    width: 340,
    height: 100,
    scrolling: true,
    home: false,
    items: [
      { key: "comida-rapida", label: "COMIDA RÁPIDA", image: "plateu5.png", active: false },
      { key: "pasteleria", label: "PASTELERIA", image: "plateu12.png", active: false },
      { key: "restaurantes", label: "RESTAURANTES", image: "plateu13.png", active: true },
      { key: "cafeterias", label: "CAFETERIAS", image: "plateu14.png", active: false },
    ],
  },
  "State=Home, Telco=No, Scrolling=Yes": {
    penId: "7331:50399",
    width: 360,
    height: 80,
    scrolling: true,
    home: true,
    items: [
      { key: "moda", label: "MODA", image: "plateu4.webp", active: true },
      { key: "tecnologia", label: "TECNOLOGÍA", image: "plateu1.webp", active: false },
      { key: "lentes", label: "LENTES", image: "plateu3.webp", active: false },
      { key: "online", label: "ONLINE", image: "plateu2.webp", active: false },
    ],
  },
};

function renderPlateuItem(item, fixedWidth) {
  return `
    <div class="plateu-item ${fixedWidth ? "plateu-item-fixed" : ""}">
      <div class="plateu-icon-wrap">
        <img class="plateu-icon" src="${item.image}" alt="${item.label}">
      </div>
      ${
        item.active
          ? `<span class="plateu-chip">${item.label}</span>`
          : `<span class="plateu-label">${item.label}</span>`
      }
    </div>
  `;
}

function buildPlateu({ property1 }) {
  const variantKey = VARIANT_OPTIONS.includes(property1) ? property1 : VARIANT_OPTIONS[0];
  const variant = PLATEU_VARIANTS[variantKey];
  const cardClass = [
    "plateu-molecule",
    variant.scrolling ? "is-scrolling" : "is-static",
    variant.home ? "is-home" : "is-default",
  ].join(" ");

  return `
    <section
      class="${cardClass}"
      style="width:${variant.width}px;height:${variant.height}px"
      aria-label="Plateu ${variantKey}"
      data-pen-id="${variant.penId}"
    >
      <div class="plateu-track ${variant.scrolling ? "is-scrolling" : "is-static"}">
        ${variant.items.map((item) => renderPlateuItem(item, variant.scrolling)).join("")}
      </div>
    </section>
  `;
}

function renderPlateuStory(args, showRecommendation = false) {
  const variantKey = VARIANT_OPTIONS.includes(args.property1) ? args.property1 : VARIANT_OPTIONS[0];
  const penId = PLATEU_VARIANTS[variantKey].penId;
  return `
    <div class="mars-story">
      <div class="mars-label">Plateu · ${variantKey} · ID .pen: ${penId}</div>
      ${
        showRecommendation
          ? `<div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
              Recomendado: labels de categoría de máximo 13 caracteres (base más larga: "COMIDA RÁPIDA").
            </div>`
          : ""
      }
      <div class="mars-mobile plateu-mobile-shell">
        ${buildPlateu({ property1: variantKey })}
      </div>
    </div>
  `;
}

export default {
  title: "Molecules/Plateu",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Molecula **Plateu** con variantes basadas en Figma (`6944:57179`). " +
          "Incluye estados Telco/No Telco con y sin scrolling, respetando tamaños (340x125, 340x100 y 360x80), " +
          "sombras y estilos del chip activo. En la variante `State=Home, Telco=No, Scrolling=Yes` la separacion horizontal entre items es de `8px`.",
      },
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    property1: VARIANT_OPTIONS[0],
  },
  argTypes: {
    property1: {
      name: "Property 1",
      control: { type: "select" },
      options: VARIANT_OPTIONS,
      description: "Variante exacta del set Plateu en Figma.",
    },
  },
  render: (args) => renderPlateuStory(args, true),
};

export const VariantMatrix = {
  name: "Variant Matrix",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Referencia visual de todas las variantes de Plateu definidas en Figma.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="plateu-grid">
        ${VARIANT_OPTIONS.map(
          (property1) => `
            <article class="plateu-story-card">
              <div class="mars-label">${property1}</div>
              ${buildPlateu({ property1 })}
            </article>
          `
        ).join("")}
      </div>
    </div>
  `,
};
