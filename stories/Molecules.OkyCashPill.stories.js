/* ─────────────────────────────────────────────────────────
   Molecules / OKY Cash Pill
   MARS: OKY Cash / Pastilla (8367:206774)
   Variantes: Dock (flotante) · Header (poscompra, disponible)
───────────────────────────────────────────────────────── */

import { renderCashPill } from "./_shared/okyCashParts";

export default {
  title: "Molecules/OKY Cash Pill",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**OKY Cash Pill** es la pastilla de saldo. **Dock**: flotante sobre la navbar en homes y Mis compras; " +
          "dice `+$X en OKY Cash` justo después de ganar, `$X en OKY Cash` con saldo y `OKY Cash, explora` sin saldo. " +
          "**Header**: en la cabecera de la poscompra, con la moneda y el saldo **disponible** (no lo ganado: la " +
          "cifra en bold y «disponible» en regular). MARS: `OKY Cash / Pastilla` · Prototipo: " +
          "`.oky-flow-cashdock` / `.oky-flow-purchase-badge.is-cash`.",
      },
    },
  },
  argTypes: {
    size: { control: "inline-radio", options: ["Dock", "Header"] },
    text: { control: "text", description: "Texto de la variante Dock." },
    balance: { control: { type: "number", min: 0, step: 0.01 }, description: "Saldo disponible de la variante Header." },
  },
  args: { size: "Dock", text: "$5.00 en OKY Cash", balance: 5.25 },
};

export const Playground = { render: (args) => renderCashPill(args) };

export const Variants = {
  render: () => `
    <div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start">
      ${renderCashPill({ size: "Dock", text: "+$0.25 en OKY Cash" })}
      ${renderCashPill({ size: "Dock", text: "$5.00 en OKY Cash" })}
      ${renderCashPill({ size: "Dock", text: "OKY Cash, explora" })}
      ${renderCashPill({ size: "Header", balance: 5.25 })}
    </div>`,
};
