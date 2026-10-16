/* ─────────────────────────────────────────────────────────
   Molecules / Empty State
   MARS: Wallet / Estado vacío (8367:207199) · solo las variantes de
   esta entrega: OKY Cash y Métodos de pago (Tu billetera).
───────────────────────────────────────────────────────── */

import { renderEmptyState, EMPTY_KINDS } from "./_shared/okyCashParts";

export default {
  title: "Molecules/Empty State",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Empty State** es la pieza vacía de Tu billetera: arte 3D en un círculo aqua, título, nota y un botón. " +
          "**OKY Cash**: sin movimientos no hay tarjeta, solo este estado (OKYC-EXP-112). **Métodos de pago**: sin " +
          "tarjetas guardadas. Los dos arrancan a la misma altura para que al cambiar de pestaña no salte nada " +
          "(OKYC-EXP-116). Las variantes de Mi wallet v1 (Gift Cards, OKY Vales, Servicios) quedan fuera de esta " +
          "entrega. MARS: `Wallet / Estado vacío` · Prototipo: `.oky-flow-cash-empty.is-wallet`.",
      },
    },
  },
  argTypes: { kind: { control: "inline-radio", options: EMPTY_KINDS } },
  args: { kind: "OKY Cash" },
};

export const Playground = { render: (args) => renderEmptyState(args) };

export const Variants = {
  render: () => `<div style="display:flex;gap:24px;flex-wrap:wrap">${EMPTY_KINDS.map((kind) => renderEmptyState({ kind })).join("")}</div>`,
};
