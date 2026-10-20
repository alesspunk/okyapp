/* ─────────────────────────────────────────────────────────
   Molecules / Folder
   MARS 7296:48470 · Left, Right, Collapsed Left, Collapsed Right.
   Usa el mismo renderFolder que Discovery Header y el prototipo
   (banderas flagpack del átomo Flag), así que no hay una copia aparte.
───────────────────────────────────────────────────────── */

import { renderFolder } from "./_shared/discoveryHeader";

const VARIANT_OPTIONS = ["Left", "Collapsed Left", "Right", "Collapsed Right"];
const BASE_VARIANT_OPTIONS = VARIANT_OPTIONS;
const DOCS_VARIANT_OPTIONS = VARIANT_OPTIONS;

const VARIANT_IDS = {
  Left: "7296:48469",
  Right: "7296:48471",
  "Collapsed Left": "7296:48472",
  "Collapsed Right": "7296:48473",
};

const normalizeCode = (value, fallback) => (String(value || "").trim().toUpperCase().slice(0, 3) || fallback);

function buildFolder({ property1, leftCode, rightCode, showChevrons = true, showNewItemChip = true }) {
  return renderFolder(property1, {
    showChevrons,
    showNewItemChip,
    markets: { left: { code: normalizeCode(leftCode, "USA") }, right: { code: normalizeCode(rightCode, "GUA") } },
  });
}

function renderFolderStory(args, showRecommendation = false) {
  const variant = DOCS_VARIANT_OPTIONS.includes(args.property1) ? args.property1 : "Left";
  return `
    <div class="mars-story mars-story-folder">
      <div class="mars-label">Folder · Property 1=${variant} · ID .pen: ${VARIANT_IDS[variant]}</div>
      ${
        showRecommendation
          ? `<div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
              Recomendado: códigos de país de máximo 3 caracteres (base: USA / GUA).
            </div>`
          : ""
      }
      ${buildFolder(args)}
    </div>
  `;
}

export default {
  title: "Molecules/Folder",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Molécula **Folder**: las pestañas de marketplace (USA / GUA) de las homes, en `Left`, `Right` y sus versiones `Collapsed` al hacer scroll. La activa va en blanco con la bandera (flagpack 4:3), el código, la doble flecha y la línea morada debajo; la inactiva queda atrás en gris. Es la misma pieza que usan Discovery Header y el prototipo.",
      },
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    property1: "Left",
    leftCode: "USA",
    rightCode: "GUA",
    showChevrons: true,
  },
  argTypes: {
    property1: {
      name: "Property 1",
      control: { type: "select" },
      options: DOCS_VARIANT_OPTIONS,
      description: "Variante activa definida en Figma.",
    },
    leftCode: {
      control: "text",
      description: "Codigo del pais izquierdo.",
    },
    rightCode: {
      control: "text",
      description: "Codigo del pais derecho.",
    },
    showChevrons: {
      control: "boolean",
      description: "Muestra chevrons en el pais seleccionado.",
    },
  },
  render: (args) => renderFolderStory(args, true),
};

export const VariantMatrix = {
  name: "Variant Matrix",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Las 4 variantes de `Property 1` de Figma.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div class="folder-grid">
        ${BASE_VARIANT_OPTIONS.map(
          (property1) => `
            <article class="folder-story-card">
              <div class="mars-label">Property 1=${property1} · ID .pen: ${VARIANT_IDS[property1]}</div>
              ${buildFolder({
                property1,
                leftCode: "USA",
                rightCode: "GUA",
                showChevrons: true,
              })}
            </article>
          `
        ).join("")}
      </div>
    </div>
  `,
};

export const Left = {
  name: "Property 1=Left",
  parameters: { controls: { disable: true } },
  render: () =>
    renderFolderStory({
      property1: "Left",
      leftCode: "USA",
      rightCode: "GUA",
      showChevrons: true,
    }),
};

export const Right = {
  name: "Property 1=Right",
  parameters: { controls: { disable: true } },
  render: () =>
    renderFolderStory({
      property1: "Right",
      leftCode: "USA",
      rightCode: "GUA",
      showChevrons: true,
    }),
};
