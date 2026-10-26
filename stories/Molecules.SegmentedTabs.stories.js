/* ─────────────────────────────────────────────────────────
   Molecules / Segmented Tabs
   MARS: Wallet / Pestañas v3 (8367:207065) ·
         Wallet / Pestañas · Mi billetera (8367:207084)
───────────────────────────────────────────────────────── */

import { renderSegTabs, SEG_KINDS } from "./_shared/okyCashParts";

export default {
  title: "Molecules/Segmented Tabs",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Segmented Tabs** son las dos mitades sobre una pista gris que cambian de vista sin salir de la pantalla. " +
          "**Mis compras**: Para mí 🙋🏽 / Para otros 👫 (variante 3, ganadora). **Mi billetera**: OKY Cash / Métodos " +
          "de pago, con la moneda y la tarjeta 3D. **Modo decisión**: las mismas pestañas de Mis compras sin ninguna " +
          "elegida, dentro de la hoja «¿Es para ti o para alguien más?». Al hacer scroll se quedan fijas arriba. " +
          "Prototipo: `.oky-flow-wallet-seg`.",
      },
    },
  },
  argTypes: {
    kind: { control: "inline-radio", options: SEG_KINDS },
    active: { control: "inline-radio", options: [0, 1], description: "Pestaña activa (0 = izquierda)." },
    decision: { control: "boolean", description: "Modo decisión: ninguna elegida (solo Mis compras)." },
  },
  args: { kind: "Mis compras", active: 0, decision: false },
};

export const Playground = { render: (args) => renderSegTabs(args) };

export const Variants = {
  render: () => `
    <div style="display:flex;flex-direction:column;gap:24px">
      ${renderSegTabs({ kind: "Mis compras", active: 0 })}
      ${renderSegTabs({ kind: "Mis compras", active: 1 })}
      ${renderSegTabs({ kind: "Mi billetera", active: 0 })}
      ${renderSegTabs({ kind: "Mi billetera", active: 1 })}
      <div style="padding:16px;border-radius:16px;background:var(--primary-main)">${renderSegTabs({ kind: "Mis compras", decision: true })}</div>
    </div>`,
};
