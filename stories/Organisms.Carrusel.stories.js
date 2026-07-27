import {
  CARRUSEL_DOT_OPTIONS,
  renderCarruselOrganism,
  renderCarruselCardsOrganism,
  initCarruselCardsInfinite,
} from "./Organisms.Carrusel.template.js";

export default {
  title: "Organisms/Carrusel",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo **Carrusel** (Figma `6449:41089`) con dos variantes: **Default (Cards)** — nueva variante " +
          "que reutiliza las Middle Cards (`Molecules/Middle Card`) y las flechas rectangulares ya construidas " +
          "para `Organisms/Producto Header` y `Pages/Checkout`, en modo **loop infinito** — y **Banners** — el " +
          "carrusel original de banners de imagen, con viewport mobile de 360px, 2 banners visibles (segunda " +
          "card parcial) y paginación de 5 puntos.\n\n" +
          "### Justificación técnica · Loop infinito\n\n" +
          "La secuencia de cards únicas se triplica en el track (3 copias seguidas): las copias de los extremos " +
          "son puramente decorativas (`aria-hidden`) y actúan como buffer visual, mientras que la copia del " +
          "medio contiene la card real activa. De este modo SIEMPRE hay una card real a ambos lados del " +
          "carrusel, sin importar cuál esté activa, y las flechas de navegación nunca necesitan ocultarse en " +
          "los extremos.\n\n" +
          "Cuando el scroll-snap termina de asentar (debounce de 120ms tras el último evento de scroll), si la " +
          "card activa quedó en una de las copias de los extremos, el carrusel se \"teletransporta\" sin " +
          "animación a la posición equivalente en la copia del medio — visualmente idéntico, pero deja margen " +
          "de sobra para seguir navegando en cualquier dirección de forma indefinida, sin necesidad de clonar " +
          "nodos en tiempo real ni reconstruir el DOM en cada paso.",
      },
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    activeDot: 1,
  },
  argTypes: {
    activeDot: {
      name: "Active Dot",
      control: { type: "select" },
      options: CARRUSEL_DOT_OPTIONS,
      description: "Indice visual del punto activo en la paginacion.",
    },
  },
  render: ({ activeDot }) => `
    <div class="mars-story">
      <div class="mars-label">Carrusel · ID .pen: 6449:41089</div>
      <div class="mars-mobile">${renderCarruselOrganism({ activeDot })}</div>
    </div>
  `,
};

// Carrusel de banners de imagen — variante original (Figma 6449:41089).
// Se mantiene disponible bajo el nombre "Banners"; la variante "Default"
// del organismo ahora es el carrusel de Cards (ver abajo).
export const Banners = {
  name: "Banners",
  parameters: { controls: { disable: true } },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Carrusel / Banners · ID .pen: 6449:41089</div>
      <div class="mars-mobile">${renderCarruselOrganism({ activeDot: 1 })}</div>
    </div>
  `,
};

// Carrusel de Cards — nueva variante por defecto del organismo:
// reutiliza Middle Cards + flechas rectangulares (mismas de Producto
// Header / Checkout) en modo loop infinito. Ver justificación técnica
// completa en el docs.description del default export de este archivo.
export const Default = {
  name: "Default",
  parameters: { controls: { disable: true } },
  render: () => {
    const root = document.createElement("div");
    root.className = "mars-story";
    root.innerHTML = `
      <div class="mars-label">Carrusel / Default (Cards · loop infinito)</div>
      <div class="mars-label" style="margin-bottom:12px;color:var(--text-secondary)">
        Misma familia de componente que "Banners", pero con Middle Cards en vez de banners de imagen: scroll-snap
        real, flechas rectangulares reutilizadas de Producto Header / Checkout, y loop infinito — siempre hay una
        card real a ambos lados, sin importar cuál esté activa.
      </div>
      <div class="mars-mobile">${renderCarruselCardsOrganism()}</div>
    `;
    initCarruselCardsInfinite(root);
    return root;
  },
};
