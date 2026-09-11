import {
  DISCOVERY_CONFIG,
  SIDE_OPTIONS,
  STATE_OPTIONS,
  renderDiscoveryHeader,
} from "./_shared/discoveryHeader";

function renderVariantCard(side, state) {
  const config = DISCOVERY_CONFIG[side][state];
  return `
    <article class="discovery-header-card">
      <div class="mars-label">Discovery Header · ${side} · ${state} · ID .pen: ${config.penId}</div>
      <div class="mars-mobile">
        ${renderDiscoveryHeader({ side, state })}
      </div>
    </article>
  `;
}

export default {
  title: "Organisms/Discovery Header",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo **Discovery Header** compuesto unicamente con moleculas existentes: " +
          "`Status Bar`, `Header`, `Folder` (expanded/collapsed), `Input/Search (Empty)` y " +
          "`Plateu · State=Home, Telco=No, Scrolling=Yes (7331:50399)`. " +
          "Incluye 3 states por lado (`Left` y `Right`) segun el orden del frame de Figma `7333:70239`. " +
          "El Plateu Home usa separacion horizontal de `8px` entre items y chip activo con fill blanco, border accent de `1px` y texto `Primary Main`. " +
          "En Docs Playground puedes alternar `Show New Item Chip` para la vista `Left · State 1`.",
      },
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    side: "Left",
    state: "State 1",
    showNewItemChip: true,
  },
  argTypes: {
    side: {
      name: "Side",
      control: { type: "select" },
      options: SIDE_OPTIONS,
      description: "Lado de navegacion del folder (Left / Right).",
    },
    state: {
      name: "State",
      control: { type: "select" },
      options: STATE_OPTIONS,
      description: "State visual dentro del lado seleccionado.",
    },
    showNewItemChip: {
      name: "Show New Item Chip",
      control: "boolean",
      description: "Muestra el chip New item solo en Folder Left expandido (State 1).",
    },
  },
  render: ({ side, state, showNewItemChip }) => {
    const safeSide = SIDE_OPTIONS.includes(side) ? side : "Left";
    const safeState = STATE_OPTIONS.includes(state) ? state : "State 1";
    const penId = DISCOVERY_CONFIG[safeSide][safeState].penId;

    return `
      <div class="mars-story">
        <div class="mars-label">Discovery Header · ${safeSide} · ${safeState} · ID .pen: ${penId}</div>
        <div class="mars-mobile">
          ${renderDiscoveryHeader({ side: safeSide, state: safeState, showNewItemChip })}
        </div>
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
        story: "Referencia visual de los 6 states del organismo (3 LEFT + 3 RIGHT).",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="discovery-header-grid">
        ${SIDE_OPTIONS.map((side) => STATE_OPTIONS.map((state) => renderVariantCard(side, state)).join("")).join("")}
      </div>
    </div>
  `,
};
