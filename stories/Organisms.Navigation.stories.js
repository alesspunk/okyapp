const navItems = [
  { key: "inicio", label: "Inicio", icon: "home" },
  { key: "canje", label: "Canje", icon: "map" },
  { key: "ofertas", label: "Ofertas", icon: "fire" },
  { key: "ayuda", label: "Ayuda", icon: "messages" },
  { key: "menu", label: "Menú", icon: "bars" },
];

const VARIANT_OPTIONS = ["Con label", "Sin label"];

export default {
  title: "Molecules/Navigation",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Molécula **Navigation** con dos variantes para Playground: `Con label` y `Sin label` (icon-only). " +
          "La variante sin label mantiene altura fija de `56px` y usa iconos `Inicio, Canje, Ofertas, Ayuda, Menú`. " +
          "Todos los iconos usan tamaño `medium` (`icon-medium`) y peso `fa-light`.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: VARIANT_OPTIONS,
    },
    activeTab: {
      control: "inline-radio",
      options: navItems.map((i) => i.key),
    },
  },
};

export const Playground = {
  name: "Bottom Nav Playground",
  args: { variant: "Con label", activeTab: "ofertas" },
  render: ({ variant, activeTab }) => {
    const isNoLabel = variant === "Sin label";
    const items = navItems
      .map(({ key, label, icon }) => {
        const isActive = key === activeTab;
        return `
          <div class="nav-item ${isActive ? "active" : ""}">
            <i class="fa-light fa-${icon} icon-medium"></i>
            ${isNoLabel ? "" : `<span class="nav-label">${label}</span>`}
          </div>`;
      })
      .join("");
    return `
      <div class="mars-story">
        <div class="mars-label">Molecule: Navigation · Variant: ${variant} · Height: 56px</div>
        <div class="mars-mobile mars-mobile-nav-shell">
          <div class="bottom-nav ${isNoLabel ? "is-no-label" : ""}">${items}</div>
        </div>
      </div>`;
  },
};

export const BottomNav = {
  render: () => `
    <div class="mars-mobile mars-mobile-nav-shell">
      <div class="bottom-nav">
        <div class="nav-item">
          <i class="fa-light fa-home icon-medium"></i>
          <span class="nav-label">Inicio</span>
        </div>
        <div class="nav-item">
          <i class="fa-light fa-map icon-medium"></i>
          <span class="nav-label">Canje</span>
        </div>
        <div class="nav-item active">
          <i class="fa-solid fa-fire icon-medium"></i>
          <span class="nav-label">Ofertas</span>
        </div>
        <div class="nav-item">
          <i class="fa-light fa-messages icon-medium"></i>
          <span class="nav-label">Ayuda</span>
        </div>
        <div class="nav-item">
          <i class="fa-light fa-bars icon-medium"></i>
          <span class="nav-label">Menú</span>
        </div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: "Referencia .pen: `MHKUc`. Regla de íconos: `fa-regular` por defecto, `fa-solid` solo activo.",
      },
    },
  },
};

export const BottomNavWithoutLabel = {
  name: "Bottom Nav / Sin Label",
  render: () => `
    <div class="mars-mobile mars-mobile-nav-shell">
      <div class="bottom-nav is-no-label">
        <div class="nav-item">
          <i class="fa-light fa-home icon-medium" aria-hidden="true"></i>
        </div>
        <div class="nav-item">
          <i class="fa-light fa-map icon-medium" aria-hidden="true"></i>
        </div>
        <div class="nav-item active">
          <i class="fa-solid fa-fire icon-medium" aria-hidden="true"></i>
        </div>
        <div class="nav-item">
          <i class="fa-light fa-messages icon-medium" aria-hidden="true"></i>
        </div>
        <div class="nav-item">
          <i class="fa-light fa-bars icon-medium" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          "Variante icon-only sin texto (`56px` de alto): Inicio (`fa-home`), Canje (`fa-map`), Ofertas (`fa-fire`), Ayuda (`fa-messages`) y Menú (`fa-bars`), con peso `fa-light` y tamaño `icon-medium`.",
      },
    },
  },
};
