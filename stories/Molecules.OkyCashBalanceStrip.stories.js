/* ─────────────────────────────────────────────────────────
   Molecules / OKY Cash Balance Strip
   MARS: OKY Cash / Balance Strip (8367:206709)
───────────────────────────────────────────────────────── */

import { renderBalanceStrip } from "./_shared/okyCashParts";

export default {
  title: "Molecules/OKY Cash Balance Strip",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**OKY Cash Balance Strip** es la tira de saldo de las homes de USA y Guatemala: la moneda, el saldo y el " +
          "botón **Explora**. Solo sale con saldo: sin OKY Cash no se muestra. Tocarla abre Tu billetera › OKY Cash. " +
          "MARS: `OKY Cash / Balance Strip` · Prototipo: `.oky-flow-cash-strip`.",
      },
    },
  },
  argTypes: {
    balance: { control: { type: "number", min: 0, step: 0.01 }, description: "Saldo disponible de OKY Cash." },
  },
  args: { balance: 5 },
};

export const Playground = {
  render: (args) => `<div style="width:328px">${renderBalanceStrip(args)}</div>`,
};
