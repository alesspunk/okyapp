/* ─────────────────────────────────────────────────────────
   Molecules / Payment Method Row
   MARS: filas de «Método de pago» de los checkouts (CHK-01…22,
   BUY, FT) · diseño minimalista del 15/10.
───────────────────────────────────────────────────────── */

import { renderPayGroup, PAY_ROWS } from "./_shared/okyCashParts";

export default {
  title: "Molecules/Payment Method Row",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Payment Method Row** son las filas del bloque «Método de pago» del checkout, en su versión " +
          "minimalista (OKYC-EXP-130): sin chips. **OKY Cash** lleva la casilla, el saldo en teal `#057A73` " +
          "(Lato Bold 16) y la moneda a la derecha; marcada, la fila va en Highlight Surface `#E8FBF8` y la casilla en teal. " +
          "**Visa / Paypal** dicen solo qué método es, con su ícono a la derecha: lo que paga cada uno lo dice el " +
          "resumen. Los íconos van en un hueco de 24px y caen en la misma x; los tres puntos se alinean con los de " +
          "«¿Para quién es?». **Aviso · Tienes OKY Cash**: la fila sola, sin moneda ni tres puntos. " +
          "Prototipo: `.oky-flow-payrow` · `.oky-flow-pay-amount` · `.oky-flow-pay-icon`.",
      },
    },
  },
  argTypes: {
    first: { control: "select", options: ["—", ...PAY_ROWS], description: "Primera fila." },
    second: { control: "select", options: ["—", ...PAY_ROWS], description: "Segunda fila." },
    balance: { control: { type: "number", min: 0, step: 0.01 } },
  },
  args: { first: "OKY Cash", second: "Visa", balance: 10 },
};

export const Playground = {
  render: ({ first, second, balance }) => renderPayGroup([first, second].filter((r) => r && r !== "—"), { balance }),
};

export const Variants = {
  render: () => `
    <div style="display:flex;flex-direction:column;gap:24px">
      ${renderPayGroup(["OKY Cash", "Visa"], { balance: 10 })}
      ${renderPayGroup(["OKY Cash · marcado", "Visa"], { balance: 10 })}
      ${renderPayGroup(["OKY Cash", "Paypal"], { balance: 5 })}
      ${renderPayGroup(["Visa"])}
      ${renderPayGroup(["Agregar tarjeta"])}
      ${renderPayGroup(["Aviso · Tienes OKY Cash"], { balance: 5 })}
    </div>`,
};
