/* ─────────────────────────────────────────────────────────
   Atoms / Scroll Hint
   MARS: Home / Pista de scroll (8367:207789)
───────────────────────────────────────────────────────── */

import { renderScrollHint } from "./_shared/okyCashParts";

export default {
  title: "Atoms/Scroll Hint",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Scroll Hint** es el botón redondo de 40px con el chevron hacia abajo que avisa en las homes que hay más " +
          "contenido. Va en la esquina inferior izquierda, sobre la navbar, y se va con el primer scroll. " +
          "MARS: `Home / Pista de scroll` · Prototipo: `.oky-flow-scroll-hint`.",
      },
    },
  },
};

export const Default = {
  render: () => `<div style="padding:24px;background:var(--background)">${renderScrollHint()}</div>`,
};
