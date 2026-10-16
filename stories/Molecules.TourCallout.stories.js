/* ─────────────────────────────────────────────────────────
   Molecules / Tour Callout
   MARS: Tour / Llamada (8367:207491) · Posición=Debajo / Encima
───────────────────────────────────────────────────────── */

import { renderTourCallout } from "./_shared/okyCashParts";

export default {
  title: "Molecules/Tour Callout",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Tour Callout** es la llamada del recorrido guiado de la primera visita a USA: flecha + frase sobre el " +
          "fondo atenuado, apuntando al elemento real que deja ver el hueco. Se pasa tocando en cualquier parte " +
          "(OKYC-EXP-074, 075). **Debajo**: la flecha apunta hacia arriba; **Encima**: hacia abajo. " +
          "MARS: `Tour / Llamada` · Prototipo: `.oky-flow-tour-call`.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    position: { control: "inline-radio", options: ["Debajo", "Encima"] },
  },
  args: { label: "Aquí ves tus compras", position: "Debajo" },
};

export const Playground = { render: (args) => renderTourCallout(args) };

export const Variants = {
  render: () => `
    <div style="display:flex;flex-direction:column;gap:16px">
      ${renderTourCallout({ label: "Aquí ves tus compras", position: "Debajo" })}
      ${renderTourCallout({ label: "Mira cuánto OKY Cash ganas", position: "Encima" })}
    </div>`,
};
