/* ─────────────────────────────────────────────────────────
   Molecules / OKY Cash Pill
   MARS: OKY Cash / Pastilla (8367:206774)
   Variantes: Dock (flotante) · Header (poscompra, disponible) ·
   Recibo (Header en blanco) · Icono (botón redondo del recibo)
───────────────────────────────────────────────────────── */

import { OKY_CASH_ESTILOS, renderCashPill } from "./_shared/okyCashParts";

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
    size: { control: "inline-radio", options: ["Dock", "Header", "Icono"] },
    tipo: { control: "inline-radio", options: ["OKY Cash", "Recibo"], description: "Recibo: blanca con borde, abre el recibo." },
    text: { control: "text", description: "Texto de la variante Dock." },
    balance: { control: { type: "number", min: 0, step: 0.01 }, description: "Saldo disponible de la variante Header." },
    estilo: { control: "inline-radio", options: OKY_CASH_ESTILOS, description: "Estilo de OKY Cash (exploración 20/10, MARS · Estilo). Aqua es como se ve hoy; el aqua claro queda para descuento.", if: { arg: "tipo", eq: "OKY Cash" } },
  },
  args: { size: "Dock", tipo: "OKY Cash", text: "$5.00 en OKY Cash", balance: 5.25, estilo: "Aqua" },
};

export const Playground = { render: (args) => renderCashPill(args) };

export const Variants = {
  render: () => `
    <div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start">
      ${renderCashPill({ size: "Dock", text: "+$0.25 en OKY Cash" })}
      ${renderCashPill({ size: "Dock", text: "$5.00 en OKY Cash" })}
      ${renderCashPill({ size: "Dock", text: "OKY Cash, explora" })}
      ${renderCashPill({ size: "Header", balance: 5.25 })}
      ${renderCashPill({ size: "Header", tipo: "Recibo", text: "+$0.25 en OKY Cash" })}
      ${renderCashPill({ size: "Icono", tipo: "Recibo" })}
    </div>`,
};

/* Los cinco estilos de OKY Cash en los cuatro estados (MARS: tabla
   «Exploración · Pastilla OKY Cash»). */
export const Estilos = {
  name: "OKY Cash · Estilos",
  parameters: { controls: { disable: true } },
  render: () => `
    <div style="display:grid;grid-template-columns:110px repeat(4,auto);gap:16px 20px;align-items:center;justify-content:start">
      ${OKY_CASH_ESTILOS.map(
        (estilo) => `
          <div class="mars-label">${estilo}</div>
          ${renderCashPill({ size: "Dock", text: "+$0.25 en OKY Cash", estilo })}
          ${renderCashPill({ size: "Dock", text: "OKY Cash, explora", estilo })}
          ${renderCashPill({ size: "Header", balance: 5.25, estilo })}
          ${renderCashPill({ size: "Dock", text: "$5.00 en OKY Cash", estilo })}`,
      ).join("")}
    </div>`,
};
