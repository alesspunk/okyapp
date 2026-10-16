/* ─────────────────────────────────────────────────────────
   Organisms / OKY Cash Win
   MARS: Poscompra / Ganaste OKY Cash (dotLottie de diseño)
───────────────────────────────────────────────────────── */

import { OKY_CASH_WIN_ANIMATION } from "./_shared/okyCashWinAnimation";
import { htmlToElement, mountLottie, phoneFrame } from "./_shared/okyCashParts";

export default {
  title: "Organisms/OKY Cash Win",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**OKY Cash Win** es la animación «Ganaste» que sigue al sello de compra exitosa cuando la compra dio " +
          "cashback: fondo verde OKY Cash `#00524D`, las monedas caen desde la pastilla de la cabecera (que hace de " +
          "ranura) y se apilan abajo, con el monto ganado al centro. Dura unos 8 s y se va sola con las monedas; un " +
          "toque la salta. En Storybook el overlay no se retira, para poder verlo, y un toque la repite. " +
          "Prototipo: `.oky-flow-cashwin` · `OKY_CASH_WIN_ANIMATION`.",
      },
    },
    layout: "centered",
  },
  argTypes: {
    earned: { control: { type: "number", min: 0, step: 0.01 }, description: "OKY Cash ganado en la compra." },
    play: { control: "boolean", description: "Reproducir (apagado: cuadro 0)." },
  },
  args: { earned: 0.25, play: true },
};

export const Playground = {
  render: ({ earned, play }) => {
    const el = htmlToElement(
      phoneFrame(`
        <div class="oky-flow-cashwin" role="status" style="animation:none">
          <div class="oky-flow-cashwin-stage"></div>
          <div class="oky-flow-cashwin-copy">
            <p class="oky-flow-cashwin-kicker">Ganaste</p>
            <p class="oky-flow-cashwin-amount"><span>$</span>${Number(earned).toFixed(2)}</p>
            <p class="oky-flow-cashwin-label">en OKY Cash</p>
            <span class="oky-flow-cashwin-hint">Toca para continuar</span>
          </div>
        </div>`),
    );
    const anim = mountLottie(el.querySelector(".oky-flow-cashwin-stage"), OKY_CASH_WIN_ANIMATION, { play, slice: true });
    /* Un toque la repite: en Storybook no hay pantalla que la dispare. */
    el.style.cursor = "pointer";
    el.addEventListener("click", () => anim.goToAndPlay(0, true));
    return el;
  },
};
