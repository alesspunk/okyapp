export const PLATEU_VARIANT_OPTIONS = [
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

export const PLATEU_VARIANTS = {
  "State=Productos, Telco=No, Scrolling=No": {
    penId: "6944:57168",
    width: 340,
    height: 125,
    scrolling: false,
    home: false,
    items: [
      { key: "productos", label: "Productos", image: "plateu5.png", active: true },
      { key: "vales", label: "Vales", image: "plateu6.png", active: false },
      { key: "ofertas", label: "Ofertas", image: "plateu7.png", active: false },
    ],
  },
  "State=Vales, Telco=No, Scrolling=No": {
    penId: "6944:57208",
    width: 340,
    height: 125,
    scrolling: false,
    home: false,
    items: [
      { key: "productos", label: "Productos", image: "plateu5.png", active: false },
      { key: "vales", label: "Vales", image: "plateu6.png", active: true },
      { key: "ofertas", label: "Ofertas", image: "plateu7.png", active: false },
    ],
  },
  "State=Ofertas, Telco=No, Scrolling=No": {
    penId: "6944:57307",
    width: 340,
    height: 125,
    scrolling: false,
    home: false,
    items: [
      { key: "productos", label: "Productos", image: "plateu5.png", active: false },
      { key: "vales-1", label: "Vales", image: "plateu6.png", active: false },
      { key: "vales-2", label: "Vales", image: "plateu6.png", active: false },
      { key: "ofertas", label: "Ofertas", image: "plateu7.png", active: true },
    ],
  },
  "State=Paquetes, Telco=Yes, Scrolling=No": {
    penId: "6985:152026",
    width: 340,
    height: 125,
    scrolling: false,
    home: false,
    items: [
      { key: "paquetes", label: "Paquetes", image: "plateu8.png", active: true },
      { key: "internet", label: "Internet", image: "plateu9.png", active: false },
      { key: "recargas", label: "Recargas", image: "plateu10.png", active: false },
      { key: "antenita", label: "Antenita", image: "plateu11.png", active: false },
    ],
  },
  "State=Internet, Telco=Yes, Scrolling=No": {
    penId: "6985:152223",
    width: 340,
    height: 125,
    scrolling: false,
    home: false,
    items: [
      { key: "paquetes", label: "Paquetes", image: "plateu8.png", active: false },
      { key: "internet", label: "Internet", image: "plateu9.png", active: true },
      { key: "recargas", label: "Recargas", image: "plateu10.png", active: false },
      { key: "antenita", label: "Antenita", image: "plateu11.png", active: false },
    ],
  },
  "State=Recargas, Telco=Yes, Scrolling=No": {
    penId: "6989:110025",
    width: 340,
    height: 125,
    scrolling: false,
    home: false,
    items: [
      { key: "paquetes", label: "Paquetes", image: "plateu8.png", active: false },
      { key: "internet", label: "Internet", image: "plateu9.png", active: false },
      { key: "recargas", label: "Recargas", image: "plateu10.png", active: true },
      { key: "antenita", label: "Antenita", image: "plateu11.png", active: false },
    ],
  },
  "State=Paquetes, Telco=Yes, Scrolling=Yes": {
    penId: "6985:152321",
    width: 340,
    height: 100,
    scrolling: true,
    home: false,
    items: [
      { key: "comida-rapida", label: "Comida rápida", image: "plateu5.png", active: true },
      { key: "pasteleria", label: "Pastelería", image: "plateu12.png", active: false },
      { key: "restaurantes", label: "Restaurantes", image: "plateu13.png", active: false },
      { key: "cafeterias", label: "Cafeterías", image: "plateu14.png", active: false },
    ],
  },
  "State=Pasteleria, Telco=Yes, Scrolling=Yes": {
    penId: "6996:111868",
    width: 340,
    height: 100,
    scrolling: true,
    home: false,
    items: [
      { key: "comida-rapida", label: "Comida rápida", image: "plateu12.png", active: false },
      { key: "pasteleria", label: "Pastelería", image: "plateu5.png", active: true },
      { key: "restaurantes", label: "Restaurantes", image: "plateu13.png", active: false },
      { key: "cafeterias", label: "Cafeterías", image: "plateu14.png", active: false },
    ],
  },
  "State=Restaurantes, Telco=Yes, Scrolling=Yes": {
    penId: "7016:135942",
    width: 340,
    height: 100,
    scrolling: true,
    home: false,
    items: [
      { key: "comida-rapida", label: "Comida rápida", image: "plateu5.png", active: false },
      { key: "pasteleria", label: "Pastelería", image: "plateu12.png", active: false },
      { key: "restaurantes", label: "Restaurantes", image: "plateu13.png", active: true },
      { key: "cafeterias", label: "Cafeterías", image: "plateu14.png", active: false },
    ],
  },
  "State=Home, Telco=No, Scrolling=Yes": {
    penId: "7331:50399",
    width: 360,
    height: 80,
    scrolling: true,
    home: true,
    items: [
      { key: "moda", label: "Moda", image: "plateu4.webp", active: true },
      { key: "tecnologia", label: "Tecnología", image: "plateu1.webp", active: false },
      { key: "lentes", label: "Lentes", image: "plateu3.webp", active: false },
      { key: "online", label: "Online", image: "plateu2.webp", active: false },
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

export function buildPlateu({ property1 }) {
  const variantKey = PLATEU_VARIANT_OPTIONS.includes(property1) ? property1 : PLATEU_VARIANT_OPTIONS[0];
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
