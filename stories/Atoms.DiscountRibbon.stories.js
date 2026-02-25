export default {
  title: "Atoms/Discount Ribbon",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Átomo de descuento reutilizado en Gift Cards, PLP y carrito. " +
          "Dos variantes: **Wrap** (overlay absoluto con muesca) y **List** (badge estático inline). " +
          "Ref. .pen: `Ta86S` (Wrap) · `twV32` (List).",
      },
    },
  },
};

/* ── Helper ──────────────────────────────────────────── */
function buildRibbon({ variant, label }) {
  if (variant === "Wrap") {
    return `
      <div style="position:relative;width:140px;height:68px;border:1px dashed var(--divider);border-radius:8px;">
        <div class="discount-ribbon discount-ribbon-wrap">
          <span class="discount-ribbon-text token-price-percent">${label}</span>
        </div>
      </div>`;
  }
  return `
    <div class="discount-ribbon discount-ribbon-list">
      <span class="discount-ribbon-text token-price-percent">${label}</span>
    </div>`;
}

/* ── Playground ──────────────────────────────────────── */
export const Playground = {
  args: {
    variant: "List",
    label: "10% OFF",
  },
  argTypes: {
    variant: {
      control: { type: "inline-radio" },
      options: ["Wrap", "List"],
      description: "**Wrap** — overlay absoluto con muesca top-right (uso: cards de producto). **List** — badge estático (uso: PLP, carrito).",
    },
    label: {
      control: "text",
      description: "Texto del descuento (ej. `10% OFF`, `93% OFF`).",
    },
  },
  render: (args) => `
    <div class="mars-story">
      <div class="mars-label">
        Discount Ribbon / ${args.variant} · ID .pen: ${args.variant === "Wrap" ? "Ta86S" : "twV32"}
      </div>
      ${buildRibbon(args)}
    </div>`,
};

/* ── BothVariants — referencia estática ─────────────── */
export const BothVariants = {
  name: "Both Variants",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Referencia visual de ambas variantes lado a lado. " +
          "**Wrap** se posiciona de forma absoluta sobre su contenedor (simula una card). " +
          "**List** es un elemento de bloque inline bajo el precio en listas y carrito.",
      },
    },
  },
  render: () => `
    <div class="mars-story" style="display:flex;gap:40px;align-items:center;flex-wrap:wrap;">

      <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
        <span style="font-size:11px;color:var(--text-secondary);font-family:Lato,sans-serif;">Wrap · Ta86S</span>
        <div style="position:relative;width:140px;height:68px;border:1px dashed var(--divider);border-radius:8px;">
          <div class="discount-ribbon discount-ribbon-wrap">
            <span class="discount-ribbon-text token-price-percent">10% OFF</span>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
        <span style="font-size:11px;color:var(--text-secondary);font-family:Lato,sans-serif;">List · twV32</span>
        <div class="discount-ribbon discount-ribbon-list">
          <span class="discount-ribbon-text token-price-percent">10% OFF</span>
        </div>
      </div>

    </div>`,
};
