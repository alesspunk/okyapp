import { OKY_COIN_FLIP } from "./_shared/okyCoinFlipAnimation";
import { htmlToElement, mountLottie } from "./_shared/okyCashParts";

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
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Recomendado: máximo 7 caracteres por label (base más larga: "Ofertas").
        </div>
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

/* ── OKY Cash · moneda del navbar (sprint 20/10) ──────────
   La navbar de la entrega: Home · Notificaciones · OKY Cash · Ayuda ·
   Menú. La moneda es siempre el Lottie de diseño: con OKY Cash nuevo
   gira en bucle; sin él queda quieta en el cuadro 0, la misma pose de
   perfil con la que arranca el giro. */
export const OkyCashCoin = {
  name: "OKY Cash · Moneda",
  argTypes: { spinning: { control: "boolean", description: "Con OKY Cash nuevo: gira en bucle." } },
  args: { spinning: true },
  render: ({ spinning }) => {
    const item = (label, icon, extra = "") => `
      <div class="nav-item ${extra}">
        <i class="fa-light fa-${icon}" style="font-size:20px" aria-hidden="true"></i>
        <span class="nav-label">${label}</span>
      </div>`;
    const el = htmlToElement(`
      <nav class="oky-flow-navbar" style="position:static;width:360px;height:56px">
        <div class="bottom-nav">
          ${item("Home", "house", "active")}
          ${item("Notificaciones", "bell", "is-dim")}
          <div class="nav-item">
            <span class="oky-flow-coin-3d is-lottie">
              <img class="oky-flow-coin" src="oky-cash-coin.png" alt="" />
              <span class="oky-flow-coin-flip" aria-hidden="true"></span>
            </span>
            <span class="nav-label">OKY Cash</span>
          </div>
          ${item("Ayuda", "messages", "is-dim")}
          ${item("Menú", "bars")}
        </div>
      </nav>`);
    const host = el.querySelector(".oky-flow-coin-flip");
    mountLottie(host, OKY_COIN_FLIP, { loop: true, play: spinning });
    host.parentElement.classList.add("is-ready");
    return el;
  },
};
