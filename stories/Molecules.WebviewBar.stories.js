/* ─────────────────────────────────────────────────────────
   Molecules / Webview Bar
   MARS: Webview / Barra (8367:207939) · Carga=Sí / No
───────────────────────────────────────────────────────── */

import { renderWebviewBar } from "./_shared/okyCashParts";

export default {
  title: "Molecules/Webview Bar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Webview Bar** es la barra del navegador dentro de la app que abre la landing de OKY Cash desde la (i) de " +
          "la saving bar de la PDP de USA (OKYC-EXP-118): la X vuelve a la PDP, el título dice el sitio con candado y " +
          "el botón de la derecha recarga. Mientras carga, la barra de progreso corre por el borde de abajo. " +
          "MARS: `Webview / Barra` · Prototipo: `.oky-webview-bar`.",
      },
    },
    layout: "centered",
  },
  argTypes: { loading: { control: "boolean", description: "Carga=Sí: barra de progreso." } },
  args: { loading: false },
};

export const Playground = { render: (args) => renderWebviewBar(args) };

export const Variants = {
  render: () => `
    <div style="display:flex;flex-direction:column;gap:16px">
      ${renderWebviewBar({ loading: true })}
      ${renderWebviewBar({ loading: false })}
    </div>`,
};
