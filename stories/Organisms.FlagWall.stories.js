/* ─────────────────────────────────────────────────────────
   Organisms / Flag Wall
   MARS: Mis compras / Lluvia de banderas (Lottie USA · Guatemala)
───────────────────────────────────────────────────────── */

import { OKY_FLAGS_US, OKY_FLAGS_GT } from "./_shared/okyFlagsAnimation";
import { htmlToElement, mountLottie, phoneFrame } from "./_shared/okyCashParts";

const SCENES = { US: OKY_FLAGS_US, GT: OKY_FLAGS_GT };

export default {
  title: "Organisms/Flag Wall",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Flag Wall** es la lluvia de banderas que cae al cambiar de marketplace desde el folder de Mis compras: " +
          "una pared de banderas del país al que se llega, de arriba abajo, una sola pasada (90 cuadros a 30 fps, " +
          "unos 3 s). Hay una escena por país: **USA** y **Guatemala**. En el primer ingreso a USA, el recorrido " +
          "guiado arranca después de esta animación. En Storybook, un toque la repite. Prototipo: `.oky-flow-flagrise.is-lottie` · " +
          "`OKY_FLAGS_US` / `OKY_FLAGS_GT`.",
      },
    },
    layout: "centered",
  },
  argTypes: {
    country: { control: "inline-radio", options: ["US", "GT"] },
    play: { control: "boolean", description: "Reproducir (apagado: cuadro 0)." },
  },
  args: { country: "US", play: true },
};

export const Playground = {
  render: ({ country, play }) => {
    const el = htmlToElement(phoneFrame(`<div class="oky-flow-flagrise is-lottie" aria-hidden="true"></div>`));
    const anim = mountLottie(el.querySelector(".oky-flow-flagrise"), SCENES[country], { play, slice: true });
    /* Un toque la repite: en Storybook no hay pantalla que la dispare. */
    el.style.cursor = "pointer";
    el.addEventListener("click", () => anim.goToAndPlay(0, true));
    return el;
  },
};
