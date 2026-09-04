/* ─────────────────────────────────────────────────────────
   Molecules / History Card
   7 variantes de historial: Pago de servicios · OKY Cash ·
   Recargas de saldo · Yayo Aprobado · Yayo Rechazado ·
   Giftcards archivadas · OKY Vales
───────────────────────────────────────────────────────── */

import {
  findHistoryCard,
  HISTORY_CARD_PATHS,
  HISTORY_CARD_VARIANTS,
  renderHistoryCard,
  resolveHistoryCard,
} from "./_shared/historyCards";

export default {
  title: "Molecules/History Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**History Card** es la molécula de fila de historial. Card blanca de `328px`, borde `--border-main`, " +
          "radio `20px` y shadow `card-shadow`, con el **ícono Font Awesome a la izquierda** dentro del avatar " +
          "circular de `41px`. " +
          "Tiene dos anatomías: **row** (avatar + fecha/monto + fila meta) para Pago de servicios, OKY Cash, " +
          "Recargas y los dos estados de Yayo; y **order** (header con iniciales + divider + lista de ítems) " +
          "para Giftcards archivadas y OKY Vales. " +
          "Tipografía Lato en todas las variantes, alineada a los tokens `Summary Total` (Bold 14/1.43/0.15) y " +
          "`Summary Text` (Regular 14/1.75/0.15) del DS. " +
          "Colores 100% por token: `--primary-base` (fecha, monto, producto), `--text-secondary` (marca, orden, " +
          "monto local), `--text-primary`, `--border-main`, `--white`, `--divider`, `--disable-main` (avatar " +
          "del estado rechazado) y los tokens de soporte en el chip de estado: `--success-bg` / `--success-text` / " +
          "`--success-main` y `--error-bg` / `--error-text` / `--error-main`. " +
          "Todos los logos son assets que ya existían en `/images` (`claro.webp`, `tigo.webp`, `mcdonalds.webp`, " +
          "`target.webp`, `plp-cajita-feliz.webp`).",
      },
    },
  },
  argTypes: {
    variantPath: {
      control: "select",
      options: HISTORY_CARD_PATHS,
      description: "Selecciona la variante base del componente.",
    },
    date: {
      control: "text",
      description: "Fecha del movimiento. Base Figma: `24 / AGO / 2026`.",
    },
    amount: {
      control: "text",
      description: "Monto principal. Acepta signo (`+ $4.07`) o negativo (`-Q120.00`).",
    },
    chipLabel: {
      control: "text",
      description: "Copy del chip de estado. Solo aplica en las variantes que tienen chip.",
    },
    showMeta: {
      control: "boolean",
      description: "Muestra el ID de Figma debajo del playground.",
    },
  },
};

export const DocsPlayground = {
  name: "Docs Playground",
  args: {
    variantPath: "Molecule/History Card/Service Payment",
    date: "",
    amount: "",
    chipLabel: "",
    showMeta: true,
  },
  render: (args) => {
    const card = resolveHistoryCard(args);
    const base = findHistoryCard(args.variantPath);

    return `
      <div class="mars-story">
        <div class="mars-label">Variant: ${card.path}</div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          ${base.recommendation}
        </div>
        <div class="mars-label" style="margin-bottom:10px;color:var(--text-secondary)">
          Layout: ${card.layout} · Width: 328px · Border: --border-main · Ícono FA: ${
            card.icon ? `${card.icon.weight} ${card.icon.glyph}` : "iniciales"
          }
        </div>
        ${args.showMeta ? `<div class="mars-label">ID Figma: ${card.id}</div>` : ""}
        ${renderHistoryCard(card)}
      </div>
    `;
  },
};

export const Variants = {
  name: "Variants",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Las 7 variantes de historial. Las dos últimas usan la anatomía `order` con lista de ítems.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div style="display:flex;flex-direction:column;gap:20px">
        ${HISTORY_CARD_VARIANTS.map(
          (card) => `
          <div>
            <div class="mars-label" style="margin-bottom:8px">${card.path} · ${card.id}</div>
            ${renderHistoryCard(card)}
          </div>
        `,
        ).join("")}
      </div>
    </div>
  `,
};

export const StatusChips = {
  name: "Status Chips",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "El chip de estado toma su color de los tokens de soporte: `is-success` usa " +
          "`--success-bg` / `--success-text` / `--success-main`, e `is-error` usa " +
          "`--error-bg` / `--error-text` / `--error-main`. El ícono siempre es Font Awesome Solid.",
      },
    },
  },
  render: () => `
    <div class="mars-story">
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center">
        <span class="history-card-chip is-success">
          <span class="history-card-chip-icon"><i class="fa-solid fa-circle-check"></i></span>
          Acreditado
        </span>
        <span class="history-card-chip is-success">
          <span class="history-card-chip-icon"><i class="fa-solid fa-circle-check"></i></span>
          Aprobado
        </span>
        <span class="history-card-chip is-error">
          <span class="history-card-chip-icon"><i class="fa-solid fa-circle-xmark"></i></span>
          Rechazada
        </span>
      </div>
    </div>
  `,
};
