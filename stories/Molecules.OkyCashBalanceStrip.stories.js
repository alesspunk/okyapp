/* ─────────────────────────────────────────────────────────
   Molecules / OKY Cash Balance Strip
   MARS: OKY Cash / Balance Strip (8367:206709)
───────────────────────────────────────────────────────── */

import { OKY_CASH_ESTILOS, renderBalanceStrip } from "./_shared/okyCashParts";

export default {
  title: "Molecules/OKY Cash Balance Strip",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**OKY Cash Balance Strip** es la tira de saldo de las homes de USA y Guatemala: la moneda, el saldo y el " +
          "botón **Explora**. Solo sale con saldo: sin OKY Cash no se muestra. Tocarla abre Mi billetera › OKY Cash. " +
          "MARS: `OKY Cash / Balance Strip` · Prototipo: `.oky-flow-cash-strip`.",
      },
    },
  },
  argTypes: {
    balance: { control: { type: "number", min: 0, step: 0.01 }, description: "Saldo disponible de OKY Cash." },
    estilo: { control: "inline-radio", options: OKY_CASH_ESTILOS, description: "Estilo de OKY Cash (exploración 20/10, MARS · Estilo). Aqua es como se ve hoy; el aqua claro queda para descuento." },
  },
  args: { balance: 5, estilo: "Aqua" },
};

export const Playground = {
  render: (args) => `<div style="width:328px">${renderBalanceStrip(args)}</div>`,
};

export const Estilos = {
  name: "OKY Cash · Estilos",
  parameters: { controls: { disable: true } },
  render: () => `
    <div style="display:flex;flex-direction:column;gap:16px;width:328px">
      ${OKY_CASH_ESTILOS.map((estilo) => `<div class="mars-label">${estilo}</div>${renderBalanceStrip({ balance: 5, estilo })}`).join("")}
    </div>`,
};
