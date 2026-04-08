import { buildPlateu, PLATEU_VARIANTS, PLATEU_VARIANT_OPTIONS } from "./_shared/plateu";

function renderPlateuStory(args, showRecommendation = false) {
  const variantKey = PLATEU_VARIANT_OPTIONS.includes(args.property1) ? args.property1 : PLATEU_VARIANT_OPTIONS[0];
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
          "sombras y estilos del chip activo. El chip seleccionado usa fill blanco, border accent de `1px` y texto `Primary Main`. " +
          "En la variante `State=Home, Telco=No, Scrolling=Yes` la separacion horizontal entre items es de `8px`.",
      },
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    property1: PLATEU_VARIANT_OPTIONS[0],
  },
  argTypes: {
    property1: {
      name: "Property 1",
      control: { type: "select" },
      options: PLATEU_VARIANT_OPTIONS,
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
        ${PLATEU_VARIANT_OPTIONS.map(
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
