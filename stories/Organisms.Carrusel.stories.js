import { CARRUSEL_DOT_OPTIONS, renderCarruselOrganism } from "./Organisms.Carrusel.template.js";

export default {
  title: "Organisms/Carrusel",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Organismo **Carrusel** (Figma `6449:41089`) con viewport mobile de 360px, " +
          "2 banners visibles en formato carrusel (segunda card parcial) y paginacion de 5 puntos.",
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

export const Default = {
  parameters: { controls: { disable: true } },
  render: () => `
    <div class="mars-story">
      <div class="mars-label">Carrusel / Default · ID .pen: 6449:41089</div>
      <div class="mars-mobile">${renderCarruselOrganism({ activeDot: 1 })}</div>
    </div>
  `,
};
