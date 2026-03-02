const TYPE_OPTIONS = ["Por tiempo", "Finito", "Normal", "Por temporada", "OKY"];

const TYPE_META = {
  "Por tiempo": {
    icon: "fa-clock",
    text: "Termina en 20:43:32",
    className: "super-ribbon-type-por-tiempo",
  },
  Finito: {
    icon: "fa-fire-flame-simple",
    text: "Últimas 20 unidades",
    className: "super-ribbon-type-finito",
  },
  Normal: {
    icon: "fa-tags",
    text: "Descuentos de temporada",
    className: "super-ribbon-type-normal",
  },
  "Por temporada": {
    icon: "fa-sun",
    text: "Ofertas del mes de Abril",
    className: "super-ribbon-type-por-temporada",
  },
  OKY: {
    icon: "fa-heart",
    text: "Para la persona que quieres",
    className: "super-ribbon-type-oky",
  },
};

function buildRibbon({ type, text, icon }) {
  const meta = TYPE_META[type];
  return `
    <div class="super-ribbon ${meta.className}">
      <span class="super-ribbon-icon"><i class="fa-solid ${icon || meta.icon}"></i></span>
      <span class="super-ribbon-text">${text || meta.text}</span>
    </div>`;
}

export default {
  title: "Atoms/Super Ribbon",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Átomo **Super Ribbon** para tácticas de marketing en MARS. " +
          "Convención de variante en Figma: `Property 1` con valores **Por tiempo**, **Finito**, **Normal**, **Por temporada** y **OKY**. " +
          "Mantiene layout fijo (32px alto) y solo cambia color, icono y copy.",
      },
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    type: "Por tiempo",
    text: "",
    icon: "",
  },
  argTypes: {
    type: {
      name: "Property 1",
      control: { type: "select" },
      options: TYPE_OPTIONS,
      description: "Variante de marketing definida en Figma.",
    },
    text: {
      control: "text",
      description: "Override opcional del texto; vacío usa el texto por defecto del type.",
    },
    icon: {
      control: "text",
      description: "Override opcional del ícono FA (ej. `fa-clock`); vacío usa ícono por defecto.",
    },
  },
  render: (args) => `
    <div class="mars-story">
      <div class="mars-label">Super Ribbon · Property 1=${args.type} · ID set .pen: 7295:52143</div>
      ${buildRibbon(args)}
    </div>`,
};

export const TypeMatrix = {
  name: "Type Matrix",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Referencia visual de todas las variantes de `Super Ribbon` con copy e ícono por defecto.",
      },
    },
  },
  render: () => `
    <div class="mars-story" style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      ${TYPE_OPTIONS.map((type) => buildRibbon({ type })).join("")}
    </div>`,
};
