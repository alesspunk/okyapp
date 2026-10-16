/* ─────────────────────────────────────────────────────────
   Organisms / Purchase Success
   MARS: Poscompra / Sello de compra exitosa + confeti (Lottie de
   Nicky, 15/10)
───────────────────────────────────────────────────────── */

import { OKY_CONFETTI } from "./_shared/okyConfettiAnimation";
import { htmlToElement, mountLottie, phoneFrame } from "./_shared/okyCashParts";

export default {
  title: "Organisms/Purchase Success",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Purchase Success** es la celebración que tapa la pantalla al tocar **Comprar**: velo blanco al 88 %, " +
          "el sello «Compra exitosa» y el confeti Lottie de una sola pasada. Se retira sola a los 2.6 s (o con un " +
          "toque) y da paso a «Ganaste OKY Cash» cuando la compra dio cashback. Con movimiento reducido no cae " +
          "confeti. En Storybook, un toque la repite. Prototipo: `.oky-flow-celebration` · `OKY_CONFETTI`.",
      },
    },
    layout: "centered",
  },
  argTypes: { play: { control: "boolean", description: "Reproducir el confeti (apagado: cuadro 0)." } },
  args: { play: true },
};

export const Playground = {
  render: ({ play }) => {
    const el = htmlToElement(
      phoneFrame(`
        <div class="oky-flow-celebration" role="status">
          <div class="oky-flow-celebration-confetti"></div>
          <div class="oky-flow-stamp-group">
            <img class="oky-flow-stamp" src="oky-stamp-exitosa.png" alt="" />
            <p class="oky-flow-stamp-label">Compra exitosa</p>
          </div>
        </div>`),
    );
    const anim = mountLottie(el.querySelector(".oky-flow-celebration-confetti"), OKY_CONFETTI, { play, slice: true });
    /* Un toque la repite: en Storybook no hay pantalla que la dispare. */
    el.style.cursor = "pointer";
    el.addEventListener("click", () => anim.goToAndPlay(0, true));
    return el;
  },
};
