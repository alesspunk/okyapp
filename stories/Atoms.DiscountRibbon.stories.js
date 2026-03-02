const TYPE_OPTIONS = ["Normal", "Por tiempo", "Finito", "Por temporada", "OKY"];

function typeClass(type) {
  return `discount-ribbon-type-${type
    .toLowerCase()
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")}`;
}

function buildRibbon({ tipo, type, label, size }) {
  const typeToken = typeClass(type);

  if (tipo === "Wrap") {
    return `
      <div style="position:relative;width:170px;height:90px;border:1px dashed var(--divider);border-radius:8px;">
        <div class="discount-ribbon discount-ribbon-wrap ${size === "Small" ? "discount-ribbon-wrap-small" : ""} ${typeToken}">
          <span class="discount-ribbon-text token-price-percent">${label}</span>
        </div>
      </div>`;
  }

  return `
    <div class="discount-ribbon discount-ribbon-list ${typeToken}">
      <span class="discount-ribbon-text token-price-percent">${label}</span>
    </div>`;
}

export default {
  title: "Atoms/Discount Ribbon",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Átomo de descuento reutilizado en Gift Cards, PLP y carrito. " +
          "Convención Figma: **Tipo** (`List` | `Wrap`) y **Type** (`Normal`, `Por tiempo`, `Finito`, `Por temporada`, `OKY`). " +
          "`Wrap` usa ancho **75px** y `Small` (solo wrap) usa **50px**.",
      },
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    tipo: "List",
    type: "Normal",
    size: "Default",
    label: "25% OFF",
  },
  argTypes: {
    tipo: {
      name: "Tipo",
      control: { type: "inline-radio" },
      options: ["List", "Wrap"],
      description: "Estructura visual base del componente.",
    },
    type: {
      name: "Type",
      control: { type: "select" },
      options: TYPE_OPTIONS,
      description: "Táctica de marketing que define color de fondo y texto.",
    },
    size: {
      name: "Wrap Size",
      control: { type: "inline-radio" },
      options: ["Default", "Small"],
      if: { arg: "tipo", eq: "Wrap" },
      description: "Solo para Wrap: Default (75px) o Small (50px).",
    },
    label: {
      control: "text",
      description: "Texto del badge (ej. `25% OFF`).",
    },
  },
  render: (args) => `
    <div class="mars-story">
      <div class="mars-label">Discount Ribbon · Tipo=${args.tipo} · Type=${args.type}${args.tipo === "Wrap" ? ` · Size=${args.size}` : ""}</div>
      ${buildRibbon(args)}
    </div>`,
};

export const TypeMatrix = {
  name: "Type Matrix",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Referencia de colores por **Type** en ambos **Tipo** (`List` y `Wrap`), incluyendo `Wrap Small`.",
      },
    },
  },
  render: () => `
    <div class="mars-story" style="display:flex;flex-direction:column;gap:20px;">
      <div>
        <div class="mars-label" style="margin-bottom:8px;">Tipo = List</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start;">
          ${TYPE_OPTIONS.map((type) => `
            <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
              <div class="discount-ribbon discount-ribbon-list ${typeClass(type)}">
                <span class="discount-ribbon-text token-price-percent">25% OFF</span>
              </div>
              <span style="font-size:11px;color:var(--text-secondary)">${type}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div>
        <div class="mars-label" style="margin-bottom:8px;">Tipo = Wrap (75px)</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start;">
          ${TYPE_OPTIONS.map((type) => `
            <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
              <div style="position:relative;width:170px;height:90px;border:1px dashed var(--divider);border-radius:8px;">
                <div class="discount-ribbon discount-ribbon-wrap ${typeClass(type)}">
                  <span class="discount-ribbon-text token-price-percent">25% OFF</span>
                </div>
              </div>
              <span style="font-size:11px;color:var(--text-secondary)">${type}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div>
        <div class="mars-label" style="margin-bottom:8px;">Tipo = Wrap Small (50px)</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start;">
          ${TYPE_OPTIONS.map((type) => `
            <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
              <div style="position:relative;width:170px;height:90px;border:1px dashed var(--divider);border-radius:8px;">
                <div class="discount-ribbon discount-ribbon-wrap discount-ribbon-wrap-small ${typeClass(type)}">
                  <span class="discount-ribbon-text token-price-percent">-23%</span>
                </div>
              </div>
              <span style="font-size:11px;color:var(--text-secondary)">${type}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>`,
};
