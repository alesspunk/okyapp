const navItems = [
  { key: "inicio", label: "Inicio", icon: "house" },
  { key: "categorias", label: "Categorías", icon: "table-cells-large" },
  { key: "destacados", label: "Destacados", icon: "fire" },
  { key: "ordenes", label: "Órdenes", icon: "receipt" },
  { key: "perfil", label: "Perfil", icon: "circle-user" },
];

export default {
  title: "Molecules/Navigation",
  tags: ["autodocs"],
  argTypes: {
    activeTab: {
      control: "inline-radio",
      options: navItems.map((i) => i.key),
    },
  },
};

export const Playground = {
  name: "Bottom Nav Playground",
  args: { activeTab: "destacados" },
  render: ({ activeTab }) => {
    const items = navItems
      .map(({ key, label, icon }) => {
        const isActive = key === activeTab;
        const faStyle = isActive ? "fa-solid" : "fa-regular";
        return `
          <div class="nav-item ${isActive ? "active" : ""}">
            <i class="${faStyle} fa-${icon}"></i>
            <span class="nav-label">${label}</span>
          </div>`;
      })
      .join("");
    return `
      <div class="mars-story">
        <div class="mars-label">Organism: Bottom Nav · ID .pen: MHKUc</div>
        <div class="mars-mobile">
          <div class="bottom-nav">${items}</div>
        </div>
      </div>`;
  },
};

export const BottomNav = {
  render: () => `
    <div class="mars-mobile">
      <div class="bottom-nav">
        <div class="nav-item">
          <i class="fa-regular fa-house"></i>
          <span class="nav-label">Inicio</span>
        </div>
        <div class="nav-item">
          <i class="fa-regular fa-table-cells-large"></i>
          <span class="nav-label">Categorías</span>
        </div>
        <div class="nav-item active">
          <i class="fa-solid fa-fire"></i>
          <span class="nav-label">Destacados</span>
        </div>
        <div class="nav-item">
          <i class="fa-regular fa-receipt"></i>
          <span class="nav-label">Órdenes</span>
        </div>
        <div class="nav-item">
          <i class="fa-regular fa-circle-user"></i>
          <span class="nav-label">Perfil</span>
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
