/* ─────────────────────────────────────────────────────────
   Molecules / Wallet Section
   MARS: Wallet / Sección plegada (8367:207168)
───────────────────────────────────────────────────────── */

import { renderSectionHead } from "./_shared/okyCashParts";

export default {
  title: "Molecules/Wallet Section",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Wallet Section** es la cabecera de cada sección de Mis compras (Comprados, Compartidos, Usados): " +
          "ícono y nombre a la izquierda, la cantidad entre paréntesis y el chevron a la derecha. Tocarla pliega o " +
          "abre la sección; abierta cambia de fondo y el chevron gira. Si hay vales sin abrir, el número sale en la " +
          "esquina (Usados no avisa). MARS: `Wallet / Sección plegada` · Prototipo: `.oky-flow-section-head`.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    icon: { control: "select", options: ["fa-box-archive", "fa-gift", "fa-paper-plane"] },
    count: { control: { type: "number", min: 0 } },
    news: { control: { type: "number", min: 0 }, description: "Vales sin abrir (0 = sin aviso)." },
    open: { control: "boolean" },
  },
  args: { label: "Usados", icon: "fa-box-archive", count: 1, news: 0, open: false },
};

export const Playground = { render: (args) => renderSectionHead(args) };

export const Variants = {
  render: () => `
    <div style="display:flex;flex-direction:column;gap:16px">
      ${renderSectionHead({ label: "Comprados", icon: "fa-gift", count: 3, news: 2 })}
      ${renderSectionHead({ label: "Compartidos", icon: "fa-paper-plane", count: 1, open: true })}
      ${renderSectionHead({ label: "Usados", icon: "fa-box-archive", count: 1 })}
    </div>`,
};
