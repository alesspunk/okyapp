/* ─────────────────────────────────────────────────────────
   Slider (Atom) — rediseño basado en el mecanismo de MUI Slider
   (halo/aureola al presionar + arrastrar) con una burbuja nueva que
   muestra el valor actual, y líneas grises que marcan los pasos
   dentro del rango. Ref. Figma 95076:64473.

   Anatomía: track (pill claro) → ticks (líneas grises fijas,
   decorativas) → fill (pill morado #552588 hasta el valor actual) →
   halo (aro translúcido, oculto en reposo) → thumb (círculo
   primary/light con shadow tipo MUI) → burbuja de valor (mismo
   primary/light, con texto #552588, encima del thumb, oculta en
   reposo). El `input[type=range]` nativo queda invisible pero sigue
   siendo el elemento realmente arrastrable/accesible; este módulo
   sincroniza la posición visual (fill/thumb/halo/burbuja) con su
   valor en cada frame de drag.

   Offset en los extremos: el thumb nunca queda pegado al borde real
   del track (ni en el mínimo ni en el máximo) — se recorta su centro
   dentro de [radio + margen, ancho - radio - margen] para dar la
   intención de "todavía puedes arrastrar" en ambos extremos.
───────────────────────────────────────────────────────── */

const THUMB_RADIUS = 14.5;
const EDGE_INSET_EXTRA = 6;
const TICK_PERCENTS = [16.67, 33.33, 50, 66.67, 83.33];

export function renderSliderTicks() {
  return TICK_PERCENTS.map((pct) => `<span class="slider-tick" style="left:${pct}%"></span>`).join("");
}

function positionSlider(root) {
  const input = root.querySelector(".slider-range");
  const fill = root.querySelector(".slider-fill");
  const halo = root.querySelector(".slider-thumb-halo");
  const thumb = root.querySelector(".slider-thumb");
  const bubble = root.querySelector(".slider-thumb-bubble");
  const trackShell = root.querySelector(".slider-track-shell");
  if (!input || !fill || !halo || !thumb || !trackShell) {
    return;
  }

  const min = Number(input.min);
  const max = Number(input.max);
  const value = Number(input.value);
  const percent = max === min ? 0 : (value - min) / (max - min);

  const trackWidth = trackShell.clientWidth;
  if (trackWidth === 0) {
    return;
  }

  const inset = THUMB_RADIUS + EDGE_INSET_EXTRA;
  const usableWidth = Math.max(trackWidth - inset * 2, 0);
  const centerPx = inset + usableWidth * percent;
  const centerPercent = (centerPx / trackWidth) * 100;

  fill.style.width = `${centerPx}px`;
  thumb.style.left = `${centerPercent}%`;
  halo.style.left = `${centerPercent}%`;

  if (bubble) {
    const currencySymbol = input.dataset.currencySymbol || "";
    bubble.textContent = `${currencySymbol}${value}`;
  }
}

export function initSliderAtom(root, attempt = 0) {
  const trackShell = root.querySelector(".slider-track-shell");
  const input = root.querySelector(".slider-range");
  if (!trackShell || !input) {
    return;
  }

  if (trackShell.clientWidth === 0) {
    if (attempt < 20) {
      requestAnimationFrame(() => initSliderAtom(root, attempt + 1));
    }
    return;
  }

  const setActive = (active) => root.classList.toggle("is-active", active);

  input.addEventListener("pointerdown", () => setActive(true));
  input.addEventListener("touchstart", () => setActive(true), { passive: true });
  input.addEventListener("focus", () => setActive(true));
  input.addEventListener("pointerup", () => setActive(false));
  input.addEventListener("pointercancel", () => setActive(false));
  input.addEventListener("touchend", () => setActive(false));
  input.addEventListener("touchcancel", () => setActive(false));
  input.addEventListener("blur", () => setActive(false));
  input.addEventListener("input", () => positionSlider(root));

  window.addEventListener("resize", () => positionSlider(root));

  positionSlider(root);
}
